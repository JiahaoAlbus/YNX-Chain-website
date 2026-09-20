import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import test from "node:test";
import { WALLET_ANDROID24 } from "../src/content/walletAndroid24.js";

const registry = JSON.parse(fs.readFileSync("public/releases/ecosystem-release-registry.json", "utf8"));
const wallet = registry.products.find((product) => product.key === "wallet");
const productRelease = JSON.parse(fs.readFileSync(`public${wallet.productRelease}`, "utf8"));
const publicProductMetadata = JSON.parse(fs.readFileSync(`public${wallet.publicProductMetadata}`, "utf8"));
const webRuntime = JSON.parse(fs.readFileSync(`public${wallet.publicWebRelease}`, "utf8"));
const webDownloadManifestBytes = fs.readFileSync(`public${wallet.webDownloadManifest.localPath}`);
const webDownloadManifest = JSON.parse(webDownloadManifestBytes);

test("Wallet Android24 product metadata binds both artifacts without promoting installed or public acceptance", () => {
  const publication = JSON.parse(fs.readFileSync(`public${WALLET_ANDROID24.publicationEvidence}`, "utf8"));
  for (const [format, expected] of [["apk", WALLET_ANDROID24], ["aab", publication.aab]]) {
    const artifact = productRelease.artifacts.find(item => item.format === format);
    assert.equal(artifact.file, expected.artifactPath);
    assert.equal(artifact.url, expected.publicUrl ?? expected.fallbackUrl);
    assert.equal(artifact.sha256, expected.sha256);
    assert.equal(artifact.sizeBytes, expected.sizeBytes);
    assert.equal(artifact.versionCode, 24);
    assert.equal(artifact.signingClass, "local-test-signed");
  }
  for (const states of [productRelease.externalStates, publicProductMetadata.status]) {
    assert.equal(states.androidWebsiteEntryPrepared, true);
    for (const field of ["androidWebsiteEntry", "androidInstallVerified", "physicalDeviceVerified", "fullInstalledE2E", "walletConnectRelayE2E", "installedFinanceE2E", "liveChainTransferExecuted", "storeSubmitted", "storeAccepted"]) assert.equal(states[field], false, field);
  }
  assert.equal(publicProductMetadata.routes.releaseEvidence, WALLET_ANDROID24.publicationEvidence);
  assert.equal(publicProductMetadata.publicEvidence.installProof, WALLET_ANDROID24.installProof);
  assert.match(publicProductMetadata.publicEvidence.installProof, /NOT_VERIFIED/);
  assert.equal(publicProductMetadata.network.chainId, 6423);
  assert.equal(publicProductMetadata.network.nativeAsset, "YNXT");
});

test("Wallet product-package and Companion source identities stay separately bound", () => {
  assert.equal(wallet.commit, "2fdd679f9044");
  assert.ok(productRelease.sourceCommit.startsWith(wallet.commit));
  assert.equal(productRelease.product, "YNX Wallet");
  assert.equal(productRelease.release, "1.0.18-testnet-preview-2fdd679f9");
  assert.equal(productRelease.releaseImmutable, false);
  assert.equal(productRelease.externalStates.androidWebsiteEntry, false);
  assert.equal(productRelease.externalStates.walletConnectRelayE2E, false);
  assert.equal(productRelease.externalStates.liveChainTransferExecuted, false);
  assert.equal(publicProductMetadata.publicEvidence.sourceCommit, productRelease.sourceCommit);
  assert.equal(publicProductMetadata.publicEvidence.sha256, productRelease.artifacts[0].sha256);
  assert.equal(publicProductMetadata.publicEvidence.sizeBytes, productRelease.artifacts[0].sizeBytes);
  assert.equal(publicProductMetadata.status.productionSigningApproved, false);
  assert.equal(publicProductMetadata.status.storeAccepted, false);

  assert.equal(wallet.publicWeb, "https://wallet.ynxweb4.com/");
  assert.equal(wallet.publicWebSourceCommit, "2f1822ef268e825f14274d87c912b6b863bbaca3");
  assert.equal(webRuntime.sourceCommit, wallet.publicWebSourceCommit);
  assert.equal(webRuntime.runtimeIdentity.sourceCommit, wallet.publicWebSourceCommit);
  assert.equal(webRuntime.deploymentId, "dpl_7dqxihBYrWXqsqd87oAbfsuMkqcP");
  assert.equal(webRuntime.checks.buildIdentityReadback, true);
  assert.equal(webRuntime.checks.sourceTreePublicReadback, false);
  assert.notEqual(wallet.commit, wallet.publicWebSourceCommit);
});

test("Wallet Web package manifest binds the exact immutable c93 release and all three current files", () => {
  assert.equal(wallet.webDownloadRelease, "/releases/wallet-web/20260920-wallet-web-testnet-preview-c93e16be.json");
  assert.equal(wallet.webDownloadManifest.url, "https://github.com/JiahaoAlbus/YNX-Chain/releases/download/wallet-web-testnet-preview-0.1.1-c93e16be8/artifact-manifest.json");
  assert.equal(webDownloadManifestBytes.length, wallet.webDownloadManifest.bytes);
  assert.equal(crypto.createHash("sha256").update(webDownloadManifestBytes).digest("hex"), wallet.webDownloadManifest.sha256);
  assert.equal(webDownloadManifest.sourceCommit, "c93e16be81beddc957ef5f27b7bbcdfa89c28db3");
  assert.notEqual(webDownloadManifest.sourceCommit, wallet.publicWebSourceCommit);
  assert.deepEqual(webDownloadManifest.artifacts.map(({ name, bytes, sha256 }) => ({ name, bytes, sha256 })), [
    { name: "ynx-wallet-web-pwa-0.1.1.zip", bytes: 312868, sha256: "6e7e6dd17e9e729a44ed915e46433124c1a3794e06a0d072c55097084cc45e13" },
    { name: "ynx-wallet-chrome-edge-0.1.1.zip", bytes: 547479, sha256: "09066d82a94cb6b8108120f980ab2cc40c42dc830ffce166529cbd570eb6a6b2" },
    { name: "ynx-wallet-firefox-0.1.1.zip", bytes: 547577, sha256: "6ac256415c34b4b492dc6094be8be8c9f0acf6a40653e2e18fde64dd20f801e0" },
  ]);
});
