import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { transform } from "esbuild";
import * as learning from "../src/content/learningContent.js";

const root = new URL("../", import.meta.url);
const copies = Object.fromEntries(fs.readdirSync(new URL("src/content/learning-locales/", root)).map(name => [name.replace(".json", ""),JSON.parse(fs.readFileSync(new URL(`src/content/learning-locales/${name}`,root),"utf8"))]));
const manualSource = fs.readFileSync(new URL("src/pages/ManualPage.jsx",root),"utf8");
const code = (await transform(manualSource,{loader:"jsx",format:"cjs"})).code;
const host = { locale:"en", window:{location:new URL("https://ynxweb4.com/manual?path=wallet")} };
const modules = {
  react:React,
  "lucide-react":Object.fromEntries(["ArrowRight","BookOpen","Check","Code2","Cpu","Layers3","Wallet"].map(name=>[name,()=>null])),
  "../lib/i18n.jsx":{useLocale:()=>({locale:host.locale,t:key=>key})},
  "../content/learningContent.js":learning,
  "../lib/useLearningCopy.js":{useLearningCopy:locale=>({...copies[locale],bodyLocale:locale})},
  "../content/documentLibraryCopy.js":{getDocumentLibraryCopy:()=>({})},
  "../components/GuideCode.jsx":{GuideCode:({code})=>React.createElement("pre",null,code)},
  "./learning-guides.css":{},
};
const module={exports:{}};
vm.runInNewContext(code,{module,exports:module.exports,require:name=>{assert.ok(Object.hasOwn(modules,name),name);return modules[name];},window:host.window,localStorage:{getItem:()=>null},URL,URLSearchParams});
function render(path,locale="en") { host.locale=locale;host.window.location=new URL(`https://ynxweb4.com/manual?path=${path}&lang=${locale}`);return renderToStaticMarkup(React.createElement(module.exports.ManualPage)); }

test("each supported platform has a read-only identity request and a real package checksum command",()=>{
  for(const platform of ["windows","macos","linux"]){
    const request=learning.learningCommandFor(platform,"chainId");
    assert.match(request,/eth_chainId/);assert.match(request,/https:\/\/evm\.ynxweb4\.com/);
    assert.doesNotMatch(request,/eth_send|personal_|requestAccounts|create-validator/);
    assert.match(learning.LEARNING_HASH_COMMANDS[platform],new RegExp(learning.LEARNING_SOURCE_DOWNLOAD.filename.replaceAll(".","\\.")));
    assert.match(request,platform==="windows"?/-TimeoutSec 12/:/--connect-timeout 5 --max-time 12/);
  }
  assert.match(learning.LEARNING_HASH_COMMANDS.windows,/Get-FileHash.*-Algorithm SHA256/);
  assert.match(learning.LEARNING_HASH_COMMANDS.macos,/shasum -a 256/);
  assert.match(learning.LEARNING_HASH_COMMANDS.linux,/sha256sum/);
  const html=render("node");
  for(const platform of ["Windows / WSL","macOS","Linux"])assert.ok(html.includes(platform));
  assert.ok(html.includes(learning.LEARNING_SOURCE_DOWNLOAD.sha256));
  assert.ok(html.includes(learning.LEARNING_SOURCE_DOWNLOAD.url));
});

test("rendered wallet journey links installation, network, faucet, Explorer and account recovery",()=>{
  const html=render("wallet");
  for(const href of ["/dapp/wallet/open-download","/dapp/wallet","https://faucet.ynxweb4.com","https://explorer.ynxweb4.com"])assert.ok(html.includes(`href="${href}"`),href);
  for(const identity of ["6423","0x1917","YNXT","20-byte"])assert.ok(html.includes(identity));
  assert.match(html,/Creating, importing and unlocking YNX Wallet never require MetaMask login/);
  assert.match(html,/Never enter recovery words or a private key into this website/);
  assert.match(html,/result is unknown/);
  assert.equal((html.match(/type="checkbox"/g)||[]).length,6);
  assert.match(html,/href="#step-wallet-network"/);
});

test("the node tutorial starts only isolated Devnet and keeps public admission separate",()=>{
  const node=render("node"), participation=render("participate");
  assert.match(node,/Go 1\.25/);assert.match(node,/git checkout --detach/);assert.ok(node.includes(learning.LEARNING_SOURCE));
  assert.match(learning.LEARNING_COMMANDS.node,/-network devnet -http 127\.0\.0\.1:16420 -data-dir \.\/\.local\/learning-node/);
  assert.match(node,/Devnet 6425/);assert.match(node,/Ctrl\+C/);assert.match(node,/same directory/);
  assert.match(participation,/Public validator self-enrollment, staking admission and block rewards are not open/);
  assert.match(participation,/make -n consensus-quorum-check/);
  assert.match(participation,/temporary keys/);
  assert.doesNotMatch(Object.values(learning.LEARNING_COMMANDS).join("\n"),/ynxd|create-validator|curl[^\n]*\|\s*(?:ba)?sh|\bsudo\b/);
});

test("all 12 locales render complete steps and recovery text without retired identity",()=>{
  assert.equal(Object.keys(copies).length,12);
  for(const locale of Object.keys(copies))for(const [index,path] of learning.LEARNING_PATHS.entries()){
    const html=render(path.id,locale), rows=copies[locale].paths[index][2];
    assert.equal((html.match(/class="learningStep"/g)||[]).length,path.steps.length,`${locale}:${path.id}`);
    assert.equal((html.match(/class="learningExpected"/g)||[]).length,path.steps.length);
    for(const row of rows)assert.equal(row.length,4);
    assert.doesNotMatch(html,/9102|0x238e|NYXT/iu);
    assert.ok(html.includes(`lang="${locale}"`));
    if(locale==="ar")assert.ok(html.includes('dir="rtl"'));
  }
});
