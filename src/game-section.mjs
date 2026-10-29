import { arrow } from './layout.mjs';

export const breakerPanel = /* HTML */ ` <section
  class="heist-typing"
  data-typing
  hidden
  aria-labelledby="breaker-title"
>
  <div class="heist-typing-heading">
    <span class="eyebrow">BEZPIECZNIK / RĘCZNE OBEJŚCIE</span>
    <span class="heist-typing-threshold">MIN. 50 WPM</span>
  </div>
  <h3 id="breaker-title">Zostaw dom <em>w ciemności.</em></h3>
  <p class="heist-typing-help" id="breaker-help">
    Przepisz cały tekst. Bez polskich znaków, minimum 50 WPM. Czas rusza z pierwszą literą. Dom
    poczeka.
  </p>
  <div class="heist-typing-stats" aria-label="Wynik pisania">
    <span><b data-typing-wpm>0</b> WPM</span>
    <span><b data-typing-accuracy>100</b>% trafności</span>
    <span><b data-typing-time>0.0</b> s</span>
  </div>
  <div class="heist-typing-text" data-typing-text aria-label="Tekst do przepisania"></div>
  <label class="sr-only" for="breaker-input">Przepisz tekst, aby wyłączyć prąd</label>
  <input
    id="breaker-input"
    data-typing-input
    type="text"
    autocomplete="off"
    autocapitalize="off"
    autocorrect="off"
    spellcheck="false"
    aria-describedby="breaker-help breaker-feedback"
    placeholder="Zacznij pisać tutaj…"
    enterkeyhint="done"
  />
  <p class="heist-typing-feedback" id="breaker-feedback" data-typing-feedback role="status">
    Błędy poprawiaj Backspace. Wklejanie jest wyłączone.
  </p>
  <div class="heist-typing-actions">
    <button class="pill-button" data-typing-retry type="button" hidden>
      <span class="button-icon">${arrow}</span><span class="button-text">Jeszcze jedna próba</span>
    </button>
    <button class="heist-typing-cancel" data-typing-cancel type="button">
      Wróć do domu <span>Esc</span>
    </button>
  </div>
</section>`;

