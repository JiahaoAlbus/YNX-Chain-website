import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { WALLET_CANONICAL_DOWNLOADS, WALLET_CANONICAL_MANIFESTS, WALLET_DOWNLOAD_HISTORY_PATH } from '../../src/content/walletCanonicalDownloads.js';
import { WALLET_MACOS_MANIFESTS } from '../../src/content/walletMacosDownloads.js';
import { WALLET_DESKTOP_MANIFESTS } from '../../src/content/walletDesktopDownloads.js';
import { WALLET_BROWSER_MANIFESTS } from '../../src/content/walletBrowserDownloads.js';
import { WALLET_ANDROID_MANIFESTS } from '../../src/content/walletAndroidDownloads.js';
import { walletDownloadState } from '../../src/lib/walletDownloads.js';
import { WALLET_APPIMAGE_ADVISORY, WALLET_APPIMAGE_HELD_SHA256, WALLET_DOWNLOAD_SAFETY_POLICY_PATH } from '../../src/lib/walletDownloadSafety.js';

export const currentWalletDownloads = WALLET_CANONICAL_DOWNLOADS;
// Pins observed GitHub metadata and owner evidence independently of the public JSON.
// Deep equality rejects omitted, added or promoted nested acceptance claims.
const android23PublicationPins = {
  "publicationMergeCommit": "c75cd8690b0bc43941db522ac502aa989addd713",
  "githubReleaseId": 392422025,
  "githubApiImmutable": false,
  "apkAssetId": 576764497,
  "assetUpdatedAt": "2026-09-20T12:19:30Z",
  "verificationBoundary": "Point-in-time URL, size and SHA verification. Publisher may replace assets; website does not recompute SHA-256 during download.",
  "ownerPublication": {
    "pullRequest": "https://github.com/JiahaoAlbus/YNX-Chain/pull/164",
    "evidenceCommit": "6e8e25015ad702728045e409153748d5b9fcdfcf",
    "manifest": "https://github.com/JiahaoAlbus/YNX-Chain/blob/6e8e25015ad702728045e409153748d5b9fcdfcf/apps/wallet/artifact-publication-1.0.17.json",
    "proof": "https://github.com/JiahaoAlbus/YNX-Chain/blob/6e8e25015ad702728045e409153748d5b9fcdfcf/apps/wallet/proof/wallet-android-1.0.17-publication-20260920.json",
    "freshDownloadDigestMatched": true,
    "downloadVerificationBy": "Wallet publication owner; website independently matched GitHub asset metadata"
  },
  "aab": {
    "artifactPath": "ynx-wallet-1.0.17-testnet-preview-875f6c5b7-local-test-signed.aab",
    "publicUrl": "https://github.com/JiahaoAlbus/YNX-Chain/releases/download/wallet-android-testnet-preview-1.0.17-875f6c5b7/ynx-wallet-1.0.17-testnet-preview-875f6c5b7-local-test-signed.aab",
    "sizeBytes": 71872002,
    "sha256": "079c8e0597ab0c30b884e10c0d15bd1a8f606c6412509162fa85429966dbef1b",
    "githubAssetId": 576764498,
    "assetUpdatedAt": "2026-09-20T12:19:22Z",
    "signingClass": "local-test-signed",
    "productionSigned": false,
    "storeReleased": false,
    "directInstallable": false
  },
  "limitedInstalledEvidence": {
    "api": 36,
    "upgradedFromVersionCode": 22,
    "versionCode": 23,
    "firstInstallTimePreserved": true,
    "coldLaunchTotalTimeMs": 220,
    "deepLinksWithoutCrash": true,
    "crashBufferEmpty": true,
    "recoveryContractTestsPassed": 56,
    "realDeviceVerified": false,
    "walletConnectRelayE2E": false,
    "liveChainTransferExecuted": false
  }
};

