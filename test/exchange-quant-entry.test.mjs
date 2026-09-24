import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import React from "react";
import { renderToReadableStream } from "react-dom/server";
import { createServer } from "vite";

const hosts = {
  exchange: "https://exchange.ynxweb4.com/",
  quant: "https://quant.ynxweb4.com/"
};

async function markup(element) {
  const stream = await renderToReadableStream(element);
  await stream.allReady;
  return new Response(stream).text();
}

test("professional entry routes reach their terminals while status and release history remain separate", async () => {
  const config = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));
  const registry = JSON.parse(readFileSync(new URL("../public/releases/ecosystem-release-registry.json", import.meta.url), "utf8"));
  const server = await createServer({ server: { middlewareMode: true, watch: null }, optimizeDeps: { noDiscovery: true, entries: [] }, appType: "custom", logLevel: "error" });
  try {
    const [{ getLegacyRouteTarget }, { ProductStatusPage }, { getCatalog, getProductRouteMatch }, { getProductPublicContract }] = await Promise.all([
      server.ssrLoadModule("/src/pages/RoutedContent.jsx"),
      server.ssrLoadModule("/src/pages/ProductStatusPage.jsx"),
      server.ssrLoadModule("/src/lib/ecosystemCatalog.js"),
      server.ssrLoadModule("/src/lib/productPublicContract.js")
    ]);
    for (const [key, host] of Object.entries(hosts)) {
      const route = `/${key}`;
      const statusRoute = `/dapp/${key}`;
      const redirect = config.redirects.filter((item) => item.source === route);
      assert.equal(redirect.length, 1, `${key} has exactly one edge redirect`);
      assert.equal(redirect[0].destination, host);
      assert.equal(redirect[0].permanent, false, "a temporary redirect avoids caching the old status-page target permanently");
      assert.equal(getLegacyRouteTarget(route), host, "SPA fallback agrees with the edge route");
      const record = registry.products.find((item) => item.key === key);
      assert.equal(record.publicWeb, host, "registry does not loop back into the redirect");
      const product = getCatalog().find((item) => item.key === key);
      assert.equal(product.route, statusRoute);
      assert.equal(getProductRouteMatch(statusRoute)?.product.key, key);
      assert.equal(getProductRouteMatch(`${statusRoute}/releases`)?.sectionId, "releases");
      const contract = getProductPublicContract(product);
      assert.equal(contract.publicEntry.href, host);
      assert.equal(contract.publicEntry.status, "available");
      const overview = await markup(React.createElement(ProductStatusPage, { product }));
      assert.match(overview, new RegExp(`<a[^>]*href="${host.replaceAll(".", "\\.").replaceAll("/", "\\/")}"[^>]*data-professional-entry="${key}"`));
      assert.match(overview, /href="\/dapp\/(?:exchange|quant)\/releases"/);
      assert.match(overview, /Production signing \/ store release/);
      const releases = await markup(React.createElement(ProductStatusPage, { product, sectionId: "releases" }));
      assert.match(releases, /Public release-registry record/);
      assert.doesNotMatch(releases, /data-professional-entry=/);
    }
    assert.equal(getLegacyRouteTarget("/faucet"), "/dapp/faucet", "other legacy paths remain unchanged");
  } finally {
    await server.close();
  }
});
