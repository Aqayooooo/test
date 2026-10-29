import { MIN_WPM, typingMetrics } from './typing.js';

export function mountTypingPanel(panel, { getChallenge, onType, onRetry, onCancel }) {
  const abort = new AbortController();
  const options = { signal: abort.signal };
  const $ = (selector) => panel.querySelector(selector);
  const input = $('[data-typing-input]');
  const text = $('[data-typing-text]');
  const retry = $('[data-typing-retry]');
  const feedback = $('[data-typing-feedback]');
  let current = null;
  let letters = [];
  let timer = 0;
  const setText = (element, value) => {
    if (element.textContent !== value) element.textContent = value;
  };

  function sync() {
    const challenge = getChallenge();
    if (!challenge) {
      clearInterval(timer);
      timer = 0;
      return;
    }
    if (current !== challenge) {
      current = challenge;
      letters = [...challenge.target].map((char) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.setAttribute('aria-hidden', 'true');
        return span;
      });
      text.replaceChildren(...letters);
      text.setAttribute('aria-label', `Tekst do przepisania: ${challenge.target}`);
      input.maxLength = challenge.target.length;
    }
    if (!timer && challenge.status === 'typing') timer = window.setInterval(sync, 100);
    if (challenge.status !== 'typing' && timer) {
      clearInterval(timer);
      timer = 0;
    }
    const metrics = typingMetrics(challenge, performance.now());
    // 49.9 to nie 50
    setText($('[data-typing-wpm]'), String(Math.floor(metrics.wpm)));
    setText($('[data-typing-accuracy]'), String(Math.round(metrics.accuracy)));
    setText($('[data-typing-time]'), metrics.seconds.toFixed(1));
    panel.dataset.phase = challenge.status;
    if (input.value !== challenge.typed) input.value = challenge.typed;
    input.readOnly = challenge.status === 'failed';
    retry.hidden = challenge.status !== 'failed';
    letters.forEach((span, i) => {
      span.className =
        i < challenge.typed.length
          ? challenge.typed[i] === challenge.target[i]
            ? 'is-correct'
            : 'is-wrong'
          : '';
      span.classList.toggle('is-current', i === challenge.typed.length);
    });
    setText(
      feedback,
      challenge.status === 'failed'
        ? `Tekst poprawny, ale ${Math.floor(metrics.wpm)} WPM to za mało. Potrzebujesz ${MIN_WPM} WPM. Enter — jeszcze raz.`
        : challenge.typed.length === challenge.target.length
          ? 'Popraw zaznaczone błędy klawiszem Backspace. Czas nadal płynie.'
          : 'Błędy poprawiaj Backspace. Wklejanie jest wyłączone.',
    );
  }
  input.addEventListener(
    'input',
    () => {
      onType(input.value, performance.now());
      sync();
    },
    options,
  );
  text.addEventListener('click', () => input.focus({ preventScroll: true }), options);
  input.addEventListener(
    'beforeinput',
    (event) => {
      if (event.data?.length > 1 || /Paste|Drop|Replacement/.test(event.inputType))
        event.preventDefault();
    },
    options,
  );
  for (const name of ['paste', 'drop'])
    input.addEventListener(name, (event) => event.preventDefault(), options);
  panel.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Enter' && getChallenge()?.status === 'failed') {
        event.preventDefault();
        onRetry();
        sync();
        input.focus({ preventScroll: true });
        return;
      }
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      onCancel();
    },
    options,
  );
  retry.addEventListener(
    'click',
    () => {
      onRetry();
      sync();
      input.focus({ preventScroll: true });
    },
    options,
  );
  $('[data-typing-cancel]').addEventListener('click', onCancel, options);
  return {
    sync,
    focus: () => input.focus({ preventScroll: true }),
    destroy() {
      abort.abort();
      clearInterval(timer);
    },
  };
}
