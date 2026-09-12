import test from 'node:test';import assert from 'node:assert/strict';
import {WALLET_DESKTOP068} from '../src/content/walletDesktop068.js';
import {walletDownloadState} from '../src/lib/walletDownloads.js';
import {getCatalog} from '../src/lib/ecosystemCatalog.js';
test('five exact Desktop 0.6.8 releases are selected without broadening GitHub trust',()=>{
 const wallet=getCatalog().find(x=>x.key==='wallet');
 for(const [platform,expected] of Object.entries(WALLET_DESKTOP068)){
  const item=wallet.downloads[platform];assert.equal(item.href,expected.publicUrl);assert.equal(walletDownloadState(platform,item).available,true);
  for(const patch of [{href:expected.publicUrl+'?other=1'},{sha256:'0'.repeat(64)},{sizeBytes:1},{sourceCommit:'0'.repeat(40)}]) assert.equal(walletDownloadState(platform,{...item,...patch}).available,false);
 }
 for(const platform of ['linuxX64AppImage','linuxArm64AppImage']) assert.equal(walletDownloadState(platform,wallet.downloads[platform]).available,false);
 assert.equal(wallet.downloads.android.versionCode,15);
});
