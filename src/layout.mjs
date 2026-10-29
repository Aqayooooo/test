export const navigation = [
  { file: 'informacja.html', key: 'about', title: 'O mnie' },
  { file: 'projekty.html', key: 'projects', title: 'Projekty' },
  { file: 'doswiadczenie.html', key: 'experience', title: 'Doświadczenie' },
  { file: 'umiejetnosci.html', key: 'skills', title: 'Umiejętności' },
  { file: 'kontakt.html', key: 'contact', title: 'Kontakt' },
];

export const email = 'bartlomiej.laczek7312@gmail.com';
export const arrow =
  '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M5 16h21M18 8l8 8-8 8" stroke="currentColor" stroke-width="1.6"/></svg>';
// zygzak pod przyciskiem, rysuje sie na hover
const btnScribble =
  '<span class="btn-scribble" aria-hidden="true"><svg viewBox="0 0 100 40" preserveAspectRatio="none"><path d="M-4 5L104 2L-4 13L104 10L-4 21L104 18L-4 29L104 26L-4 37L104 34L-4 44" pathLength="1" filter="url(#graphite)"/></svg></span>';
export function button(href, label, extra = '') {
  return `<a class="pill-button ${extra}" href="${href}" data-magnetic>${btnScribble}<span class="button-text">${label}</span><span class="button-icon">${arrow}</span></a>`;
}

// zygzak do przejscia miedzy stronami
const scribblePath = (() => {
  let d = 'M-25 -6';
  for (let y = -6, i = 0; y <= 112; y += 9, i++) {
    d += i % 2 ? ` L-25 ${y + 6}` : ` L125 ${y + 2}`;
  }
  return d;
})();

// filtry: pencil (lekkie drganie linii), graphite (poszarpane brzegi)
const pencilFilter = `<svg class="defs" width="0" height="0" aria-hidden="true" focusable="false"><filter id="pencil" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="2"/></filter><filter id="graphite" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.5 0.08" numOctaves="3" seed="2" result="grain"/><feDisplacementMap in="SourceGraphic" in2="grain" scale="4"/></filter></svg>`;

export function layout(page) {
  const nav = navigation
    .map(
      (item) =>
        `<a href="${item.file}"${page.key === item.key ? ' aria-current="page"' : ''}>${item.title}</a>`,
    )
    .join('');
  const index = navigation.findIndex((item) => item.key === page.key);
  const next = navigation[(index + 1) % navigation.length];
  return /* HTML */ `<!DOCTYPE html>
    <html lang="pl">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f4f3ef" />
        <meta name="description" content="${page.description}" />
        <title>${page.key === 'home' ? 'Bartłomiej Łaczek' : `${page.title} — Bartłomiej Łaczek`}</title>
        <link rel="icon" type="image/svg+xml" href="assets/favicon.svg" />
        <link rel="stylesheet" href="style.css" />
        ${page.key === 'home' ? '<link rel="preload" as="image" href="assets/sketch-hero.webp" fetchpriority="high" />' : ''}
        <script src="app.js" defer></script>
      </head>
      <body data-page="${page.key}">
        ${pencilFilter}
        <a class="skip-link" href="#main">Przejdź do treści</a>
        <header class="site-header">
          <a class="brand" href="index.html">Bartłomiej Łaczek</a>
          <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-nav">
            Menu
          </button>
          <nav id="main-nav" class="main-nav" aria-label="Nawigacja główna">${nav}</nav>
        </header>
        <main id="main" tabindex="-1">${page.content}</main>
        ${page.key !== 'home' ? `<nav class="next-page wrap" aria-label="Kolejna strona"><span>Dalej</span><a href="${next.file}">${next.title} ${arrow}</a></nav>` : ''}
        <footer class="site-footer wrap">
          <span>Bartłomiej Łaczek, 2026</span>
          <a href="mailto:${email}">E-mail</a>
          <a href="https://github.com/Aqayooooo" target="_blank" rel="noopener noreferrer"
            >GitHub</a
          ><a class="back-top" href="#main">Do góry ↑</a>
        </footer>
        <div class="page-curtain" aria-hidden="true">
          <svg class="scribble-canvas" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path class="scribble" d="${scribblePath}" pathLength="1" filter="url(#graphite)" />
          </svg>
          <span class="curtain-title"></span>
        </div>
        <div class="announcement sr-only" role="status" aria-live="polite"></div>
      </body>
    </html>`;
}
