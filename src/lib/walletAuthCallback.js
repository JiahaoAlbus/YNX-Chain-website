export const CALLBACK = "https://www.ynxweb4.com/dapp/wallet/wallet-auth/callback";
const pendingKey = "ynx.wallet.web.callback.pending.v1";
const replayKey = "ynx.wallet.web.callback.replay.v1";
const product = Object.freeze({requestingProduct:"wallet-web-companion",productClientId:"ynx-wallet-web-companion-v1",bundleId:"web.ynx.wallet.companion",chainId:"ynx_6423-1"});
const error = (code) => Object.assign(new Error(code), {code});
const canonical = (value) => {
  if (value === null || ["string","boolean"].includes(typeof value)) return JSON.stringify(value);
  if (typeof value === "number") { if (!Number.isSafeInteger(value)) throw error("INVALID_CALLBACK"); return JSON.stringify(value); }
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (!value || Object.getPrototypeOf(value) !== Object.prototype) throw error("INVALID_CALLBACK");
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
};
const exact = (value, fields) => { if (Object.keys(value).sort().join("\n") !== [...fields].sort().join("\n")) throw error("INVALID_CALLBACK"); };
const decode = (value) => {
  if (typeof value !== "string" || !/^[A-Za-z0-9_-]+$/.test(value)) throw error("INVALID_CALLBACK");
  const padded=`${value.replace(/-/g,"+").replace(/_/g,"/")}${"=".repeat((4-value.length%4)%4)}`;
  try { return new TextDecoder("utf-8",{fatal:true}).decode(typeof atob === "function" ? Uint8Array.from(atob(padded),c=>c.charCodeAt(0)) : Uint8Array.from(Buffer.from(padded,"base64"))); } catch { throw error("INVALID_CALLBACK"); }
};
const fingerprint = async (value) => {
  if (!globalThis.crypto?.subtle) throw error("CALLBACK_STORAGE_UNAVAILABLE");
  const bytes=await globalThis.crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));
  return [...new Uint8Array(bytes)].map(v=>v.toString(16).padStart(2,"0")).join("");
};
function stored(storage,key) { const raw=storage.getItem(key); if(raw===null)return null; let value; try { value=JSON.parse(raw); } catch { throw error("CALLBACK_STATE_MISMATCH"); } if(canonical(value)!==raw)throw error("CALLBACK_STATE_MISMATCH"); return value; }
/** The frozen Core client calls this when it has created the canonical request. */
export function registerWalletCallback(request, storage=globalThis.sessionStorage) {
  const value={schemaVersion:1,callback:request?.callback,requestDigest:request?.requestDigest,nonce:request?.nonce,expiresAt:request?.expiresAt};
  if(value.callback!==CALLBACK||!/^[0-9a-f]{64}$/.test(value.requestDigest)||!/^[A-Za-z0-9_-]{32,64}$/.test(value.nonce)||!Number.isFinite(Date.parse(value.expiresAt)))throw error("INVALID_PENDING_CALLBACK");
  storage.setItem(pendingKey,canonical(value)); if(storage.getItem(pendingKey)!==canonical(value))throw error("CALLBACK_STORAGE_UNAVAILABLE"); return Object.freeze(value);
}
/** Strict receiver only: it never creates a session or exposes account/signing authority. */
export async function consumeWalletCallback(url, storage=globalThis.sessionStorage, now=new Date()) {
  let parsed; try { parsed=new URL(url); } catch { throw error("INVALID_CALLBACK"); }
  const keys=[...parsed.searchParams.keys()], response=keys.length===1&&keys[0]==="response"?parsed.searchParams.get("response"):null; parsed.search="";
  if(parsed.toString()!==CALLBACK||parsed.hash||parsed.username||parsed.password||!response)throw error("CALLBACK_MISMATCH");
  const replay=stored(storage,replayKey)||{schemaVersion:1,digests:[]}; if(replay.schemaVersion!==1||!Array.isArray(replay.digests))throw error("CALLBACK_STATE_MISMATCH");
  const id=await fingerprint(response); if(replay.digests.includes(id))throw error("CALLBACK_REPLAY");
  let body; try { body=JSON.parse(decode(response)); } catch (cause) { if(cause?.code)throw cause; throw error("INVALID_CALLBACK"); }
  if(canonical(body)!==decode(response))throw error("INVALID_CALLBACK");
  const rejected=body?.decision==="rejected";
  exact(body,rejected?["version","decision","requestDigest","nonce","chainId","requestingProduct","productClientId","bundleId","callback","decisionCode","rejectedAt","authorityGranted","grantedScopes"]:["version","requestDigest","nonce","chainId","requestingProduct","productClientId","bundleId","productDeviceAlgorithm","productDeviceKey","callback","account","accountPublicKey","grantedScopes","purpose","issuedAt","expiresAt","walletSignature"]);
  if(body.version!=="1"||body.chainId!==product.chainId||body.requestingProduct!==product.requestingProduct||body.productClientId!==product.productClientId||body.bundleId!==product.bundleId||body.callback!==CALLBACK||!/^[0-9a-f]{64}$/.test(body.requestDigest)||!/^[A-Za-z0-9_-]{32,64}$/.test(body.nonce))throw error("CALLBACK_BINDING_MISMATCH");
  if(rejected&&(body.decisionCode!=="USER_REJECTED"||body.authorityGranted!==false||!Array.isArray(body.grantedScopes)||body.grantedScopes.length!==0))throw error("INVALID_CALLBACK");
  const pending=stored(storage,pendingKey); if(!pending||pending.schemaVersion!==1||pending.callback!==CALLBACK||pending.requestDigest!==body.requestDigest||pending.nonce!==body.nonce||Date.parse(pending.expiresAt)<=now.getTime())throw error("CALLBACK_STATE_MISMATCH");
  const next=canonical({schemaVersion:1,digests:[...replay.digests,id].slice(-8)}); storage.setItem(replayKey,next); if(storage.getItem(replayKey)!==next)throw error("CALLBACK_STORAGE_UNAVAILABLE"); storage.removeItem(pendingKey);
  return Object.freeze({status:rejected?"rejected":"received",account:false,sign:false,sendTransaction:false});
}
