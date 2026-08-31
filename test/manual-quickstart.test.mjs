import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const manual = fs.readFileSync(new URL("../src/pages/ManualPage.jsx", import.meta.url), "utf8");

test("manual provides explicit Windows, macOS, and Linux step-by-step paths", () => {
  for (const platform of ["Windows", "macOS", "Linux"]) {
    assert.match(manual, new RegExp(`name: "${platform}"`));
    assert.match(manual, new RegExp(`${platform}.*Step-by-step \\+ one-command`, "s"));
  }
  assert.match(manual, /Get-FileHash .* -Algorithm SHA256/);
  assert.match(manual, /shasum -a 256/);
  assert.match(manual, /sha256sum/);
});

test("manual covers wallet, canonical network, Testnet asset, Explorer, observer, validator, backup, and recovery", () => {
  for (const required of [
    "wallet installation",
    "6423",
    "0x1917",
    "YNXT",
    "Explorer",
    "observer",
    "validator",
    "Back up",
    "recovery",
  ]) assert.match(manual, new RegExp(required, "i"));

  assert.match(manual, /href="\/downloads"/);
  assert.match(manual, /Open 6423 network setup/);
  assert.match(manual, /Request Testnet YNXT/);
  assert.match(manual, /Verify in Explorer/);
});

test("one-command paths are copyable read-only preflights, never automatic enrollment", () => {
  assert.equal((manual.match(/quickCommand:/g) || []).length, 3);
  assert.equal((manual.match(/eth_chainId/g) || []).length >= 3, true);
  assert.match(manual, /Copy read-only command/);
  assert.match(manual, /-TimeoutSec 12/);
  assert.equal((manual.match(/--connect-timeout 5 --max-time 12/g) || []).length, 2);
  assert.match(manual, /does not install a wallet/);
  assert.match(manual, /cannot start an observer or join the validator set automatically/);
  assert.match(manual, /explicit human candidate review/);
  assert.doesNotMatch(manual, /curl[^\n]*\|\s*(?:ba)?sh/);
  assert.doesNotMatch(manual, /\bsudo\b/);
});

test("manual fails closed on custody material and contains no retired network identity", () => {
  assert.match(manual, /never paste a mnemonic or private key into a website/);
  assert.match(manual, /should request or generate your private key, mnemonic, or signer secret/);
  for (const retired of ["9102", "0x238e", "NYXT"]) assert.doesNotMatch(manual, new RegExp(retired, "i"));
});