export const gameSection = /* HTML */ ` <article
  class="heist-project wrap"
  id="nocna-zmiana"
  aria-labelledby="heist-title"
>
  <div class="heist-heading">
    <div>
      <h2 id="heist-title">Nocna zmiana</h2>
      <p>Skradanka w Canvas. Wyłącz prąd, zbierz łupy i wróć do auta.</p>
    </div>
    <ul class="tags" aria-label="Technologie"><li>JavaScript</li><li>Canvas</li></ul>
  </div>
  <div class="heist-game" data-heist>
    <div class="heist-toolbar">
      <span class="heist-wordmark"
        ><span aria-hidden="true">☾</span> NOCTURNE <small>CAT BURGLAR</small></span
      >
      <div class="heist-metrics">
        <span>TORBA <b data-bag>0 / 3</b></span>
        <span>W AUCIE <b data-saved>0 / 12</b></span>
      </div>
      <button
        class="heist-expand"
        type="button"
        data-expand
        aria-label="Powiększ grę"
        aria-expanded="false"
        title="Powiększ grę"
      >
        ⤢
      </button>
      <button
        class="heist-pause"
        type="button"
        data-pause
        aria-label="Wstrzymaj grę"
        title="Pauza"
        disabled
      >
        Ⅱ
      </button>
    </div>
    <div class="heist-mission">
      <span><span data-objective>NAJPIERW</span> <b data-goal>PRĄD W PIWNICY</b></span>
      <progress
        max="6"
        value="0"
        data-mission-progress
        aria-label="Skarby zabezpieczone do ukończenia misji"
      ></progress>
      <span data-mission-state>Najpierw wyłącz prąd w piwnicy</span>
    </div>
    <div class="heist-tools">
      <span class="heist-noise"
        >HAŁAS <progress max="1" value="0" data-noise aria-label="Głośność kota"></progress
      ></span>
      <span data-key>BRAK KLUCZA</span>
      <span data-power>KAMERY ON</span>
      <span data-heat>DOM ŚPI</span>
    </div>
    <div
      class="heist-stage"
      tabindex="0"
      role="group"
      aria-label="Gra Nocna zmiana. Wciśnij przycisk startu, następnie steruj klawiszami W A S D i spacją."
      aria-describedby="heist-controls"
    >
      <canvas
        class="heist-canvas"
        width="960"
        height="540"
        role="img"
        aria-label="Nocny dom z otwartymi drzwiami, półkami, piwnicą i dostawczakiem po lewej."
      ></canvas>
      <div class="heist-scene-hud" aria-hidden="true">
        <span class="heist-location" data-location>PRZED DOMEM</span>
        <span class="heist-watch" data-watch>DOMOWNIK ŚPI</span>
      </div>
      <div class="heist-overlay" data-overlay>
        <div class="heist-brief" data-brief>
          <span class="eyebrow">NIE BUDŹ DOMOWNIKÓW</span>
          <h3>Wchodzisz po cichu.<br /><em>Wychodzisz ze skarbem.</em></h3>
          <ul class="heist-tasks">
            <li>Najpierw bezpiecznik w piwnicy: przepisz tekst z min. 50 WPM.</li>
            <li>Kamery zgasną na 30 s. Zabezpiecz 6 z 12 łupów, po trzy w torbie.</li>
            <li>Skradaj się i chowaj pod S. Klucz w bibliotece otwiera sejf.</li>
          </ul>
          <button class="pill-button heist-start" type="button" data-start disabled>
            <span class="button-icon">${arrow}</span>
            <span class="button-text">Wczytywanie gry…</span>
          </button>
          <span class="heist-brief-note"
            >Przytrzymaj W — wyższy skok. Shift / S + ruch — skradanie.</span
          >
        </div>
        ${breakerPanel}
        <div class="heist-result" data-result hidden>
          <span class="eyebrow" data-result-kicker></span>
          <h3 data-result-title></h3>
          <p data-result-copy></p>
          <dl class="heist-summary" data-summary hidden>
            <div>
              <dt>W aucie</dt>
              <dd data-result-loot></dd>
            </div>
            <div>
              <dt>Czas</dt>
              <dd data-result-time></dd>
            </div>
            <div>
              <dt>Styl</dt>
              <dd data-result-style></dd>
            </div>
          </dl>
          <button class="pill-button" type="button" data-result-action>
            <span class="button-icon">${arrow}</span>
            <span class="button-text" data-result-label>Spróbuj ponownie</span>
          </button>
        </div>
      </div>
      <div class="heist-suspicion" hidden data-alarm>
        <span>KTOŚ CIĘ WIDZI</span>
        <progress max="1" value="0" aria-label="Poziom wykrycia"></progress>
      </div>
      <div class="heist-arrival" data-cinematic hidden>Ostatni kurs tej nocy.</div>
      <div class="heist-safe-opening" data-safe-opening hidden>
        <span>OTWIERASZ SEJF · TRZYMAJ SPACJĘ</span>
        <progress
          max="1"
          value="0"
          data-safe-progress
          aria-label="Postęp otwierania sejfu"
        ></progress>
      </div>
    </div>
    <div class="heist-context">
      <span class="heist-status-dot" aria-hidden="true"></span>
      <span data-prompt>Wciśnij Graj, aby rozpocząć.</span>
      <button type="button" class="heist-exit" data-exit hidden>Odjedź z łupem ↗</button>
    </div>
    <div class="heist-controls" id="heist-controls">
      <span><kbd>A</kbd><kbd>D</kbd> ruch</span>
      <span><kbd>W</kbd> skok / drabina</span>
      <span><kbd>S</kbd> schowaj / zejdź</span>
      <span><kbd>SHIFT</kbd> skradaj się</span>
      <span><kbd>SPACJA</kbd> zabierz / użyj</span>
      <span><kbd>ESC</kbd> pauza</span>
    </div>
    <div class="heist-touch" aria-label="Sterowanie dotykowe">
      <div>
        <button type="button" data-control="left" aria-label="Idź w lewo">←</button>
        <button type="button" data-control="right" aria-label="Idź w prawo">→</button>
      </div>
      <div>
        <button type="button" data-control="down" aria-label="Ukryj się lub zejdź po drabinie">
          S
        </button>
        <button type="button" data-control="up" aria-label="Skocz lub wejdź po drabinie">↑</button>
        <button type="button" data-control="action" aria-label="Zabierz przedmiot lub odłóż łupy">
          ✦
        </button>
      </div>
    </div>
    <p class="heist-live sr-only" role="status" aria-live="polite" data-game-live></p>
    <noscript
      ><p class="heist-noscript">
        Do gry potrzebny jest JavaScript. Pozostałe projekty możesz przeglądać bez niego.
      </p></noscript
    >
  </div>
  <p class="heist-footnote">
    <span>CANVAS / JAVASCRIPT</span><span>Łupy liczą się dopiero po odłożeniu do auta.</span>
  </p>
</article>`;
