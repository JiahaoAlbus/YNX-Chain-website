import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToReadableStream } from "react-dom/server";
import { createServer } from "vite";

async function markup(element) {
  const stream = await renderToReadableStream(element);
  await stream.allReady;
  return new Response(stream).text();
}

function fileAnchors(html) {
  return [...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"[^>]*>/g)]
    .filter(([, href]) => /\.(?:zip|apk|dmg|exe|rpm|deb|AppImage)$/.test(href));
}

test("all Wallet download surfaces enforce the same file eligibility without changing other products", async () => {
  const server = await createServer({ server: { middlewareMode: true, watch: null }, optimizeDeps: { noDiscovery: true, entries: [] }, appType: "custom", logLevel: "error" });
  try {
    const [{ WalletDownload }, { WalletDownloadSheet }, { ProductDownloads }, { DownloadPage }, { ProductStatusPage }, catalog, contracts, helpers, copy] = await Promise.all([
      server.ssrLoadModule("/src/components/WalletDownload.jsx"),
      server.ssrLoadModule("/src/components/WalletDownloadSheet.jsx"),
      server.ssrLoadModule("/src/components/ProductDownloads.jsx"),
      server.ssrLoadModule("/src/pages/DownloadPage.jsx"),
      server.ssrLoadModule("/src/pages/ProductStatusPage.jsx"),
      server.ssrLoadModule("/src/lib/ecosystemCatalog.js"),
      server.ssrLoadModule("/src/lib/productPublicContract.js"),
      server.ssrLoadModule("/src/lib/walletDownloads.js"),
      server.ssrLoadModule("/src/content/productUiCopy.js")
    ]);
    const { WALLET_DOWNLOAD_COPY } = await server.ssrLoadModule("/src/content/walletDownloadCopy.js");
    const { currentWalletDownloads } = await import("../scripts/lib/verify-wallet-download-metadata.mjs");
    const products = catalog.getCatalog();
    const wallet = products.find(product => product.key === "wallet");
    const contract = contracts.getProductPublicContract(wallet);
    for (const [platform, artifact] of Object.entries(currentWalletDownloads)) {
      assert.equal(wallet.downloads[platform].href, artifact.publicUrl, platform);
      assert.equal(wallet.downloads[platform].sizeBytes, artifact.sizeBytes, platform);
      assert.equal(wallet.downloads[platform].sha256, artifact.sha256, platform);
    }
    const expected = helpers.walletDownloadOptions(wallet, contract.downloadHostedVerified)
      .filter(option => option.available).map(option => option.item.href).sort();
    const [trigger, chooser, details, directory, overview] = await Promise.all([
      markup(React.createElement(WalletDownload)),
      markup(React.createElement(WalletDownloadSheet, { locale: "en", noticeId: "download-notice" })),
      markup(React.createElement(ProductDownloads, { product: wallet, contract, copy: copy.PRODUCT_UI_COPY.en, locale: "en" })),
      markup(React.createElement(DownloadPage)),
      markup(React.createElement(ProductStatusPage, { product: wallet }))
    ]);
    const walletDirectory = directory.match(/<article\b[^>]*data-product="wallet"[^>]*>([\s\S]*?)<\/article>/)?.[1];
    assert.ok(walletDirectory, "Wallet is present in the download directory");
    for (const [surface, html] of Object.entries({ chooser, details, directory: walletDirectory, overview })) {
      const anchors = fileAnchors(html);
      assert.deepEqual(anchors.map(([, href]) => href).sort(), expected, surface);
      for (const [anchor] of anchors) assert.match(anchor, /\bdownload="[^"]+"/, `${surface} has a direct file download`);
      assert.ok(!anchors.some(([, href]) => href.includes("sha256-69b4fa5db7b8a9ab105af6633de44f5a5a4a9fceeaa0925a306f77b22381b044")), `${surface} blocks the old macOS package`);
      assert.match(html, /Historical preview/, `${surface} identifies the downloadable archives as historical`);
    }
    assert.match(trigger, /<button\b[^>]*aria-haspopup="dialog"[^>]*>Download Wallet</);
    assert.equal(fileAnchors(trigger).length, 0, "The unopened trigger does not render the release catalog");
    assert.match(chooser, /<a[^>]*href="\/manual\?path=wallet&amp;lang=en">Installation guide</);
    assert.ok(!/<a\b[^>]*>Download Wallet</.test(chooser));
    assert.match(chooser, /<p class="walletDownloadFlowBoundary">Historical preview\. Installation, connection and signing have not been verified against current Wallet requirements for this exact package\.<\/p>/);

    assert.ok(!fileAnchors(chooser).some(([, href]) => /firefox|1\.0\.3|0\.1\.1-x64/.test(href)), "current packages replace old defaults and Firefox remains held");
    assert.ok(!chooser.includes('data-platform="linux"'), "specific Linux packages replace the aggregate unavailable row");
    const escaped = value => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
    for (const [locale, localized] of Object.entries(WALLET_DOWNLOAD_COPY)) {
      const localizedChooser = await markup(React.createElement(WalletDownloadSheet, { locale }));
      const localizedProduct = await markup(React.createElement(ProductDownloads, { product: wallet, contract, copy: copy.PRODUCT_UI_COPY[locale], locale }));
      for (const [surface, html] of Object.entries({ chooser: localizedChooser, product: localizedProduct })) {
        assert.equal(fileAnchors(html).length, expected.length, locale + surface);
        for (const key of ["desktopPreviewBoundary", "limitedCiLaunch", "appImageNotInstalled", "unsignedPreview", "browserPreviewBoundary", "manualExtension", "pwaArchiveOnly", "androidPreviewBoundary", "androidLimitedProof", "qaSignedPreview"]) {
          assert.ok(localized[key], locale + key);
          assert.ok(html.includes(escaped(localized[key])), locale + surface + key);
        }
        assert.ok(html.includes("Android · ARM64"));
        assert.ok(!html.includes("Android 7.0+"), "current Android has no inferred minimum OS");
      }
      assert.ok(localizedChooser.includes(escaped(localized.firefoxPermissionHold)));
      assert.ok(localizedChooser.includes('href="/manual?path=wallet&amp;lang=' + locale + '"'));
    }

    const developer = products.find(product => product.key === "developer");
    const developerDirectory = directory.match(/<article\b[^>]*data-product="developer"[^>]*>([\s\S]*?)<\/article>/)?.[1];
    assert.ok(developerDirectory);
    assert.deepEqual(fileAnchors(developerDirectory).map(([, href]) => href).sort(),
      Object.values(developer.downloads).filter(item => item.downloadHosted && item.href).map(item => item.href).sort());
  } finally {
    await server.close();
  }
});
