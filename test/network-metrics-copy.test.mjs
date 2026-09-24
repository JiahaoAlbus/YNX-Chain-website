import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { CORE_LOCALES } from "../src/content/coreLocaleContent.js";
import { NETWORK_METRIC_COPY, getNetworkMetricCopy } from "../src/content/networkMetricCopy.js";

test("network observations have complete localized labels and a safe fallback", () => {
  assert.deepEqual(Object.keys(NETWORK_METRIC_COPY), CORE_LOCALES);
  const fields = Object.keys(NETWORK_METRIC_COPY.en);
  for (const locale of CORE_LOCALES) {
    assert.deepEqual(Object.keys(getNetworkMetricCopy(locale)), fields);
    for (const value of Object.values(getNetworkMetricCopy(locale))) assert.ok(value.trim());
  }
  assert.equal(getNetworkMetricCopy("unknown"), NETWORK_METRIC_COPY.en);
  assert.match(NETWORK_METRIC_COPY.en.blockAge, /at check/);
  assert.match(NETWORK_METRIC_COPY["zh-CN"].rpcRead, /排队/);
});

test("portal distinguishes block age, collection, indexer lag and refresh failure", async () => {
  const source = await readFile(new URL("../src/pages/PortalPage.jsx", import.meta.url), "utf8");
  for (const field of ["blockAgeMs", "rpcCollectionMs", "explorerCollectionMs", "indexerLagBlocks"]) assert.ok(source.includes(field));
  assert.match(source, /network\.error \? t\("liveSourceUnavailable"\)/);
  assert.match(source, /setNetwork\(await loadNetworkSnapshot\(\)\)/);
  assert.match(source, /data-chain-verified/);
  assert.match(source, /data-indexer-verified/);
});
