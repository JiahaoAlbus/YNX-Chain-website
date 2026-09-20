import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const i18nSource = await readFile(new URL("../src/lib/i18n.jsx", import.meta.url), "utf8");
const headerSource = await readFile(new URL("../src/components/SiteHeader.jsx", import.meta.url), "utf8");

const expectedLocales = ["en", "zh-CN", "zh-TW", "ja", "ko", "es", "fr", "de", "pt", "ru", "ar", "id"];

function balancedSlice(source, start) {
  const opening = source[start];
  const closing = opening === "{" ? "}" : opening === "[" ? "]" : undefined;
  assert.ok(closing, `expected a collection at offset ${start}`);
  let depth = 0;
  let quote = "";
  let escaped = false;
  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = "";
      continue;
    }
    if (character === '"' || character === "'" || character === "`") {
      quote = character;
      continue;
    }
    if (character === opening) depth += 1;
    if (character === closing) depth -= 1;
    if (depth === 0) return source.slice(start, index + 1);
  }
  throw new Error(`unterminated collection at offset ${start}`);
}

function assignedLiteral(name) {
  const marker = `export const ${name} =`;
  const markerIndex = i18nSource.indexOf(marker);
  assert.notEqual(markerIndex, -1, `${name} export is missing`);
  const searchFrom = markerIndex + marker.length;
  const start = searchFrom + i18nSource.slice(searchFrom).search(/[\[{]/u);
  return Function(`"use strict"; return (${balancedSlice(i18nSource, start)});`)();
}

function exportedFunction(name) {
  const marker = `export function ${name}`;
  const start = i18nSource.indexOf(marker);
  assert.notEqual(start, -1, `${name} export is missing`);
  const bodyStart = i18nSource.indexOf("{", start);
  return `${i18nSource.slice(start, bodyStart)}${balancedSlice(i18nSource, bodyStart)}`.replace("export ", "");
}

function mockElement() {
  const attributes = new Map();
  const styles = new Map([["direction", "ltr"]]);
  return {
    lang: "",
    getAttribute: (name) => attributes.get(name) ?? null,
    setAttribute: (name, value) => attributes.set(name, value),
    style: {
      getPropertyValue: (name) => styles.get(name) ?? "",
      removeProperty: (name) => styles.delete(name),
    },
  };
}

test("all twelve locales expose the complete global message contract", () => {
  const supportedLocales = assignedLiteral("SUPPORTED_LOCALES");
  const localeOptions = assignedLiteral("LOCALE_OPTIONS");
  const messages = assignedLiteral("messages");
  assert.deepEqual(supportedLocales, expectedLocales);
  assert.deepEqual(Object.keys(messages), expectedLocales);
  assert.deepEqual(localeOptions.map(({ value }) => value), expectedLocales);
  assert.equal(new Set(localeOptions.map(({ label }) => label)).size, expectedLocales.length);

  const englishKeys = Object.keys(messages.en).sort();
  assert.ok(englishKeys.includes("connectWallet"));
  assert.ok(englishKeys.includes("footerBoundary"));
  for (const locale of expectedLocales) {
    assert.deepEqual(Object.keys(messages[locale]).sort(), englishKeys, `${locale} message keys differ from English`);
    for (const key of englishKeys) {
      assert.equal(typeof messages[locale][key], "string", `${locale}.${key} must be text`);
      assert.ok(messages[locale][key].trim(), `${locale}.${key} must not be empty`);
    }
  }
});

test("locale normalization and document lang/dir switch Arabic to RTL only", () => {
  const documentElement = mockElement();
  const body = mockElement();
  const document = { documentElement, body };
  const functions = Function(
    "SUPPORTED_LOCALES",
    "document",
    `"use strict"; ${["normalizeLocale", "localeDirection", "applyDocumentLocale"].map(exportedFunction).join("\n")} return { normalizeLocale, localeDirection, applyDocumentLocale };`,
  )(expectedLocales, document);

  assert.equal(functions.normalizeLocale("ar-SA"), "ar");
  assert.equal(functions.normalizeLocale("pt_BR"), "pt");
  assert.equal(functions.normalizeLocale("zh-Hant-HK"), "zh-TW");
  assert.equal(functions.normalizeLocale("unknown"), "en");

  for (const locale of expectedLocales) {
    const expectedDirection = locale === "ar" ? "rtl" : "ltr";
    assert.equal(functions.localeDirection(locale), expectedDirection);
    assert.deepEqual(functions.applyDocumentLocale(locale), { lang: locale, dir: expectedDirection });
    assert.equal(documentElement.lang, locale);
    assert.equal(documentElement.getAttribute("dir"), expectedDirection);
    assert.equal(body.getAttribute("dir"), expectedDirection);
    assert.equal(documentElement.style.getPropertyValue("direction"), "");
    assert.equal(body.style.getPropertyValue("direction"), "");
  }

  functions.applyDocumentLocale("ar");
  assert.equal(documentElement.getAttribute("dir"), "rtl");
  functions.applyDocumentLocale("en");
  assert.equal(documentElement.getAttribute("dir"), "ltr");
  assert.match(i18nSource, /function enforceNativeLtr\(locale\)\s*\{\s*return applyDocumentLocale\(locale\);\s*\}/u);
  assert.doesNotMatch(i18nSource, /function enforceNativeLtr\(\)\s*\{/u);
});

test("header renders the canonical twelve-locale selector", () => {
  assert.match(headerSource, /value=\{locale\}/u);
  assert.match(headerSource, /setLocale\(event\.target\.value\)/u);
  assert.match(headerSource, /SUPPORTED_LOCALES\.map\(\(value\) => <option value=\{value\} key=\{value\}>/u);
  assert.equal(expectedLocales.length, 12);
});

test("language switches preserve the selected guide, document, other parameters and exact step", () => {
  const updateUrl = Function(`${exportedFunction("localeUrl")} return localeUrl;`)();
  for (const route of ["/manual?path=node&lang=zh-CN#step-node-inspect", "/docs?doc=whitepaper-streambft-specification&lang=en#safety"]) {
    const original = new URL(route, "https://ynxweb4.com");
    for (const locale of expectedLocales) {
      const changed = new URL(updateUrl(original.href, locale));
      assert.equal(changed.searchParams.get("lang"), locale);
      assert.equal(changed.pathname, original.pathname);
      assert.equal(changed.hash, original.hash);
      for (const [key,value] of original.searchParams) if (key !== "lang") assert.equal(changed.searchParams.get(key), value);
    }
  }
});
