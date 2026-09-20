import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { loadDocsAuthority } from "../scripts/lib/docs-authority.mjs";
import { loadDocsLocales } from "../scripts/lib/docs-locales.mjs";

const root = path.resolve(import.meta.dirname, "..");

test("docs locale artifacts publish only complete 14-article locales", () => {
  const authority = loadDocsAuthority(root);
  const locales = loadDocsLocales(root, authority.articles);
  assert.equal(authority.articles.length, 14);
  assert.deepEqual(locales.publishedLocales, locales.requestedLocales);
  assert.equal(locales.publishedLocales.length, 12);
  for (const locale of locales.publishedLocales) {
    assert.equal(locales.byLocale[locale].length, 14);
    assert.deepEqual(locales.missingMatrix[locale], []);
  }
  assert.equal(locales.direction.ar, "rtl");
});

test("restored docs translations contain their own article text", () => {
  const authority = loadDocsAuthority(root);
  const locales = loadDocsLocales(root, authority.articles);
  for (const locale of ["es", "fr", "de", "pt", "ru", "ar", "id"]) {
    assert.equal(locales.byLocale[locale].length, 14);
    assert.deepEqual(locales.missingMatrix[locale], []);
    for (const article of locales.byLocale[locale]) {
      assert.notEqual(article.markdown, locales.byLocale.en.find((source) => source.route === article.route).markdown);
    }
  }
});

test("localized docs sanitize HTML and exclude retired identity and internal paths", () => {
  const authority = loadDocsAuthority(root);
  const locales = loadDocsLocales(root, authority.articles);
  for (const locale of locales.publishedLocales) {
    const rendered = JSON.stringify(locales.byLocale[locale]);
    for (const forbidden of ["9102", "0x238e", "NYXT", "Codex", "worktree", "/Users/", "/private/tmp/"]) assert.equal(rendered.includes(forbidden), false, `${locale} exposes ${forbidden}`);
    assert.equal(rendered.includes("<script"), false, locale);
    assert.equal(rendered.includes("javascript:"), false, locale);
    assert.equal(rendered.includes("6423"), true, locale);
    assert.equal(rendered.includes("YNXT"), true, locale);
  }
});

test("committed missing matrix exactly matches the locale loader", () => {
  const authority = loadDocsAuthority(root);
  const locales = loadDocsLocales(root, authority.articles);
  const report = JSON.parse(fs.readFileSync(path.join(root, "content/docs-locales/missing-matrix.json"), "utf8"));
  assert.deepEqual(report.missingMatrix, locales.missingMatrix);
});
