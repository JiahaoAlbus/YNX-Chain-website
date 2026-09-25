import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToReadableStream } from "react-dom/server";
import { createServer } from "vite";
import { DOWNLOAD_EXPERIENCE_LOCALES, getDownloadCategoryLabels, getDownloadExperienceCopy } from "../src/content/downloadExperienceCopy.js";
import { DOWNLOAD_TILE_KEYS, DOWNLOAD_TILE_LOCALES, getDownloadTileSummary } from "../src/content/downloadTileSummaries.js";
import { getCatalog } from "../src/lib/ecosystemCatalog.js";
import { getDownloadDirectoryProduct } from "../src/lib/downloadDirectory.js";
import { getEligiblePackageEntries, hasEligibleWebEntry } from "../src/lib/downloadActions.js";
import { filterDownloadProducts } from "../src/lib/downloadFilters.js";

async function markup(element) {
  const stream = await renderToReadableStream(element);
  await stream.allReady;
  return new Response(stream).text();
}

test("the download hub has native interface copy in all twelve locales", () => {
  assert.equal(DOWNLOAD_EXPERIENCE_LOCALES.length, 12);
  for (const locale of DOWNLOAD_EXPERIENCE_LOCALES) {
    const copy = getDownloadExperienceCopy(locale);
    for (const key of ["title", "lead", "search", "choose", "openWeb", "versions", "noPublic", "platformUnavailable", "details", "clear", "empty"]) {
      assert.ok(copy[key]?.trim(), `${locale}:${key}`);
    }
    assert.equal(getDownloadCategoryLabels(locale).length, 5);
  }
  assert.notEqual(getDownloadExperienceCopy("ar").title, getDownloadExperienceCopy("en").title);
  assert.equal(getDownloadCategoryLabels("ar")[0], "الهوية والمجتمع");
});

test("all 26 product purpose summaries are localized in every supported locale", () => {
  assert.equal(DOWNLOAD_TILE_KEYS.length, 26);
  assert.deepEqual([...DOWNLOAD_TILE_LOCALES].sort(), [...DOWNLOAD_EXPERIENCE_LOCALES].sort());
  for (const locale of DOWNLOAD_EXPERIENCE_LOCALES) {
    for (const key of DOWNLOAD_TILE_KEYS) assert.ok(getDownloadTileSummary(locale, key)?.trim(), `${locale}:${key}`);
  }
  assert.equal(getDownloadTileSummary("zh-CN", "wallet"), "管理资产，连接应用");
  assert.notEqual(getDownloadTileSummary("ar", "wallet"), getDownloadTileSummary("en", "wallet"));
});

test("the compact page retains all 26 products and the release-gated Wallet surface", async () => {
  const server = await createServer({ server: { middlewareMode: true, watch: null }, optimizeDeps: { noDiscovery: true, entries: [] }, appType: "custom", logLevel: "error" });
  try {
    const { DownloadPage } = await server.ssrLoadModule("/src/pages/DownloadPage.jsx");
    const html = await markup(React.createElement(DownloadPage));
    assert.equal((html.match(/class="downloadHubTile/g) || []).length, 26);
    assert.match(html, /data-selected-product="wallet"/);
    assert.match(html, /data-product="wallet"/);
    assert.match(html, /data-product="resource"/);
    assert.match(html, /data-wallet-safety-hold="GHSA-7g7r-gx96-252g"/);
    assert.match(html, /class="downloadHubWebLink"/);
    assert.ok(!html.includes('class="downloadHubSecondary"'), "public web is part of the platform choices, not a duplicate side action");
    assert.ok(html.includes("ynx-wallet-desktop-0.6.10-x64.exe"), "only the exact published Windows x64 Testnet preview is selectable");
  } finally {
    await server.close();
  }
});

test("a verified web-only product is eligible without inventing an installer", () => {
  const card = getDownloadDirectoryProduct(getCatalog().find(product => product.key === "card"));
  assert.equal(hasEligibleWebEntry(card), true);
  assert.equal(getEligiblePackageEntries(card).length, 0);
});

test("top actions and package filters reject paused or incomplete Wallet file evidence", () => {
  const wallet = getDownloadDirectoryProduct(getCatalog().find(product => product.key === "wallet"));
  const ready = getEligiblePackageEntries(wallet);
  assert.ok(ready.some(([platform]) => platform === "windowsX64"));
  const hold = { ...wallet, downloads: { ...wallet.downloads, windowsX64: { ...wallet.downloads.windowsX64, downloadApproved: false } } };
  assert.ok(!getEligiblePackageEntries(hold).some(([platform]) => platform === "windowsX64"));
  const noCanonical = { ...wallet, downloads: { ...wallet.downloads, windowsX64: { ...wallet.downloads.windowsX64, canonicalDownload: false } } };
  assert.ok(!getEligiblePackageEntries(noCanonical).some(([platform]) => platform === "windowsX64"));
  const noProvenance = { ...wallet, downloads: { ...wallet.downloads, windowsX64: { ...wallet.downloads.windowsX64, sourceCommit: "" } } };
  assert.ok(!getEligiblePackageEntries(noProvenance).some(([platform]) => platform === "windowsX64"));
  const allDenied = { ...wallet, downloads: Object.fromEntries(Object.entries(wallet.downloads).map(([platform, item]) => [platform, platform === "web" ? item : { ...item, downloadApproved: false }])) };
  assert.equal(getEligiblePackageEntries(allDenied).length, 0);
  assert.equal(filterDownloadProducts([allDenied], { method: "packages" }).length, 0, "a stale hasDownload flag cannot show a package filter result");
  assert.equal(filterDownloadProducts([allDenied], { method: "packages", platform: "desktop" }).length, 0);
});
