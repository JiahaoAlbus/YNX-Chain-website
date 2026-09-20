import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { CORE_LOCALES, PORTAL_COPY, getPortalCopy } from "../src/content/coreLocaleContent.js";
import { GUIDE_UI_KEYS, LEARNING_PATHS } from "../src/content/learningContent.js";
import { HOME_COPY, getHomeCopy } from "../src/content/homeLocaleContent.js";

const routes = ["home", "/blockchain", "/tokens", "/data", "/governance", "/ecosystem", "/developers", "/downloads", "/more"];

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

test("learning guides contain full 12-locale actions, expected outcomes and recovery instructions", async () => {
  const copies = await Promise.all(CORE_LOCALES.map(async locale => [locale, JSON.parse(await readFile(new URL(`../src/content/learning-locales/${locale}.json`, import.meta.url), "utf8"))]));
  const english = copies[0][1];
  for (const [locale, copy] of copies) {
    nonEmpty(copy.title, locale + ".title"); nonEmpty(copy.lead, locale + ".lead");
    assert.equal(copy.ui.length, GUIDE_UI_KEYS.length);
    copy.ui.forEach((text, index) => nonEmpty(text, locale + ".ui." + GUIDE_UI_KEYS[index]));
    assert.equal(copy.paths.length, LEARNING_PATHS.length);
    copy.paths.forEach((path, index) => {
      nonEmpty(path[0], locale + ".pathTitle"); nonEmpty(path[1], locale + ".pathLead");
      assert.equal(path[2].length, LEARNING_PATHS[index].steps.length);
      path[2].forEach((step, stepIndex) => {
        assert.equal(step.length, 4);
        step.forEach((text, field) => {
          nonEmpty(text, locale + ".step." + field);
          if (locale !== "en") assert.notEqual(text, english.paths[index][2][stepIndex][field], "English body substituted for " + locale);
        });
      });
      assert.equal(new Set(path[2].map(step=>step[3])).size, path[2].length, "Recovery instructions must be specific to each step");
    });
  }
});

test("core pages consume the structured locale contract instead of binary English/Chinese branches", async () => {
  const [portal, hero, manual] = await Promise.all([
    readFile(new URL("../src/pages/PortalPage.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/sections/HeroPortal.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/pages/ManualPage.jsx", import.meta.url), "utf8"),
  ]);
  assert.match(portal, /getPortalCopy\(locale, path\)/u);
    assert.match(hero, /getHomeCopy\(locale\)/u);
  assert.match(manual, /useLearningCopy\(locale\)/u);
  for (const source of [portal, hero, manual]) {
    assert.doesNotMatch(source, /locale === "zh-CN"/u);
    assert.doesNotMatch(source, retired);
  }
});
