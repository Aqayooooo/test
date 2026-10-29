import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { pages } from '../src/pages.mjs';

let checked = 0;
for (const page of pages) {
  const html = await readFile(new URL(`../${page.file}`, import.meta.url), 'utf8');
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${page.file}: exactly one main heading`);
  assert.match(html, /<html lang="pl">/);
  assert.match(html, /<main id="main"/);
  assert.match(html, /<meta\s+name="description"\s+content="[^"]+"\s*\/?>/);
  assert(!html.includes('undefined'), `${page.file}: no unresolved template values`);
  assert(!/>\s*0\d\s*(?:\/|—|<)/.test(html), `${page.file}: no decorative chapter numbers`);
  assert(!html.includes('growth-count'), `${page.file}: no numeric garden counter`);
  assert(!/assets\/(?:cat-|maple-leaf)/.test(html), `${page.file}: no cat-theme artwork`);
  assert(!html.includes('cat-guide'), `${page.file}: no cat guide`);
  assert(html.includes('<filter id="pencil"'), `${page.file}: pencil filter present`);
  assert.equal(
    (html.match(/data-heist\b/g) || []).length,
    page.key === 'projects' ? 1 : 0,
    `${page.file}: game only in Projects`,
  );
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${page.file}: unique IDs`);
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const href = match[1];
    if (/^(?:https?:|mailto:|data:)/.test(href)) continue;
    if (href.startsWith('#')) {
      assert(ids.includes(href.slice(1)), `${page.file}: missing anchor ${href}`);
    } else {
      const target = new URL(`../${href.split('#')[0]}`, import.meta.url);
      assert((await stat(target)).isFile(), `${page.file}: missing ${href}`);
    }
    checked++;
  }
  console.log(`ok ${page.file}`);
}
for (const stylesheet of ['style.css', 'game/game.css', 'assets/fonts/fonts.css']) {
  const file = new URL(`../${stylesheet}`, import.meta.url);
  const css = await readFile(file, 'utf8');
  for (const match of css.matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g)) {
    if (/^(?:data:|https?:|#|%23)/.test(match[1])) continue;
    assert((await stat(new URL(match[1], file))).isFile(), `Missing CSS asset: ${match[1]}`);
  }
}
console.log(`linki: ${checked}`);
