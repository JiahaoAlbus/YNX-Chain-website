import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const artifacts = [
  {
    platform: "web-pwa",
    path: "public/downloads/wallet-web/sha256-a5e8d413e037ed1e345a4af7c42fc31bc413d6514afb0c8a0a0b82b6047fe209/ynx-wallet-web-pwa-0.1.0.zip",
    bytes: 274329,
    sha256: "a5e8d413e037ed1e345a4af7c42fc31bc413d6514afb0c8a0a0b82b6047fe209",
  },
  {
    platform: "chrome-edge-extension",
    path: "public/downloads/wallet-web/sha256-354c1d7834c4be1ec19af4f19bb69ad8f097ce7ebb713e8b639e382815495266/ynx-wallet-chrome-edge-0.1.0.zip",
    bytes: 189922,
    sha256: "354c1d7834c4be1ec19af4f19bb69ad8f097ce7ebb713e8b639e382815495266",
  },
  {
    platform: "firefox-extension",
    path: "public/downloads/wallet-web/sha256-4d71e5de63ed24f35b52b847743f9c60bc3dc22e3c49e3461761ee5180466cea/ynx-wallet-firefox-0.1.0.zip",
    bytes: 189959,
    sha256: "4d71e5de63ed24f35b52b847743f9c60bc3dc22e3c49e3461761ee5180466cea",
  },
];

for (const artifact of artifacts) {
  const body = fs.readFileSync(artifact.path);
  assert.equal(body.length, artifact.bytes, `${artifact.platform} byte drift`);
  assert.equal(sha256(body), artifact.sha256, `${artifact.platform} SHA-256 drift`);
}

const pwaZip = artifacts[0].path;
const entries = execFileSync("unzip", ["-Z1", pwaZip], { encoding: "utf8" })
  .trim()
  .split("\n")
  .filter(Boolean);
assert.equal(entries.length, 17, "exact PWA resource count drift");
assert.equal(new Set(entries).size, entries.length, "duplicate PWA ZIP entry");
for (const entry of entries) {
  assert.equal(path.basename(entry), entry, `nested or unsafe PWA ZIP entry: ${entry}`);
  const archived = execFileSync("unzip", ["-p", pwaZip, entry]);
  const published = fs.readFileSync(path.join("public/wallet/companion", entry));
  assert.equal(sha256(published), sha256(archived), `materialized PWA resource drift: ${entry}`);
}

const manifest = JSON.parse(read("public/wallet/companion/manifest.webmanifest"));
assert.equal(manifest.name, "YNX Wallet Testnet Companion");
assert.equal(manifest.short_name, "YNX Wallet");
assert.equal(manifest.id, "/wallet/companion");
assert.equal(manifest.start_url, "./");
assert.equal(manifest.scope, "./");

const app = read("public/wallet/companion/app.js");
const binding = read("public/wallet/companion/core-auth-binding.js");
const routing = read("public/wallet/companion/mobile-wallet-routing.js");
const provider = read("public/wallet/companion/provider.js");
const walletWorker = read("public/wallet/companion/sw.js");
const walletWorkerPolicy = read("public/wallet/companion/service-worker-policy.js");
const rootWorker = read("public/sw.js");
const vercel = JSON.parse(read("vercel.json"));
const catalog = read("src/lib/ecosystemCatalog.js");
const prerender = read("scripts/prerender.mjs");
const registry = JSON.parse(read("public/releases/ecosystem-release-registry.json"));
const evidence = JSON.parse(read("docs/integration/wallet-web-mobile-discovery-website-publication-20260815.json"));

assert.match(app, /CANONICAL_AUTH_UNAVAILABLE/);
assert.match(binding, /"enabled":false/);
assert.match(binding, /"webCallbacks":\[\]/);
const { metaMaskMobileDappUrl } = await import("../public/wallet/companion/mobile-wallet-routing.js");
assert.equal(metaMaskMobileDappUrl(), "https://metamask.app.link/dapp/www.ynxweb4.com/dapp/wallet");
assert.match(routing, /canonical-auth-unavailable/);
assert.match(provider, /https:\/\/evm\.ynxweb4\.com/);
assert.match(walletWorker, /self\.registration\.scope/);
assert.match(walletWorkerPolicy, /scopePath/);
assert.match(walletWorkerPolicy, /network-only/);
assert.match(rootWorker, /PRESERVED_CACHE_PREFIXES\s*=\s*\["ynx-wallet-web-v"\]/);
assert.match(prerender, /href="\/wallet\/companion\/manifest\.webmanifest"/);
assert.match(catalog, /020f513e5d5d/);
assert.match(catalog, /CANONICAL_AUTH_UNAVAILABLE/);
assert.match(catalog, /downloadFunctional=false/);

const csp = vercel.headers
  .flatMap((rule) => rule.headers || [])
  .find((header) => header.key === "Content-Security-Policy")?.value;
assert.ok(csp?.includes("https://evm.ynxweb4.com"), "frozen legacy RPC origin missing from CSP");
assert.ok(csp?.includes("https://rpc.ynxweb4.com"), "canonical RPC origin missing from CSP");

const wallet = registry.products.find((product) => product.key === "wallet");
assert.equal(wallet.walletWebSourceCommit, "020f513e5d5d12920f75201f637bdd854ccc91aa");
assert.equal(wallet.walletWebDeployedPublic, false);
assert.equal(wallet.mobileVisibleContractProvedPublic, false);
for (const field of ["ynxCanonicalAuthorizationAvailable", "addChainProved", "providerConnected", "accountProved", "signProved", "transactionProved", "testnetConnectionProved"]) {
  assert.equal(wallet[field], false, `${field} must fail closed before direct evidence`);
}
for (const artifact of artifacts) {
  const download = wallet.downloads.find((item) => item.platform === artifact.platform);
  assert.equal(download.sha256, artifact.sha256);
  assert.equal(download.bytes, artifact.bytes);
  assert.equal(download.hosted, false, `${artifact.platform} hosted must await public verification`);
}
const android = wallet.downloads.find((item) => item.platform === "android-api24");
assert.equal(android.functional, false, "Android functionality lacks exact replacement and device proof");
assert.equal(evidence.android.downloadFunctional, false);
for (const [gate, value] of Object.entries(evidence.falseUntilDirectProductionEvidence)) {
  assert.equal(value, false, `${gate} was promoted without direct evidence`);
}

console.log(`wallet mobile discovery publication gate passed: ${entries.length} exact PWA resources, ${artifacts.length} exact static packages, all unproved runtime/public gates false`);

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
