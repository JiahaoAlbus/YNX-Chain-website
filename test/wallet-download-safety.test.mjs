import assert from 'node:assert/strict';
import test from 'node:test';
import { WALLET_CANONICAL_DOWNLOADS } from '../src/content/walletCanonicalDownloads.js';
import { WALLET_DESKTOP_DOWNLOADS } from '../src/content/walletDesktopDownloads.js';
import { walletDownloadState } from '../src/lib/walletDownloads.js';
import { walletDownloadSafetyHold } from '../src/lib/walletDownloadSafety.js';

const held = [
  '3ba16d0372021471e13733425eaa39b155c122175e5bdcbc0e39b2554c199b00',
  '66dde56c9f8da969e9916d72c8929add581b1a0ea0695cd70a2e9fcb3c960a72',
  'dcaf1372b29e6d3cb58f9a37d3db3b6fcb45aa9e13feff1c7c247bf283cd9893',
  '5664be113dea0e06862fcc8e6d1918de86a60197d7ca1906bbb30e8e5b3c4183'
];

test('all four affected AppImages remain paused even when old bytes are re-promoted or relabeled', () => {
  const knownFiles = [...Object.values(WALLET_CANONICAL_DOWNLOADS), ...Object.values(WALLET_DESKTOP_DOWNLOADS)];
  for (const sha256 of held) {
    const file = knownFiles.find(item => item.sha256 === sha256);
    assert.ok(file, sha256);
    const promoted = { ...file, href: file.publicUrl, downloadHosted: true, canonicalDownload: true, historicalPreview: false, downloadApproved: true };
    for (const platform of ['linuxX64AppImage', 'linuxArm64AppImage', 'windowsX64']) {
      const state = walletDownloadState(platform, { ...promoted, installation: 'exe' });
      assert.equal(state.available, false, `${platform}:${sha256}`);
      assert.equal(state.filename, null);
      assert.equal(state.safetyHold?.id, 'GHSA-7g7r-gx96-252g');
    }
    assert.ok(walletDownloadSafetyHold({ sha256: sha256.toUpperCase() }));
  }
});

test('the exact safety hold leaves ten current choices and does not certify other or rebuilt files', () => {
  const choices = Object.entries(WALLET_CANONICAL_DOWNLOADS).filter(([platform, item]) => walletDownloadState(platform, { ...item, href: item.publicUrl, downloadHosted: true }).available);
  assert.deepEqual(choices.map(([platform]) => platform).sort(), ['android', 'androidUniversal', 'windowsX64', 'windowsArm64', 'linuxX64Deb', 'linuxArm64Deb', 'macos', 'chromeEdge', 'pwa', 'firefox'].sort());
  for (const [, item] of choices) assert.equal(walletDownloadSafetyHold(item), null);
  assert.equal(walletDownloadSafetyHold({ installation: 'appimage', version: '0.6.5', sha256: 'a'.repeat(64) }), null, 'an unknown replacement is not a known affected identity');
  assert.equal(walletDownloadState('linuxX64AppImage', { installation: 'appimage', sha256: 'a'.repeat(64) }).available, false, 'not being held is insufficient publication evidence');
});

test('current Wallet Web choices bind the rebuilt source, immutable website path and exact bytes', () => {
  const expected = {
    pwa: ['0afb5a3a623fb9ddbcd82519114e669736c3670c261759182fefeec7a02d7773', 867602, 'ynx-wallet-web-pwa-0.1.15.zip'],
    chromeEdge: ['9d86f0f9505c428218190d4e3b0ef7ceb9a15b2d6e81e292c1f0136f44b9658e', 665236, 'ynx-wallet-chrome-edge-0.1.15.zip'],
    firefox: ['ec1b5b48b732b568aa43ec2da7b25bedc28bc1c33e2dee7280a5da27c4f508c5', 665335, 'ynx-wallet-firefox-0.1.15.zip']
  };
  for (const [platform, [sha256, sizeBytes, filename]] of Object.entries(expected)) {
    const item = WALLET_CANONICAL_DOWNLOADS[platform];
    assert.equal(item.sourceCommit, '661c4daee8af638e16eaf6fb1ba8fa9ff10012ed');
    assert.equal(item.sha256, sha256);
    assert.equal(item.sizeBytes, sizeBytes);
    assert.equal(item.artifactPath, filename);
    assert.equal(item.publicUrl, `https://www.ynxweb4.com/downloads/wallet-web/sha256-${sha256}/${filename}`);
    assert.equal(walletDownloadState(platform, { ...item, href: item.publicUrl, downloadHosted: true }).available, true);
  }
});
