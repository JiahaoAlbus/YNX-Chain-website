import assert from 'node:assert/strict';
import test from 'node:test';
import { currentWalletDownloads, verifyWalletDownloadMetadata } from '../scripts/lib/verify-wallet-download-metadata.mjs';
import { walletDownloadState } from '../src/lib/walletDownloads.js';

const clone = () => structuredClone(currentWalletDownloads);

test('eleven current packages are bound to two canonical public manifests and keep installed acceptance separate', () => {
  assert.deepEqual(verifyWalletDownloadMetadata(), { files: 11, manifests: 2, publishedHistory: 17, superseded: 6, websiteSelectable: 9, securityPaused: 2 });
  for (const [platform, item] of Object.entries(currentWalletDownloads)) {
    const state = walletDownloadState(platform, { ...item, href: item.publicUrl, downloadHosted: true });
    const held = ['linuxX64AppImage', 'linuxArm64AppImage'].includes(platform);
    assert.equal(state.available, !held, platform);
    assert.equal(state.filename, held ? null : item.artifactPath);
    assert.equal(Boolean(state.safetyHold), held, platform);
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
    ['android', 'publicationEvidence', '/releases/historical.json'],
    ['macos', 'notarized', true], ['macos', 'developerIdSigned', true],
    ['macos', 'spctlAccepted', true], ['macos', 'fullInstalledE2E', true],
    ['macos', 'sourceCommit', '5a6b033897a1295d35fc325a92c6bb81c8b04a19'],
    ['macos', 'architecture', 'arm64'], ['androidUniversal', 'architecture', 'arm64'],
    ['windowsArm64', 'version', '0.6.4'], ['pwa', 'version', '0.6.5'],
    ['linuxArm64AppImage', 'limitedInstalledEvidence', { appImageBuildOnly: false, thisFormatInstalledOnNativeCI: true }],
    ['androidUniversal', 'limitedInstalledEvidence', { otherABIsInstalledVerified: true, realHardwareVerified: true }]
  ]) {
    const changed = clone(); changed[platform][field] = value;
    assert.throws(() => verifyWalletDownloadMetadata(changed), undefined, `${platform}.${field}`);
  }
  const changed = clone(); changed.android.limitedInstalledEvidence.realHardwareVerified = true;
  assert.throws(() => verifyWalletDownloadMetadata(changed), undefined, 'emulator proof cannot become Pixel acceptance');
});
