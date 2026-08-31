import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  canonicalNetworkFacts,
  coreRouteJsonLd,
  createCoreRouteEntries,
  renderCoreRouteBody,
  verifyCoreRouteEntries,
} from "../scripts/lib/core-route-content.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(fs.readFileSync(path.join(root, "public/releases/ecosystem-release-registry.json"), "utf8"));
const entries = createCoreRouteEntries(registry);

test("core prerender definition covers every requested route and release-registry product", () => {
  assert.equal(verifyCoreRouteEntries(entries, registry), true);
  for (const route of ["/", "/blockchain", "/tokens", "/data", "/governance", "/ecosystem", "/developers", "/downloads", "/more", "/manual", "/api", "/status", "/dapp", ...registry.products.map((product) => product.route)]) {
    assert.ok(entries.some((entry) => entry.route === route), route);
  }
});

test("every static route has unique metadata, canonical JSON-LD, network truth, and honest hydration copy", () => {
  assert.equal(canonicalNetworkFacts.nativeChainId, "ynx_6423-1");
  assert.equal(canonicalNetworkFacts.evmChainId, "6423 / 0x1917");
  assert.equal(canonicalNetworkFacts.nativeAsset, "YNXT");
  for (const entry of entries) {
    const body = renderCoreRouteBody(entry);
    const jsonLd = coreRouteJsonLd(entry, "https://ynxweb4.com");
    assert.match(body, new RegExp(`<h1>${escapeRegex(entry.h1)}</h1>`));
    assert.match(body, /ynx_6423-1/);
    assert.match(body, /0x1917/);
    assert.match(body, /YNXT/);
    assert.match(body, /Live chain and product data load after hydration/);
    assert.doesNotMatch(body, /latest height is \d+|network tps is \d+/i);
    assert.equal(jsonLd.url, `https://ynxweb4.com${entry.route === "/" ? "" : entry.route}`);
    assert.equal(jsonLd.description, entry.description);
  }
});

test("product static routes preserve evidence boundaries from the release registry", () => {
  for (const product of registry.products) {
    const entry = entries.find((candidate) => candidate.route === product.route);
    const body = renderCoreRouteBody(entry);
    assert.ok(entry.product);
    assert.match(body, new RegExp(product.centralAccepted === true ? "Central accepted</dt><dd>Yes" : "Central accepted</dt><dd>No"));
    assert.match(body, new RegExp(product.publicWeb ? "Published entry" : "Public web</dt><dd>Not proven"));
    assert.match(body, new RegExp(product.downloadHosted === true ? "Available with separate package evidence" : "Hosted download</dt><dd>Not proven"));
  }
});

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
