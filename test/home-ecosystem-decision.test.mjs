import assert from "node:assert/strict";
import test from "node:test";
import { homeEcosystemPanelDecision } from "../src/lib/homeEcosystemDecision.js";

test("network reference keeps its own runtime status and opens a user-facing network route", () => {
  assert.deepEqual(homeEcosystemPanelDecision(0, "live"), { status: "live", href: "/testnet", healthStatus: null });
  assert.equal(homeEcosystemPanelDecision(1, "live").status, "reference");
  assert.equal(homeEcosystemPanelDecision(8, "live").href, "/#address");
});

test("public product links come from release-registry contracts", () => {
  const explorer = homeEcosystemPanelDecision(2, "status unavailable");
  const exchange = homeEcosystemPanelDecision(9, "status unavailable");
  assert.equal(explorer.status, "public-web");
  assert.equal(explorer.href, "https://explorer.ynxweb4.com");
  assert.equal(exchange.status, "public-web");
  assert.equal(exchange.href, "https://exchange.ynxweb4.com/");
});

test("healthy API does not promote a candidate product or turn health into its entry", () => {
  const ai = homeEcosystemPanelDecision(3, "live", { ai: { ok: true } });
  const pay = homeEcosystemPanelDecision(4, "live", { pay: { ok: true } });
  assert.equal(ai.status, "candidate");
  assert.equal(ai.healthStatus, "live");
  assert.equal(ai.href, "/dapp/ai");
  assert.equal(pay.status, "candidate");
  assert.equal(pay.href, "/dapp/pay");
});
