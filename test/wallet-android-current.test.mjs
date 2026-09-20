import test from 'node:test';
import assert from 'node:assert/strict';
import { WALLET_ANDROID23 } from '../src/content/walletAndroid23.js';
import { walletDownloadState } from '../src/lib/walletDownloads.js';
import { getCatalog } from '../src/lib/ecosystemCatalog.js';
test('Android23 public selection uses the exact verified release and distinct installation evidence',()=>{
 const item=getCatalog().find(p=>p.key==='wallet').downloads.android;
 assert.equal(item.sha256,WALLET_ANDROID23.sha256);
 assert.equal(item.sizeBytes,116636787);
 const state=walletDownloadState('android',item);
 assert.equal(state.available,true);assert.equal(state.installProofKey,'android23Proof');assert.equal(state.fallbackHref,WALLET_ANDROID23.fallbackUrl);
 for(const patch of [{sizeBytes:1},{versionCode:21},{productionSigned:true},{storeReleased:true},{releaseImmutable:true},{publisherCanReplaceAssets:false},{downloadTimeSha256Verified:true}]) assert.equal(walletDownloadState('android',{...item,...patch}).available,false);
 for(const patch of [{href:item.href+'?other=1'},{sha256:'0'.repeat(64)},{sourceCommit:'0'.repeat(40)}]) assert.equal(walletDownloadState('android',{...item,...patch}).available,false);
 for(const patch of [{fallbackUrl:item.fallbackUrl+'?other=1'},{releaseTag:'other'}]) assert.equal(walletDownloadState('android',{...item,...patch}).available,false);
});

test('Android23 rejects a coordinated filename and fallback substitution under the same tag',()=>{
 const item=getCatalog().find(p=>p.key==='wallet').downloads.android;
 const artifactPath='ynx-wallet-1.0.17-testnet-preview-875f6c5b7-local-test-signed.aab';
 const fallbackUrl=`https://github.com/JiahaoAlbus/YNX-Chain/releases/download/${item.releaseTag}/${artifactPath}`;
 for(const platform of ['android','androidUniversal']){
  const state=walletDownloadState(platform,{...item,artifactPath,fallbackUrl});
  assert.equal(state.available,false);
  assert.equal(state.fallbackHref,null);
 }
});

test('Android23 manifest preserves exact AAB provenance and links the unchanged Android22 history', async()=>{
 const {readFile}=await import('node:fs/promises');
 const manifest=JSON.parse(await readFile(new URL('../public'+WALLET_ANDROID23.publicationEvidence,import.meta.url),'utf8'));
 for(const [key,value] of Object.entries(WALLET_ANDROID23)) assert.deepEqual(manifest[key],value,key);
 assert.equal(manifest.ownerPublication.evidenceCommit,'6e8e25015ad702728045e409153748d5b9fcdfcf');
 assert.equal(manifest.aab.sizeBytes,71872002);
 assert.equal(manifest.aab.sha256,'079c8e0597ab0c30b884e10c0d15bd1a8f606c6412509162fa85429966dbef1b');
 assert.equal(manifest.aab.publicUrl,`https://github.com/JiahaoAlbus/YNX-Chain/releases/download/${manifest.releaseTag}/${manifest.aab.artifactPath}`);
 assert.equal(manifest.aab.directInstallable,false);
 const history=JSON.parse(await readFile(new URL('../public'+manifest.previousRelease,import.meta.url),'utf8'));
 assert.equal(history.version,'1.0.16-testnet-preview');
 assert.equal(history.sha256,'89a842dc8641206a9154a6e41fd1c9e3cbb4b6cca2cea455ed5b7fc674b558c0');
 const item=getCatalog().find(p=>p.key==='wallet').downloads.android;
 for(const field of ['walletConnectRelayE2E','liveChainTransferExecuted','installedFinanceE2E']){
  assert.equal(manifest[field],false,field);
  assert.equal(walletDownloadState('android',{...item,[field]:true}).available,false,field);
 }
 assert.equal(manifest.limitedInstalledEvidence.recoveryContractTestsPassed,56);
 assert.equal(manifest.limitedInstalledEvidence.liveChainTransferExecuted,false);
});
