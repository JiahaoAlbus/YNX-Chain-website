import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { consumeWalletCallback } from "../lib/walletAuthCallback.js";

export function WalletAuthCallbackPage() {
  const [message,setMessage]=useState("Verifying the Wallet approval return…");
  useEffect(()=>{let active=true;consumeWalletCallback(window.location.href).then(result=>active&&setMessage(result.status==="rejected"?"Wallet approval was rejected. No Product Session was created.":"Approval return received. The Wallet companion must verify it before any session is active.")).catch(reason=>active&&setMessage(`${reason.code||"CALLBACK_REJECTED"}: Wallet approval return rejected safely.`));return()=>{active=false;};},[]);
  return <main className="routePage"><div className="routeInner"><a className="backLink" href="/dapp/wallet"><ArrowLeft size={17}/> Return to YNX Wallet</a><p className="sectionEyebrow">YNX Wallet / Auth</p><h1>Wallet approval return</h1><p className="routeLead" role="status" aria-live="polite">{message}</p><div className="routeFacts"><div><span>Binding</span><strong>Exact HTTPS callback</strong></div><div><span>Authority</span><strong>Not granted by this page</strong></div><div><span>Replay</span><strong>One-time protected</strong></div><div><span>Network</span><strong>YNX Testnet</strong></div></div></div></main>;
}
