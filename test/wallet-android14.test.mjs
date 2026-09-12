import test from 'node:test';
import assert from 'node:assert/strict';
import { WALLET_ANDROID14 } from '../src/content/walletAndroid14.js';
import { walletDownloadState } from '../src/lib/walletDownloads.js';
import { getCatalog } from '../src/lib/ecosystemCatalog.js';
test('Android14 public selection uses the exact verified release and distinct installation evidence',()=>{
 const item=getCatalog().find(p=>p.key==='wallet').downloads.android;
 assert.equal(item.sha256,WALLET_ANDROID14.sha256);
 assert.equal(item.sizeBytes,78912051);
 const state=walletDownloadState('android',item);
 assert.equal(state.available,true);assert.equal(state.installProofKey,'android14Proof');
 for(const patch of [{href:item.href+'?other=1'},{sha256:'0'.repeat(64)},{sourceCommit:'0'.repeat(40)}]) assert.equal(walletDownloadState('android',{...item,...patch}).available,false);
});
