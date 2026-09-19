import assert from "node:assert/strict";
import { webcrypto, createHash } from "node:crypto";
import fs from "node:fs";
import test from "node:test";
import { createFaucetSession, FAUCET_ORIGINS } from "../src/lib/faucetSession.js";
import { DURABLE_FAUCET_BUILD, validateFaucetRuntime } from "../src/lib/faucetRuntime.js";
import { YNX_6423, YNX_SERVICE_DIRECTORY } from "../src/lib/api/ynxApi.js";
import { BUSINESS_LOCALES, getFaucetCopy } from "../src/content/businessLocaleContent.js";

const address = `0x${"12".repeat(20)}`, hash = `0x${"ab".repeat(32)}`;
const health = { ok: true, upstreamMode: "authoritative", upstreamOk: true,
  service: "ynx-faucetd", chainId: 6423, nativeSymbol: "YNXT", fundingReady: true,
  idempotentRequests: true, requestStatusPath: "/request-status", defaultAmount: 100, maxAmount: 100,
  build: DURABLE_FAUCET_BUILD, rpcUrl: "http://127.0.0.1:6420", requestLog: "/private/diagnostic" };
const version = { service: "ynx-faucetd", build: DURABLE_FAUCET_BUILD };
const response = (body, status = 200) => new Response(JSON.stringify(body), { status });
const receipt = (id, extra = {}) => ({ status: "accepted", requestId: id, address, amount: 100,
  nativeSymbol: "YNXT", truthfulStatus: "rpc-backed-faucet", transactionHash: hash,
  transaction: { hash, to: address, amount: 100 }, ...extra });
const storage = () => { const data = new Map(); return {
  getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key),
}; };

test("durable client is byte-identical to the published Faucet source", () => {
  const body = fs.readFileSync("src/lib/faucetClient.js", "utf8").split("\n").slice(2).join("\n");
  assert.equal(createHash("sha256").update(body).digest("hex"), "be26e0bc3a91732b72fc49bd6500dba406dff08a3b19478774dbdb4abcf01627");
});
function setup({ disk = storage(), origin = FAUCET_ORIGINS[0], request, status, h = health, v = version } = {}) {
  const calls = [];
  const fetch = async (url, options = {}) => {
    calls.push({ url, options });
    assert.equal(new URL(url).origin, origin);
    assert.equal(options.credentials, "omit"); assert.equal(options.redirect, "error");
    if (url.endsWith("/health")) return response(h);
    if (url.endsWith("/version")) return response(v);
    if (new URL(url).pathname === "/request-status") return status ? status(url) : response({ status: "pending" });
    const body = JSON.parse(options.body);
    return request ? request(body, options) : response(receipt(body.requestId), 201);
  };
  return { session: createFaucetSession({ origin, fetch, storage: disk, crypto: webcrypto }), calls, disk };
}

test("canonical entries and status use the new alias; CSP keeps both exact hosts", () => {
  assert.equal(YNX_6423.services.faucet, FAUCET_ORIGINS[0]);
  assert.equal(YNX_SERVICE_DIRECTORY.faucet.healthEndpoint, `${FAUCET_ORIGINS[0]}/health`);
  const csp = JSON.parse(fs.readFileSync("vercel.json")).headers.flatMap(x => x.headers).find(x => x.key === "Content-Security-Policy").value;
  for (const origin of FAUCET_ORIGINS) assert.ok(csp.split(" ").includes(origin) || csp.includes(`${origin};`));
  assert.ok(fs.existsSync("public/releases/faucet-runtime/64efa498fa9982e12ffda888391d67082dc898bb/runtime-publication.json"));
});

test("exact durable identity is projected without topology diagnostics", () => {
  const result = validateFaucetRuntime(health, version);
  assert.equal(result.durable, true);
  for (const key of ["rpcUrl", "requestLog", "lastError"]) assert.equal(Object.hasOwn(result.health, key), false);
  for (const mutation of [{ chainId: 1 }, { fundingReady: false }, { idempotentRequests: false }, { requestStatusPath: "https://evil.invalid" }, { defaultAmount: 101 }]) {
    assert.throws(() => validateFaucetRuntime({ ...health, ...mutation }, version));
  }
  assert.throws(() => validateFaucetRuntime(health, { ...version, build: { ...version.build, commit: "unknown" } }));
});

