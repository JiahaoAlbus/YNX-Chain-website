import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { getCachedNavigationCopy } from '../src/content/cachedNavigationCopy.js';
import { CACHED_NAVIGATION_MARKER, isCachedNavigation } from '../src/lib/cachedNavigation.js';

test('cached navigation marker is exact; ordinary network HTML has no warning', () => {
  const absent = { querySelector(selector) { assert.equal(selector, CACHED_NAVIGATION_MARKER); return null; } };
  const present = { querySelector(selector) { assert.equal(selector, CACHED_NAVIGATION_MARKER); return {}; } };
  assert.equal(isCachedNavigation(absent), false);
  assert.equal(isCachedNavigation(present), true);
});

test('all twelve supported languages explain a stale page and offer manual refresh', () => {
  const locales = ['en', 'zh-CN', 'zh-TW', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ru', 'ar', 'id'];
  for (const locale of locales) {
    const copy = getCachedNavigationCopy(locale);
    assert.equal(copy.length, 3, locale);
    for (const part of copy) assert.ok(part.trim().length > 0, locale);
  }
  assert.deepEqual(getCachedNavigationCopy('unknown'), getCachedNavigationCopy('en'));
});

test('page notice is marker-gated with one user-invoked refresh and no automatic retry', async () => {
  const page = await readFile(new URL('../src/main.jsx', import.meta.url), 'utf8');
  assert.match(page, /isCachedNavigation\(\) \? <aside className="cachedNavigationNotice"/);
  assert.match(page, /cachedNavigationCopy\[2\]\}<\/button>/);
  assert.match(page, /onClick=\{\(\) => window\.location\.reload\(\)\}/);
  assert.doesNotMatch(page, /addEventListener\(["']online["']/);
});