export function verifyWalletAndroidPublication(evidence) {
  assert.deepEqual(evidence, { ...currentWalletDownloads.android, ...android23PublicationPins },
    'Android23 publication must match the exact merged owner evidence and release assets');
}

const archivedManifests = [...WALLET_DESKTOP_MANIFESTS, ...WALLET_BROWSER_MANIFESTS, ...WALLET_ANDROID_MANIFESTS, ...WALLET_MACOS_MANIFESTS];
const archivePins = [
  ['c510fcd2b72eb2a6f7c07188e32161e9bcd4d6b4f79a131f5f7a213c46c9bfd3', 2926],
  ['cc80de8cee26e3e30a9d47ccbd46419793c7680590e166fc98293513b0f7633e', 8591],
  ['7b5a3ecfec00501cbd0ab387c1e14e1cc6f6cc77689bad0c74cbe8fd316f0399', 644],
  ['814574df0d3e8e689d10446ee7358938a1ce407afcee249be1b5ba7d0a964887', 5256],
  ['dd2932d9e67867e167d6a586cad101ead825d7f9e17b7152dcf2cbc0c6825bac', 685],
  ['f14af90c79caac046ee5e283e96c4ebce9d50d323dcaeef9df774594da781cd2', 3324],
  ['8269fe58132125d810c86d6f93de2ba84ad3a98984393db2bb3f4fc2f6050c62', 654],
  ['162dce80ecf62238c718b6bd0ecbe3773102ec303a0de289e929327e8955e855', 3145]
];
const canonicalPins = [
  ['344651e9f6f4324a9dddbc2bd7b103aad1bfc1bc855b412e62048b4f48fad0ef', 6012],
  ['28162c332f04f0a683457f7dc0f53172a02a58cb0008eafa979f38e83973b6ca', 29774]
];
const safetyPins = [
  '3ba16d0372021471e13733425eaa39b155c122175e5bdcbc0e39b2554c199b00',
  '66dde56c9f8da969e9916d72c8929add581b1a0ea0695cd70a2e9fcb3c960a72',
  'dcaf1372b29e6d3cb58f9a37d3db3b6fcb45aa9e13feff1c7c247bf283cd9893',
  '5664be113dea0e06862fcc8e6d1918de86a60197d7ca1906bbb30e8e5b3c4183'
];
// Select explicit release IDs; array order, dates and lexical commit order are not selection rules.
const expectedKeys = ['android', 'androidUniversal', 'windowsX64', 'windowsArm64', 'linuxX64Deb', 'linuxX64AppImage',
  'linuxArm64Deb', 'linuxArm64AppImage', 'macos', 'chromeEdge', 'pwa'];
const overlayKeys = new Set(['android', 'androidUniversal', 'windowsX64', 'windowsArm64', 'linuxX64Deb', 'linuxArm64Deb', 'macos', 'chromeEdge', 'pwa']);
const legacySlots = {
  linuxX64AppImage: 'linux-x64-appimage-065-4e7023c4',
  linuxArm64AppImage: 'linux-arm64-appimage-065-4e7023c4'
};
function readPinned(manifest, pin) {
  const bytes = fs.readFileSync(`public${manifest.localPath}`);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), pin[0], manifest.localPath);
  assert.equal(bytes.length, pin[1]);
  assert.equal(manifest.sha256, pin[0]);
  assert.equal(manifest.bytes, bytes.length);
  assert.equal(manifest.url, `https://downloads.ynxweb4.com/wallet/sha256-${manifest.sha256}/${manifest.localPath.split('/').pop()}`);
  return JSON.parse(bytes);
}

