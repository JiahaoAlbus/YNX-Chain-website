import assert from "node:assert/strict";
import test from "node:test";
import { EventEmitter } from "node:events";
import {
  LEGACY_LOCAL_SIGNER_KEYS,
  YNX_EVM_CHAIN_ID,
  canonicalProviderEntry,
  clearLegacyLocalSignerData,
  connectCanonicalProvider,
  hasLegacyLocalSignerData,
  requestCanonicalPersonalSignature,
  sendCanonicalTransaction,
  switchCanonicalProviderToYNX,
  subscribeCanonicalProvider,
  walletIdentity,
  walletKind,
} from "../src/lib/walletProvider.js";

const account = "0x1111111111111111111111111111111111111111";

test("provider events update accounts and chain, reject malformed chain events, and detach on disconnect", () => {
  const provider = Object.assign(new EventEmitter(), { isYNXWallet: true, request() { throw new Error("Events must not request wallet authority"); } });
  const updates = [];
  const stop = subscribeCanonicalProvider(canonicalProviderEntry(provider), (state) => updates.push(state));
  provider.emit("accountsChanged", [account, "invalid"]);
  provider.emit("chainChanged", "0x01917");
  provider.emit("accountsChanged", []);
  assert.doesNotThrow(() => provider.emit("chainChanged", "malformed"));
  provider.emit("disconnect");
  assert.deepEqual(updates, [
    { type: "accountsChanged", accounts: [account] },
    { type: "chainChanged", chainId: "0x1917" },
    { type: "accountsChanged", accounts: [] },
    { type: "disconnect" },
    { type: "disconnect" },
  ]);
  stop();
  provider.emit("accountsChanged", [account]);
  assert.equal(updates.length, 5);
  assert.equal(provider.listenerCount("accountsChanged"), 0);
  assert.equal(provider.listenerCount("chainChanged"), 0);
  assert.equal(provider.listenerCount("disconnect"), 0);
});

test("wallet identity accepts only mutually exclusive canonical providers", () => {
  assert.deepEqual(walletIdentity({ isYNXWallet: true, isMetaMask: false }, { rdns: "com.ynx.wallet" }), {
    accepted: true, kind: "ynx", label: "YNX Wallet", rdns: "com.ynx.wallet",
  });
  assert.equal(walletKind({ isMetaMask: true, isYNXWallet: false }, { rdns: "io.metamask" }), "MetaMask");
  assert.equal(walletIdentity({ isYNXWallet: true, isMetaMask: true }).accepted, false);
  assert.equal(walletIdentity({ isYNXWallet: true }, { rdns: "io.metamask" }).accepted, false);
  assert.equal(canonicalProviderEntry({ request() {} }, { name: "Another Wallet" }), null);
});

test("canonical connection requests an account only through the selected provider and reads chain 6423", async () => {
  const calls = [];
  const provider = {
    isYNXWallet: true,
    isMetaMask: false,
    async request(request) {
      calls.push(request);
      if (request.method === "eth_requestAccounts") return [account.toUpperCase().replace("0X", "0x")];
      if (request.method === "eth_chainId") return "0x01917";
      throw new Error("unexpected request");
    },
  };
  const entry = canonicalProviderEntry(provider, { rdns: "com.ynx.wallet", name: "YNX Wallet" });
  const result = await connectCanonicalProvider(entry);
  assert.equal(result.account, account);
  assert.equal(result.chainId, YNX_EVM_CHAIN_ID);
  assert.deepEqual(calls.map(({ method }) => method), ["eth_requestAccounts", "eth_chainId"]);
});

test("network switch is exact-bound and requires 0x1917 readback", async () => {
  const calls = [];
  const provider = {
    isMetaMask: true,
    isYNXWallet: false,
    async request(request) {
      calls.push(request);
      if (request.method === "wallet_switchEthereumChain" && calls.length === 1) throw Object.assign(new Error("missing"), { code: 4902 });
      if (request.method === "eth_chainId") return "0x1917";
      return null;
    },
  };
  const entry = canonicalProviderEntry(provider, { rdns: "io.metamask", name: "MetaMask" });
  const chainId = await switchCanonicalProviderToYNX(entry, { chainId: "0x1917", chainName: "YNX" });
  assert.equal(chainId, "0x1917");
  assert.deepEqual(calls.map(({ method }) => method), ["wallet_switchEthereumChain", "wallet_addEthereumChain", "wallet_switchEthereumChain", "eth_chainId"]);
});

test("signature and send helpers delegate exact requests without receiving key material", async () => {
  const calls = [];
  const provider = {
    isYNXWallet: true,
    isMetaMask: false,
    async request(request) {
      calls.push(request);
      if (request.method === "eth_chainId") return "0x1917";
      if (request.method === "eth_accounts") return [account];
      return request.method === "personal_sign" ? "0xsig" : "0xtx";
    },
  };
  const entry = canonicalProviderEntry(provider, { rdns: "com.ynx.wallet" });
  assert.equal(await requestCanonicalPersonalSignature(entry, { account, messageHex: "0x74657374" }), "0xsig");
  assert.equal(await sendCanonicalTransaction(entry, { from: account.toUpperCase().replace("0X", "0x"), to: account, value: "0x0" }), "0xtx");
  assert.deepEqual(calls, [
    { method: "eth_chainId" },
    { method: "eth_accounts" },
    { method: "personal_sign", params: ["0x74657374", account] },
    { method: "eth_chainId" },
    { method: "eth_accounts" },
    { method: "eth_sendTransaction", params: [{ from: account, to: account, value: "0x0" }] },
  ]);
});

test("legacy signer detection and clearing never reads stored values", () => {
  const values = new Map([[LEGACY_LOCAL_SIGNER_KEYS[0], "must-not-be-read"], ["unrelated", "keep"]]);
  let reads = 0;
  const storage = {
    get length() { return values.size; },
    key(index) { return [...values.keys()][index] ?? null; },
    getItem() { reads += 1; throw new Error("secret value read"); },
    removeItem(key) { values.delete(key); },
  };
  assert.equal(hasLegacyLocalSignerData(storage), true);
  const result = clearLegacyLocalSignerData({ storage, target: null });
  assert.equal(result.removed, true);
  assert.equal(result.secretValuesRead, false);
  assert.equal(reads, 0);
  assert.equal(hasLegacyLocalSignerData(storage), false);
  assert.equal(values.get("unrelated"), "keep");
});
