import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {readFile} from "node:fs/promises";
import {dirname, join, resolve} from "node:path";
import test from "node:test";
import {fileURLToPath} from "node:url";
import vm from "node:vm";
import {
  bindWalletManifest,
  WALLET_MANIFEST_HREF,
  WALLET_ROUTE,
} from "../../../release/integration/wallet-web-pwa-site/wallet-manifest-binding.mjs";
import {
  connectWallet,
  sendTransaction,
  signMessage,
  verifyTestnetRpc,
  walletActionGates,
} from "../../../public/wallet/companion/provider.js";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "../../..");
const publicDir = join(repoRoot, "public/wallet/companion");
const frozenPath = join(repoRoot, "release/integration/wallet-web-pwa-site/frozen-wallet-manifest.webmanifest");
const hash = body => createHash("sha256").update(body).digest("hex");

function fakeDocument(initialHref = "/manifest.webmanifest") {
  const attributes = new Map([["rel", "manifest"], ["href", initialHref]]);
  const link = {
    removed: false,
    getAttribute: key => attributes.has(key) ? attributes.get(key) : null,
    setAttribute: (key, value) => attributes.set(key, value),
    removeAttribute: key => attributes.delete(key),
    remove() { this.removed = true; },
  };
  return {link, head: {append(node) { this.appended = node; }}, querySelector: () => link, createElement: () => link};
}

test("Wallet route binds the frozen manifest and cleanup restores the site identity", () => {
  const documentLike = fakeDocument();
  const binding = bindWalletManifest(documentLike, WALLET_ROUTE);
  assert.equal(binding.bound, true);
  assert.equal(documentLike.link.getAttribute("href"), WALLET_MANIFEST_HREF);
  binding.cleanup();
  binding.cleanup();
  assert.equal(documentLike.link.getAttribute("href"), "/manifest.webmanifest");
});

test("production CSP allows only the exact Wallet RPC origin requested by the companion", async () => {
  const vercel = JSON.parse(await readFile(join(repoRoot, "vercel.json"), "utf8"));
  const globalHeaders = vercel.headers.find((entry) => entry.source === "/(.*)")?.headers || [];
  const csp = globalHeaders.find((entry) => entry.key === "Content-Security-Policy")?.value || "";
  const connectSrc = csp.match(/(?:^|;)\s*connect-src\s+([^;]+)/u)?.[1]?.trim().split(/\s+/u) || [];
  assert.equal(connectSrc.filter((origin) => origin === "https://evm.ynxweb4.com").length, 1);
  assert.equal(connectSrc.some((origin) => /^https:\/\/\*\./u.test(origin)), false);
});

test("root worker cleanup preserves the Wallet cache namespace and deletes unrelated stale caches", async () => {
  const source = await readFile(join(repoRoot, "public/sw.js"), "utf8");
  const handlers = new Map();
  const deleted = [];
  const cacheKeys = ["ynx-web-shell-v5-native-i18n-notranslate", "ynx-wallet-web-v6", "ynx-wallet-web-v5", "legacy-site-cache", "other-wallet-cache"];
  const context = {
    URL,
    Response,
    caches: {
      keys: async () => cacheKeys,
      delete: async (key) => { deleted.push(key); return true; },
    },
    self: {
      addEventListener: (name, handler) => handlers.set(name, handler),
      skipWaiting() {},
      clients: {claim: async () => undefined},
      location: {origin: "https://www.ynxweb4.com"},
    },
  };
  vm.runInNewContext(source, context, {filename: "public/sw.js"});
  let activation;
  handlers.get("activate")({waitUntil: (promise) => { activation = promise; }});
  await activation;
  assert.deepEqual(deleted.sort(), ["legacy-site-cache", "other-wallet-cache"]);
});

test("non-Wallet routes never mutate the site manifest", () => {
  const documentLike = fakeDocument();
  const binding = bindWalletManifest(documentLike, "/");
  assert.equal(binding.bound, false);
  assert.equal(documentLike.link.getAttribute("href"), "/manifest.webmanifest");
});

