import assert from "node:assert/strict";
import crypto from "node:crypto";
import test from "node:test";
import { normalizeYNXAddress, toEVMAddress, toYNXAddress } from "../src/lib/addressCodec.js";
import { ADDRESS_COPY, getAddressCopy } from "../src/content/addressCopy.js";

// Exact shared testdata/address-vectors.json from the canonical Go/SDK/browser codec.
const vectors = [
  { hex: "0x0000000000000000000000000000000000000000", bech32: "ynx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqgrm2qr" },
  { hex: "0x7e5f4552091a69125d5dfcb7b8c2659029395bdf", bech32: "ynx10e0525sfrf53yh2aljmm3sn9jq5njk7llqhn80" },
  { hex: "0xffffffffffffffffffffffffffffffffffffffff", bech32: "ynx1llllllllllllllllllllllllllllllllyj698f" },
];

test("canonical shared vectors preserve 20-byte account identity in both formats", () => {
  for (const { hex, bech32 } of vectors) {
    for (const value of [hex, bech32, hex.toUpperCase(), bech32.toUpperCase(), ` ${bech32} `]) {
      assert.deepEqual(normalizeYNXAddress(value), { evmAddress: hex, ynxAddress: bech32 });
      assert.equal(toEVMAddress(value), hex);
      assert.equal(toYNXAddress(value), bech32);
    }
  }
});

test("the same 512 public synthetic cases round-trip and reject checksum mutations", () => {
  for (let i = 0; i < 512; i++) {
    const hex = `0x${crypto.createHash("sha256").update(`ynx-address-parity-${i}`).digest("hex").slice(0, 40)}`;
    const address = toYNXAddress(hex);
    for (const value of [hex, address, hex.toUpperCase(), address.toUpperCase(), ` ${address} `]) {
      assert.equal(toEVMAddress(value), hex);
      assert.equal(toYNXAddress(value), address);
    }
    const bad = address.slice(0, -1) + (address.endsWith("q") ? "p" : "q");
    assert.throws(() => normalizeYNXAddress(bad), /checksum/);
  }
});

test("invalid wallet account values are rejected rather than formatted as an address", () => {
  for (const value of ["", null, 12, {}, "0x1234", `0x${"0".repeat(64)}`, "ynx_faucet", "eth1qqqqqq", "ynx1qqqqqq", "YNX1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqgrm2qr", "<img src=x onerror=alert(1)>"]) assert.throws(() => normalizeYNXAddress(value));
});

test("all twelve locales explain native and EVM address formats with a safe fallback", () => {
  assert.deepEqual(Object.keys(ADDRESS_COPY).sort(), ["en", "zh-CN", "zh-TW", "ja", "ko", "es", "fr", "de", "pt", "ru", "ar", "id"].sort());
  for (const locale of Object.keys(ADDRESS_COPY)) for (const key of ["native", "details", "evm", "sameAccount", "unavailable"]) assert.ok(typeof getAddressCopy(locale)[key] === "string" && getAddressCopy(locale)[key].length > 0, `${locale}.${key}`);
  assert.equal(getAddressCopy("missing"), ADDRESS_COPY.en);
});
