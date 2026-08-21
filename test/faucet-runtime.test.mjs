import assert from "node:assert/strict";
import test from "node:test";
import { ACCEPTED_FAUCET_MANIFEST, validateFaucetClaim, validateFaucetRuntime } from "../src/lib/faucetRuntime.js";

const build = { commit: "02cf44d17b50", release: "ynx-chain-02cf44d17b50", buildTime: "2026-08-21T01:10:00Z" };
const health = {
  ok: true,
  service: "ynx-faucetd",
  chainId: 6423,
  height: 1136721,
  nativeSymbol: "YNXT",
  upstreamOk: true,
  dependencies: [{ name: "chain-rpc", required: true, ok: true }],
  build,
  startedAt: "2026-08-21T00:46:14Z",
  truthfulStatus: "rpc-backed-faucet",
};
const version = { service: "ynx-faucetd", build, startedAt: health.startedAt };

test("accepts only the exact topology-safe Faucet runtime identity", () => {
  const result = validateFaucetRuntime(health, version);
  assert.equal(result.version.build.commit, "02cf44d17b50");
  assert.equal(ACCEPTED_FAUCET_MANIFEST.payloadSha256, "6d8ca3adfef00d1dc55367fee13ff2ada96953a1dcaab43547428edfee40a998");
  assert.ok(Object.isFrozen(result));
});

test("accepts only a claim response bound to the requested address and amount", () => {
  const address = "ynx10e0525sfrf53yh2aljmm3sn9jq5njk7llqhn80";
  const evmAddress = "0x7e5f4552091a69125d5dfcb7b8c2659029395bdf";
  const payload = {
    transaction: { hash: `0x${"8".repeat(64)}`, to: evmAddress, amount: 100 },
    address,
    canonicalAddress: address,
    evmAddress,
    amount: 100,
    nativeSymbol: "YNXT",
    truthfulStatus: "rpc-backed-faucet",
  };
  assert.equal(validateFaucetClaim(payload, address, 100).hash, payload.transaction.hash);
  assert.throws(() => validateFaucetClaim({ ...payload, amount: 99 }, address, 100), /No success is claimed/);
  assert.throws(() => validateFaucetClaim({ ...payload, address: "ynx1other" }, address, 100), /No success is claimed/);
});

test("rejects topology leaks, stale deployments, wrong chain, mismatched or unknown builds", () => {
  for (const [candidateHealth, candidateVersion] of [
    [{ ...health, rpcUrl: "http://127.0.0.1:6420" }, version],
    [{ ...health, requestLog: "/var/log/ynx-chain/faucet-requests.jsonl" }, version],
    [{ ...health, defaultAmount: 100 }, version],
    [{ ...health, upstreamMode: "authoritative" }, version],
    [{ ...health, chainId: 1 }, version],
    [{ ...health, upstreamOk: false }, version],
    [{ ...health, dependencies: [] }, version],
    [{ ...health, height: 0 }, version],
    [{ ...health, build: { ...build, commit: "64efa498fa99", release: "ynx-chain-64efa498fa99" } }, { ...version, build: { ...build, commit: "64efa498fa99", release: "ynx-chain-64efa498fa99" } }],
    [health, { ...version, build: { ...build, commit: "unknown" } }],
  ]) {
    assert.throws(() => validateFaucetRuntime(candidateHealth, candidateVersion), /No availability is claimed/);
  }
});
