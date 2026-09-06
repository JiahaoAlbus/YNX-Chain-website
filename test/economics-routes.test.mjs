import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { ECONOMIC_COMMANDS, ECONOMIC_PAGES, economicEvidence } from "../src/lib/economicsEvidence.js";
import evidenceHandler from "../api/economics/evidence.js";

const expectedRoutes = ["/ynxt", "/supply", "/burn", "/staking", "/stablecoin", "/treasury", "/solvency", "/liquidity", "/fees", "/whitepaper"];
const contractFields = ["source", "asOf", "version", "coverage", "state", "error"];

test("all required public economic routes are registered and searchable", () => {
  assert.deepEqual(Object.keys(ECONOMIC_PAGES), expectedRoutes);
  assert.deepEqual(ECONOMIC_COMMANDS.map(({ href }) => href), expectedRoutes);
  const main = fs.readFileSync("src/pages/RoutedContent.jsx", "utf8");
  const palette = fs.readFileSync("src/components/CommandPalette.jsx", "utf8");
  assert.match(main, /ECONOMIC_ROUTES\.has\(route\)/);
  assert.match(palette, /ECONOMIC_COMMANDS/);
});

test("economic evidence uses one complete machine-readable contract", () => {
  for (const field of contractFields) assert.ok(Object.hasOwn(economicEvidence, field), `missing top-level ${field}`);
  for (const evidence of [economicEvidence.identity, ...Object.values(economicEvidence.indicators)]) {
    for (const field of contractFields) assert.ok(Object.hasOwn(evidence, field), `missing evidence ${field}`);
  }
  assert.equal(economicEvidence.identity.chainId, 6423);
  assert.equal(economicEvidence.identity.evmChainId, "0x1917");
  assert.equal(economicEvidence.identity.nativeAsset, "YNXT");
  assert.equal(economicEvidence.identity.mainnet, false);
});

test("machine-readable endpoint returns the contract with fail-safe headers", () => {
  const headers = {};
  let status;
  let body;
  evidenceHandler({}, {
    setHeader(name, value) { headers[name.toLowerCase()] = value; },
    status(value) { status = value; return this; },
    json(value) { body = value; }
  });
  assert.equal(status, 200);
  assert.equal(headers["cache-control"], "no-store, max-age=0, must-revalidate");
  assert.equal(headers["content-type"], "application/json; charset=utf-8");
  assert.equal(headers["x-content-type-options"], "nosniff");
  assert.deepEqual(body, economicEvidence);
});

test("unsupported economics stay unavailable and contain no synthetic values", () => {
  for (const [topic, evidence] of Object.entries(economicEvidence.indicators)) {
    assert.equal(evidence.topic, topic);
    assert.equal(evidence.state, "unavailable");
    assert.equal(evidence.value, null);
    assert.equal(evidence.source, null);
    assert.equal(evidence.asOf, null);
    assert.match(evidence.error, /No |not |unavailable/i);
  }
  const productSource = [
    "src/lib/economicsEvidence.js", "src/pages/EconomicPage.jsx", "api/economics/evidence.js"
  ].map((file) => fs.readFileSync(file, "utf8")).join("\n");
  for (const retired of ["9102", "0x238e", ["NY", "XT"].join("")]) assert.equal(productSource.includes(retired), false);
  for (const promise of [/guaranteed return/i, /promised yield/i, /fixed APR/i, /risk-free/i]) assert.doesNotMatch(productSource, promise);
});

test("whitepaper route links to maintained evidence instead of inventing a PDF", () => {
  const whitepaper = ECONOMIC_PAGES["/whitepaper"];
  assert.ok(whitepaper.actions.some(([, href]) => href === "/docs"));
  assert.ok(whitepaper.actions.some(([, href]) => href === "https://github.com/JiahaoAlbus/YNX-Chain/tree/main/docs"));
  assert.equal(whitepaper.actions.some(([, href]) => href.endsWith(".pdf")), false);
});
