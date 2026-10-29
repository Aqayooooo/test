import assert from 'node:assert/strict';
import {
  createGame,
  startGame,
  stepGame,
  interact,
  pauseGame,
  resumeGame,
  visibleToGuard,
  rayRectangle,
  platforms,
  lootTemplate,
  CAPACITY,
  GOAL,
  HOUSE,
  KEY,
  SAFE,
  BREAKER,
  POWER_DURATION,
  SECURITY_CAMERAS,
  cameraAngle,
  visibleToCamera,
  makeNoise,
  typeBreaker,
  retryBreaker,
  cancelBreaker,
} from '../game/engine.js';
import { createTypingChallenge, updateTyping, typingMetrics, MIN_WPM } from '../game/typing.js';

const tick = (state, seconds, input = {}) => {
  for (let i = 0; i < Math.ceil(seconds * 60); i++)
    stepGame(
      state,
      { ...input, jump: input.jump && i === 0, action: input.action && i === 0 },
      1 / 60,
    );
};
const playable = (powerDone = true) => {
  const s = createGame();
  startGame(s);
  tick(s, 3.2);
  assert.equal(s.mode, 'playing');
  s.security.completed = powerDone;
  return s;
};
const place = (s, x, y) =>
  Object.assign(s.player, { x, y, vx: 0, vy: 0, grounded: true, hidden: false });
const typeText = (challenge, wpm, input = (value, now) => updateTyping(challenge, value, now)) => {
  const duration = (challenge.target.length * 12000) / wpm;
  for (let i = 1; i <= challenge.target.length; i++)
    input(
      challenge.target.slice(0, i),
      1000 + ((i - 1) / (challenge.target.length - 1)) * duration,
    );
};
const cutPower = (s, wpm = 60) => {
  place(s, BREAKER.x, BREAKER.y);
  interact(s);
  assert.equal(s.mode, 'typing');
  typeText(s.typing, wpm, (value, now) => typeBreaker(s, value, now));
};

