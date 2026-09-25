import assert from "node:assert/strict";
import test from "node:test";
import { CARD_PUBLIC_LOCALES, localizeCardProduct } from "../src/content/cardPublicCopy.js";
import { BUSINESS_LOCALES } from "../src/content/businessLocaleContent.js";
import { getCatalog } from "../src/lib/ecosystemCatalog.js";

const card = getCatalog().find((product) => product.key === "card");

test("Card's newly published boundaries have content in every website locale", () => {
  assert.deepEqual([...CARD_PUBLIC_LOCALES].sort(), [...BUSINESS_LOCALES].sort());
  for (const locale of BUSINESS_LOCALES) {
    const localized = localizeCardProduct(card, locale);
    assert.notEqual(localized, card);
    assert.ok(localized.detail.length > 40, locale);
    assert.match(localized.release.statusNote, /e95fcf443/);
    assert.ok(localized.downloads.web.note.length > 20, locale);
    assert.equal(localized.metrics.length, 3);
    assert.equal(localized.downloads.web.href, card.downloads.web.href);
    assert.equal(localized.release.commit, card.release.commit);
    if (locale !== "en") assert.notEqual(localized.detail, localizeCardProduct(card, "en").detail);
  }
});

test("Card localization does not rewrite other product evidence", () => {
  const wallet = getCatalog().find((product) => product.key === "wallet");
  assert.equal(localizeCardProduct(wallet, "zh-CN"), wallet);
  assert.equal(localizeCardProduct(card, "unknown").detail, localizeCardProduct(card, "en").detail);
});
