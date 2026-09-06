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
    const products = catalog.getCatalog();
    const wallet = products.find(product => product.key === "wallet");
    const contract = contracts.getProductPublicContract(wallet);
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
    assert.match(chooser, /<a[^>]*href="\/manual#wallet">Installation guide</);
    assert.ok(!/<a\b[^>]*>Download Wallet</.test(chooser));
    assert.match(chooser, /<p class="walletDownloadFlowBoundary">Historical preview\. Installation, connection and signing have not been verified against current Wallet requirements for this exact package\.<\/p>/);

    const developer = products.find(product => product.key === "developer");
    const developerDirectory = directory.match(/<article\b[^>]*data-product="developer"[^>]*>([\s\S]*?)<\/article>/)?.[1];
    assert.ok(developerDirectory);
    assert.deepEqual(fileAnchors(developerDirectory).map(([, href]) => href).sort(),
      Object.values(developer.downloads).filter(item => item.downloadHosted && item.href).map(item => item.href).sort());
  } finally {
    await server.close();
  }
});
