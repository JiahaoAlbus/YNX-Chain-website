import test from 'node:test';import assert from 'node:assert/strict';
import {WALLET_DESKTOP068} from '../src/content/walletDesktop068.js';
import {WALLET_DESKTOP069_WINDOWS_X64} from '../src/content/walletDesktop069.js';
import {walletDownloadState} from '../src/lib/walletDownloads.js';
import {getCatalog} from '../src/lib/ecosystemCatalog.js';
test('Desktop 0.6.8 remains immutable while only Windows x64 selects exact 0.6.9',()=>{
 const wallet=getCatalog().find(x=>x.key==='wallet');
 for(const [platform,expected] of Object.entries(WALLET_DESKTOP068)){
  if(platform==='windowsX64'){
   assert.notEqual(wallet.downloads.windowsX64.sha256,expected.sha256);
   assert.equal(walletDownloadState(platform,{...wallet.downloads.windowsX64,href:expected.publicUrl,sha256:expected.sha256,sourceCommit:expected.sourceCommit,sizeBytes:expected.sizeBytes}).available,false);
   continue;
  }
  const item=wallet.downloads[platform];assert.equal(item.href,expected.publicUrl);assert.equal(walletDownloadState(platform,item).available,true);
  assert.equal(walletDownloadState(platform,item).fallbackHref,expected.fallbackUrl);assert.ok(expected.fallbackUrl.endsWith('/'+expected.releaseTag+'/'+expected.artifactPath));
  for(const patch of [{href:expected.publicUrl+'?other=1'},{sha256:'0'.repeat(64)},{sizeBytes:1},{sourceCommit:'0'.repeat(40)}]) assert.equal(walletDownloadState(platform,{...item,...patch}).available,false);
  for(const patch of [{fallbackUrl:expected.fallbackUrl+'?redirect=1'},{fallbackUrl:expected.fallbackUrl.replace('github.com','example.com')},{releaseTag:'other'}]) assert.equal(walletDownloadState(platform,{...item,...patch}).available,false);
 }
 const current=WALLET_DESKTOP069_WINDOWS_X64;
 const item=wallet.downloads.windowsX64;
 assert.equal(item.href,current.publicUrl);assert.equal(walletDownloadState('windowsX64',item).available,true);
 assert.equal(walletDownloadState('windowsX64',item).fallbackHref,current.fallbackUrl);
 assert.equal(walletDownloadState('windowsX64',item).limitationKey,'desktop069Boundary');
 assert.equal(walletDownloadState('windowsX64',item).installProofKey,'desktop069Proof');
 for(const patch of [{href:current.publicUrl+'?other=1'},{sha256:'0'.repeat(64)},{sizeBytes:1},{sourceCommit:'0'.repeat(40)}]) assert.equal(walletDownloadState('windowsX64',{...item,...patch}).available,false);
 for(const platform of ['linuxX64AppImage','linuxArm64AppImage']) assert.equal(walletDownloadState(platform,wallet.downloads[platform]).available,false);
 assert.equal(wallet.downloads.android.versionCode,27);
});
