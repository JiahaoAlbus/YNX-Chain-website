import test from 'node:test';
import assert from 'node:assert/strict';
import { WALLET_ANDROID15 } from '../src/content/walletAndroid15.js';
import { walletDownloadState } from '../src/lib/walletDownloads.js';
import { getCatalog } from '../src/lib/ecosystemCatalog.js';
test('Android15 public selection uses the exact verified release and distinct installation evidence',()=>{
 const item=getCatalog().find(p=>p.key==='wallet').downloads.android;
 assert.equal(item.sha256,WALLET_ANDROID15.sha256);
 assert.equal(item.sizeBytes,78981683);
 const state=walletDownloadState('android',item);
 assert.equal(state.available,true);assert.equal(state.installProofKey,'android15Proof');
 for(const patch of [{href:item.href+'?other=1'},{sha256:'0'.repeat(64)},{sourceCommit:'0'.repeat(40)}]) assert.equal(walletDownloadState('android',{...item,...patch}).available,false);
});
