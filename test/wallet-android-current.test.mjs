import test from 'node:test';
import assert from 'node:assert/strict';
import { WALLET_ANDROID25 } from '../src/content/walletAndroid25.js';
import { WALLET_ANDROID26 } from '../src/content/walletAndroid26.js';
import { WALLET_ANDROID27 } from '../src/content/walletAndroid27.js';
import { walletDownloadState } from '../src/lib/walletDownloads.js';
import { getCatalog } from '../src/lib/ecosystemCatalog.js';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { WALLET_ANDROID24 } from '../src/content/walletAndroid24.js';
import { verifyWalletAndroidPublication } from '../scripts/lib/verify-wallet-download-metadata.mjs';
test('Android27 public selection uses the exact published Testnet preview with bounded emulator proof',()=>{
 const item=getCatalog().find(p=>p.key==='wallet').downloads.android;
 assert.equal(item.sha256,WALLET_ANDROID27.sha256);
 assert.equal(item.sizeBytes,116815538);
 const state=walletDownloadState('android',item);
 assert.equal(state.available,true);assert.equal(state.installProofKey,'android27Proof');assert.equal(state.fallbackHref,WALLET_ANDROID27.fallbackUrl);
 for(const patch of [{sizeBytes:1},{versionCode:21},{productionSigned:true},{storeReleased:true},{releaseImmutable:true},{publisherCanReplaceAssets:false},{downloadTimeSha256Verified:true},{androidInstallVerified:false},{androidInstallScope:'physical device'}]) assert.equal(walletDownloadState('android',{...item,...patch}).available,false);
 for(const patch of [{href:item.href+'?other=1'},{sha256:'0'.repeat(64)},{sourceCommit:'0'.repeat(40)}]) assert.equal(walletDownloadState('android',{...item,...patch}).available,false);
 for(const patch of [{fallbackUrl:item.fallbackUrl+'?other=1'},{releaseTag:'other'}]) assert.equal(walletDownloadState('android',{...item,...patch}).available,false);
});

test('Android27 rejects a coordinated filename and fallback substitution under the same tag',()=>{
 const item=getCatalog().find(p=>p.key==='wallet').downloads.android;
 const artifactPath='ynx-wallet-1.0.21-testnet-preview-008aa8b07-local-test-signed.aab';
 const fallbackUrl=`https://github.com/JiahaoAlbus/YNX-Chain/releases/download/${item.releaseTag}/${artifactPath}`;
 for(const platform of ['android','androidUniversal']){
  const state=walletDownloadState(platform,{...item,artifactPath,fallbackUrl});
  assert.equal(state.available,false);
  assert.equal(state.fallbackHref,null);
 }
});

test('Android27 selection rejects stale identity and promoted acceptance',()=>{
 const item=getCatalog().find(p=>p.key==='wallet').downloads.android;
 for(const platform of ['android','androidUniversal']){
  assert.equal(walletDownloadState(platform,WALLET_ANDROID24).available,false);
  assert.equal(walletDownloadState(platform,WALLET_ANDROID25).available,false);
  assert.equal(walletDownloadState(platform,WALLET_ANDROID26).available,false);
  for(const patch of [{id:WALLET_ANDROID24.id},{version:WALLET_ANDROID24.version},{publicationEvidence:WALLET_ANDROID24.publicationEvidence},{fullInstalledE2E:true},{newWalletGoalsAccepted:true}]){
   const state=walletDownloadState(platform,{...item,...patch});
   assert.equal(state.available,false);
   assert.equal(state.fallbackHref,null);
  }
 }
});

