import { WALLET_ANDROID15 } from "../src/content/walletAndroid15.js";
import test from 'node:test';
import assert from 'node:assert/strict';
import { getCatalog } from '../src/lib/ecosystemCatalog.js';
import { getDownloadDirectoryProduct } from '../src/lib/downloadDirectory.js';

test('unreleased packages and health URLs cannot bypass the directory release decision', () => {
  const social = getDownloadDirectoryProduct(getCatalog().find(p => p.key === 'social'));
  assert.equal(social.downloads.android.href, null);
  assert.equal(social.downloads.web.href, null);
  assert.equal(social.hasDownload, false);
  assert.notEqual(social.status, 'live');
});
test('unregistered products cannot claim public availability from catalog defaults', () => {
  const quant = getDownloadDirectoryProduct(getCatalog().find(p => p.key === 'quant'));
  assert.equal(quant.downloads.web.href, null);
  assert.equal(quant.status, 'not-ready');
});
test('approved files remain direct downloads while blocked files keep their reason', () => {
  const wallet = getDownloadDirectoryProduct(getCatalog().find(p => p.key === 'wallet'));
  assert.equal(wallet.downloads.android.href, WALLET_ANDROID15.publicUrl);
  assert.equal(wallet.downloads.linuxX64AppImage.href, null);
  assert.match(wallet.downloads.linuxX64AppImage.sha256, /^[a-f0-9]{64}$/);
  assert.equal(wallet.hasDownload, true);
});
