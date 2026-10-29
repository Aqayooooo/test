import { mkdir, writeFile } from 'node:fs/promises';

const directory = new URL('../assets/fonts/', import.meta.url);
await mkdir(directory, { recursive: true });
const glyphs =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ĄĆĘŁŃÓŚŹŻąćęłńóśźż /.,:;!?—–-·+()@©↗→↑✓×✦';
const source =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400..600;1,400..500&family=Manrope:wght@400..700&display=swap&text=' +
  encodeURIComponent(glyphs);
const response = await fetch(source, {
  headers: { 'User-Agent': 'Mozilla/5.0 Chrome/130.0.0.0 Safari/537.36' },
});
if (!response.ok) throw new Error(`Fonts: HTTP ${response.status}`);
let css = await response.text();
const faces = [...css.matchAll(/@font-face\s*{([^}]+)}/g)].map((m) => m[1]);
let count = 0;
for (const face of faces) {
  const url = face.match(/url\((https:[^)]+)\)/)[1];
  const family = face.includes('Manrope') ? 'manrope' : 'cormorant';
  const weight = face.match(/font-weight:\s*(\d+)/)[1];
  const italic = face.includes('italic') ? 'i' : '';
  const font = await fetch(url);
  if (!font.ok) throw new Error(`Font file: HTTP ${font.status}`);
  const bytes = Buffer.from(await font.arrayBuffer());
  const extension = bytes.subarray(0, 4).toString() === 'wOF2' ? 'woff2' : 'ttf';
  const filename = `${family}-${weight}${italic}.${extension}`;
  count++;
  await writeFile(new URL(filename, directory), bytes);
  css = css.replaceAll(url, `./${filename}`);
}
await writeFile(new URL('fonts.css', directory), css, 'utf8');
for (const family of ['cormorantgaramond', 'manrope']) {
  const license = await fetch(
    `https://raw.githubusercontent.com/google/fonts/main/ofl/${family}/OFL.txt`,
  );
  if (!license.ok) throw new Error(`License ${family}: HTTP ${license.status}`);
  await writeFile(new URL(`${family}-OFL.txt`, directory), await license.text(), 'utf8');
}
console.log(`fonty: ${count} plikow`);
