import { createTypingChallenge, updateTyping, typingMetrics } from './typing.js';

// x, y = srodek miedzy lapami
export const VIEW = { width: 960, height: 540 };
export const WORLD = { width: 2920, height: 800 };
export const HOUSE = { x: 500, right: 2820, top: 125, ground: 490, cellar: 730 };
export const VAN = { x: 180, y: 490 };
export const GOAL = 6;
export const CAPACITY = 3;
export const KEY = { x: 1990, y: 290 };
export const SAFE = { x: 2700, y: 290 };
export const BREAKER = { x: 2030, y: 730 };
export const POWER_DURATION = 30;
export const SECURITY_CAMERAS = [
  { x: 2370, y: 319, range: 225, phase: 0 },
  { x: 2570, y: 552, range: 225, phase: 2.1 },
  { x: 1280, y: 319, range: 225, phase: 1.4 },
  { x: 1480, y: 146, range: 180, phase: 0.8 },
  { x: 2520, y: 146, range: 180, phase: 3.2 },
  { x: 1180, y: 552, range: 235, phase: 4.1 },
  { x: 1820, y: 552, range: 230, phase: 1.1 },
];
export const CREAKY_BOARDS = [
  { x: 1260, y: 490, w: 110 },
  { x: 1950, y: 290, w: 125 },
  { x: 2440, y: 490, w: 130 },
  { x: 2350, y: 730, w: 100 },
];
export const platforms = [
  { x: 0, y: 490, w: 640, kind: 'floor' },
  { x: 700, y: 490, w: 1420, kind: 'floor' },
  { x: 930, y: 290, w: 1890, kind: 'floor' },
  { x: 500, y: 730, w: 2320, kind: 'floor' },
  { x: 2180, y: 490, w: 640, kind: 'floor' },
  { x: 535, y: 420, w: 95 },
  { x: 670, y: 355, w: 105 },
  { x: 805, y: 300, w: 100 },
  { x: 1100, y: 420, w: 110 },
  { x: 1230, y: 350, w: 110 },
  { x: 1370, y: 415, w: 100 },
  { x: 1500, y: 365, w: 110 },
  { x: 1650, y: 420, w: 100 },
  { x: 790, y: 665, w: 110 },
  { x: 990, y: 610, w: 110 },
  { x: 1180, y: 655, w: 120 },
  { x: 1380, y: 605, w: 110 },
  { x: 1940, y: 420, w: 145 },
  { x: 2370, y: 410, w: 110 },
  { x: 2530, y: 340, w: 120 },
  { x: 2180, y: 655, w: 125 },
  { x: 2390, y: 590, w: 110 },
  { x: 2550, y: 650, w: 120 },
];
export const ladders = [
  { x: 660, top: 470, bottom: 730 },
  { x: 950, top: 290, bottom: 490 },
  { x: 2150, top: 470, bottom: 730 },
  { x: 2280, top: 290, bottom: 490 },
];
export const hideouts = [
  { x: 1010, y: 490, w: 92, name: 'pod stołem', kind: 'table' },
  { x: 1375, y: 490, w: 105, name: 'za kanapą', kind: 'sofa' },
  { x: 1660, y: 290, w: 75, name: 'za zasłoną', kind: 'curtain' },
  { x: 765, y: 730, w: 85, name: 'za beczkami', kind: 'barrels' },
  { x: 1400, y: 730, w: 95, name: 'za skrzynią', kind: 'crate' },
  { x: 1950, y: 490, w: 100, name: 'pod kuchennym stołem', kind: 'table' },
  { x: 2420, y: 290, w: 85, name: 'za zasłoną w bibliotece', kind: 'curtain' },
  { x: 2630, y: 490, w: 105, name: 'za fotelem', kind: 'sofa' },
  { x: 2470, y: 730, w: 95, name: 'za beczkami w winiarni', kind: 'barrels' },
];
export const lootTemplate = [
  { x: 1000, y: 468, name: 'Złoty pierścionek', type: 'ring' },
  { x: 1160, y: 398, name: 'Srebrny kielich', type: 'goblet' },
  { x: 2020, y: 398, name: 'Mały obraz', type: 'painting' },
  { x: 1120, y: 268, name: 'Zegarek', type: 'watch' },
  { x: 2450, y: 268, name: 'Bursztynowy naszyjnik', type: 'necklace' },
  { x: 950, y: 708, name: 'Stare wino', type: 'wine' },
  { x: 2240, y: 633, name: 'Złoty łańcuszek', type: 'necklace' },
  { x: 2740, y: 708, name: 'Mała szkatułka', type: 'treasure' },
  { x: 1920, y: 468, name: 'Antyczny wazon', type: 'vase' },
  { x: 2200, y: 268, name: 'Złote monety', type: 'coins' },
  { x: 2590, y: 318, name: 'Broszka', type: 'ring' },
  { x: 2700, y: 268, name: 'Szmaragd z sejfu', type: 'gem', locked: true },
];
const route = [
  { x: 1540, y: 290 },
  { x: 950, y: 290 },
  { x: 950, y: 490 },
  { x: 1670, y: 490 },
  { x: 2280, y: 490 },
  { x: 2280, y: 290 },
  { x: 2700, y: 290 },
  { x: 2280, y: 490 },
  { x: 2150, y: 730 },
  { x: 2730, y: 730 },
  { x: 660, y: 730 },
  { x: 660, y: 490 },
  { x: 950, y: 290 },
];
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
export function createGame() {
  return {
    mode: 'ready',
    previousMode: 'playing',
    time: 0,
    sequence: 0,
    runTime: 0,
    player: {
      x: 258,
      y: 490,
      vx: 0,
      vy: 0,
      facing: 1,
      grounded: true,
      hidden: false,
      coyote: 0.1,
      jumpBuffer: 0,
      landing: 0,
      sneaking: false,
      drop: 0,
      stepTimer: 0,
      bag: [],
    },
    guard: {
      x: 1540,
      y: 290,
      facing: -1,
      angle: Math.PI,
      awake: false,
      wakeIn: Infinity,
      target: 1,
      searchTime: 0,
      lastSeenX: 0,
      lastSeenY: 0,
      climbTarget: null,
      reason: '',
      moving: false,
    },
    loot: lootTemplate.map((item, id) => ({ ...item, id, taken: false, delivered: false })),
    deposited: 0,
    alarm: 0,
    camera: { x: 0, y: 110 },
    vanX: -170,
    toast: '',
    toastTime: 0,
    event: '',
    outcome: null,
    effects: [],
    stats: { jumps: 0, closeCalls: 0, maxAlarm: 0 },
    escapedLight: false,
    inventory: { key: false },
    safe: { open: false, progress: 0, noiseTimer: 0 },
    security: { powerOff: 0, cooldown: 0, spotted: false, completed: false, attempts: 0 },
    typing: null,
    noise: 0,
    heat: 0,
  };
}
export function startGame(state, reduced = false) {
  Object.assign(state, createGame());
  state.mode = 'arriving';
  state.fastSequence = reduced;
}
export function pauseGame(state) {
  if (['playing', 'arriving', 'leaving'].includes(state.mode)) {
    state.previousMode = state.mode;
    state.mode = 'paused';
    state.player.vx = 0;
  }
}
export function resumeGame(state) {
  if (state.mode === 'paused') state.mode = state.previousMode;
}
export function hidingPlace(player) {
  return hideouts.find((h) => Math.abs(player.x - h.x) < h.w / 2 && Math.abs(player.y - h.y) < 12);
}
export function nearestLoot(state) {
  const p = state.player;
  return state.loot
    .filter(
      (item) => !item.taken && !item.locked && Math.hypot(p.x - item.x, p.y - 18 - item.y) < 53,
    )
    .sort((a, b) => Math.abs(p.x - a.x) - Math.abs(p.x - b.x))[0];
}
export function atVan(state) {
  return Math.abs(state.player.x - 250) < 91 && Math.abs(state.player.y - 490) < 16;
}
function say(state, text) {
  state.toast = text;
  state.toastTime = 3.2;
  state.event = text;
}
function effect(state, kind, x, y) {
  state.effects.push({ kind, x, y, age: 0, life: kind === 'pickup' ? 0.8 : 0.5 });
  if (state.effects.length > 24) state.effects.shift();
}
export function interactionTarget(state) {
  const near = (point) => Math.hypot(state.player.x - point.x, state.player.y - point.y) < 58;
  if (!state.inventory.key && near(KEY)) return { ...KEY, kind: 'key' };
  if (!state.safe.open && near(SAFE)) return { ...SAFE, kind: 'safe' };
  if (near(BREAKER)) return { ...BREAKER, kind: 'breaker' };
  return null;
}
export function makeNoise(state, x, y, strength) {
  state.noise = Math.max(state.noise, strength);
  const guard = state.guard;
  if (x < HOUSE.x || Math.hypot(guard.x - x, (guard.y - y) * 0.8) > strength * 750) return;
  guard.wakeIn = Math.min(guard.wakeIn, 0.7);
  if (state.alarm < 0.3) {
    guard.searchTime = 12;
    guard.lastSeenX = x;
    guard.lastSeenY = y;
    guard.reason = 'noise';
  }
}
export function interact(state) {
  if (state.mode !== 'playing') return;
  const p = state.player;
  if (atVan(state)) {
    if (p.bag.length) {
      for (const id of p.bag) state.loot[id].delivered = true;
      state.deposited += p.bag.length;
      p.bag = [];
      effect(state, 'deposit', 258, 453);
      say(
        state,
        state.deposited >= GOAL && state.security.completed
          ? 'Łup bezpieczny. Spacja: kończymy rabunek i odjeżdżamy.'
          : 'Łup w aucie. Jeszcze trochę i można odjeżdżać.',
      );
    } else if (!state.security.completed) {
      say(state, 'Najpierw odetnij prąd. Bezpiecznik jest w piwnicy, dalej po prawej →');
    } else if (state.deposited >= GOAL) {
      state.mode = 'leaving';
      state.sequence = 0;
      state.alarm = 0;
      say(state, 'Wskakuj. Czas zniknąć.');
    } else say(state, `Zbierz co najmniej ${GOAL} przedmiotów i przynieś je do auta.`);
    return;
  }
  if (p.hidden) return;
  const target = interactionTarget(state);
  if (target?.kind === 'key') {
    state.inventory.key = true;
    effect(state, 'pickup', KEY.x, KEY.y - 25);
    say(state, 'Klucz do sejfu. Szukaj metalowych drzwi na końcu biblioteki →');
    return;
  }
  if (target?.kind === 'breaker') {
    if (state.security.cooldown > 0) {
      say(
        state,
        state.security.powerOff > 0
          ? 'Kamery wyłączone. Masz chwilę na przejście.'
          : 'Bezpiecznik jeszcze stygnie. Wróć za moment.',
      );
    } else {
      if (!p.grounded || Math.abs(p.vx) > 25) {
        say(state, 'Zatrzymaj się przy bezpieczniku i wciśnij spację.');
        return;
      }
      state.typing = createTypingChallenge(state.security.attempts++);
      state.mode = 'typing';
      p.vx = 0;
    }
    return;
  }
  if (target?.kind === 'safe') {
    say(
      state,
      state.inventory.key
        ? 'Przytrzymaj spację przy sejfie. To chwilę potrwa.'
        : 'Zamknięte. Klucz leży w bibliotece, bliżej schodów.',
    );
    return;
  }
  const item = nearestLoot(state);
  if (!item) return;
  if (!state.security.completed) {
    say(state, 'Najpierw wyłącz prąd przy bezpieczniku w piwnicy →');
    return;
  }
  if (p.bag.length >= CAPACITY) {
    say(state, 'Torba pełna. Zanieś łupy do auta po lewej.');
    return;
  }
  item.taken = true;
  p.bag.push(item.id);
  effect(state, 'pickup', item.x, item.y);
  state.guard.wakeIn = Math.min(state.guard.wakeIn, 3);
  state.heat = Math.min(1, state.loot.filter((loot) => loot.taken).length * 0.075);
  say(state, `${item.name} w torbie.${p.bag.length === CAPACITY ? ' Wracaj do auta ←' : ''}`);
}
export function typeBreaker(state, value, now) {
  if (state.mode !== 'typing' || !state.typing) return;
  updateTyping(state.typing, value, now);
  if (state.typing.status !== 'passed') return;
  state.security.powerOff = POWER_DURATION;
  state.security.cooldown = 48;
  state.security.completed = true;
  state.security.spotted = false;
  state.mode = 'playing';
  say(
    state,
    `${Math.floor(typingMetrics(state.typing).wpm)} WPM. Prąd odcięty na ${POWER_DURATION} s. Zbieraj łupy!`,
  );
  makeNoise(state, BREAKER.x, BREAKER.y, 0.65);
}
export function retryBreaker(state) {
  if (state.mode !== 'typing' || state.typing?.status !== 'failed') return;
  state.typing = createTypingChallenge(state.security.attempts++);
}
export function cancelBreaker(state) {
  if (state.mode !== 'typing') return;
  state.typing = null;
  state.mode = 'playing';
  say(state, 'Prąd nadal działa. Wróć do bezpiecznika, gdy będziesz gotowy.');
}
export function prompt(state) {
  if (state.mode === 'typing') return 'BEZPIECZNIK · przepisz tekst z wynikiem min. 50 WPM';
  if (state.mode !== 'playing') return '';
  if (atVan(state))
    return state.player.bag.length
      ? 'SPACJA · Odłóż łupy do auta'
      : !state.security.completed
        ? 'NAJPIERW PRĄD · bezpiecznik w piwnicy po prawej →'
        : state.deposited >= GOAL
          ? 'SPACJA · Zakończ rabunek i odjedź'
          : 'Otwarte drzwi są po prawej →';
  if (state.player.hidden) return 'W CIENIU · puść S, aby wyjść';
  const target = interactionTarget(state);
  if (target?.kind === 'key')
    return 'SPACJA · zabierz klucz do sejfu (nie zajmuje miejsca w torbie)';
  if (target?.kind === 'safe')
    return state.inventory.key
      ? 'PRZYTRZYMAJ SPACJĘ · otwórz sejf'
      : 'SEJF ZAMKNIĘTY · potrzebujesz klucza z biblioteki';
  if (target?.kind === 'breaker')
    return state.security.powerOff > 0
      ? 'PRĄD ODCIĘTY · kamery wrócą za chwilę'
      : state.security.cooldown > 0
        ? 'BEZPIECZNIK STYGNIE · wróć później'
        : 'SPACJA · odetnij prąd — próba pisania, minimum 50 WPM';
  if (state.player.sneaking) return 'CICHE ŁAPY · poruszasz się wolniej, trudniej Cię przyłapać';
  const item = nearestLoot(state);
  if (item)
    return !state.security.completed
      ? 'NAJPIERW PRĄD · znajdź bezpiecznik w piwnicy →'
      : state.player.bag.length >= CAPACITY
        ? 'TORBA PEŁNA · wróć do auta ←'
        : `SPACJA · ${item.name}`;
  if (hidingPlace(state.player)) return 'PRZYTRZYMAJ S · schowaj się';
  if (
    ladders.some(
      (l) =>
        Math.abs(state.player.x - l.x) < 30 &&
        state.player.y >= l.top - 8 &&
        state.player.y <= l.bottom + 8,
    )
  )
    return 'W / S · wejdź lub zejdź po drabinie';
  return state.player.bag.length >= CAPACITY
    ? 'Torba pełna · auto czeka po lewej ←'
    : state.player.y > 580
      ? 'Piwnica · nie wszystko musi błyszczeć'
      : 'Wskakuj na półki. Wypatruj złotych błysków.';
}
// dystans do pierwszego przeciecia promienia z prostokatem
export function rayRectangle(ox, oy, dx, dy, rect) {
  let near = 0,
    far = Infinity;
  for (const [origin, direction, min, max] of [
    [ox, dx, rect.x, rect.x + rect.w],
    [oy, dy, rect.y, rect.y + rect.h],
  ]) {
    if (Math.abs(direction) < 1e-8) {
      if (origin < min || origin > max) return Infinity;
      continue;
    }
    const a = (min - origin) / direction,
      b = (max - origin) / direction;
    near = Math.max(near, Math.min(a, b));
    far = Math.min(far, Math.max(a, b));
    if (near > far) return Infinity;
  }
  return far >= 0 ? near : Infinity;
}
export const lightBlockers = [
  ...platforms.filter((p) => p.kind === 'floor').map((p) => ({ x: p.x, y: p.y, w: p.w, h: 12 })),
  { x: HOUSE.right, y: 125, w: 14, h: 605 },
  { x: HOUSE.x - 12, y: 130, w: 12, h: 300 },
];
export function lightDistance(guard, angle, max = 330) {
  const ox = guard.x + guard.facing * 12,
    oy = guard.y - 38;
  return Math.min(
    max,
    ...lightBlockers.map((rect) => rayRectangle(ox, oy, Math.cos(angle), Math.sin(angle), rect)),
  );
}
export function cameraAngle(camera, time) {
  return Math.PI / 2 + Math.sin(time * 0.62 + camera.phase) * 0.68;
}
export function cameraDistance(camera, angle) {
  return Math.min(
    camera.range,
    ...lightBlockers.map((rect) =>
      rayRectangle(camera.x, camera.y, Math.cos(angle), Math.sin(angle), rect),
    ),
  );
}
export function visibleToCamera(state) {
  const p = state.player;
  if (p.hidden || state.security.powerOff > 0 || p.x < HOUSE.x) return false;
  return SECURITY_CAMERAS.some((camera) => {
    const dx = p.x - camera.x;
    const dy = p.y - 18 - camera.y;
    const distance = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);
    const difference = Math.atan2(
      Math.sin(angle - cameraAngle(camera, state.time)),
      Math.cos(angle - cameraAngle(camera, state.time)),
    );
    return (
      distance < camera.range &&
      Math.abs(difference) < 0.34 &&
      cameraDistance(camera, angle) > distance - 6
    );
  });
}
export function visibleToGuard(state) {
  const { player: p, guard: g } = state;
  if (!g.awake || p.hidden || p.x < HOUSE.x - 20) return false;
  const ox = g.x + g.facing * 12,
    oy = g.y - 38;
  const dx = p.x - ox,
    dy = p.y - 18 - oy,
    distance = Math.hypot(dx, dy);
  if (distance > 330) return false;
  const angle = Math.atan2(dy, dx);
  const difference = Math.atan2(Math.sin(angle - g.angle), Math.cos(angle - g.angle));
  return Math.abs(difference) < 0.44 && lightDistance(g, angle) >= distance - 7;
}
function movePlayer(s, input, dt) {
  const p = s.player;
  p.drop = Math.max(0, p.drop - dt);
  p.landing = Math.max(0, p.landing - dt);
  p.jumpBuffer = input.jump ? 0.13 : Math.max(0, p.jumpBuffer - dt);
  p.coyote = p.grounded ? 0.11 : Math.max(0, p.coyote - dt);
  const horizontal = Number(Boolean(input.right)) - Number(Boolean(input.left));
  p.hidden = Boolean(input.down && !horizontal && p.grounded && hidingPlace(p));
  const ladder = ladders.find(
    (l) => Math.abs(p.x - l.x) < 25 && p.y >= l.top - 6 && p.y <= l.bottom + 5,
  );
  const climb = ladder && !horizontal && !p.hidden && (input.up || input.down);
  if (climb) {
    p.sneaking = false;
    p.jumpBuffer = 0;
    p.x += (ladder.x - p.x) * Math.min(1, dt * 18);
    p.vy = 0;
    p.vx = 0;
    p.y = clamp(p.y + (input.down ? 1 : -1) * 125 * dt, ladder.top, ladder.bottom);
    p.grounded = p.y === ladder.top || p.y === ladder.bottom;
    return;
  }
  if (p.jumpBuffer > 0 && p.coyote > 0 && !p.hidden) {
    p.vy = -445;
    p.grounded = false;
    p.coyote = 0;
    p.jumpBuffer = 0;
    s.stats.jumps++;
  }
  // krotko = niski skok, przytrzymanie = wyzej (na polki)
  if (input.jumpHeld === false && !input.jump && p.vy < -220) p.vy = -220;
  const onShelf = platforms.some(
    (plat) =>
      !plat.kind && p.x + 10 > plat.x && p.x - 10 < plat.x + plat.w && Math.abs(p.y - plat.y) < 2,
  );
  if (input.down && !horizontal && p.grounded && !p.hidden && !ladder && onShelf) {
    p.drop = 0.23;
    p.grounded = false;
    p.y += 4;
  }
  p.sneaking = Boolean(p.grounded && (input.sneak || input.down) && !p.hidden);
  const loadedSpeed = (p.sneaking ? 108 : 205) - p.bag.length * (p.sneaking ? 3 : 7);
  const speed = p.hidden ? 0 : horizontal * loadedSpeed;
  p.vx += (speed - p.vx) * Math.min(1, dt * 18);
  if (p.hidden) p.vx = 0;
  if (horizontal) p.facing = horizontal;
  p.x = clamp(p.x + p.vx * dt, 24, HOUSE.right - 24);
  if (p.y > HOUSE.ground + 20) p.x = Math.max(HOUSE.x + 18, p.x);
  if (p.x > HOUSE.x - 22 && p.x < HOUSE.x + 8 && p.y < 434 && p.y > 125) p.x = HOUSE.x - 22;
  const previousY = p.y;
  p.vy = Math.min(p.vy + 1120 * dt, 680);
  p.y += p.vy * dt;
  p.grounded = false;
  if (p.vy >= 0 && p.drop <= 0) {
    for (const plat of platforms) {
      if (
        p.x + 11 > plat.x &&
        p.x - 11 < plat.x + plat.w &&
        previousY <= plat.y + 0.5 &&
        p.y >= plat.y
      ) {
        if (p.vy > 260) {
          p.landing = 0.16;
          effect(s, 'land', p.x, plat.y);
          if (p.x > HOUSE.x) makeNoise(s, p.x, plat.y, input.sneak || input.down ? 0.2 : 0.72);
        }
        p.y = plat.y;
        p.vy = 0;
        p.grounded = true;
        break;
      }
    }
  }
  if (p.y > WORLD.height + 30) {
    p.x = 570;
    p.y = 490;
    p.vy = 0;
    say(s, 'Złap równowagę. Drabina prowadzi z piwnicy na górę.');
  }
  p.stepTimer = Math.max(0, p.stepTimer - dt);
  if (
    p.grounded &&
    !p.sneaking &&
    !input.sneak &&
    !input.down &&
    Math.abs(p.vx) > 120 &&
    p.stepTimer <= 0 &&
    CREAKY_BOARDS.some(
      (board) => Math.abs(p.y - board.y) < 3 && p.x > board.x && p.x < board.x + board.w,
    )
  ) {
    p.stepTimer = 0.48;
    makeNoise(s, p.x, p.y, 0.85);
    effect(s, 'noise', p.x, p.y - 3);
  }
}
const floorAt = (y) => (y <= 302 ? 290 : y <= 502 ? 490 : 730);
function guardStep(guard, target, travel) {
  // najpierw schodzi z drabiny, potem zmienia cel
  if (guard.climbTarget !== null) {
    const dy = guard.climbTarget - guard.y;
    guard.y += Math.sign(dy) * Math.min(Math.abs(dy), travel);
    if (Math.abs(guard.y - guard.climbTarget) < 0.1) guard.climbTarget = null;
    return false;
  }
  const from = floorAt(guard.y);
  const to = floorAt(target.y);
  let destinationX = target.x;
  let nextFloor = from;
  if (from !== to) {
    nextFloor = from === 490 ? to : 490;
    const choices = ladders.filter(
      (ladder) =>
        floorAt(ladder.top) === Math.min(from, nextFloor) &&
        ladder.bottom === Math.max(from, nextFloor),
    );
    const ladder = choices.reduce(
      (best, candidate) =>
        !best ||
        Math.abs(guard.x - candidate.x) + Math.abs(target.x - candidate.x) <
          Math.abs(guard.x - best.x) + Math.abs(target.x - best.x)
          ? candidate
          : best,
      null,
    );
    if (!ladder) return false;
    destinationX = ladder.x;
  }
  const dx = destinationX - guard.x;
  if (Math.abs(dx) > 0.5) guard.facing = Math.sign(dx);
  guard.x += Math.sign(dx) * Math.min(Math.abs(dx), travel);
  if (Math.abs(guard.x - destinationX) < 0.5 && from !== to) guard.climbTarget = nextFloor;
  return from === to && Math.abs(guard.x - target.x) < 1;
}
function moveGuard(s, dt) {
  const g = s.guard;
  g.wakeIn -= dt;
  if (!g.awake && (g.wakeIn <= 0 || s.runTime > 18)) {
    g.awake = true;
    say(s, 'Ktoś się obudził. Trzymaj się cienia i szukaj kryjówek.');
  }
  if (!g.awake) return;
  g.searchTime = Math.max(0, g.searchTime - dt);
  const searching = g.searchTime > 0;
  const target = searching
    ? {
        x: clamp(g.lastSeenX, floorAt(g.lastSeenY) === 290 ? 950 : 540, HOUSE.right - 40),
        y: floorAt(g.lastSeenY),
      }
    : route[g.target];
  const speed = 98 + s.heat * 24 + (searching ? 14 : 0);
  const previousX = g.x;
  const previousY = g.y;
  const arrived = guardStep(g, target, speed * dt);
  g.moving = Math.abs(g.x - previousX) + Math.abs(g.y - previousY) > 0.01;
  if (arrived && !searching) g.target = (g.target + 1) % route.length;
  const tilt = searching && arrived && g.lastSeenY < g.y - 40 ? -g.facing * 1.05 : 0;
  g.angle =
    tilt +
    (g.facing === 1 ? 0 : Math.PI) +
    Math.sin(s.time * (searching ? 2.1 : 0.9)) * (searching && arrived ? 0.4 : 0.14);
}
function updateSafe(s, input, dt) {
  if (s.safe.open) return;
  const target = interactionTarget(s);
  if (
    target?.kind === 'safe' &&
    s.inventory.key &&
    input.actionHeld &&
    !s.player.hidden &&
    s.player.grounded &&
    Math.abs(s.player.vx) < 25
  ) {
    s.safe.progress = Math.min(1, s.safe.progress + dt / 2.8);
    s.safe.noiseTimer -= dt;
    if (s.safe.noiseTimer <= 0) {
      makeNoise(s, SAFE.x, SAFE.y, 0.85);
      s.safe.noiseTimer = 0.8;
    }
    if (s.safe.progress >= 1) {
      s.safe.open = true;
      for (const item of s.loot) item.locked = false;
      effect(s, 'deposit', SAFE.x, SAFE.y - 30);
      say(s, 'Sejf otwarty. Zabierz szmaragd i znikaj.');
    }
  } else {
    s.safe.progress = Math.max(0, s.safe.progress - dt * 0.4);
  }
}
export function stepGame(s, input = {}, dt = 1 / 60) {
  dt = clamp(dt, 0, 1 / 30);
  if (['ready', 'paused', 'typing', 'caught', 'complete'].includes(s.mode)) return;
  s.time += dt;
  s.toastTime = Math.max(0, s.toastTime - dt);
  s.noise = Math.max(0, s.noise - dt * 0.55);
  for (const particle of s.effects) particle.age += dt;
  s.effects = s.effects.filter((particle) => particle.age < particle.life);
  if (s.mode === 'arriving') {
    s.sequence += dt;
    const duration = s.fastSequence ? 0.45 : 3.1;
    const t = clamp(s.sequence / (duration * 0.75), 0, 1);
    s.vanX = -170 + 350 * (1 - (1 - t) ** 3);
    s.player.x =
      258 + Math.sin((clamp((s.sequence / duration - 0.7) / 0.3, 0, 1) * Math.PI) / 2) * 42;
    s.player.y = 490 - Math.sin(clamp((s.sequence / duration - 0.7) / 0.3, 0, 1) * Math.PI) * 48;
    if (s.sequence >= duration) {
      s.mode = 'playing';
      s.player.y = 490;
      s.player.grounded = true;
      say(s, 'Auto czeka tutaj. Otwarte drzwi są po prawej →');
    }
  } else if (s.mode === 'leaving') {
    s.sequence += dt;
    const duration = s.fastSequence ? 0.4 : 2.8;
    s.vanX = 180 - (s.sequence / duration) ** 2 * 500;
    s.player.x = s.vanX + 70;
    if (s.sequence >= duration) {
      s.mode = 'complete';
      s.outcome = { deposited: s.deposited, total: s.loot.length };
    }
  } else {
    s.runTime += dt;
    const hadPowerOff = s.security.powerOff > 0;
    s.security.powerOff = Math.max(0, s.security.powerOff - dt);
    s.security.cooldown = Math.max(0, s.security.cooldown - dt);
    if (hadPowerOff && s.security.powerOff === 0)
      say(s, 'Kamery znów działają. Uważaj na czerwone światło.');
    movePlayer(s, input, dt);
    moveGuard(s, dt);
    if (input.action) interact(s);
    if (s.mode === 'playing') updateSafe(s, input, dt);
    if (s.mode === 'playing') {
      const spotted = visibleToGuard(s);
      const cameraSpotted = visibleToCamera(s);
      s.security.spotted = cameraSpotted;
      if (spotted || cameraSpotted) {
        s.guard.searchTime = cameraSpotted ? 10 : 7;
        s.guard.lastSeenX = s.player.x;
        s.guard.lastSeenY = s.player.y;
        s.guard.reason = cameraSpotted ? 'camera' : 'sight';
        if (cameraSpotted) s.guard.wakeIn = Math.min(s.guard.wakeIn, 0.5);
      }
      const detection = spotted ? (s.player.sneaking ? 0.65 : 0.95) + s.heat * 0.12 : 0.73;
      s.alarm = clamp(s.alarm + (spotted || cameraSpotted ? detection : -0.4) * dt, 0, 1);
      s.stats.maxAlarm = Math.max(s.stats.maxAlarm, s.alarm);
      if (s.alarm > 0.3) s.escapedLight = true;
      if (s.escapedLight && s.alarm === 0) {
        s.stats.closeCalls++;
        s.escapedLight = false;
      }
      if (s.alarm >= 1) {
        s.mode = 'caught';
        s.player.vx = 0;
        say(
          s,
          cameraSpotted
            ? 'Kamera Cię namierzyła. Wyłącz prąd albo poczekaj, aż odwróci obiektyw.'
            : 'Latarka złapała Cię w świetle. Następnym razem trzymaj S przy kryjówce.',
        );
      }
    }
  }
  const targetX = clamp(s.player.x - VIEW.width * 0.36, 0, Math.max(0, WORLD.width - VIEW.width));
  const targetY = clamp(s.player.y - VIEW.height * 0.7, 0, WORLD.height - VIEW.height);
  s.camera.x += (targetX - s.camera.x) * Math.min(1, dt * 6);
  s.camera.y += (targetY - s.camera.y) * Math.min(1, dt * 5);
}
