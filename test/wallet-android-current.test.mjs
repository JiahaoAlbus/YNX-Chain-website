import test from 'node:test';
import assert from 'node:assert/strict';
import { WALLET_ANDROID22 } from '../src/content/walletAndroid22.js';
import { walletDownloadState } from '../src/lib/walletDownloads.js';
import { getCatalog } from '../src/lib/ecosystemCatalog.js';
test('Android22 public selection uses the exact verified release and distinct installation evidence',()=>{
 const item=getCatalog().find(p=>p.key==='wallet').downloads.android;
 assert.equal(item.sha256,WALLET_ANDROID22.sha256);
 assert.equal(item.sizeBytes,116631255);
 const state=walletDownloadState('android',item);
 assert.equal(state.available,true);assert.equal(state.installProofKey,'android22Proof');assert.equal(state.fallbackHref,WALLET_ANDROID22.fallbackUrl);
 for(const patch of [{sizeBytes:1},{versionCode:21},{productionSigned:true},{storeReleased:true},{releaseImmutable:true},{publisherCanReplaceAssets:false},{downloadTimeSha256Verified:true}]) assert.equal(walletDownloadState('android',{...item,...patch}).available,false);
 for(const patch of [{href:item.href+'?other=1'},{sha256:'0'.repeat(64)},{sourceCommit:'0'.repeat(40)}]) assert.equal(walletDownloadState('android',{...item,...patch}).available,false);
 for(const patch of [{fallbackUrl:item.fallbackUrl+'?other=1'},{releaseTag:'other'}]) assert.equal(walletDownloadState('android',{...item,...patch}).available,false);
});

test('Android22 rejects a coordinated filename and fallback substitution under the same tag',()=>{
 const item=getCatalog().find(p=>p.key==='wallet').downloads.android;
 const artifactPath='ynx-wallet-1.0.16-testnet-preview-e9816a827-local-test-signed.aab';
 const fallbackUrl=`https://github.com/JiahaoAlbus/YNX-Chain/releases/download/${item.releaseTag}/${artifactPath}`;
 for(const platform of ['android','androidUniversal']){
  const state=walletDownloadState(platform,{...item,artifactPath,fallbackUrl});
  assert.equal(state.available,false);
  assert.equal(state.fallbackHref,null);
 }
});
