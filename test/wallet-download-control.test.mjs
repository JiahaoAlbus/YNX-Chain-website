import assert from "node:assert/strict";
import test from "node:test";
import { walletDownloadState, walletDownloadOptions } from "../src/lib/walletDownloads.js";
import { WALLET_DOWNLOAD_COPY } from "../src/content/walletDownloadCopy.js";
import { publishedDownloadMetadata } from "../src/content/publishedDownloads.js";

const [href, metadata] = Object.entries(publishedDownloadMetadata).find(([href]) => href.endsWith("x64.exe"));
const released = { ...metadata, href, downloadHosted: true };

test("a file action requires complete immutable release provenance and registry authorization", () => {
  const state = walletDownloadState("windowsX64", released);
  assert.equal(state.available, true);
  assert.equal(state.filename, "ynx-wallet-desktop-0.6.5-x64.exe");
  assert.equal(walletDownloadState("windowsX64", released, false).available, false);
  for (const field of ["sha256", "sourceCommit", "sizeBytes", "publicationEvidence", "signingClass", "downloadHosted", "canonicalDownload"]) {
    assert.equal(walletDownloadState("windowsX64", { ...released, [field]: undefined }).available, false, field);
  }
  assert.equal(walletDownloadState("windowsX64", { ...released, downloadApproved: false }).available, false);
});

test("download actions cannot become product-page or untrusted URL navigation", () => {
  for (const badHref of ["/dapp/wallet", "/dapp/wallet/open-download", "https://example.com" + href,
    href.replace(metadata.sha256, "0".repeat(64)), href + "?redirect=/dapp/wallet", "javascript:alert(1)",
    "https://user:pass@ynxweb4.com" + href, href.replace(".exe", ".html")]) {
    assert.equal(walletDownloadState("windowsX64", { ...released, href: badHref }).available, false, badHref);
  }
});

test("known blocked macOS package and incomplete platform evidence remain unavailable", () => {
  const [macHref, macMetadata] = Object.entries(publishedDownloadMetadata).find(([, item]) => item.sourceCommit === "5a6b033897a1295d35fc325a92c6bb81c8b04a19");
  const state = walletDownloadState("macos", { ...macMetadata, href: macHref, downloadHosted: true });
  assert.equal(state.available, false);
  assert.equal(state.legacyBlocked, true);
  assert.equal(state.limitationKey, "macLegacyBlocked");
  const options = walletDownloadOptions({ downloads: { windowsX64: released } });
  assert.deepEqual(options.filter(item => item.available).map(item => item.platform), ["windowsX64"]);
  assert.ok(options.some(item => item.platform === "ios" && !item.available));
  assert.ok(options.some(item => item.platform === "chromeEdge" && !item.available));
});

test("download chooser has native text for all twelve website locales", () => {
  assert.deepEqual(Object.keys(WALLET_DOWNLOAD_COPY).sort(), ["zh-CN", "zh-TW", "en", "ja", "ko", "es", "fr", "de", "pt", "ru", "ar", "id"].sort());
  for (const [locale, copy] of Object.entries(WALLET_DOWNLOAD_COPY)) {
    for (const key of ["downloadWallet", "close", "otherPlatforms", "releasePending", "historicalPreview", "historicalBoundary"]) assert.ok(copy[key]?.length, `${locale}.${key}`);
  }
});