test("Website handoff manifest is exactly the built Wallet manifest with frozen icon identities", async () => {
  const local = JSON.parse(await readFile(join(publicDir, "manifest.webmanifest"), "utf8"));
  const frozen = JSON.parse(await readFile(frozenPath, "utf8"));
  assert.deepEqual(frozen, local);
  assert.deepEqual(
    {name: frozen.name, id: frozen.id, start_url: frozen.start_url, scope: frozen.scope},
    {name: "YNX Wallet Testnet Companion", id: "/wallet/companion", start_url: "./", scope: "./"},
  );
  const expected = new Map([
    ["ynx-icon-192.png", [9838, "02bd7b202a6683d83bbe4b17c246afc969b43284ee945e97167d9606e6df04af"]],
    ["ynx-icon-512.png", [45914, "5a6fb80c48a2047ad5632cf0b69f410ebaefd8aff0bb3da7dce28c1ce8c992c7"]],
    ["ynx-icon-maskable-512.png", [45914, "5a6fb80c48a2047ad5632cf0b69f410ebaefd8aff0bb3da7dce28c1ce8c992c7"]],
  ]);
  for (const icon of frozen.icons) {
    const body = await readFile(join(publicDir, icon.src));
    assert.deepEqual([body.length, hash(body)], expected.get(icon.src.slice(2)));
  }
});

test("hardened Wallet source package is the exact Website companion materialization", async () => {
  const artifactManifest = JSON.parse(await readFile(join(repoRoot, "apps/wallet-web/artifact-manifest.json"), "utf8"));
  const pwa = artifactManifest.artifacts.find((artifact) => artifact.name === "ynx-wallet-web-pwa-0.1.0.zip");
  const zip = await readFile(join(repoRoot, "apps/wallet-web/artifacts/ynx-wallet-web-pwa-0.1.0.zip"));
  assert.deepEqual(
    {bytes: pwa.bytes, sha256: pwa.sha256, observedBytes: zip.length, observedSha256: hash(zip)},
    {bytes: 272793, sha256: "d54126990dc421ec730112d244e404d5f81ec69b07e030f724925f4dfaf6bc40", observedBytes: 272793, observedSha256: "d54126990dc421ec730112d244e404d5f81ec69b07e030f724925f4dfaf6bc40"},
  );
  assert.equal(
    await readFile(join(repoRoot, "apps/wallet-web/public/sw.js"), "utf8"),
    await readFile(join(publicDir, "sw.js"), "utf8"),
  );
  assert.equal(
    await readFile(join(repoRoot, "apps/wallet-web/src/service-worker-policy.js"), "utf8"),
    await readFile(join(publicDir, "service-worker-policy.js"), "utf8"),
  );
});

test("RPC timeout keeps account, signing, transaction, and chain-changing actions fail closed", async () => {
  const timeout = Object.assign(new Error("simulated bounded RPC timeout"), {name: "TimeoutError"});
  const unavailable = async () => { throw timeout; };
  const providerCalls = [];
  const provider = {request: async (input) => { providerCalls.push(input); throw new Error("provider must not be reached"); }};

  await assert.rejects(() => verifyTestnetRpc(unavailable), (error) => error.code === "RPC_UNAVAILABLE");
  await assert.rejects(() => connectWallet(provider, {fetcher: unavailable}), (error) => error.code === "RPC_UNAVAILABLE");
  await assert.rejects(() => signMessage(provider, null, "must remain blocked"), (error) => error.code === "INVALID_ACCOUNT");
  await assert.rejects(
    () => sendTransaction(provider, {
      from: "0x1111111111111111111111111111111111111111",
      to: "0x2222222222222222222222222222222222222222",
      value: "0x0",
      data: "0x",
    }, {fetcher: unavailable}),
    (error) => error.code === "RPC_UNAVAILABLE",
  );
  assert.deepEqual(providerCalls, []);
  assert.deepEqual(walletActionGates(provider, null, null, false), {
    canAddChain: false,
    canSwitchChain: false,
    canSign: false,
    canSendTransaction: false,
  });
});