{
  const s = createGame();
  assert.equal(s.mode, 'ready');
  tick(s, 10);
  assert.equal(s.time, 0);
  startGame(s);
  assert.equal(s.mode, 'arriving');
  tick(s, 3.2);
  assert.equal(s.mode, 'playing');
  assert.equal(s.vanX, 180);
  const x = s.player.x;
  tick(s, 0.5, { right: true });
  assert(s.player.x > x + 75, 'A/D moves the cat');
  const oldY = s.player.y;
  tick(s, 0.2, { jump: true });
  assert(s.player.y < oldY - 45, 'W jumps');
  tick(s, 1);
  assert.equal(s.player.y, 490, 'cat lands on the ground');
  console.log('ok ruch/skok');
}
{
  const s = playable();
  place(s, 950, 490);
  tick(s, 1.7, { up: true });
  assert.equal(s.player.y, 290, 'ladder reaches upper floor');
  tick(s, 1.7, { down: true });
  assert.equal(s.player.y, 490, 'ladder goes down');
  place(s, 660, 490);
  tick(s, 2, { down: true });
  assert.equal(s.player.y, 730, 'cellar is reachable');
  tick(s, 2.2, { up: true });
  assert.equal(s.player.y, 470, 'cellar ladder returns to entrance');
  tick(s, 0.2, { left: true });
  assert(s.player.y <= 490);
  console.log('ok drabiny');
}
{
  const s = playable();
  for (const item of s.loot.slice(0, 4)) {
    place(s, item.x, item.y + 18);
    interact(s);
  }
  assert.equal(s.player.bag.length, CAPACITY, 'bag has a real capacity');
  assert.equal(s.loot.filter((i) => i.taken).length, 3);
  place(s, 250, 490);
  interact(s);
  assert.equal(s.deposited, 3);
  assert.equal(s.player.bag.length, 0);
  interact(s);
  assert.equal(s.mode, 'playing', 'cannot leave before half the loot is safe');
  while (s.deposited < GOAL) {
    const item = s.loot.find((i) => !i.taken && !i.locked);
    place(s, item.x, item.y + 18);
    interact(s);
    place(s, 250, 490);
    interact(s);
  }
  assert.equal(s.deposited, GOAL);
  assert.equal(s.mode, 'playing', 'deposit does not accidentally auto-finish');
  interact(s);
  assert.equal(s.mode, 'leaving');
  tick(s, 3);
  assert.equal(s.mode, 'complete');
  assert.equal(s.outcome.deposited, GOAL);
  assert.equal(s.loot.filter((i) => i.delivered).length, GOAL, 'only deposited loot counts');
  console.log('ok lupy + koniec');
}
{
  const s = playable();
  place(s, 1000, 290);
  interact(s);
  assert.equal(s.player.bag.length, 0, 'no collecting through a floor');
  const item = s.loot[0];
  place(s, item.x, item.y + 18);
  interact(s);
  interact(s);
  assert.equal(s.player.bag.length, 1, 'loot cannot be collected twice');
  assert(s.guard.wakeIn <= 5, 'first item triggers wake-up');
  tick(s, 5.1);
  assert(s.guard.awake);
  console.log('ok interakcje');
}
{
  const s = playable();
  place(s, 1375, 490);
  tick(s, 0.2, { down: true });
  assert(s.player.hidden, 'S hides behind sofa');
  tick(s, 0.1);
  assert(!s.player.hidden, 'release S leaves hiding');
  place(s, 1400, 730);
  Object.assign(s.guard, { x: 1250, y: 730, awake: true, facing: 1, angle: 0, target: 7 });
  tick(s, 2, { down: true });
  assert.equal(s.alarm, 0, 'hiding protects from flashlight');
  place(s, 1000, 490);
  Object.assign(s.guard, { x: 1000, y: 290, awake: true, facing: 1, angle: Math.PI / 2 });
  assert(!visibleToGuard(s), 'floor blocks light');
  place(s, 250, 490);
  Object.assign(s.guard, { x: 510, y: 490, facing: -1, angle: Math.PI });
  assert(!visibleToGuard(s), 'van is outside patrol detection');
  assert.equal(rayRectangle(0, 0, 1, 0, { x: 10, y: -5, w: 5, h: 10 }), 10);
  assert.equal(rayRectangle(0, 0, 1, 0, { x: 10, y: 5, w: 5, h: 10 }), Infinity);
  console.log('ok chowanie');
}
{
  const s = playable();
  place(s, 1350, 490);
  Object.assign(s.guard, { x: 1100, y: 490, awake: true, facing: 1, angle: 0, target: 3 });
  tick(s, 0.4);
  assert(s.alarm > 0 && s.mode === 'playing', 'there is time to react');
  tick(s, 1.2);
  assert.equal(s.mode, 'caught');
  const t = s.time;
  tick(s, 2);
  assert.equal(s.time, t, 'caught state stops simulation');
  console.log('ok wykrycie');
}
{
  const s = playable();
  pauseGame(s);
  const t = s.time,
    x = s.player.x;
  tick(s, 15, { right: true });
  assert.equal(s.time, t);
  assert.equal(s.player.x, x);
  resumeGame(s);
  tick(s, 0.2, { right: true });
  assert(s.player.x > x);
  startGame(s, true);
  tick(s, 0.5);
  assert.equal(s.mode, 'playing');
  assert.equal(s.deposited, 0);
  assert.equal(s.loot.filter((i) => i.taken).length, 0);
  assert(!s.security.completed && !s.typing, 'replay resets the mandatory power objective');
  console.log('ok pauza');
}
{
  // czy do kazdego lupu da sie dojsc (skoki: g=1120, v=445, + drabiny)
  const graph = platforms.map(() => new Set());
  for (let i = 0; i < platforms.length; i++)
    for (let j = 0; j < platforms.length; j++) {
      if (i === j) continue;
      const a = platforms[i],
        b = platforms[j],
        rise = a.y - b.y;
      if (rise > 88) continue;
      const discriminant = 445 ** 2 - 2 * 1120 * rise;
      if (discriminant < 0) continue;
      const flight = (445 + Math.sqrt(discriminant)) / 1120;
      const gap = Math.max(0, b.x - (a.x + a.w), a.x - (b.x + b.w));
      if (gap <= 205 * flight - 12) graph[i].add(j);
    }
  graph[0].add(3);
  graph[3].add(0);
  graph[1].add(2);
  graph[2].add(1);
  const visited = new Set([0]),
    queue = [0];
  while (queue.length) {
    for (const j of graph[queue.shift()])
      if (!visited.has(j)) {
        visited.add(j);
        queue.push(j);
      }
  }
  for (const item of lootTemplate) {
    const idx = platforms.findIndex(
      (p) => item.x >= p.x && item.x <= p.x + p.w && Math.abs(p.y - item.y - 22) < 3,
    );
    assert(idx >= 0 && visited.has(idx), `${item.name} has a reachable supporting platform`);
  }
  console.log(`ok dojscie do ${lootTemplate.length} lupow`);
}
{
  const s = playable();
  place(s, 1160, 490);
  tick(s, 0.8, { down: true });
  assert.equal(s.player.y, 490, 'S cannot drop through the main floor');
  place(s, 1110, 420);
  tick(s, 0.5, { down: true });
  assert.equal(s.player.y, 490, 'S can still drop through a shelf');
  place(s, 560, 730);
  tick(s, 1, { left: true });
  assert(s.player.x >= 518, 'cat cannot walk through cellar foundations');
  console.log('ok kolizje');
}
{
  const running = playable();
  const sneaking = playable();
  place(running, 1100, 490);
  place(sneaking, 1100, 490);
  tick(running, 0.5, { right: true });
  tick(sneaking, 0.5, { right: true, sneak: true });
  assert(sneaking.player.sneaking);
  assert(sneaking.player.x - 1100 < (running.player.x - 1100) * 0.65);
  for (const s of [running, sneaking]) {
    place(s, 1350, 490);
    Object.assign(s.guard, { x: 1100, y: 490, awake: true, facing: 1, angle: 0, target: 3 });
  }
  tick(running, 0.3);
  tick(sneaking, 0.3, { sneak: true });
  assert(sneaking.alarm < running.alarm, 'sneaking gives more time in the light');
  assert(running.guard.searchTime > 2, 'resident remembers last seen location');
  assert.equal(running.guard.lastSeenX, running.player.x);
  place(running, 1375, 490);
  tick(running, 10.2, { down: true });
  assert.equal(running.alarm, 0, 'hiding clears suspicion');
  assert.equal(running.guard.searchTime, 0, 'search expires without magical player tracking');
  console.log('ok skradanie');
}
{
  const high = playable();
  const low = playable();
  tick(high, 0.25, { jump: true, jumpHeld: true });
  tick(low, 0.25, { jump: true, jumpHeld: false });
  assert(high.player.y < low.player.y - 20, 'holding W gives a higher jump');
  const buffered = playable();
  Object.assign(buffered.player, { x: 360, y: 480, vy: 210, grounded: false, coyote: 0 });
  stepGame(buffered, { jump: true, jumpHeld: true });
  tick(buffered, 0.12, { jumpHeld: true });
  assert(buffered.player.vy < 0, 'jump just before landing is buffered');
  assert.equal(buffered.stats.jumps, 1);
  const coyote = playable();
  Object.assign(coyote.player, { grounded: false, y: 489, coyote: 0.07 });
  stepGame(coyote, { jump: true });
  assert(coyote.player.vy < -400, 'late edge jumps remain forgiving');
  console.log('ok skok (coyote time)');
}
{
  const s = playable();
  const item = s.loot[0];
  place(s, item.x, item.y + 18);
  interact(s);
  assert(s.effects.some((effect) => effect.kind === 'pickup'));
  place(s, 250, 490);
  interact(s);
  assert(s.effects.some((effect) => effect.kind === 'deposit'));
  tick(s, 1);
  assert.equal(s.effects.length, 0, 'visual effects are removed after their lifetime');
  Object.assign(s.guard, { x: 1100, y: 490, awake: true, facing: 1, angle: 0, target: 3 });
  place(s, 1350, 490);
  tick(s, 0.5);
  assert(s.stats.maxAlarm > 0.3);
  place(s, 1375, 490);
  tick(s, 2, { down: true });
  assert.equal(s.stats.closeCalls, 1, 'a real escape from light counts once');
  pauseGame(s);
  const time = s.time;
  tick(s, 3);
  assert.equal(s.time, time);
  startGame(s, true);
  assert.deepEqual(s.stats, { jumps: 0, closeCalls: 0, maxAlarm: 0 });
  assert.equal(s.guard.searchTime, 0);
  assert.equal(s.effects.length, 0);
  console.log('ok efekty');
}
{
  assert.equal(lootTemplate.length, 12);
  assert.equal(GOAL, lootTemplate.length / 2);
  assert(
    lootTemplate.filter((item) => item.x < 1800).length < GOAL,
    'the new wing is part of the mission, not empty decoration',
  );
  assert(HOUSE.right > 2700);
  const s = playable();
  place(s, SAFE.x, SAFE.y);
  interact(s);
  tick(s, 1, { actionHeld: true });
  assert.equal(s.safe.progress, 0, 'a locked safe requires the key');
  place(s, KEY.x, KEY.y);
  interact(s);
  assert(s.inventory.key);
  assert.equal(s.player.bag.length, 0, 'the key does not consume a loot slot');
  place(s, SAFE.x, SAFE.y);
  tick(s, 1, { actionHeld: true });
  assert(s.safe.progress > 0 && s.safe.progress < 1);
  const progress = s.safe.progress;
  tick(s, 0.4);
  assert(s.safe.progress < progress, 'releasing space interrupts opening');
  tick(s, 2.9, { actionHeld: true });
  assert(s.safe.open);
  assert(!s.loot.find((item) => item.type === 'gem').locked);
  interact(s);
  assert.equal(s.player.bag.length, 1);
  assert.equal(s.loot[s.player.bag[0]].type, 'gem');
  startGame(s);
  assert(!s.inventory.key && !s.safe.open && s.safe.progress === 0);
  console.log('ok sejf/klucz');
}
{
  const s = playable();
  const camera = SECURITY_CAMERAS[0];
  const angle = cameraAngle(camera, s.time);
  const dy = 490 - 18 - camera.y;
  place(s, camera.x + (Math.cos(angle) * dy) / Math.sin(angle), 490);
  assert(visibleToCamera(s));
  tick(s, 0.4);
  assert(s.alarm > 0 && s.mode === 'playing', 'a camera warns before catching the cat');
  assert.equal(s.guard.reason, 'camera');
  s.player.hidden = true;
  assert(!visibleToCamera(s), 'furniture shields the cat from cameras too');
  s.player.hidden = false;
  place(s, camera.x, 290);
  assert(!visibleToCamera(s), 'a camera cannot see through a floor');
  cutPower(s);
  assert.equal(s.security.powerOff, POWER_DURATION);
  place(s, camera.x, 490);
  assert(!visibleToCamera(s), 'the breaker really disables detection');
  place(s, 250, 490);
  tick(s, POWER_DURATION + 0.1);
  assert.equal(s.security.powerOff, 0);
  assert(s.security.cooldown > 0);
  place(s, BREAKER.x, BREAKER.y);
  interact(s);
  assert.equal(s.security.powerOff, 0, 'the breaker cannot be spammed to bypass timing');
  place(s, 250, 490);
  tick(s, 18.1);
  cutPower(s);
  assert.equal(s.security.powerOff, POWER_DURATION);
  console.log('ok kamery');
}
{
  const noisy = playable();
  const quiet = playable();
  noisy.security.powerOff = quiet.security.powerOff = 120;
  place(noisy, 1230, 490);
  place(quiet, 1230, 490);
  tick(noisy, 0.6, { right: true });
  tick(quiet, 0.9, { right: true, sneak: true });
  assert(noisy.noise > 0.4 && noisy.guard.wakeIn < Infinity);
  assert.equal(noisy.guard.reason, 'noise');
  assert.equal(quiet.noise, 0, 'sneaking prevents creaky footsteps');
  const s = playable();
  place(s, 250, 490);
  Object.assign(s.guard, { x: 950, y: 290, awake: true });
  makeNoise(s, 660, 730, 1);
  for (let i = 0; i < 8 * 60; i++) {
    const { x, y } = s.guard;
    stepGame(s);
    assert(
      Math.abs(s.guard.x - x) < 0.001 || Math.abs(s.guard.y - y) < 0.001,
      'investigations use horizontal corridors and vertical ladders, never diagonal flight',
    );
  }
  assert.equal(s.guard.y, 730);
  assert(Math.abs(s.guard.x - 660) < 3, 'resident investigates a noise on another floor');
  console.log('ok halas');
}
{
  const empty = playable();
  const full = playable();
  full.player.bag = [0, 1, 2];
  tick(empty, 0.8, { right: true });
  tick(full, 0.8, { right: true });
  assert(full.player.x < empty.player.x - 10, 'a full bag has a movement cost');
  const route = playable();
  route.security.powerOff = 120;
  place(route, 2060, 490);
  tick(route, 0.15, { right: true });
  tick(route, 0.65, { right: true, jump: true, jumpHeld: true });
  assert(
    route.player.x > 2180 && route.player.y <= 490,
    'the second cellar opening can be jumped across',
  );
  place(route, 2280, 490);
  tick(route, 1.7, { up: true });
  assert.equal(route.player.y, 290);
  place(route, 2150, 490);
  tick(route, 2, { down: true });
  assert.equal(route.player.y, 730);
  tick(route, 2.2, { up: true });
  tick(route, 0.45, { right: true });
  assert.equal(route.player.y, 490, 'the new cellar ladder has a working exit');
  console.log('ok torba');
}
{
  assert.equal(SECURITY_CAMERAS.length, 7, 'seven cameras cover the expanded house');
  assert(SECURITY_CAMERAS.some((c) => c.y < 290));
  assert(SECURITY_CAMERAS.some((c) => c.y > 490));
  for (const camera of SECURITY_CAMERAS) {
    const s = playable(false);
    s.time = 0;
    const angle = cameraAngle(camera, s.time);
    const floor = camera.y < 290 ? 290 : camera.y < 490 ? 490 : 730;
    const dy = floor - 18 - camera.y;
    place(s, camera.x + (Math.cos(angle) * dy) / Math.sin(angle), floor);
    assert(visibleToCamera(s), 'each camera has a real visible beam on its own floor');
    s.player.hidden = true;
    assert(!visibleToCamera(s));
    s.player.hidden = false;
    s.security.powerOff = 1;
    assert(!visibleToCamera(s));
  }
  console.log('ok pietra');
}
{
  const s = playable(false);
  place(s, s.loot[0].x, s.loot[0].y + 18);
  interact(s);
  assert.equal(s.player.bag.length, 0, 'power must be cut before taking loot');
  s.deposited = GOAL;
  place(s, 250, 490);
  interact(s);
  assert.equal(s.mode, 'playing', 'the van cannot bypass the mandatory power objective');
  place(s, BREAKER.x, BREAKER.y);
  interact(s);
  assert.equal(s.mode, 'typing');
  assert.equal(s.security.powerOff, 0, 'opening the panel does not cut power');
  const time = s.time;
  tick(s, 10, { right: true, action: true });
  assert.equal(s.time, time, 'the world pauses while the player types');
  typeText(s.typing, 49.99, (value, now) => typeBreaker(s, value, now));
  assert.equal(s.typing.status, 'failed');
  assert.equal(s.mode, 'typing');
  assert(!s.security.completed && s.security.powerOff === 0);
  retryBreaker(s);
  assert.equal(s.typing.typed, '');
  assert.equal(s.typing.startedAt, null);
  typeText(s.typing, MIN_WPM, (value, now) => typeBreaker(s, value, now));
  assert.equal(s.mode, 'playing', 'exactly 50 WPM is sufficient');
  assert(s.security.completed);
  assert.equal(s.security.powerOff, POWER_DURATION);
  place(s, s.loot[0].x, s.loot[0].y + 18);
  interact(s);
  assert.equal(s.player.bag.length, 1, 'successful typing unlocks looting');
  place(s, 250, 490);
  tick(s, POWER_DURATION + 0.1);
  assert(
    s.security.completed && s.security.powerOff === 0,
    'the objective survives restored power',
  );
  interact(s);
  interact(s);
  assert.equal(s.mode, 'leaving');
  console.log('ok bezpiecznik (50 wpm)');
}
{
  const s = playable(false);
  place(s, BREAKER.x, BREAKER.y);
  interact(s);
  typeBreaker(s, 'c', 1000);
  cancelBreaker(s);
  assert.equal(s.mode, 'playing');
  assert(!s.typing && !s.security.completed && s.security.cooldown === 0);
  interact(s);
  assert.equal(s.mode, 'typing');
  assert.equal(s.typing.startedAt, null);
  startGame(s);
  assert(!s.typing && !s.security.completed && s.security.attempts === 0);
  console.log('ok anulowanie pisania');
}
{
  const c = createTypingChallenge();
  updateTyping(c, c.target, 1000);
  assert.equal(c.typed, '', 'pasted text does not count as typing');
  updateTyping(c, 'x', 1000);
  updateTyping(c, '', 2000);
  assert.equal(c.startedAt, 1000, 'backspacing everything cannot reset the clock');
  updateTyping(c, c.target[0], 3000);
  assert.equal(c.mistakes, 1);
  assert.equal(typingMetrics(c, 3000).accuracy, 50);
  const before = c.typed;
  updateTyping(c, before + c.target[1], NaN);
  updateTyping(c, before + c.target[1], -1);
  assert.equal(c.typed, before);
  updateTyping(c, before + c.target[1], 2500);
  assert.equal(c.lastTime, 3000, 'backwards clocks do not shorten a test');
  const fast = createTypingChallenge();
  typeText(fast, 70);
  assert.equal(fast.status, 'passed');
  const result = typingMetrics(fast, 100000);
  assert.equal(result.wpm, 70, 'completed results do not drift with wall time');
  const zero = createTypingChallenge();
  for (let i = 1; i <= zero.target.length; i++) updateTyping(zero, zero.target.slice(0, i), 0);
  assert.equal(zero.status, 'failed', 'zero elapsed time cannot produce an infinite passing score');
  const wrong = createTypingChallenge();
  const wrongText = wrong.target.slice(0, -1) + 'x';
  for (let i = 1; i <= wrongText.length; i++)
    updateTyping(wrong, wrongText.slice(0, i), 1000 + i * 80);
  assert.equal(wrong.status, 'typing', 'speed alone cannot pass an incorrect text');
  updateTyping(wrong, wrong.target.slice(0, -1), 10000);
  updateTyping(wrong, wrong.target, 10100);
  assert.equal(wrong.status, 'passed', 'a corrected text can pass; corrections cost real time');
  console.log('ok liczenie wpm');
}
console.log('gra: wszystko ok');
