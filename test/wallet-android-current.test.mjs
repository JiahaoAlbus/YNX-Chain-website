import test from 'node:test';
import assert from 'node:assert/strict';
import { WALLET_ANDROID24 } from '../src/content/walletAndroid24.js';
import { walletDownloadState } from '../src/lib/walletDownloads.js';
import { getCatalog } from '../src/lib/ecosystemCatalog.js';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { WALLET_ANDROID23 } from '../src/content/walletAndroid23.js';
import { verifyWalletAndroidPublication } from '../scripts/lib/verify-wallet-download-metadata.mjs';
test('Android24 public selection uses the exact verified release and distinct installation evidence',()=>{
 const item=getCatalog().find(p=>p.key==='wallet').downloads.android;
 assert.equal(item.sha256,WALLET_ANDROID24.sha256);
 assert.equal(item.sizeBytes,116737714);
 const state=walletDownloadState('android',item);
 assert.equal(state.available,true);assert.equal(state.installProofKey,'android24Proof');assert.equal(state.fallbackHref,WALLET_ANDROID24.fallbackUrl);
 for(const patch of [{sizeBytes:1},{versionCode:21},{productionSigned:true},{storeReleased:true},{releaseImmutable:true},{publisherCanReplaceAssets:false},{downloadTimeSha256Verified:true}]) assert.equal(walletDownloadState('android',{...item,...patch}).available,false);
 for(const patch of [{href:item.href+'?other=1'},{sha256:'0'.repeat(64)},{sourceCommit:'0'.repeat(40)}]) assert.equal(walletDownloadState('android',{...item,...patch}).available,false);
 for(const patch of [{fallbackUrl:item.fallbackUrl+'?other=1'},{releaseTag:'other'}]) assert.equal(walletDownloadState('android',{...item,...patch}).available,false);
});

test('Android24 rejects a coordinated filename and fallback substitution under the same tag',()=>{
 const item=getCatalog().find(p=>p.key==='wallet').downloads.android;
 const artifactPath='ynx-wallet-1.0.18-testnet-preview-2fdd679f9-local-test-signed.aab';
 const fallbackUrl=`https://github.com/JiahaoAlbus/YNX-Chain/releases/download/${item.releaseTag}/${artifactPath}`;
 for(const platform of ['android','androidUniversal']){
  const state=walletDownloadState(platform,{...item,artifactPath,fallbackUrl});
  assert.equal(state.available,false);
  assert.equal(state.fallbackHref,null);
 }
});

test('Android24 selection rejects stale identity and promoted acceptance',()=>{
 const item=getCatalog().find(p=>p.key==='wallet').downloads.android;
 for(const platform of ['android','androidUniversal']){
  assert.equal(walletDownloadState(platform,WALLET_ANDROID23).available,false);
  for(const patch of [{id:WALLET_ANDROID23.id},{version:WALLET_ANDROID23.version},{publicationEvidence:WALLET_ANDROID23.publicationEvidence},{fullInstalledE2E:true},{newWalletGoalsAccepted:true}]){
   const state=walletDownloadState(platform,{...item,...patch});
   assert.equal(state.available,false);
   assert.equal(state.fallbackHref,null);
  }
 }
});

test('Android23 historical evidence remains byte-for-byte unchanged',()=>{
 for(const [path,digest] of [
  ['wallet-downloads/20260920-android23.json','43a19c8a518be2c3661ec98705cc450713c52fd63ea5009cc3e1011a735782ac'],
  ['wallet/875f6c5b7/product-release.json','78ea96b2b7109abf30a8d6ca35fc1045e96d39906bb19d4a8d23fc5cbf009876'],
  ['wallet/875f6c5b7/public-product-metadata.json','1ad5d0eb8e5af488878c504963c88a1290cea747ca2ecaa9c92536c0f93c534b']
 ]) assert.equal(createHash('sha256').update(readFileSync(new URL('../public/releases/'+path,import.meta.url))).digest('hex'),digest,path);
});

