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
  assert.deepEqual(locales.publishedLocales, ["en", "zh-CN"]);
  for (const locale of locales.publishedLocales) {
    assert.equal(locales.byLocale[locale].length, 14);
    assert.deepEqual(locales.missingMatrix[locale], []);
  }
  assert.equal(locales.direction.ar, "rtl");
});

test("missing docs translations are explicit and never English fallbacks", () => {
  const authority = loadDocsAuthority(root);
  const locales = loadDocsLocales(root, authority.articles);
  for (const locale of ["zh-TW", "ja", "ko", "es", "fr", "de", "pt", "ru", "ar", "id"]) {
    assert.equal(locales.byLocale[locale], undefined);
    assert.equal(locales.missingMatrix[locale].length, 14);
  }
});

test("localized docs sanitize HTML and exclude retired identity and internal paths", () => {
  const authority = loadDocsAuthority(root);
  const locales = loadDocsLocales(root, authority.articles);
  const rendered = JSON.stringify(locales.byLocale["zh-CN"]);
  for (const forbidden of ["9102", "0x238e", "NYXT", "Codex", "worktree", "/Users/", "/private/tmp/"]) assert.equal(rendered.includes(forbidden), false);
  assert.equal(rendered.includes("<script"), false);
  assert.equal(rendered.includes("javascript:"), false);
  assert.equal(rendered.includes("6423"), true);
  assert.equal(rendered.includes("YNXT"), true);
});

test("committed missing matrix exactly matches the locale loader", () => {
  const authority = loadDocsAuthority(root);
  const locales = loadDocsLocales(root, authority.articles);
  const report = JSON.parse(fs.readFileSync(path.join(root, "content/docs-locales/missing-matrix.json"), "utf8"));
  assert.deepEqual(report.missingMatrix, locales.missingMatrix);
});
