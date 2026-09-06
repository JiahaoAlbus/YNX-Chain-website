import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { WALLET_DESKTOP_DOWNLOADS, WALLET_DESKTOP_MANIFESTS } from '../../src/content/walletDesktopDownloads.js';
import { WALLET_BROWSER_DOWNLOADS, WALLET_BROWSER_MANIFESTS } from '../../src/content/walletBrowserDownloads.js';
import { WALLET_ANDROID_DOWNLOADS, WALLET_ANDROID_MANIFESTS } from '../../src/content/walletAndroidDownloads.js';

export const currentWalletDownloads = { ...WALLET_DESKTOP_DOWNLOADS, ...WALLET_BROWSER_DOWNLOADS, ...WALLET_ANDROID_DOWNLOADS };
const manifests = [...WALLET_DESKTOP_MANIFESTS, ...WALLET_BROWSER_MANIFESTS, ...WALLET_ANDROID_MANIFESTS];
// Pins are the exact small public GETs authorized by Central, independent of consumer metadata.
const pins = [
  ['c510fcd2b72eb2a6f7c07188e32161e9bcd4d6b4f79a131f5f7a213c46c9bfd3', 2926],
  ['cc80de8cee26e3e30a9d47ccbd46419793c7680590e166fc98293513b0f7633e', 8591],
  ['7b5a3ecfec00501cbd0ab387c1e14e1cc6f6cc77689bad0c74cbe8fd316f0399', 644],
  ['814574df0d3e8e689d10446ee7358938a1ce407afcee249be1b5ba7d0a964887', 5256],
  ['dd2932d9e67867e167d6a586cad101ead825d7f9e17b7152dcf2cbc0c6825bac', 685],
  ['f14af90c79caac046ee5e283e96c4ebce9d50d323dcaeef9df774594da781cd2', 3324]
];

export function verifyWalletDownloadMetadata(downloads = currentWalletDownloads, registry = JSON.parse(fs.readFileSync('public/releases/ecosystem-release-registry.json')).products.find(p => p.key === 'wallet')) {
  const documents = manifests.map((manifest, i) => {
    const bytes = fs.readFileSync(`public${manifest.localPath}`);
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), pins[i][0], manifest.localPath);
    assert.equal(bytes.length, pins[i][1], manifest.localPath);
    assert.equal(manifest.sha256, pins[i][0]);
    assert.equal(manifest.bytes, bytes.length);
    assert.equal(manifest.url, `https://downloads.ynxweb4.com/wallet/sha256-${manifest.sha256}/${manifest.localPath.split('/').pop()}`);
    return JSON.parse(bytes);
  });
  assert.deepEqual(registry.downloadManifests, manifests);
  assert.deepEqual(registry.downloadReleaseBatches, documents.filter((_, i) => i % 2).map(d => d.releaseId));
  assert.equal(registry.centralAccepted, false);
  for (const key of ['fullInstalledE2E', 'productionSigned', 'storeReleased', 'pwaDeployed']) assert.equal(registry[key], false, key);
  const sources = documents.filter((_, i) => i % 2).flatMap(d => {
    assert.equal(d.status, 'published-files-verified');
    assert.equal(d.hosting, 'static-artifact-files-only');
    assert.equal(d.accessContract.integratedAllProducts, false);
    return d.artifacts.map(a => ({ ...a, releaseBatch: d.releaseId }));
  });
  assert.equal(sources.length, 8);
  assert.equal(Object.keys(downloads).length, 8);
  assert.equal(new Set(Object.values(downloads).map(a => a.id)).size, 8);
  for (const item of Object.values(downloads)) {
    const source = sources.find(a => a.id === item.id);
    assert.ok(source, item.id);
    for (const [key, sourceKey] of Object.entries({ publicUrl: 'url', artifactPath: 'filename', sizeBytes: 'bytes', sha256: 'sha256', sourceCommit: 'sourceCommit', architecture: 'architecture', installation: 'installation', targetPlatform: 'platform', mimeType: 'mimeType', releaseBatch: 'releaseBatch' })) assert.equal(item[key], source[sourceKey], `${item.id}.${key}`);
    assert.match(item.sourceCommit, /^[a-f0-9]{40}$/);
    assert.match(item.sha256, /^[a-f0-9]{64}$/);
    assert.equal(item.publicUrl, `https://downloads.ynxweb4.com/wallet/sha256-${item.sha256}/${item.artifactPath}`);
    for (const key of ['productionSigned', 'storeReleased', 'fullInstalledE2E', 'newWalletGoalsAccepted', 'pwaDeployed', 'historicalPreview']) assert.equal(item[key], false, `${item.id}.${key}`);
    for (const key of ['downloadApproved', 'publicDownloadVerified']) assert.equal(item[key], true, `${item.id}.${key}`);
    assert.equal(item.launchURL, null);
    const previewIndex = documents.findIndex(d => d.releaseId === item.releaseBatch);
    assert.equal(item.publicationEvidence, manifests[previewIndex].localPath);
    assert.equal(item.previewManifest, manifests[previewIndex].url);
    const sdkItem = documents[previewIndex - 1].artifacts.find(a => a.id === item.id);
    if (item.targetPlatform === 'pwa-archive') {
      assert.equal(sdkItem, undefined, 'PWA is intentionally not supported by SDK schema 1');
      assert.equal(item.sdkManifest, undefined, 'PWA must cite its own preview record');
    } else {
      assert.ok(sdkItem, item.id);
      assert.equal(item.sdkManifest, manifests[previewIndex - 1].url);
      for (const key of ['url', 'sha256', 'bytes', 'sourceCommit', 'architecture', 'installation']) assert.equal(sdkItem[key], source[key], `${item.id}.SDK.${key}`);
    }
  }
  assert.equal(downloads.android.version, '1.0.7');
  assert.equal(downloads.android.versionCode, 8);
  assert.deepEqual(downloads.android.limitedInstalledEvidence, sources.find(a => a.platform === 'android').limitedInstalledEvidence);
  assert.equal(downloads.android.limitedInstalledEvidence.latestProductLoginRerun, false);
  assert.equal(downloads.android.limitedInstalledEvidence.realHardwareVerified, false);
  return { files: sources.length, manifests: documents.length };
}