test('Android24 manifest preserves exact AAB provenance and links the unchanged Android23 history', async()=>{
 const {readFile}=await import('node:fs/promises');
 const manifest=JSON.parse(await readFile(new URL('../public'+WALLET_ANDROID24.publicationEvidence,import.meta.url),'utf8'));
 verifyWalletAndroidPublication(manifest);
 assert.equal(manifest.publicationEvidenceCommit,'f3c0a39af312d36027459ba113d68ce83b0615c5');
 for(const [key,value] of Object.entries(WALLET_ANDROID24)) assert.deepEqual(manifest[key],value,key);
 assert.equal(manifest.ownerPublication.evidenceCommit,'f3c0a39af312d36027459ba113d68ce83b0615c5');
 assert.equal(manifest.aab.sizeBytes,71875238);
 assert.equal(manifest.aab.sha256,'c6f920a00b8768c9ea8837bd35cfcee4b1b2c9106959c101c44026fa388c7850');
 assert.equal(manifest.aab.publicUrl,`https://github.com/JiahaoAlbus/YNX-Chain/releases/download/${manifest.releaseTag}/${manifest.aab.artifactPath}`);
 assert.equal(manifest.aab.directInstallable,false);
 const history=JSON.parse(await readFile(new URL('../public'+manifest.previousRelease,import.meta.url),'utf8'));
 assert.equal(history.version,'1.0.17-testnet-preview');
 assert.equal(history.sha256,'04a37e7bd9f76bb3bb76fe330921f0f80e6d2cfa3b115d38ac93c53cb80370a2');
 const item=getCatalog().find(p=>p.key==='wallet').downloads.android;
 for(const field of ['walletConnectRelayE2E','liveChainTransferExecuted','installedFinanceE2E','androidInstallVerified','physicalDeviceVerified','fullInstalledE2E','newWalletGoalsAccepted']){
  assert.equal(manifest[field],false,field);
  assert.equal(walletDownloadState('android',{...item,[field]:true}).available,false,field);
 }
 assert.equal(manifest.limitedInstalledEvidence.androidInstall,'NOT_VERIFIED');
 assert.equal(manifest.limitedInstalledEvidence.androidColdLaunch,'NOT_VERIFIED');
 assert.equal(manifest.limitedInstalledEvidence.liveChainTransferExecuted,false);
});

const publication = JSON.parse(readFileSync(new URL('../public/releases/wallet-downloads/20260921-android24.json',import.meta.url)));
const metadataFields = ['publicationEvidenceCommit','githubReleaseId','githubApiImmutable','apkAssetId','assetUpdatedAt','verificationBoundary'];
const nestedSections = ['ownerPublication','aab','limitedInstalledEvidence','reproducibility'];
const checkedPaths = [
 ...metadataFields.map(key=>[key]),
 ...nestedSections.flatMap(section=>Object.keys(publication[section]).map(key=>[section,key]))
];
for(const path of checkedPaths){
 test(`Android24 publication rejects tampered or omitted ${path.join('.')}`,()=>{
  const changed=structuredClone(publication);
  const missing=structuredClone(publication);
  const key=path.at(-1);
  const changedParent=path.length===1?changed:changed[path[0]];
  const missingParent=path.length===1?missing:missing[path[0]];
  const old=changedParent[key];
  changedParent[key]=typeof old==='boolean'?!old:typeof old==='number'?1:
   old.startsWith('https://')?'https://attacker.example/forged-evidence':old+'-tampered';
  delete missingParent[key];
  assert.throws(()=>verifyWalletAndroidPublication(changed),/exact pinned owner evidence/);
  assert.throws(()=>verifyWalletAndroidPublication(missing),/exact pinned owner evidence/);
 });
}
for(const section of nestedSections){
 test(`Android24 publication rejects unrecognized or missing ${section} facts`,()=>{
  const extra=structuredClone(publication);
  extra[section].unreviewedAcceptance=true;
  assert.throws(()=>verifyWalletAndroidPublication(extra),/exact pinned owner evidence/);
  const missing=structuredClone(publication);
  delete missing[section];
  assert.throws(()=>verifyWalletAndroidPublication(missing),/exact pinned owner evidence/);
 });
}
test('Android24 publication rejects the coordinated release, proof, signing and installed-acceptance attack',()=>{
 const attack=structuredClone(publication);
 Object.assign(attack,{githubReleaseId:1,apkAssetId:1,githubApiImmutable:true});
 Object.assign(attack.ownerPublication,{manifest:'https://attacker.example/manifest',proof:'https://attacker.example/proof',freshDownloadDigestMatched:false});
 Object.assign(attack.aab,{githubAssetId:1,signingClass:'production-signed',productionSigned:true,storeReleased:true});
 Object.assign(attack.limitedInstalledEvidence,{realDeviceVerified:true,walletConnectRelayE2E:true});
 assert.throws(()=>verifyWalletAndroidPublication(attack),/exact pinned owner evidence/);
});
