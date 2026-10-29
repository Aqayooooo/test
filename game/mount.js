import {
  VIEW,
  createGame,
  startGame,
  stepGame,
  prompt,
  pauseGame,
  resumeGame,
  interact,
  GOAL,
  CAPACITY,
  atVan,
  HOUSE,
  typeBreaker,
  retryBreaker,
  cancelBreaker,
} from './engine.js';
import { renderGame } from './render.js';
import { mountTypingPanel } from './typing-view.js';

export function mountGame(root) {
  const abort = new AbortController();
  const options = { signal: abort.signal };
  const $ = (selector) => root.querySelector(selector);
  const stage = $('.heist-stage'),
    canvas = $('canvas'),
    ctx = canvas.getContext('2d');
  const start = $('[data-start]'),
    overlay = $('[data-overlay]'),
    brief = $('[data-brief]');
  const result = $('[data-result]'),
    resultAction = $('[data-result-action]'),
    pause = $('[data-pause]');
  const alarm = $('[data-alarm]'),
    alarmMeter = alarm.querySelector('progress');
  const expand = $('[data-expand]');
  const missionProgress = $('[data-mission-progress]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const state = createGame();
  const keys = {
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false,
    action: false,
    actionHeld: false,
    sneak: false,
  };
  let expanded = false;
  let placeholder;
  let previousOverflow = '';
  let inertElements = [];
  let frame = 0,
    lastTime = 0,
    accumulator = 0,
    completeTimer = 0,
    destroyed = false,
    inView = true;
  let shownMode = '',
    lastPrompt = '';
  const keyMap = {
    KeyA: 'left',
    ArrowLeft: 'left',
    KeyD: 'right',
    ArrowRight: 'right',
    KeyW: 'up',
    ArrowUp: 'up',
    KeyS: 'down',
    ArrowDown: 'down',
    Space: 'action',
    ShiftLeft: 'sneak',
    ShiftRight: 'sneak',
  };
  const clearKeys = () => {
    for (const key of Object.keys(keys)) keys[key] = false;
  };
  const setText = (node, text) => {
    if (node.textContent !== text) node.textContent = text;
  };
  if (!ctx) {
    setText(start.querySelector('.button-text'), 'Canvas niedostępny');
    setText(
      $('[data-prompt]'),
      'Ta przeglądarka nie obsługuje gry. Pozostałe projekty nadal są dostępne.',
    );
    return () => abort.abort();
  }
  const typingPanel = $('[data-typing]');
  const typingView = mountTypingPanel(typingPanel, {
    getChallenge: () => (state.mode === 'typing' ? state.typing : null),
    onType(value, now) {
      typeBreaker(state, value, now);
      if (state.mode === 'playing') stage.focus({ preventScroll: true });
      ui();
      if (active()) run();
    },
    onRetry: () => retryBreaker(state),
    onCancel: leaveTyping,
  });
  function leaveTyping() {
    cancelBreaker(state);
    clearKeys();
    stage.focus({ preventScroll: true });
    ui();
    run();
  }
  function resize() {
    const box = stage.getBoundingClientRect(),
      ratio = Math.min(devicePixelRatio || 1, 2);
    if (!box.width || !box.height) return;
    VIEW.height = box.width < 500 && box.height >= box.width * 0.8 ? 430 : 540;
    VIEW.width = Math.round((VIEW.height * box.width) / box.height);
    canvas.width = Math.round(box.width * ratio);
    canvas.height = Math.round(box.height * ratio);
    ctx.setTransform(canvas.width / VIEW.width, 0, 0, canvas.height / VIEW.height, 0, 0);
    renderGame(ctx, state);
  }
  function active() {
    return ['playing', 'arriving', 'leaving'].includes(state.mode);
  }
  function setExpanded(open, focus = true) {
    if (open === expanded) return;
    expanded = open;
    if (open) {
      placeholder = document.createElement('div');
      placeholder.style.height = `${root.getBoundingClientRect().height}px`;
      placeholder.setAttribute('aria-hidden', 'true');
      root.before(placeholder);
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      for (let node = root; node.parentElement; node = node.parentElement) {
        for (const sibling of node.parentElement.children) {
          if (sibling !== node && sibling instanceof HTMLElement) {
            inertElements.push([sibling, sibling.inert]);
            sibling.inert = true;
          }
        }
        if (node.parentElement === document.body) break;
      }
      root.setAttribute('role', 'dialog');
      root.setAttribute('aria-modal', 'true');
      root.setAttribute('aria-label', 'Nocna zmiana — powiększona gra');
    } else {
      placeholder?.remove();
      placeholder = null;
      document.body.style.overflow = previousOverflow;
      for (const [element, wasInert] of inertElements) element.inert = wasInert;
      inertElements = [];
      root.removeAttribute('role');
      root.removeAttribute('aria-modal');
      root.removeAttribute('aria-label');
    }
    root.classList.toggle('is-expanded', open);
    expand.setAttribute('aria-expanded', String(open));
    expand.setAttribute('aria-label', open ? 'Zmniejsz grę' : 'Powiększ grę');
    expand.title = open ? 'Zmniejsz grę' : 'Powiększ grę';
    expand.textContent = open ? '×' : '⤢';
    resize();
    if (focus) {
      const target =
        state.mode === 'typing'
          ? $('[data-typing-input]')
          : active()
            ? stage
            : open
              ? state.mode === 'ready'
                ? start
                : resultAction
              : expand;
      target.focus({ preventScroll: true });
    }
  }
  expand.addEventListener('click', () => setExpanded(!expanded), options);
  root.addEventListener(
    'keydown',
    (event) => {
      if (!event.defaultPrevented && event.key === 'Escape' && state.mode === 'typing') {
        event.preventDefault();
        leaveTyping();
        return;
      }
      if (!expanded || event.defaultPrevented) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        if (active()) freeze();
        else setExpanded(false);
      }
      if (event.key === 'Tab') {
        const focusable = [
          ...root.querySelectorAll('button:not(:disabled), input:not(:disabled), [tabindex="0"]'),
        ].filter((element) => element.getClientRects().length);
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    },
    options,
  );
  function ui() {
    setText($('[data-bag]'), `${state.player.bag.length} / ${CAPACITY}`);
    setText($('[data-saved]'), `${state.deposited} / ${state.loot.length}`);
    missionProgress.max = GOAL;
    missionProgress.value = Math.min(GOAL, state.deposited);
    setText($('[data-objective]'), state.security.completed ? 'ZABEZPIECZ' : 'NAJPIERW');
    setText($('[data-goal]'), state.security.completed ? `${GOAL} SKARBÓW` : 'PRĄD W PIWNICY');
    $('[data-noise]').value = state.noise;
    setText($('[data-key]'), state.inventory.key ? 'KLUCZ ✓' : 'BRAK KLUCZA');
    setText(
      $('[data-power]'),
      state.security.powerOff > 0
        ? `KAMERY OFF · ${Math.ceil(state.security.powerOff)} s`
        : state.security.cooldown > 0
          ? `KAMERY ON · RESET ${Math.ceil(state.security.cooldown)} s`
          : 'KAMERY ON',
    );
    setText(
      $('[data-heat]'),
      state.heat > 0.5 ? 'WYSOKA CZUJNOŚĆ' : state.guard.awake ? 'DOM CZUWA' : 'DOM ŚPI',
    );
    root.classList.toggle('power-off', state.security.powerOff > 0);
    root.classList.toggle('has-key', state.inventory.key);
    const openingSafe = state.mode === 'playing' && state.safe.progress > 0 && !state.safe.open;
    $('[data-safe-opening]').hidden = !openingSafe;
    $('[data-safe-progress]').value = state.safe.progress;
    setText(
      $('[data-mission-state]'),
      !state.security.completed
        ? 'Bezpiecznik → próba pisania, min. 50 WPM'
        : state.deposited >= GOAL
          ? 'Możesz odjechać — albo zaryzykować więcej'
          : 'Bezpiecznik ✓ · Auto czeka po lewej',
    );
    const canLeave = state.deposited >= GOAL && state.security.completed;
    root.classList.toggle('mission-ready', canLeave);
    const location =
      state.player.x < HOUSE.x
        ? 'PRZED DOMEM'
        : state.player.y > 540
          ? state.player.x > 1840
            ? 'WINIARNIA'
            : 'PIWNICA'
          : state.player.y < 330
            ? state.player.x > 1800
              ? 'BIBLIOTEKA'
              : 'SYPIALNIA'
            : state.player.x > 1800
              ? 'KUCHNIA'
              : 'SALON';
    setText($('[data-location]'), location);
    const watch = state.player.hidden
      ? 'JESTEŚ W UKRYCIU'
      : state.alarm > 0.12
        ? state.security.spotted
          ? 'KAMERA CIĘ WIDZI'
          : 'WIDZI CIĘ · UCIEKAJ'
        : state.guard.searchTime > 0
          ? state.guard.reason === 'noise'
            ? 'SPRAWDZA HAŁAS'
            : 'SZUKA CIĘ'
          : state.guard.awake
            ? 'DOMOWNIK PATROLUJE'
            : 'DOMOWNIK ŚPI';
    setText($('[data-watch]'), watch);
    root.dataset.alert = state.player.hidden ? 'hidden' : state.alarm > 0.12 ? 'seen' : 'quiet';
    const line =
      prompt(state) ||
      (state.mode === 'ready' ? 'Wciśnij Graj, aby rozpocząć.' : 'Sterowanie: WASD i spacja.');
    if (line !== lastPrompt) {
      setText($('[data-prompt]'), line);
      lastPrompt = line;
    }
    alarm.hidden = state.mode !== 'playing' || state.alarm < 0.06;
    alarmMeter.value = state.alarm;
    setText(
      alarm.querySelector('span'),
      state.security.spotted ? 'KAMERA CIĘ WIDZI' : 'NIE DAJ SIĘ ZAUWAŻYĆ',
    );
    $('[data-exit]').hidden = state.mode !== 'playing' || !canLeave || !atVan(state);
    if (state.event) {
      setText($('[data-game-live]'), state.event);
      state.event = '';
    }
    typingView.sync();
    if (shownMode === state.mode) return;
    shownMode = state.mode;
    root.dataset.mode = state.mode;
    overlay.hidden = active();
    brief.hidden = state.mode !== 'ready';
    result.hidden = !['paused', 'caught', 'complete'].includes(state.mode);
    typingPanel.hidden = state.mode !== 'typing';
    if (state.mode === 'typing') {
      clearKeys();
      cancelAnimationFrame(frame);
      frame = 0;
      typingView.focus();
    }
    pause.disabled = !active() && state.mode !== 'paused';
    pause.textContent = state.mode === 'paused' ? '▷' : 'Ⅱ';
    pause.setAttribute('aria-label', state.mode === 'paused' ? 'Wznów grę' : 'Wstrzymaj grę');
    pause.title = state.mode === 'paused' ? 'Wznów grę' : 'Pauza';
    $('[data-summary]').hidden = !['caught', 'complete'].includes(state.mode);
    if (['caught', 'complete'].includes(state.mode)) {
      setText($('[data-result-loot]'), `${state.deposited} / ${state.loot.length}`);
      const seconds = Math.floor(state.runTime);
      setText(
        $('[data-result-time]'),
        `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`,
      );
      setText(
        $('[data-result-style]'),
        state.mode === 'caught'
          ? 'Przyłapany'
          : state.stats.maxAlarm < 0.3
            ? 'Bez śladu'
            : 'O włos',
      );
    }
    const cinematic = $('[data-cinematic]');
    cinematic.hidden = !['arriving', 'leaving'].includes(state.mode);
    cinematic.textContent =
      state.mode === 'leaving' ? 'Cicho przyszliśmy. Cicho znikamy.' : 'Ostatni kurs tej nocy.';
    if (state.mode === 'paused') {
      setText($('[data-result-kicker]'), 'DOM POCZEKA');
      setText($('[data-result-title]'), 'Mała przerwa.');
      setText(
        $('[data-result-copy]'),
        'Wróć, gdy będziesz gotowy. W czasie pauzy nikt Cię nie szuka.',
      );
      setText($('[data-result-label]'), 'Wracam do gry');
    } else if (state.mode === 'caught') {
      clearKeys();
      setText($('[data-result-kicker]'), 'KONIEC NOCNEJ ZMIANY');
      setText($('[data-result-title]'), 'BUSTED');
      setText(
        $('[data-result-copy]'),
        state.security.spotted
          ? 'Kamery też mają oczy. Bezpiecznik w piwnicy wyłącza je na pół minuty.'
          : 'O jedną błyskotkę za daleko. Skradaj się po jasnych deskach i przytrzymaj S przy kryjówce.',
      );
      setText($('[data-result-label]'), 'Jeszcze jedna próba');
      setText($('[data-game-live]'), 'Przyłapany. Możesz zacząć ponownie.');
    } else if (state.mode === 'complete') {
      clearKeys();
      setText(
        $('[data-result-kicker]'),
        state.deposited === state.loot.length
          ? 'WSZYSTKO W AUCIE. CZYSTA ROBOTA.'
          : 'KOT WRÓCIŁ. SKARBY TEŻ.',
      );
      setText($('[data-result-title]'), 'MISSION COMPLETE');
      setText(
        $('[data-result-copy]'),
        `W aucie ${state.deposited} z ${state.loot.length} skarbów. Dzięki za zagranie — dobrych snów!`,
      );
      setText($('[data-result-label]'), 'Jeszcze jeden nocny kurs');
      setText($('[data-game-live]'), 'Misja zakończona. Dziękuję za zagranie.');
      // chwila na przeczytanie wyniku
      completeTimer = window.setTimeout(reset, 11000);
    }
  }
  function reset() {
    clearTimeout(completeTimer);
    clearKeys();
    Object.assign(state, createGame());
    shownMode = '';
    ui();
    renderGame(ctx, state);
  }
  function tick(now) {
    frame = 0;
    if (destroyed || !root.isConnected || !active() || !inView || document.hidden) return;
    const elapsed = lastTime ? Math.min((now - lastTime) / 1000, 0.08) : 1 / 60;
    lastTime = now;
    accumulator += elapsed;
    while (accumulator >= 1 / 60) {
      stepGame(state, { ...keys, jumpHeld: keys.up }, 1 / 60);
      keys.jump = false;
      keys.action = false;
      accumulator -= 1 / 60;
    }
    ui();
    renderGame(ctx, state);
    if (active()) frame = requestAnimationFrame(tick);
  }
  function run() {
    if (!frame && active() && inView && !document.hidden) {
      lastTime = 0;
      accumulator = 0;
      frame = requestAnimationFrame(tick);
    }
  }
  function freeze() {
    clearKeys();
    if (state.mode === 'typing') cancelBreaker(state);
    pauseGame(state);
    cancelAnimationFrame(frame);
    frame = 0;
    ui();
    renderGame(ctx, state);
  }
  function centerGame() {
    if (expanded) return;
    // nie scrollIntoView bo ucina sterowanie (scroll-padding)
    const box = root.getBoundingClientRect();
    const offset = Math.max(4, (innerHeight - box.height) / 2);
    window.scrollTo({ top: Math.max(0, box.top + scrollY - offset), behavior: 'instant' });
  }
  function begin() {
    clearTimeout(completeTimer);
    clearKeys();
    // fokus przed ukryciem przycisku, inaczej blur pauzuje intro
    stage.focus({ preventScroll: true });
    startGame(state, reduced.matches);
    ui();
    centerGame();
    stage.focus({ preventScroll: true });
    run();
  }
  start.addEventListener('click', begin, options);
  function continueGame() {
    centerGame();
    stage.focus({ preventScroll: true });
    resumeGame(state);
    ui();
    run();
  }
  resultAction.addEventListener(
    'click',
    () => {
      if (state.mode === 'paused') continueGame();
      else if (state.mode === 'caught') begin();
      else reset();
    },
    options,
  );
  pause.addEventListener(
    'click',
    () => {
      if (state.mode === 'paused') continueGame();
      else freeze();
    },
    options,
  );
  $('[data-exit]').addEventListener(
    'click',
    () => {
      // oddaj tez to co zostalo w torbie
      if (state.deposited >= GOAL && state.security.completed && atVan(state)) {
        interact(state);
        if (state.mode === 'playing') interact(state);
        ui();
      }
      stage.focus({ preventScroll: true });
      run();
    },
    options,
  );
  stage.addEventListener(
    'keydown',
    (event) => {
      if (event.target !== stage || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.code === 'Escape' || event.code === 'KeyP') {
        event.preventDefault();
        if (state.mode === 'typing') leaveTyping();
        else if (active()) freeze();
        else if (event.code === 'Escape' && expanded) setExpanded(false);
        return;
      }
      const key = keyMap[event.code];
      if (!key || state.mode !== 'playing') return;
      event.preventDefault();
      if (key === 'action') {
        keys.actionHeld = true;
        if (!event.repeat) keys.action = true;
      } else {
        keys[key] = true;
        if (key === 'up' && !event.repeat) keys.jump = true;
      }
    },
    options,
  );
  window.addEventListener(
    'keyup',
    (event) => {
      const key = keyMap[event.code];
      if (key === 'action') keys.actionHeld = false;
      if (key && key !== 'action') keys[key] = false;
    },
    options,
  );
  stage.addEventListener(
    'blur',
    (event) => {
      if ((active() || state.mode === 'typing') && !root.contains(event.relatedTarget)) freeze();
    },
    options,
  );
  root.addEventListener(
    'focusout',
    (event) => {
      if ((active() || state.mode === 'typing') && !root.contains(event.relatedTarget)) freeze();
    },
    options,
  );
  window.addEventListener(
    'blur',
    () => {
      if (active() || state.mode === 'typing') freeze();
    },
    options,
  );
  document.addEventListener(
    'visibilitychange',
    () => {
      if (document.hidden && (active() || state.mode === 'typing')) freeze();
    },
    options,
  );
  for (const control of root.querySelectorAll('[data-control]')) {
    const key = control.dataset.control;
    control.addEventListener(
      'pointerdown',
      (event) => {
        if (state.mode !== 'playing') return;
        event.preventDefault();
        control.setPointerCapture(event.pointerId);
        stage.focus({ preventScroll: true });
        keys[key] = true;
        if (key === 'action') keys.actionHeld = true;
        if (key === 'up') keys.jump = true;
      },
      options,
    );
    const release = () => {
      if (key === 'action') keys.actionHeld = false;
      if (key !== 'action') keys[key] = false;
    };
    control.addEventListener('pointerup', release, options);
    control.addEventListener('pointercancel', release, options);
    control.addEventListener('lostpointercapture', release, options);
  }
  const resizer = new ResizeObserver(resize);
  resizer.observe(stage);
  const visibility = new IntersectionObserver(
    (entries) => {
      inView = entries[0].isIntersecting;
      if (!inView && (active() || state.mode === 'typing')) freeze();
      else if (inView && active()) run();
    },
    { threshold: 0.15 },
  );
  visibility.observe(stage);
  start.disabled = false;
  setText(start.querySelector('.button-text'), 'Graj w Nocną zmianę');
  resize();
  ui();
  document.fonts.ready.then(() => {
    if (!destroyed) renderGame(ctx, state);
  });
  return () => {
    destroyed = true;
    if (expanded) setExpanded(false, false);
    abort.abort();
    typingView.destroy();
    clearKeys();
    cancelAnimationFrame(frame);
    clearTimeout(completeTimer);
    resizer.disconnect();
    visibility.disconnect();
  };
}
