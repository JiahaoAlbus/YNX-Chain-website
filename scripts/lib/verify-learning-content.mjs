import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { LEARNING_PATHS, LEARNING_COMMANDS, LEARNING_SOURCE, LEARNING_HASH_COMMANDS, LEARNING_SOURCE_DOWNLOAD, GUIDE_UI_KEYS, learningCommandFor } from "../../src/content/learningContent.js";
import { DOCUMENT_LIBRARY } from "../../src/content/documentLibrary.js";
import { getDocumentLibraryCopy } from "../../src/content/documentLibraryCopy.js";

export function verifyLearningContent(root=process.cwd()) {
 const locales=["en","zh-CN","zh-TW","ja","ko","es","fr","de","pt","ru","ar","id"];
 const english=JSON.parse(fs.readFileSync(path.join(root,"src/content/learning-locales/en.json"),"utf8"));
 assert.deepEqual(LEARNING_PATHS.map(item=>item.id),["wallet","node","participate","develop"]);
 for(const locale of locales){
  const copy=JSON.parse(fs.readFileSync(path.join(root,`src/content/learning-locales/${locale}.json`),"utf8"));
  assert.equal(copy.ui.length,GUIDE_UI_KEYS.length,locale);assert.equal(copy.paths.length,4,locale);
  assert.ok(copy.ui.every(value=>typeof value==="string"&&value.trim()));
  copy.paths.forEach((item,index)=>{assert.equal(item[2].length,LEARNING_PATHS[index].steps.length,locale);item[2].forEach((step,stepIndex)=>{assert.equal(step.length,4);step.forEach((text,field)=>{assert.ok(typeof text==="string"&&text.trim());assert.doesNotMatch(text,/9102|0x238e|NYXT/iu);if(locale!=="en")assert.notEqual(text,english.paths[index][2][stepIndex][field],`${locale} untranslated step`);});});});
  assert.equal(Object.keys(getDocumentLibraryCopy(locale).documents).length,47);
 }
 for(const platform of ["windows","macos","linux"]){assert.match(learningCommandFor(platform,"chainId"),/eth_chainId/);assert.doesNotMatch(learningCommandFor(platform,"chainId"),/eth_send|requestAccounts/);assert.ok(LEARNING_HASH_COMMANDS[platform].includes(LEARNING_SOURCE_DOWNLOAD.filename));}
 assert.match(LEARNING_COMMANDS.node,/-network devnet -http 127\.0\.0\.1:16420 -data-dir \.\/\.local\/learning-node/);
 assert.ok(LEARNING_COMMANDS.source.includes(LEARNING_SOURCE));assert.match(LEARNING_SOURCE_DOWNLOAD.sha256,/^[a-f0-9]{64}$/);
 assert.ok(LEARNING_PATHS[0].steps.some(step=>step.href==="/dapp/wallet/open-download"));assert.ok(LEARNING_PATHS[0].steps.some(step=>step.network));
 assert.match(english.paths[2][2][1][1],/self-enrollment, staking admission and block rewards are not open/);
 assert.match(english.paths[0][2][1][3],/Never enter recovery words or a private key into this website/);
 assert.equal(DOCUMENT_LIBRARY.length,47);assert.equal(DOCUMENT_LIBRARY.filter(document=>document.category==="whitepaper").length,4);
 for(const document of DOCUMENT_LIBRARY){
  const bytes=fs.readFileSync(path.join(root,"public",document.downloadUrl));assert.equal(bytes.length,document.bytes);assert.equal(crypto.createHash("sha256").update(bytes).digest("hex"),document.sha256);
  const body=JSON.parse(fs.readFileSync(path.join(root,"public",document.bodyUrls.en),"utf8"));assert.equal(body.documentId,document.id);assert.equal(body.sourceSha256,document.sha256);assert.equal(body.markdown,bytes.toString("utf8"));
  assert.equal(Object.hasOwn(document,"html"),false,"Full bodies must not enter the catalog bundle");assert.equal(Object.hasOwn(document,"markdown"),false);
 }
 return true;
}
