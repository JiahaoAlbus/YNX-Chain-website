import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import test from "node:test";
import { WALLET_ANDROID24 } from "../src/content/walletAndroid24.js";
import { WALLET_ANDROID25 } from "../src/content/walletAndroid25.js";

const registry = JSON.parse(fs.readFileSync("public/releases/ecosystem-release-registry.json", "utf8"));
const wallet = registry.products.find((product) => product.key === "wallet");
const productRelease = JSON.parse(fs.readFileSync(`public${wallet.productRelease}`, "utf8"));
const publicProductMetadata = JSON.parse(fs.readFileSync(`public${wallet.publicProductMetadata}`, "utf8"));
const webRuntime = JSON.parse(fs.readFileSync(`public${wallet.publicWebRelease}`, "utf8"));
const webDownloadManifestBytes = fs.readFileSync(`public${wallet.webDownloadManifest.localPath}`);
const webDownloadManifest = JSON.parse(webDownloadManifestBytes);

test("Wallet Android25 product metadata binds both artifacts without promoting installed acceptance", () => {
  const publication = JSON.parse(fs.readFileSync(`public${WALLET_ANDROID25.publicationEvidence}`, "utf8"));
  for (const [format, expected] of [["apk", WALLET_ANDROID25], ["aab", publication.aab]]) {
    const artifact = productRelease.artifacts.find(item => item.format === format);
    assert.equal(artifact.file, expected.artifactPath);
    assert.equal(artifact.url, expected.publicUrl ?? expected.fallbackUrl);
    assert.equal(artifact.sha256, expected.sha256);
    assert.equal(artifact.sizeBytes, expected.sizeBytes);
    assert.equal(artifact.versionCode, 25);
    assert.equal(artifact.signingClass, "local-test-signed");
  }
  for (const states of [productRelease.externalStates, publicProductMetadata.status]) {
    assert.equal(states.androidWebsiteEntryPrepared, true);
    assert.equal(states.androidWebsiteEntry, true);
    for (const field of ["androidInstallVerified", "physicalDeviceVerified", "fullInstalledE2E", "walletConnectRelayE2E", "installedFinanceE2E", "liveChainTransferExecuted", "storeSubmitted", "storeAccepted"]) assert.equal(states[field], false, field);
  }
  assert.equal(publicProductMetadata.routes.releaseEvidence, WALLET_ANDROID25.publicationEvidence);
  assert.equal(publicProductMetadata.publicEvidence.installProof, WALLET_ANDROID25.installProof);
  assert.match(publicProductMetadata.publicEvidence.installProof, /NOT_REPEATED_FOR_VERSION_ONLY_RELEASE/);
  assert.equal(publicProductMetadata.network.chainId, 6423);
  assert.equal(publicProductMetadata.network.nativeAsset, "YNXT");
});

