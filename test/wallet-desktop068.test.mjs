import test from 'node:test';import assert from 'node:assert/strict';
import {WALLET_DESKTOP068} from '../src/content/walletDesktop068.js';
import {WALLET_DESKTOP069_WINDOWS_X64} from '../src/content/walletDesktop069.js';
import {WALLET_DESKTOP0618_WINDOWS_X64,WALLET_DESKTOP0618_WINDOWS_ARM64} from '../src/content/walletDesktop0618.js';
import {walletDownloadState} from '../src/lib/walletDownloads.js';
import {getCatalog} from '../src/lib/ecosystemCatalog.js';
test('Desktop 0.6.8 and 0.6.9 remain immutable while Windows x64 and ARM64 select exact 0.6.18',()=>{
 const wallet=getCatalog().find(x=>x.key==='wallet');
 for(const [platform,expected] of Object.entries(WALLET_DESKTOP068)){
  if(['windowsX64','windowsArm64'].includes(platform)){
   assert.notEqual(wallet.downloads[platform].sha256,expected.sha256);
   assert.equal(walletDownloadState(platform,{...wallet.downloads[platform],href:expected.publicUrl,sha256:expected.sha256,sourceCommit:expected.sourceCommit,sizeBytes:expected.sizeBytes}).available,false);
   continue;
  }
  const item=wallet.downloads[platform];assert.equal(item.href,expected.publicUrl);assert.equal(walletDownloadState(platform,item).available,true);
  assert.equal(walletDownloadState(platform,item).fallbackHref,expected.fallbackUrl);assert.ok(expected.fallbackUrl.endsWith('/'+expected.releaseTag+'/'+expected.artifactPath));
  for(const patch of [{href:expected.publicUrl+'?other=1'},{sha256:'0'.repeat(64)},{sizeBytes:1},{sourceCommit:'0'.repeat(40)}]) assert.equal(walletDownloadState(platform,{...item,...patch}).available,false);
  for(const patch of [{fallbackUrl:expected.fallbackUrl+'?redirect=1'},{fallbackUrl:expected.fallbackUrl.replace('github.com','example.com')},{releaseTag:'other'}]) assert.equal(walletDownloadState(platform,{...item,...patch}).available,false);
 }
 assert.equal(WALLET_DESKTOP069_WINDOWS_X64.version,'0.6.9');
 const current=WALLET_DESKTOP0618_WINDOWS_X64;
 const item=wallet.downloads.windowsX64;
 assert.equal(item.href,current.publicUrl);assert.equal(walletDownloadState('windowsX64',item).available,true);
 assert.equal(walletDownloadState('windowsX64',item).fallbackHref,current.fallbackUrl);
 assert.equal(walletDownloadState('windowsX64',item).limitationKey,'desktop0618Boundary');
 assert.equal(walletDownloadState('windowsX64',item).installProofKey,'desktop0618Proof');
 for(const patch of [{href:current.publicUrl+'?other=1'},{sha256:'0'.repeat(64)},{sizeBytes:1},{sourceCommit:'0'.repeat(40)}]) assert.equal(walletDownloadState('windowsX64',{...item,...patch}).available,false);
 for(const platform of ['linuxX64AppImage','linuxArm64AppImage']) assert.equal(walletDownloadState(platform,wallet.downloads[platform]).available,false);
 assert.equal(wallet.downloads.android.versionCode,34);
});

test("Windows ARM64 0.6.18 pins its own installer and does not inherit x64 upgrade proof",()=>{const item=getCatalog().find(x=>x.key==="wallet").downloads.windowsArm64;const p=WALLET_DESKTOP0618_WINDOWS_ARM64;assert.equal(item.href,p.publicUrl);assert.equal(walletDownloadState("windowsArm64",item).available,true);assert.equal(walletDownloadState("windowsArm64",item).installProofKey,"desktop0618ArmProof");assert.equal(walletDownloadState("windowsArm64",{...item,sha256:WALLET_DESKTOP0618_WINDOWS_X64.sha256}).available,false);});
