import test from 'node:test';
import assert from 'node:assert/strict';
import { WALLET_ANDROID23 } from '../src/content/walletAndroid23.js';
import { walletDownloadState } from '../src/lib/walletDownloads.js';
import { getCatalog } from '../src/lib/ecosystemCatalog.js';
import { readFileSync } from 'node:fs';
import { verifyWalletAndroidPublication } from '../scripts/lib/verify-wallet-download-metadata.mjs';
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
 verifyWalletAndroidPublication(manifest);
 assert.equal(manifest.publicationMergeCommit,'c75cd8690b0bc43941db522ac502aa989addd713');
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

const publication = JSON.parse(readFileSync(new URL('../public/releases/wallet-downloads/20260920-android23.json',import.meta.url)));
const metadataFields = ['publicationMergeCommit','githubReleaseId','githubApiImmutable','apkAssetId','assetUpdatedAt','verificationBoundary'];
const nestedSections = ['ownerPublication','aab','limitedInstalledEvidence'];
const checkedPaths = [
 ...metadataFields.map(key=>[key]),
 ...nestedSections.flatMap(section=>Object.keys(publication[section]).map(key=>[section,key]))
];
for(const path of checkedPaths){
 test(`Android23 publication rejects tampered or omitted ${path.join('.')}`,()=>{
  const changed=structuredClone(publication);
  const missing=structuredClone(publication);
  const key=path.at(-1);
  const changedParent=path.length===1?changed:changed[path[0]];
  const missingParent=path.length===1?missing:missing[path[0]];
  const old=changedParent[key];
  changedParent[key]=typeof old==='boolean'?!old:typeof old==='number'?1:
   old.startsWith('https://')?'https://attacker.example/forged-evidence':old+'-tampered';
  delete missingParent[key];
  assert.throws(()=>verifyWalletAndroidPublication(changed),/exact merged owner evidence/);
  assert.throws(()=>verifyWalletAndroidPublication(missing),/exact merged owner evidence/);
 });
}
for(const section of nestedSections){
 test(`Android23 publication rejects unrecognized or missing ${section} facts`,()=>{
  const extra=structuredClone(publication);
  extra[section].unreviewedAcceptance=true;
  assert.throws(()=>verifyWalletAndroidPublication(extra),/exact merged owner evidence/);
  const missing=structuredClone(publication);
  delete missing[section];
  assert.throws(()=>verifyWalletAndroidPublication(missing),/exact merged owner evidence/);
 });
}
test('Android23 publication rejects the coordinated release, proof, signing and installed-acceptance attack',()=>{
 const attack=structuredClone(publication);
 Object.assign(attack,{githubReleaseId:1,apkAssetId:1,githubApiImmutable:true});
 Object.assign(attack.ownerPublication,{manifest:'https://attacker.example/manifest',proof:'https://attacker.example/proof',freshDownloadDigestMatched:false});
 Object.assign(attack.aab,{githubAssetId:1,signingClass:'production-signed',productionSigned:true,storeReleased:true});
 Object.assign(attack.limitedInstalledEvidence,{realDeviceVerified:true,walletConnectRelayE2E:true});
 assert.throws(()=>verifyWalletAndroidPublication(attack),/exact merged owner evidence/);
});
