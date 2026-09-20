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
 for(const patch of [{sizeBytes:1},{versionCode:21},{productionSigned:true},{storeReleased:true}]) assert.equal(walletDownloadState('android',{...item,...patch}).available,false);
 for(const patch of [{href:item.href+'?other=1'},{sha256:'0'.repeat(64)},{sourceCommit:'0'.repeat(40)}]) assert.equal(walletDownloadState('android',{...item,...patch}).available,false);
 for(const patch of [{fallbackUrl:item.fallbackUrl+'?other=1'},{releaseTag:'other'}]) assert.equal(walletDownloadState('android',{...item,...patch}).available,false);
});
