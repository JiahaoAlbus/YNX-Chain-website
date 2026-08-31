import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { CORE_LOCALES, MANUAL_COPY, PORTAL_COPY, getManualCopy, getPortalCopy } from "../src/content/coreLocaleContent.js";
import { HOME_COPY, getHomeCopy } from "../src/content/homeLocaleContent.js";

const routes = ["home", "/blockchain", "/tokens", "/data", "/governance", "/ecosystem", "/developers", "/downloads", "/more"];
const chapters = ["network", "wallet", "ynxt", "explorer", "observer", "validator", "backup", "recovery", "mining", "bridge"];
const retired = /9102|0x238e|NYXT/iu;
const nonEmpty = (value, label) => {
  assert.equal(typeof value, "string", `${label} must be text`);
  assert.ok(value.trim(), `${label} must be non-empty`);
  assert.doesNotMatch(value, retired, `${label} contains retired identity`);
};

test("all core portal routes have complete localized title, lead, facts, and actions", () => {
  assert.deepEqual(CORE_LOCALES, ["en", "zh-CN", "zh-TW", "ja", "ko", "es", "fr", "de", "pt", "ru", "ar", "id"]);
  assert.deepEqual(Object.keys(PORTAL_COPY), CORE_LOCALES);
  for (const locale of CORE_LOCALES) {
    assert.deepEqual(Object.keys(PORTAL_COPY[locale]), routes, `${locale} portal routes differ`);
    for (const route of routes) {
      const page = getPortalCopy(locale, route);
      for (const field of ["eyebrow", "title", "lead"]) nonEmpty(page[field], `${locale}.${route}.${field}`);
      assert.ok(page.facts.length >= 3, `${locale}.${route}.facts incomplete`);
      assert.ok(page.actions.length >= 2, `${locale}.${route}.actions incomplete`);
      page.facts.forEach((value, index) => nonEmpty(value, `${locale}.${route}.facts[${index}]`));
      page.actions.forEach((value, index) => nonEmpty(value, `${locale}.${route}.actions[${index}]`));
      if (locale !== "en") assert.notEqual(page.title, PORTAL_COPY.en[route].title, `${locale}.${route} silently falls back to English`);
    }
  }
  assert.equal(getPortalCopy("xx", "/tokens"), null, "unsupported locale must fail closed");
});

test("lightweight homepage copy is complete for every locale", () => {
  assert.deepEqual(Object.keys(HOME_COPY), CORE_LOCALES);
  for (const locale of CORE_LOCALES) {
    const home = getHomeCopy(locale);
    for (const field of ["eyebrow", "title", "lead"]) nonEmpty(home[field], `${locale}.home.${field}`);
    assert.equal(home.actions.length, 3);
    home.actions.forEach((value, index) => nonEmpty(value, `${locale}.home.actions[${index}]`));
    for (const [key, value] of Object.entries(home.labels)) nonEmpty(value, `${locale}.home.labels.${key}`);
    if (locale !== "en") assert.notEqual(home.title, getHomeCopy("en").title, `${locale}.home silently falls back to English`);
  }
  assert.equal(getHomeCopy("xx"), null, "unsupported locale must fail closed");
});

test("manual has complete localized user, wallet, 6423, YNXT, Explorer, operator and recovery contracts", () => {
  assert.deepEqual(Object.keys(MANUAL_COPY), CORE_LOCALES);
  for (const locale of CORE_LOCALES) {
    const manual = getManualCopy(locale);
    assert.equal(manual.hero.length, 3);
    assert.ok(manual.actions.length >= 2);
    assert.ok(manual.facts.includes("6423") && manual.facts.includes("0x1917") && manual.facts.includes("YNXT"));
    assert.ok(manual.platform.length >= 6);
    assert.deepEqual(Object.keys(manual.chapters), chapters, `${locale} manual chapters differ`);
    [...manual.hero, ...manual.actions, ...manual.facts, ...manual.platform, ...manual.recovery, manual.warning].forEach((value, index) => nonEmpty(value, `${locale}.manual[${index}]`));
    for (const id of chapters) {
      const chapter = manual.chapters[id];
      nonEmpty(chapter.title, `${locale}.${id}.title`);
      nonEmpty(chapter.lead, `${locale}.${id}.lead`);
      nonEmpty(chapter.warning, `${locale}.${id}.warning`);
      assert.ok(chapter.steps.length >= 2, `${locale}.${id}.steps incomplete`);
      chapter.steps.forEach((value, index) => nonEmpty(value, `${locale}.${id}.steps[${index}]`));
      if (locale !== "en") assert.notEqual(chapter.title, MANUAL_COPY.en.chapters[id].title, `${locale}.${id} silently falls back to English`);
    }
  }
  assert.equal(getManualCopy("xx"), null, "unsupported locale must fail closed");
});

test("core pages consume the structured locale contract instead of binary English/Chinese branches", async () => {
  const [portal, hero, manual] = await Promise.all([
    readFile(new URL("../src/pages/PortalPage.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/sections/HeroPortal.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/pages/ManualPage.jsx", import.meta.url), "utf8"),
  ]);
  assert.match(portal, /getPortalCopy\(locale, path\)/u);
    assert.match(hero, /getHomeCopy\(locale\)/u);
  assert.match(manual, /getManualCopy\(locale\)/u);
  for (const source of [portal, hero, manual]) {
    assert.doesNotMatch(source, /locale === "zh-CN"/u);
    assert.doesNotMatch(source, retired);
  }
});
