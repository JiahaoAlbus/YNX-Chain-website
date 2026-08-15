import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import test from "node:test";
import { CALLBACK, consumeWalletCallback, registerWalletCallback } from "../src/lib/walletAuthCallback.js";
globalThis.crypto ??= webcrypto;
class Storage { values=new Map(); getItem(key){return this.values.get(key)??null;} setItem(key,value){this.values.set(key,String(value));} removeItem(key){this.values.delete(key);} }
const base={version:"1",requestDigest:"a".repeat(64),nonce:"A".repeat(32),chainId:"ynx_6423-1",requestingProduct:"wallet-web-companion",productClientId:"ynx-wallet-web-companion-v1",bundleId:"web.ynx.wallet.companion",callback:CALLBACK};
const response={...base,decision:"rejected",decisionCode:"USER_REJECTED",rejectedAt:"2026-08-15T10:00:00.000Z",authorityGranted:false,grantedScopes:[]};
const canonical=value=>value===null||["string","boolean"].includes(typeof value)?JSON.stringify(value):Array.isArray(value)?`[${value.map(canonical).join(",")}]`:`{${Object.keys(value).sort().map(key=>`${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
const url=`${CALLBACK}?response=${Buffer.from(canonical(response)).toString("base64url")}`;
const pending={...base,expiresAt:"2026-08-15T11:00:00.000Z"};
test("only a matched canonical rejection is received without authority",async()=>{const storage=new Storage();registerWalletCallback(pending,storage);assert.deepEqual(await consumeWalletCallback(url,storage,new Date("2026-08-15T10:01:00.000Z")),{status:"rejected",account:false,sign:false,sendTransaction:false});});
test("substitution, malformed return, state mismatch, and replay fail closed",async()=>{const storage=new Storage();registerWalletCallback(pending,storage);await assert.rejects(()=>consumeWalletCallback(url.replace("https://www.ynxweb4.com","https://attacker.example"),storage),{code:"CALLBACK_MISMATCH"});await assert.rejects(()=>consumeWalletCallback(`${CALLBACK}?response=not-json`,storage),{code:"INVALID_CALLBACK"});await assert.rejects(()=>consumeWalletCallback(`${CALLBACK}?response=${Buffer.from(canonical({...response,nonce:"B".repeat(32)})).toString("base64url")}`,storage),{code:"CALLBACK_STATE_MISMATCH"});await consumeWalletCallback(url,storage,new Date("2026-08-15T10:01:00.000Z"));await assert.rejects(()=>consumeWalletCallback(url,storage),{code:"CALLBACK_REPLAY"});});