test("Wallet product-package and Companion source identities stay separately bound", () => {
  assert.equal(wallet.commit, "d58ce00dc4e8");
  assert.ok(productRelease.sourceCommit.startsWith(wallet.commit));
  assert.equal(productRelease.product, "YNX Wallet");
  assert.equal(productRelease.release, "1.0.19-testnet-preview-d58ce00dc");
  assert.equal(productRelease.releaseImmutable, false);
  assert.equal(productRelease.externalStates.androidWebsiteEntry, true);
  assert.equal(productRelease.externalStates.productionSigned, false);
  assert.equal(productRelease.externalStates.mainnet, false);
  assert.equal(publicProductMetadata.status.walletMainnetReady, false);
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

test("Historical Android24 website activation binds the first public build and bounded read-only evidence", () => {
  const productRelease = JSON.parse(fs.readFileSync("public/releases/wallet/2fdd679f9/product-release.json", "utf8"));
  const publicProductMetadata = JSON.parse(fs.readFileSync("public/releases/wallet/2fdd679f9/public-product-metadata.json", "utf8"));
  const wallet = {productRelease: "/releases/wallet/2fdd679f9/product-release.json", publicProductMetadata: "/releases/wallet/2fdd679f9/public-product-metadata.json"};
  assert.equal(productRelease.externalStates.androidWebsiteEntry, true);
  assert.equal(publicProductMetadata.status.androidWebsiteEntry, true);
  const path = "/releases/wallet/2fdd679f9/website-activation.json";
  assert.equal(productRelease.websiteActivationEvidence, path);
  assert.equal(publicProductMetadata.websiteActivationEvidence, path);
  const evidence = JSON.parse(fs.readFileSync(`public${path}`, "utf8"));
  assert.equal(evidence.schema, "ynx-wallet-website-activation/v1");
  assert.equal(evidence.httpObservedAt, "2026-09-20T19:52:28Z");
  assert.deepEqual(evidence.websiteBuild, {
    url: "https://ynxweb4.com/build-identity.json",
    sourceCommit: "677a4e3d1e193ce8a5e54253dbbe300736031182",
    sourceTree: "3fc040ec9521b9ce4460a223eed736eea6d6e1a7",
    release: "website-677a4e3d1e19"
  });
  assert.notEqual(evidence.websiteBuild.sourceCommit, productRelease.sourceCommit);
  assert.equal(evidence.canonicalPage, "https://ynxweb4.com/dapp/download");
  assert.deepEqual(evidence.metadataUrls, [
    `https://ynxweb4.com${WALLET_ANDROID24.publicationEvidence}`,
    `https://ynxweb4.com${wallet.productRelease}`,
    `https://ynxweb4.com${wallet.publicProductMetadata}`
  ]);
  assert.deepEqual(evidence.checks, {
    buildIdentityReadback: true, canonicalPageHttp200: true, metadataHttp200: true,
    browserRenderedVersionLinkShaAndSource: true, metadataVersionCode24: true
  });
  assert.deepEqual(evidence.unchangedAcceptance, {
    androidInstallVerified: false, androidColdLaunch: "NOT_VERIFIED",
    physicalDeviceVerified: false, fullInstalledE2E: false, productionSigned: false,
    storeSubmitted: false, storeAccepted: false, walletConnectRelayE2E: false,
    installedFinanceE2E: false, liveChainTransferExecuted: false
  });
  assert.match(evidence.scope, /point-in-time evidence/);
  assert.match(evidence.verificationBoundary, /No APK download, installation, signing, transaction or Sandbox execution/);
});

test("Android25 activation binds its own verified public build without inheriting installed acceptance", () => {
  const path = "/releases/wallet/d58ce00dc/website-activation.json";
  assert.equal(productRelease.websiteActivationEvidence, path);
  assert.equal(publicProductMetadata.websiteActivationEvidence, path);
  assert.equal(publicProductMetadata.routes.download, WALLET_ANDROID25.publicUrl);
  assert.equal(productRelease.externalStates.androidWebsiteEntry, true);
  assert.equal(publicProductMetadata.status.androidWebsiteEntry, true);
  const evidence = JSON.parse(fs.readFileSync(`public${path}`, "utf8"));
  assert.equal(evidence.schema, "ynx-wallet-website-activation/v1");
  assert.equal(evidence.httpObservedAt, "2026-09-20T22:54:29Z");
  assert.deepEqual(evidence.websiteBuild, {
    url: "https://ynxweb4.com/build-identity.json",
    sourceCommit: "8ad37c17b3bc778fd820281339f9eeaf53703535",
    sourceTree: "7570357b41eeb608476c25b073c2356d30e7d809",
    release: "website-8ad37c17b3bc"
  });
  assert.notEqual(evidence.websiteBuild.sourceCommit, productRelease.sourceCommit);
  assert.equal(evidence.canonicalPage, "https://ynxweb4.com/dapp/download");
  assert.equal(evidence.registryUrl, "https://ynxweb4.com/releases/ecosystem-release-registry.json");
  assert.deepEqual(evidence.metadataUrls, [
    `https://ynxweb4.com${WALLET_ANDROID25.publicationEvidence}`,
    `https://ynxweb4.com${wallet.productRelease}`,
    `https://ynxweb4.com${wallet.publicProductMetadata}`
  ]);
  assert.deepEqual(evidence.historicalUrls, [
    `https://ynxweb4.com${WALLET_ANDROID24.publicationEvidence}`,
    "https://ynxweb4.com/releases/wallet/2fdd679f9/product-release.json",
    "https://ynxweb4.com/releases/wallet/2fdd679f9/public-product-metadata.json"
  ]);
  assert.deepEqual(evidence.checks, {
    buildIdentityReadback: true, canonicalPageHttp200: true, registryHttp200: true,
    metadataHttp200: true, historicalUrlsHttp200: true,
    browserRenderedAndroidAndUniversalVersionLinkShaAndSource: true
  });
  assert.deepEqual(evidence.unchangedAcceptance, {
    androidInstallVerified: false, androidInstall: "NOT_REPEATED_FOR_VERSION_ONLY_RELEASE",
    androidColdLaunch: "NOT_REPEATED_FOR_VERSION_ONLY_RELEASE", physicalDeviceVerified: false,
    fullInstalledE2E: false, productionSigned: false, storeSubmitted: false, storeAccepted: false,
    walletConnectRelayE2E: false, installedFinanceE2E: false, liveChainTransferExecuted: false,
    downloadTimeSha256Verified: false
  });
  assert.match(evidence.scope, /point-in-time evidence/);
  assert.match(evidence.verificationBoundary, /No APK download, installation, signing, transaction or Sandbox execution/);
});
