import { button, email } from './layout.mjs';
import { gameSection } from './game-section.mjs';
import { codeSketch, migrationSketch } from './sketch.mjs';

// tresc stron, po zmianach: npm run build
const pageHero = (title, lead) =>
  `<header class="page-hero wrap"><h1>${title}</h1>${lead ? `<p>${lead}</p>` : ''}</header>`;
const tags = (words) =>
  `<ul class="tags" aria-label="Technologie">${words.map((word) => `<li>${word}</li>`).join('')}</ul>`;

export const pages = [
  {
    file: 'index.html',
    key: 'home',
    title: 'Portfolio',
    description:
      'Portfolio Bartłomieja Łaczka: strony internetowe, Python, praktyki w Elektris i minigry w JavaScript.',
    content: /* HTML */ `<section class="intro" aria-labelledby="home-title">
        <div class="intro-art" aria-hidden="true">
          <img src="assets/sketch-hero.webp" width="1774" height="887" alt="" fetchpriority="high" />
        </div>
        <div class="intro-grid wrap">
          <div class="intro-text">
            <h1 id="home-title">Bartłomiej Łaczek</h1>
            <p class="lead">
              Uczę się w Zespole Szkół im. Walerego Goetla. Robię strony internetowe, piszę backend w
              Pythonie i uczę się projektować interfejsy.
            </p>
            <p>
              We wrześniu 2025 byłem na praktykach w Elektris, gdzie przenosiłem workflow z n8n do
              aplikacji w Pythonie. Niżej są moje projekty — w dwa z nich możesz zagrać.
            </p>
            <p class="intro-links">
              <a class="text-link" href="mailto:${email}">${email}</a>
              <a class="text-link" href="https://github.com/Aqayooooo" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            </p>
          </div>
        </div>
      </section>
      <section class="work wrap" aria-labelledby="work-title">
        <h2 id="work-title" class="section-title">Projekty i doświadczenie</h2>
        <ul class="work-list">
          <li>
            <a href="doswiadczenie.html">
              <span class="work-kind">Praktyki · wrzesień 2025</span>
              <span class="work-name">Elektris</span>
              <span class="work-desc">Migracja workflow z n8n do aplikacji backendowej.</span>
              <span class="work-tech">Python, n8n</span>
            </a>
          </li>
          <li>
            <a href="projekty.html#nocna-zmiana">
              <span class="work-kind">Gra</span>
              <span class="work-name">Nocna zmiana</span>
              <span class="work-desc">Skradanka w Canvas: wyłącz prąd, zbierz łupy, nie daj się złapać.</span>
              <span class="work-tech">JavaScript, Canvas</span>
            </a>
          </li>
          <li>
            <a href="projekty.html#ogrodek">
              <span class="work-kind">Minigra</span>
              <span class="work-name">Mały ogródek</span>
              <span class="work-desc">Podlewasz roślinę, a ona rośnie etap po etapie.</span>
              <span class="work-tech">HTML, CSS, JavaScript</span>
            </a>
          </li>
          <li>
            <a href="projekty.html#portfolio">
              <span class="work-kind">Strona</span>
              <span class="work-name">To portfolio</span>
              <span class="work-desc">Bez frameworka, z własnym skryptem do budowania stron.</span>
              <span class="work-tech">HTML, CSS, JavaScript, Node</span>
            </a>
          </li>
        </ul>
      </section>
      <section class="now wrap" aria-labelledby="now-title">
        <h2 id="now-title" class="section-title">Teraz</h2>
        <p>
          Uczę się Javy, C++ i C#, a do szybszego składania stron Bootstrapa. Chcę zajmować się
          full-stackiem i aplikacjami mobilnymi.
        </p>
      </section>`,
  },
  {
    file: 'informacja.html',
    key: 'about',
    title: 'O mnie',
    description:
      'Poznaj Bartłomieja Łaczka: ucznia Zespołu Szkół im. Walerego Goetla, zainteresowanego webem, backendem i UI/UX.',
    content: /* HTML */ `${pageHero('O mnie')}
      <section class="about wrap">
        <div class="prose">
          <p class="lead">
            Uczę się w Zespole Szkół im. Walerego Goetla. Interesują mnie strony internetowe,
            backend i projektowanie interfejsów.
          </p>
          <p>
            Chcę tworzyć zarówno interfejsy, jak i zaplecze aplikacji. Interesują mnie też aplikacje
            mobilne.
          </p>
          <p>
            We wrześniu 2025 odbyłem miesięczne praktyki w Elektris. Przenosiłem tam workflow z n8n
            do aplikacji backendowej w Pythonie.
          </p>
          ${button('doswiadczenie.html', 'Więcej o praktykach')}
        </div>
        <dl class="facts">
          <div>
            <dt>Szkoła</dt>
            <dd>Zespół Szkół im. Walerego Goetla</dd>
          </div>
          <div>
            <dt>Interesuje mnie</dt>
            <dd>Web development, UI/UX, backend</dd>
          </div>
          <div>
            <dt>Teraz się uczę</dt>
            <dd>Java, C++, C#, Bootstrap</dd>
          </div>
          <div>
            <dt>Kierunek</dt>
            <dd>Full-stack, aplikacje mobilne</dd>
          </div>
        </dl>
      </section>`,
  },
  {
    file: 'projekty.html',
    key: 'projects',
    title: 'Projekty',
    description:
      'Projekty Bartłomieja Łaczka: portfolio, interaktywny Mały ogródek i Nocna zmiana — minigra w JavaScript.',
    content: /* HTML */ `${pageHero('Projekty', 'To portfolio i dwie minigry w JavaScript. W obie możesz zagrać na tej stronie.')}
      ${gameSection}
      <article class="project garden-project wrap" id="ogrodek" aria-labelledby="garden-title">
        <div class="project-meta">
          <h2 id="garden-title">Mały ogródek</h2>
          <p>
            Kliknij konewkę, żeby podlać roślinę. Kiełek, liście, pąk i kwiat to kolejne stany
            animacji sterowanej w JavaScript.
          </p>
          ${tags(['HTML', 'CSS', 'JavaScript'])}
        </div>
        <div class="garden-demo paper">
          <div class="garden-scene" aria-hidden="true">
            <span class="garden-moon"></span><span class="garden-horizon"></span>
            <div class="garden-plant" data-stage="0">
              <span class="seed"></span><span class="stem"></span
              ><span class="leaf leaf-left"></span><span class="leaf leaf-right"></span
              ><span class="flower"><i></i><i></i><i></i><i></i><i></i><b></b></span>
            </div>
            <span class="garden-ground"></span
            ><span class="garden-drops"><i></i><i></i><i></i></span>
          </div>
          <div class="garden-controls">
            <progress id="growth-progress" max="4" value="0" aria-label="Postęp wzrostu kwiatu">
              0 z 4
            </progress>
            <p id="plant-status" aria-live="polite">Nasionko czeka na wodę.</p>
            <button class="garden-water" id="water-flower" type="button">
              <span>Podlej nasionko</span
              ><svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 3c-2 4-6 8-6 12a6 6 0 0 0 12 0c0-4-4-8-6-12Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
              </svg>
            </button>
          </div>
        </div>
        ${codeSketch()}
      </article>
      <article class="project wrap" id="portfolio" aria-labelledby="portfolio-title">
        <div class="project-meta">
          <h2 id="portfolio-title">To portfolio</h2>
          <p>Napisane w HTML, CSS i JavaScript, bez frameworka.</p>
          ${tags(['HTML', 'CSS', 'JavaScript', 'Node'])}
        </div>
        <ul class="details">
          <li>
            <strong>Strony z jednego źródła.</strong> Treść jest w <code>src/pages.mjs</code>, a
            skrypt <code>npm run build</code> składa z niej sześć plików HTML.
          </li>
          <li>
            <strong>Bez przeładowania.</strong> Podstrony są pobierane przez <code>fetch</code> i
            podmieniane w miejscu, a przyciski wstecz/dalej działają dzięki History API.
          </li>
          <li>
            <strong>Testy.</strong> <code>npm run check</code> sprawdza linki, nagłówki i
            unikalne identyfikatory na każdej stronie oraz logikę gry.
          </li>
          <li>
            <strong>Rysunki w SVG.</strong> Szkic edytora na stronie głównej pokazuje prawdziwy kod
            z <code>app.js</code>, a numery linii liczą się przy każdym buildzie.
          </li>
        </ul>
      </article>`,
  },
  {
    file: 'doswiadczenie.html',
    key: 'experience',
    title: 'Doświadczenie',
    description:
      'Praktyki backendowe w Elektris we wrześniu 2025: migracja workflow n8n do aplikacji w Pythonie.',
    content: /* HTML */ `${pageHero('Doświadczenie')}
      <article class="experience wrap" aria-labelledby="elektris-title">
        <header class="experience-head">
          <div>
            <h2 id="elektris-title">Elektris</h2>
            <p>Elektris sp. z o.o. sp. k. — praktyki backendowe</p>
          </div>
          <dl class="facts compact">
            <div>
              <dt>Kiedy</dt>
              <dd>Wrzesień 2025</dd>
            </div>
            <div>
              <dt>Czas trwania</dt>
              <dd>1 miesiąc</dd>
            </div>
            <div>
              <dt>Narzędzia</dt>
              <dd>Python, n8n</dd>
            </div>
          </dl>
        </header>
        <figure class="migration paper">${migrationSketch}</figure>
        <div class="prose">
          <h3>Co robiłem</h3>
          <p>
            Przenosiłem istniejący workflow z n8n do aplikacji backendowej w Pythonie. Workflow
            wspierał proces na linii produkcyjnej.
          </p>
          ${tags(['Python', 'n8n', 'Backend', 'Automatyzacja'])}
        </div>
      </article>`,
  },
  {
    file: 'umiejetnosci.html',
    key: 'skills',
    title: 'Umiejętności',
    description:
      'Technologie i obszary nauki Bartłomieja Łaczka: web, Python, PHP, C++, Git, n8n, Java i C#.',
    content: /* HTML */ `${pageHero('Umiejętności', 'Osobno technologie, z których korzystam, i te, których się teraz uczę.')}
      <section class="skills wrap" aria-label="Obszary umiejętności">
        <div class="skill">
          <h2>Frontend</h2>
          <p>Strony internetowe i interakcje, także w tym portfolio.</p>
          <p class="skill-tech">HTML, CSS, JavaScript</p>
        </div>
        <div class="skill">
          <h2>Backend</h2>
          <p>Z Pythona korzystałem podczas praktyk w Elektris.</p>
          <p class="skill-tech">Python, PHP</p>
        </div>
        <div class="skill">
          <h2>Narzędzia</h2>
          <p>Git do kontroli wersji, n8n do automatyzacji.</p>
          <p class="skill-tech">Git, GitHub, n8n</p>
        </div>
        <div class="skill is-learning">
          <h2>W nauce</h2>
          <p>Rozwijam umiejętności w tych technologiach.</p>
          <p class="skill-tech">Java, C++, C#, Bootstrap</p>
        </div>
      </section>`,
  },
  {
    file: 'kontakt.html',
    key: 'contact',
    title: 'Kontakt',
    description: `Napisz do Bartłomieja Łaczka: ${email}. GitHub: Aqayooooo.`,
    content: /* HTML */ `${pageHero('Kontakt', 'Masz pytanie o któryś projekt? Napisz maila.')}
      <section class="contact wrap">
        <a class="email-address" href="mailto:${email}"
          >bartlomiej.laczek7312<wbr />@gmail.com</a
        >
        <div class="contact-actions">
          ${button(`mailto:${email}`, 'Napisz wiadomość')}<button
            type="button"
            class="copy-email"
            data-email="${email}"
          >
            <span>Kopiuj adres</span>
          </button>
        </div>
        <p class="contact-other">
          Kod moich projektów jest na
          <a class="text-link" href="https://github.com/Aqayooooo" target="_blank" rel="noopener noreferrer">GitHubie (Aqayooooo) ↗</a>
        </p>
      </section>`,
  },
];
