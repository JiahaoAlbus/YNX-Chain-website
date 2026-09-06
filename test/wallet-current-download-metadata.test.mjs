import assert from 'node:assert/strict';
import test from 'node:test';
import { currentWalletDownloads, verifyWalletDownloadMetadata } from '../scripts/lib/verify-wallet-download-metadata.mjs';
import { walletDownloadState } from '../src/lib/walletDownloads.js';

const clone = () => structuredClone(currentWalletDownloads);

test('eight current packages are bound to six exact public manifests and keep installed acceptance separate', () => {
  assert.deepEqual(verifyWalletDownloadMetadata(), { files: 8, manifests: 6 });
  for (const [platform, item] of Object.entries(currentWalletDownloads)) {
    const state = walletDownloadState(platform, { ...item, href: item.publicUrl, downloadHosted: true });
    assert.equal(state.available, true, platform);
    assert.equal(state.filename, item.artifactPath);
    assert.ok(state.installProofKey && state.signingKey, platform);
  }
  const android = currentWalletDownloads.android;
  assert.equal(walletDownloadState('android', android).requirements, 'Android · ARM64 · APK');
  assert.equal(walletDownloadState('firefox', { ...currentWalletDownloads.chromeEdge, href: currentWalletDownloads.chromeEdge.publicUrl, downloadHosted: true }).available, false, 'Firefox permission hold cannot reuse a hosted Chromium ZIP');
});

test('manifest verification rejects substituted bytes, architecture, evidence, release claims and unsupported SDK promotion', () => {
  for (const [platform, field, value] of [
    ['windowsX64', 'sizeBytes', 1], ['linuxArm64Deb', 'architecture', 'x64'],
    ['linuxX64AppImage', 'sha256', '0'.repeat(64)], ['chromeEdge', 'sourceCommit', '0'.repeat(40)],
    ['chromeEdge', 'fullInstalledE2E', true], ['pwa', 'pwaDeployed', true],
    ['pwa', 'launchURL', 'https://wallet.ynxweb4.com/'], ['pwa', 'sdkManifest', currentWalletDownloads.chromeEdge.sdkManifest],
    ['android', 'versionCode', 7], ['android', 'productionSigned', true],
    ['android', 'publicUrl', currentWalletDownloads.android.publicUrl.replace('arm64', 'universal') + '?file=universal'],
    ['android', 'publicationEvidence', '/releases/historical.json']
  ]) {
    const changed = clone(); changed[platform][field] = value;
    assert.throws(() => verifyWalletDownloadMetadata(changed), undefined, `${platform}.${field}`);
  }
  const changed = clone(); changed.android.limitedInstalledEvidence.realHardwareVerified = true;
  assert.throws(() => verifyWalletDownloadMetadata(changed), undefined, 'emulator proof cannot become Pixel acceptance');
});
