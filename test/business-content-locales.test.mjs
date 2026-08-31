import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { RUNTIME_LOCALES, getRuntimeCopy, loadRuntimeCopy } from "../src/content/runtimeLocaleContent.js";
import { BUSINESS_LOCALES, getAppsCopy, getDownloadCopy, getFaucetCopy } from "../src/content/businessLocaleContent.js";

const text = (value) => typeof value === "string" && value.trim().length > 0;

test("runtime and latest-record content is complete for every supported locale", async () => {
  assert.deepEqual(BUSINESS_LOCALES, RUNTIME_LOCALES);
  for (const locale of RUNTIME_LOCALES) {
    const copy = await loadRuntimeCopy(locale);
    assert.ok(copy, locale);
    assert.equal(copy.network.metrics.length, 6, locale);
    assert.equal(copy.network.labels.length, 5, locale);
    assert.equal(copy.validators.headers.length, 4, locale);
    assert.equal(copy.ecosystem.products.length, 10, locale);
    assert.equal(copy.readiness.verified.length, 7, locale);
    assert.equal(copy.readiness.required.length, 5, locale);
    assert.ok(copy.records.blocks.every(text), locale);
    assert.ok(copy.records.transactions.every(text), locale);
    assert.ok(copy.ecosystem.products.every((item) => text(item.title) && text(item.text)), locale);
  }
  assert.equal(getRuntimeCopy("unsupported"), null);
});

test("apps, downloads and Faucet expose complete locale-owned content", () => {
  for (const locale of BUSINESS_LOCALES) {
    const apps = getAppsCopy(locale);
    const download = getDownloadCopy(locale);
    const faucet = getFaucetCopy(locale);
    assert.equal(apps.categories.length, 5, locale);
    assert.equal(apps.statusFilters.length, 4, locale);
    assert.ok([apps.title, apps.lead, apps.statusLead, apps.boundary].every(text), locale);
    assert.equal(download.hero.length, 3, locale);
    assert.equal(download.available.length, 3, locale);
    assert.equal(download.other.length, 3, locale);
    assert.equal(download.boundary.length, 3, locale);
    assert.equal(download.evidence.length, 6, locale);
    assert.equal(faucet.steps.length, 4, locale);
    assert.ok([faucet.hero[0], faucet.hero[1], faucet.consent, faucet.security, faucet.rateLimit, faucet.connectionError].every(text), locale);
  }
  assert.equal(getAppsCopy("unsupported"), null);
  assert.equal(getDownloadCopy("unsupported"), null);
  assert.equal(getFaucetCopy("unsupported"), null);
});

test("download and Faucet contracts retain release and custody boundaries", () => {
  for (const locale of BUSINESS_LOCALES) {
    const download = getDownloadCopy(locale);
    const faucet = getFaucetCopy(locale);
    assert.match(download.available[2], /Android/i, locale);
    assert.match(download.available[2], /Web\/PWA/i, locale);
    assert.match(download.boundary[1], /(Testnet|测试网|測試網|테스트넷|тестовой|اختبار)/i, locale);
    assert.match(faucet.consent, /(Testnet|测试网|測試網|테스트넷|тестовой|اختبار)/i, locale);
    assert.match(faucet.security, /(private|私钥|私鑰|秘密鍵|개인 키|privada|privée|privaten|privat|закрытый|مفتاح|kunci privat)/i, locale);
    assert.match(faucet.steps[1][1], /100 YNXT/i, locale);
  }
});

test("five business components consume structured locale helpers without binary language branches", () => {
  for (const file of ["src/main.jsx", "src/components/LatestRecords.jsx", "src/pages/AppsPage.jsx", "src/pages/DownloadPage.jsx", "src/pages/FaucetPage.jsx"]) {
    const source = fs.readFileSync(file, "utf8");
    assert.doesNotMatch(source, /locale\s*===\s*["']zh-CN["']/i, file);
    assert.doesNotMatch(source, /\bzh\s*\?/, file);
  }
});

test("new business locale packs contain no retired network identity", () => {
  const source = `${fs.readFileSync("src/content/runtimeLocaleContent.js", "utf8")}\n${fs.readFileSync("src/content/businessLocaleContent.js", "utf8")}`;
  assert.doesNotMatch(source, /9102|0x238e|NYXT/i);
});
