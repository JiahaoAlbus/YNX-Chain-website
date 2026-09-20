import test from "node:test";
import assert from "node:assert/strict";
import config from "../vite.config.js";
import { loadDocsAuthority } from "../scripts/lib/docs-authority.mjs";
import { selectLocalizedDocs } from "../src/lib/docsLocale.js";

const plugin = config.plugins.find(candidate => candidate.name === "ynx-docs-authority");
const readVirtual = id => JSON.parse(plugin.load(plugin.resolveId(id)).replace(/^export default /, "").replace(/;$/, ""));

test("route and search authority payload includes metadata without article bodies", () => {
  const publicAuthority = readVirtual("virtual:ynx-docs-authority");
  const source = loadDocsAuthority();
  assert.equal(publicAuthority.articles.length, source.articles.length);
  assert.ok(Buffer.byteLength(JSON.stringify(publicAuthority.articles)) < 10000);
  publicAuthority.articles.forEach((article, index) => {
    assert.equal("markdown" in article, false); assert.equal("html" in article, false);
    const { markdown, html, ...metadata } = source.articles[index];
    assert.deepEqual(article, metadata);
  });
});

test("the dynamic English locale preserves every full authority article and unknown-locale fallback", () => {
  const publicAuthority = readVirtual("virtual:ynx-docs-authority");
  const english = readVirtual("virtual:ynx-docs-locale/en");
  const loader = plugin.load(plugin.resolveId("virtual:ynx-docs-locales"));
  assert.match(loader, /"en": \(\) => import\("virtual:ynx-docs-locale\/en"\)/);
  const source = loadDocsAuthority();
  for (const locale of ["en", "unknown-locale"]) {
    const state = selectLocalizedDocs({ ...publicAuthority, byLocale: { en: english } }, locale);
    assert.equal(state.available, true); assert.equal(state.locale, "en"); assert.equal(state.articles.length, 14);
    for (const article of source.articles) {
      const body = state.articles.find(candidate => candidate.route === article.route);
      assert.equal(body.html, article.html); assert.equal(body.markdown, article.markdown);
    }
  }
});

test("a missing translation never substitutes metadata for full text or silently uses English", () => {
  const publicAuthority = readVirtual("virtual:ynx-docs-authority");
  const english = readVirtual("virtual:ynx-docs-locale/en");
  const state = selectLocalizedDocs({ ...publicAuthority, byLocale: { en: english } }, "ja");
  assert.equal(state.available, false); assert.deepEqual(state.articles, []); assert.equal(state.locale, "ja");
});