test('Android27 manifest binds the single GitHub APK and does not promote the emulator upgrade',()=>{
 const manifest=JSON.parse(readFileSync(new URL('../public'+WALLET_ANDROID27.publicationEvidence,import.meta.url)));
 verifyWalletAndroidPublication(manifest);
 for(const [key,value] of Object.entries(WALLET_ANDROID27)) assert.deepEqual(manifest[key],value,key);
 assert.equal(manifest.githubReleaseId,395855899);
 assert.equal(manifest.apkAssetId,586315576);
 assert.equal(manifest.certificateSha256,'d4e562610ecb4e304fa00ee07e7adae7da862ce108bda7bdfe933c28831f154e');
 assert.equal(manifest.previousRelease,WALLET_ANDROID26.publicationEvidence);
 assert.equal(manifest.aab,undefined,'1.0.21 publishes no AAB');
 for(const key of ['fundedBalanceRetained','pendingOutboxRecovered','physicalDeviceVerified','productionSigned','storeReleased','walletConnectRelayE2E','installedFinanceE2E','liveChainTransferExecuted']) assert.equal(manifest.releaseLimits[key],false,key);
 const forged=structuredClone(manifest);forged.releaseLimits.pendingOutboxRecovered=true;
 assert.throws(()=>verifyWalletAndroidPublication(forged),/exact pinned owner evidence/);
});

test('Android26 historical source and release record remain byte-for-byte unchanged',()=>{
 for(const [path,digest] of [
  ['src/content/walletAndroid26.js','058f3457e187d66a9b42e8871c522076292660beb27fae98f33040fd5d02d8f0'],
  ['public/releases/wallet-downloads/20260924-android26.json','5a5abd37cb5237b59e982673166c2da91611af80dd600cc36009f26e06631ff1']
 ]) assert.equal(createHash('sha256').update(readFileSync(new URL('../'+path,import.meta.url))).digest('hex'),digest,path);
});

test('Android23 historical evidence remains byte-for-byte unchanged',()=>{
 for(const [path,digest] of [
  ['wallet-downloads/20260920-android23.json','43a19c8a518be2c3661ec98705cc450713c52fd63ea5009cc3e1011a735782ac'],
  ['wallet/875f6c5b7/product-release.json','78ea96b2b7109abf30a8d6ca35fc1045e96d39906bb19d4a8d23fc5cbf009876'],
  ['wallet/875f6c5b7/public-product-metadata.json','1ad5d0eb8e5af488878c504963c88a1290cea747ca2ecaa9c92536c0f93c534b']
 ]) assert.equal(createHash('sha256').update(readFileSync(new URL('../public/releases/'+path,import.meta.url))).digest('hex'),digest,path);
});

test('Android25 manifest preserves exact AAB provenance and links the unchanged Android24 history', async()=>{
 const {readFile}=await import('node:fs/promises');
 const manifest=JSON.parse(await readFile(new URL('../public'+WALLET_ANDROID25.publicationEvidence,import.meta.url),'utf8'));
 verifyWalletAndroidPublication(manifest);
 assert.equal(manifest.publicationEvidenceCommit,'cd71230a8a3e5536a4a61bf6b5786fcf4962d8c9');
 for(const [key,value] of Object.entries(WALLET_ANDROID25)) assert.deepEqual(manifest[key],value,key);
 assert.equal(manifest.ownerPublication.evidenceCommit,'cd71230a8a3e5536a4a61bf6b5786fcf4962d8c9');
 assert.equal(manifest.aab.sizeBytes,71874951);
 assert.equal(manifest.aab.sha256,'e60c165362ba5d85cf96e562800b5a1ef2f33812fff9eacd10745370bf114b7f');
 assert.equal(manifest.aab.publicUrl,`https://github.com/JiahaoAlbus/YNX-Chain/releases/download/${manifest.releaseTag}/${manifest.aab.artifactPath}`);
 assert.equal(manifest.aab.directInstallable,false);
 const history=JSON.parse(await readFile(new URL('../public'+manifest.previousRelease,import.meta.url),'utf8'));
 assert.equal(history.version,'1.0.18-testnet-preview');
 assert.equal(history.sha256,'45fd5004c9156d4fb5880d9caa2056f5b2238e85ca63a13ddf73f25dea96266a');
 const item=getCatalog().find(p=>p.key==='wallet').downloads.android;
 for(const field of ['walletConnectRelayE2E','liveChainTransferExecuted','installedFinanceE2E','fundedBalanceNonceVerified','physicalDeviceVerified','fullInstalledE2E','newWalletGoalsAccepted']){
  assert.equal(manifest[field],false,field);
  assert.equal(walletDownloadState('android',{...item,[field]:true}).available,false,field);
 }
 assert.equal(manifest.androidInstallVerified,true);
 assert.equal(manifest.androidInstallScope,'API 36 emulator only');
 assert.equal(walletDownloadState('android',{...item,androidInstallVerified:false}).available,false);
 assert.equal(walletDownloadState('android',{...item,androidInstallScope:'physical device'}).available,false);
 assert.equal(manifest.limitedInstalledEvidence.androidInstall,'PASS_API36_EMULATOR_ONLY');
 assert.equal(manifest.limitedInstalledEvidence.androidColdLaunch,'PASS_API36_EMULATOR_ONLY');
 assert.equal(manifest.limitedInstalledEvidence.liveChainTransferExecuted,false);
});