test("unknown origins fail closed before I/O", () => {
  for (const origin of ["http://faucet-testnet.ynxweb4.com", "https://faucet-testnet.ynxweb4.com.evil.invalid", `${FAUCET_ORIGINS[0]}/`, "https://faucet-mainnet.ynxweb4.com"]) {
    assert.throws(() => createFaucetSession({ origin }), /Unsupported/);
  }
});

test("refresh is read-only; verified success binds one exact intent", async () => {
  const { session, calls } = setup();
  await session.refresh(); assert.equal(calls.length, 2);
  const result = await session.submit(address);
  assert.equal(result.state, "success"); assert.equal(result.hash, hash);
  await session.submit(address);
  assert.equal(calls.filter(c => c.options.method === "POST").length, 1);
  assert.throws(() => session.client.newRequest.call({ pending: { state: "sent" }, error: session.client.error }));
  session.reset(); assert.equal(session.snapshot().state, "idle");
});

test("lost ACK reload checks status without POST, then retries byte-identically across aliases", async () => {
  const first = setup({ request: () => { throw new Error("lost ACK"); } });
  await first.session.refresh(); await assert.rejects(first.session.submit(address));
  assert.equal(first.session.snapshot().state, "pending"); assert.throws(() => first.session.reset());
  const second = setup({ disk: first.disk, origin: FAUCET_ORIGINS[1] });
  await second.session.refresh();
  assert.equal(second.calls.filter(c => c.options.method === "POST").length, 0);
  await assert.rejects(second.session.submit(`0x${"13".repeat(20)}`));
  await second.session.submit(address);
  assert.equal(first.calls.find(c => c.options.method === "POST").options.body, second.calls.find(c => c.options.method === "POST").options.body);
});

test("accepted status recovers an ACK with no second write", async () => {
  const first = setup({ request: () => { throw new Error("lost ACK"); } });
  await first.session.refresh(); await assert.rejects(first.session.submit(address));
  const second = setup({ disk: first.disk, status: url => response(receipt(new URL(url).searchParams.get("requestId"))) });
  await second.session.refresh(); assert.equal(second.session.snapshot().state, "success");
  assert.equal(second.calls.filter(c => c.options.method === "POST").length, 0);
});

test("400 is rejected; 409/429/502 preserve original intent, never a success", async () => {
  for (const code of [400, 409, 429, 502]) {
    const { session } = setup({ request: body => response({ requestId: body.requestId, retrySameRequest: true }, code) });
    await session.refresh(); await assert.rejects(session.submit(address));
    assert.equal(session.snapshot().state, code === 400 ? "idle" : "pending");
    if (code !== 400) assert.throws(() => session.reset());
  }
});

test("receipt substitutions and disagreement between two hash fields never succeed", async () => {
  for (const extra of [{ requestId: "wrong" }, { address: `0x${"34".repeat(20)}` }, { amount: 99 },
    { transactionHash: `0x${"cd".repeat(32)}` }, { nativeSymbol: "YNX" }, { status: "pending" }]) {
    const { session } = setup({ request: body => response(receipt(body.requestId, extra), 201) });
    await session.refresh(); await assert.rejects(session.submit(address));
    assert.equal(session.snapshot().state, "pending");
  }
});

test("failed persistence and wrong identity cannot write", async () => {
  for (const config of [{ disk: { getItem: () => null, setItem() { throw Error("storage denied"); } } }, { h: { ...health, chainId: 1 } }]) {
    const { session, calls } = setup(config);
    try { await session.refresh(); } catch {}
    await assert.rejects(session.submit(address));
    assert.equal(calls.filter(c => c.options.method === "POST").length, 0);
  }
});

test("all locales use truthful uncertainty and the original form locks unresolved intent", () => {
  for (const locale of BUSINESS_LOCALES) assert.ok(Object.values(getFaucetCopy(locale).recovery).every(x => typeof x === "string" && x.length > 0));
  const page = fs.readFileSync("src/pages/FaucetPage.jsx", "utf8");
  assert.ok(page.includes("createFaucetSession")); assert.ok(page.includes("disabled={locked}"));
  assert.ok(!page.includes("copy.errorTitle")); assert.ok(!page.includes('fetch(`${apiConfig.faucetUrl}/request`'));
});