export function verifyWalletDownloadMetadata(downloads = currentWalletDownloads, registry = JSON.parse(fs.readFileSync('public/releases/ecosystem-release-registry.json')).products.find(p => p.key === 'wallet')) {
  const archives = archivedManifests.map((m, i) => readPinned(m, archivePins[i]));
  const [sdk, preview] = WALLET_CANONICAL_MANIFESTS.map((m, i) => readPinned(m, canonicalPins[i]));
  assert.equal(preview.aggregateId, 'wallet-published-17-history-11-active-r3');
  assert.equal(preview.status, 'published-files-verified');
  assert.equal(preview.aggregateMetadataPubliclyHosted, true);
  assert.equal(preview.hosting, 'static-artifact-files-only');
  assert.equal(preview.artifacts.length, 11);
  assert.equal(sdk.artifacts.length, 10);
  assert.deepEqual(registry.downloadManifests, WALLET_CANONICAL_MANIFESTS);
  assert.deepEqual(registry.downloadManifestArchive, archivedManifests);
  assert.deepEqual(registry.downloadReleaseBatches, [...new Set(preview.artifacts.map(a => a.sourceReleaseId))]);
  assert.equal(registry.downloadAggregateId, preview.aggregateId);
  assert.equal(registry.downloadHistory, WALLET_DOWNLOAD_HISTORY_PATH);
  assert.equal(registry.currentDownloadCount, 11);
  assert.equal(registry.publishedDownloadHistoryCount, 17);
  for (const key of ['centralAccepted', 'fullInstalledE2E', 'productionSigned', 'storeReleased', 'pwaDeployed']) assert.equal(registry[key], false, key);
  assert.deepEqual(Object.keys(downloads).sort(), [...expectedKeys].sort());
  assert.deepEqual(sdk.artifacts.map(a => a.id).sort(), preview.artifacts.filter(a => a.platform !== 'pwa-archive').map(a => a.id).sort());
  for (const [slot, item] of Object.entries(downloads)) {
    if (overlayKeys.has(slot)) {
      assert.deepEqual(item, currentWalletDownloads[slot], `${slot} current website overlay`);
      const evidence = JSON.parse(fs.readFileSync(`public${item.publicationEvidence}`));
      if (slot === 'android' || slot === 'androidUniversal') {
        verifyWalletAndroidPublication(evidence);
        for (const key of ['id', 'version', 'versionCode', 'architecture', 'installation', 'artifactPath', 'sizeBytes', 'sha256', 'sourceCommit', 'publicUrl', 'fallbackUrl', 'releaseTag', 'publicationEvidence', 'signingClass', 'releaseBatch', 'installProof', 'mimeType', 'releaseImmutable', 'publisherCanReplaceAssets', 'downloadTimeSha256Verified', 'releaseMetadataObservedAt', 'walletConnectRelayE2E', 'liveChainTransferExecuted', 'installedFinanceE2E', 'previousRelease']) assert.equal(item[key], evidence[key], `${slot}.${key}`);
      } else if (['windowsX64', 'windowsArm64', 'linuxX64Deb', 'linuxArm64Deb', 'macos'].includes(slot)) {
        const asset = evidence.assets.find(candidate => candidate.filename === item.artifactPath);
        assert.ok(asset, `${slot} release asset`);
        assert.equal(item.version, evidence.version, `${slot}.version`);
        assert.equal(item.sourceCommit, evidence.sourceCommit, `${slot}.sourceCommit`);
        assert.equal(item.sizeBytes, asset.bytes, `${slot}.sizeBytes`);
        assert.equal(item.sha256, asset.sha256, `${slot}.sha256`);
        assert.equal(item.releaseTag, evidence.releaseTag, `${slot}.releaseTag`);
        assert.equal(item.fallbackUrl, asset.githubUrl, `${slot}.fallbackUrl`);
      } else {
        const asset = evidence.artifacts.find(candidate => candidate.filename === item.artifactPath);
        assert.ok(asset, `${slot} Wallet Web release asset`);
        assert.equal(item.sourceCommit, evidence.sourceCommit, `${slot}.sourceCommit`);
        assert.equal(item.sizeBytes, asset.bytes, `${slot}.sizeBytes`);
        assert.equal(item.sha256, asset.sha256, `${slot}.sha256`);
        assert.equal(item.publicUrl, asset.websiteUrl, `${slot}.publicUrl`);
      }
      for (const key of ['productionSigned', 'storeReleased', 'fullInstalledE2E', 'newWalletGoalsAccepted', 'historicalPreview']) assert.equal(item[key], false, `${slot}.${key}`);
      for (const key of ['canonicalDownload', 'downloadApproved', 'publicDownloadVerified']) assert.equal(item[key], true, `${slot}.${key}`);
      continue;
    }
    assert.equal(item.id, legacySlots[slot], slot);
    const source = preview.artifacts.find(a => a.id === item.id);
    for (const [key, sourceKey] of Object.entries({ publicUrl: 'url', artifactPath: 'filename', sizeBytes: 'bytes', sha256: 'sha256', sourceCommit: 'sourceCommit', architecture: 'architecture', installation: 'installation', targetPlatform: 'platform', mimeType: 'mimeType', observedHTTPContentType: 'observedHTTPContentType', releaseBatch: 'sourceReleaseId', publicationReceiptSHA256: 'publicationReceiptSHA256' })) assert.equal(item[key], source[sourceKey], `${item.id}.${key}`);
    assert.match(item.sourceCommit, /^[a-f0-9]{40}$/);
    assert.match(item.sha256, /^[a-f0-9]{64}$/);
    assert.equal(item.publicUrl, `https://downloads.ynxweb4.com/wallet/sha256-${item.sha256}/${item.artifactPath}`);
    assert.equal(item.publicationReceiptSHA256, preview.publicationProofs.find(p => p.releaseId === item.releaseBatch).receiptSHA256);
    assert.deepEqual(item.limitedInstalledEvidence, source.limitedInstalledEvidence);
    for (const key of ['productionSigned', 'storeReleased', 'fullInstalledE2E', 'newWalletGoalsAccepted', 'pwaDeployed', 'historicalPreview']) assert.equal(item[key], false, `${item.id}.${key}`);
    for (const key of ['canonicalDownload', 'downloadApproved', 'publicDownloadVerified']) assert.equal(item[key], true, `${item.id}.${key}`);
    assert.equal(item.canonicalAggregateId, preview.aggregateId);
    assert.equal(item.launchURL, null);
    assert.equal(item.publicationEvidence, WALLET_CANONICAL_MANIFESTS[1].localPath);
    assert.equal(item.previewManifest, WALLET_CANONICAL_MANIFESTS[1].url);
    const sdkItem = sdk.artifacts.find(a => a.id === item.id);
    if (item.targetPlatform === 'pwa-archive') {
      assert.equal(sdkItem, undefined);
      assert.equal(item.sdkManifest, undefined, 'PWA is a preview-only archive');
    } else {
      assert.equal(item.sdkManifest, WALLET_CANONICAL_MANIFESTS[0].url);
      for (const key of ['url', 'sha256', 'bytes', 'sourceCommit', 'architecture', 'installation']) assert.equal(sdkItem[key], source[key], `${item.id}.SDK.${key}`);
    }
    if (['windows', 'linux'].includes(item.targetPlatform)) assert.equal(item.version, '0.6.5');
    else if (item.targetPlatform === 'android') { assert.equal(item.version, '1.0.7'); assert.equal(item.versionCode, 8); }
    else if (item.targetPlatform === 'macos') assert.equal(item.version, '0.6.4');
    else assert.equal(item.version, undefined, 'browser/PWA versions must not be invented');
  }
  const history = JSON.parse(fs.readFileSync(`public${WALLET_DOWNLOAD_HISTORY_PATH}`));
  const r8Record = preview.publicationProofs.find(p => p.releaseId === 'wallet-static-20260906-r8-windows-arm64').publicMetadata.find(m => m.id === 'website-preview-metadata');
  const r8 = readPinned({ ...r8Record, localPath: '/releases/wallet-downloads/20260906-r8-windows-arm64/ynx-wallet-download-preview-metadata.json' }, [r8Record.sha256, r8Record.bytes]);
  const superseded = [...archives[1].artifacts.map(a => ({ ...a, sourceReleaseId: 'wallet-static-20260906-r2a' })), ...r8.artifacts.map(a => ({ ...a, sourceReleaseId: 'wallet-static-20260906-r8-windows-arm64' }))];
  assert.deepEqual(history.artifacts, [...preview.artifacts.map(a => ({ ...a, selectionState: 'current' })), ...superseded.map(a => ({ ...a, selectionState: 'superseded', downloadApproved: false, historicalPreview: true }))]);
  assert.equal(history.totalPublishedHistoryCount, 17);
  assert.equal(history.activeCount, 11);
  assert.equal(history.supersededCount, 6);
  assert.equal(new Set(history.artifacts.map(a => a.id)).size, 17);
  assert.deepEqual(history.publicationProofs, preview.publicationProofs);
  assert.equal(history.publicationProofs.reduce((n, p) => n + p.artifactCount, 0), 17);
  // Upstream publication counts stay immutable. Website safety selection is a separate overlay.
  assert.deepEqual(WALLET_APPIMAGE_HELD_SHA256, safetyPins);
  assert.equal(WALLET_APPIMAGE_ADVISORY.href, 'https://github.com/electron-userland/electron-builder/security/advisories/GHSA-7g7r-gx96-252g');
  const safetyPolicy = JSON.parse(fs.readFileSync(`public${WALLET_DOWNLOAD_SAFETY_POLICY_PATH}`));
  assert.equal(safetyPolicy.scope, 'website-download-selection');
  assert.equal(safetyPolicy.upstreamCurrentDownloadCount, 11);
  assert.equal(safetyPolicy.websiteSelectableCount, 9);
  assert.equal(safetyPolicy.withheldCurrentCount, 2);
  assert.equal(safetyPolicy.withheldHistoricalCount, 2);
  assert.equal(safetyPolicy.upstreamManifestsChanged, false);
  assert.equal(safetyPolicy.upstreamHistoryChanged, false);
  assert.equal(safetyPolicy.installedAppImageVerified, false);
  assert.equal(safetyPolicy.fixedReplacementVerified, false);
  assert.deepEqual(safetyPolicy.advisory, WALLET_APPIMAGE_ADVISORY);
  assert.deepEqual(safetyPolicy.heldSHA256, safetyPins);
  assert.deepEqual(safetyPolicy.currentHeldSHA256, safetyPins.slice(0, 2));
  assert.deepEqual(safetyPolicy.historicalHeldSHA256, safetyPins.slice(2));
  assert.deepEqual(safetyPolicy.upstreamManifests, WALLET_CANONICAL_MANIFESTS.map(({ url, sha256, bytes }) => ({ url, sha256, bytes })));
  const websiteChoices = Object.entries(downloads).filter(([platform, item]) => walletDownloadState(platform, { ...item, href: item.publicUrl, downloadHosted: true }).available);
  assert.equal(websiteChoices.length, 9);
  assert.equal(new Set(websiteChoices.map(([, item]) => item.publicUrl)).size, 8, 'Android and Android Universal intentionally share one universal APK');
  for (const artifact of history.artifacts.filter(item => safetyPins.includes(item.sha256))) {
    const selection = walletDownloadState('linuxX64AppImage', { ...artifact, href: artifact.url, canonicalDownload: true, historicalPreview: false, downloadApproved: true, downloadHosted: true, sizeBytes: artifact.bytes, publicationEvidence: WALLET_CANONICAL_MANIFESTS[1].localPath, signingClass: 'preview' });
    assert.equal(selection.available, false, `${artifact.id} cannot be re-promoted`);
    assert.equal(selection.safetyHold?.id, WALLET_APPIMAGE_ADVISORY.id);
    assert.equal(selection.filename, null);
  }
  return { files: 11, manifests: 2, publishedHistory: 17, superseded: 6, websiteSelectable: 9, securityPaused: 2 };
}