test('Android26 manifest pins GitHub APK/AAB identity without promoting 1.0.19 installation evidence',()=>{
 const manifest=JSON.parse(readFileSync(new URL('../public'+WALLET_ANDROID26.publicationEvidence,import.meta.url)));
 verifyWalletAndroidPublication(manifest);
 for(const [key,value] of Object.entries(WALLET_ANDROID26)) assert.deepEqual(manifest[key],value,key);
 assert.equal(manifest.githubReleaseId,392641001);
 assert.equal(manifest.apkAssetId,577942956);
 assert.equal(manifest.aab.githubAssetId,577942957);
 assert.equal(manifest.aab.sizeBytes,71877410);
 assert.equal(manifest.aab.sha256,'46d3f0e7f2738ac55aa5e6f24717ff4adef3b499f368ca6c3e253a7c3a4e6c4d');
 assert.equal(manifest.previousRelease,WALLET_ANDROID25.publicationEvidence);
 for(const key of ['androidInstallVerified','physicalDeviceVerified','walletConnectRelayE2E','installedFinanceE2E','liveChainTransferExecuted','pr188LoginIncluded','certificateFingerprintVerified']) assert.equal(manifest.releaseLimits[key],false,key);
 const forged=structuredClone(manifest);forged.releaseLimits.androidInstallVerified=true;
 assert.throws(()=>verifyWalletAndroidPublication(forged),/exact pinned owner evidence/);
});

