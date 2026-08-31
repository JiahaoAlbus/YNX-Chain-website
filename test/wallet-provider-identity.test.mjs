import assert from "node:assert/strict";
import test from "node:test";
import { walletKind } from "../src/lib/walletProvider.js";

test("wallet labels keep YNX Wallet and MetaMask mutually exclusive", () => {
  assert.equal(walletKind({ isYNXWallet: true, isMetaMask: false }), "YNX Wallet");
  assert.equal(walletKind({ isYNXWallet: false, isMetaMask: true }), "MetaMask");
  assert.equal(walletKind({ isYNXWallet: true, isMetaMask: true }), "Compatible EIP-1193 wallet");
  assert.equal(walletKind({}, { name: "Another Wallet" }), "Another Wallet");
});
