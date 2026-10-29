import { mkdir, writeFile } from 'node:fs/promises';
import { pages } from '../src/pages.mjs';
import { layout } from '../src/layout.mjs';

for (const page of pages) {
  const html = layout(page).replace(/[\t ]+$/gm, '');
  await writeFile(new URL(`../${page.file}`, import.meta.url), html, 'utf8');
}
await mkdir(new URL('../assets/', import.meta.url), { recursive: true });
console.log(`build ok (${pages.length} stron)`);