const publication = JSON.parse(readFileSync(new URL('../public/releases/wallet-downloads/20260921-android25.json',import.meta.url)));
const metadataFields = ['publicationMergeCommit','publicationEvidenceCommit','githubReleaseId','githubApiImmutable','apkAssetId','assetUpdatedAt','verificationBoundary'];
const nestedSections = ['ownerPublication','aab','limitedInstalledEvidence','reproducibility'];
const checkedPaths = [
 ...metadataFields.map(key=>[key]),
 ...nestedSections.flatMap(section=>Object.keys(publication[section]).map(key=>[section,key]))
];
for(const path of checkedPaths){
 test(`Android25 publication rejects tampered or omitted ${path.join('.')}`,()=>{
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
 test(`Android25 publication rejects unrecognized or missing ${section} facts`,()=>{
  const extra=structuredClone(publication);
  extra[section].unreviewedAcceptance=true;
  assert.throws(()=>verifyWalletAndroidPublication(extra),/exact pinned owner evidence/);
  const missing=structuredClone(publication);
  delete missing[section];
  assert.throws(()=>verifyWalletAndroidPublication(missing),/exact pinned owner evidence/);
 });
}
test('Android25 publication rejects the coordinated release, proof, signing and installed-acceptance attack',()=>{
 const attack=structuredClone(publication);
 Object.assign(attack,{githubReleaseId:1,apkAssetId:1,githubApiImmutable:true});
 Object.assign(attack.ownerPublication,{manifest:'https://attacker.example/manifest',proof:'https://attacker.example/proof',freshDownloadDigestMatched:false});
 Object.assign(attack.aab,{githubAssetId:1,signingClass:'production-signed',productionSigned:true,storeReleased:true});
 Object.assign(attack.limitedInstalledEvidence,{realDeviceVerified:true,walletConnectRelayE2E:true});
 assert.throws(()=>verifyWalletAndroidPublication(attack),/exact pinned owner evidence/);
});

test('Android24 history and source remain unchanged after current selection advances',()=>{
 for(const [path,digest] of [
  ['public/releases/wallet-downloads/20260921-android24.json','d86f3fede9f71ea97e2ed4d484fccf1dad54c9665e64b53d0445e453e7f29f49'],
  ['public/releases/wallet/2fdd679f9/product-release.json','df37625135043fae520948c0cb1362088b9d73dd59d1447a68bf869b3ce23db8'],
  ['public/releases/wallet/2fdd679f9/public-product-metadata.json','67e05fe39fc54ef1993c4215ec2c6818dcee44f88bcb20a5aa6b017d6445be72'],
  ['public/releases/wallet/2fdd679f9/website-activation.json','36bd3ff7d4bb013146c2b2300626e0c510a3866a45f5dd53488e44cfb4a7aea5'],
  ['src/content/walletAndroid24.js','eaae604ce7c8a6f826cc553560e90659539b61f0e3ba6ae2e8957b21838a8d96']
 ]) assert.equal(createHash('sha256').update(readFileSync(new URL('../'+path,import.meta.url))).digest('hex'),digest,path);
});

test('Android25 does not promote raw Gradle reproducibility or historical installed evidence',()=>{
 assert.equal(publication.publicationMergeCommit,'cdb9bd25cdef9524c7c869d1110f4ce0b7d8cd91');
 assert.equal(publication.reproducibility.rawGradleApkBitForBitMatched,false);
 assert.equal(publication.reproducibility.rawGradleApkV2SignatureAlgorithm,'RSA_PKCS1_V1_5_WITH_SHA256');
 assert.equal(publication.reproducibility.differingBlock,'APK Dependency Info');
 assert.equal(publication.reproducibility.resigningRemovedOrReplacedDependencyMetadata,true);
 assert.equal(publication.reproducibility.rsaPssSaltNormalizationClaim,false);
 assert.equal(publication.reproducibility.publishedApkBitForBitMatched,true);
 assert.equal(publication.limitedInstalledEvidence.historicalVersion,'1.0.18-testnet-preview');
 assert.equal(publication.limitedInstalledEvidence.mutationRepeatedFor1019,false);
 assert.equal(publication.downloadTimeSha256Verified,false);
});

test('Android25 emulator evidence preserves zero mutations and the historical first website activation',()=>{
 assert.equal(publication.limitedInstalledEvidence.evidenceCommit,'5009572445f08e3a7b138e71ce9d4328199f4a83');
 assert.equal(publication.limitedInstalledEvidence.mergeCommit,'b29e1be58f3ed28104d9d35a3c8eb4f599635ab7');
 assert.equal(publication.limitedInstalledEvidence.readOnlyResult,'NO_ON_CHAIN_ACCOUNT_RECORD');
 assert.equal(publication.limitedInstalledEvidence.biometricToSettledResultMillis,9848);
 for(const field of ['faucetRequests','transferBroadcasts','walletConnectRelayContacts','publicServiceMutations']) assert.equal(publication.limitedInstalledEvidence[field],0,field);
 assert.equal(createHash('sha256').update(readFileSync(new URL('../public/releases/wallet/d58ce00dc/website-activation.json',import.meta.url))).digest('hex'),'eb64a0631fe94fdcf2909d89767fdd401e66920721e09125f35e716b05cd4c49');
});
