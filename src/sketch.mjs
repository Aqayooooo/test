import { readFileSync } from 'node:fs';


const escape = (text) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// wycinek pliku z numerami linii (liczone przy buildzie)
function excerpt(file, marker, count) {
  const lines = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8').split(/\r?\n/);
  const start = lines.findIndex((line) => line.includes(marker));
  if (start < 0) throw new Error(`Nie znaleziono „${marker}” w ${file}`);
  const chunk = lines.slice(start, start + count);
  const base = Math.min(...chunk.filter(Boolean).map((line) => line.match(/^ */)[0].length));
  return {
    first: start + 1,
    lines: chunk.map((line) => ({
      indent: Math.max(0, line.match(/^ */)[0].length - base),
      text: line.trim(),
    })),
  };
}

// linie ktore odpalaja sie po kliknieciu "Podlej" (po kolei)
const runOrder = ['% 5', '.dataset.stage', "'#plant-status'", "water.querySelector('span')"];

// okno edytora z kodem z app.js
function codeWindow() {
  const { first, lines } = excerpt('app.js', 'function initializeGarden()', 20);
  const top = 64;
  const step = 18;
  const rows = lines
    .map(({ indent, text }, i) => {
      const run = runOrder.findIndex((marker) => text.includes(marker));
      const y = top + i * step;
      return (
        `<text class="sk-num" x="42" y="${y}">${first + i}</text>` +
        `<text class="sk-code" x="${62 + indent * 6.6}" y="${y}" style="--i:${i}"${run >= 0 ? ` data-run="${run}"` : ''}>${escape(text)}</text>`
      );
    })
    .join('');
  const h = top + lines.length * step + 8;
  return /* HTML */ `<svg class="code-sketch" viewBox="0 0 470 ${h}" aria-hidden="true">
    <defs><clipPath id="code-clip"><rect x="6" y="36" width="458" height="${h - 42}" /></clipPath></defs>
    <g class="sk-frame" filter="url(#pencil)">
      <rect class="sk-face" x="6" y="6" width="458" height="${h - 12}" rx="4" pathLength="1" />
      <path class="sk-line" d="M6 36H464M50 36V${h - 6}" pathLength="1" />
      <circle class="sk-line" cx="22" cy="21" r="4.5" pathLength="1" /><circle class="sk-line" cx="37" cy="21" r="4.5" pathLength="1" /><circle class="sk-line" cx="52" cy="21" r="4.5" pathLength="1" />
    </g>
    <text class="sk-tab" x="235" y="25">app.js</text>
    <g clip-path="url(#code-clip)">${rows}</g>
    <ellipse class="sk-marker" data-marker cx="140" cy="0" rx="80" ry="10" filter="url(#pencil)" />
  </svg>`;
}


export function codeSketch() {
  return /* HTML */ `<figure class="code-figure" data-code-sketch data-reveal>
    <div class="paper">${codeWindow()}</div>
    <figcaption>
      <code>app.js</code> — po podlaniu kółko pokazuje, które linie się wykonały.
    </figcaption>
  </figure>`;
}

// n8n -> python
export const migrationSketch = /* HTML */ `<svg class="migration-sketch" viewBox="0 0 640 220" role="img" aria-labelledby="migration-title">
  <title id="migration-title">Schemat: workflow w n8n przeniesiony do aplikacji w Pythonie</title>
  <g filter="url(#pencil)">
    <rect class="sk-face" x="10" y="40" width="170" height="130" rx="3" />
    <rect class="sk-dark" x="460" y="40" width="170" height="130" rx="3" />
    <path class="sk-line" d="M196 105 C 260 80, 380 80, 444 105 M 430 96 L 446 106 L 431 116" />
    <path class="sk-dash" d="M30 72h50m-50 18h90m-90 18h70M480 72h60m-60 18h100m-100 18h80" />
  </g>
  <text class="sk-big" x="95" y="152">n8n</text>
  <text class="sk-big sk-light" x="545" y="152">Python</text>
  <text class="sk-small" x="95" y="196">workflow</text>
  <text class="sk-small" x="545" y="196">backend</text>
</svg>`;
