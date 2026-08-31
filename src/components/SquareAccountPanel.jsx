import React, { useEffect, useRef, useState } from "react";
import { AlertTriangle, LogOut, RefreshCw, ShieldCheck, Trash2, WalletCards } from "lucide-react";
import { networkParams } from "../lib/api/ynxApi.js";
import {
  YNX_EVM_CHAIN_ID,
  clearLegacyLocalSignerData,
  connectCanonicalProvider,
  discoverCanonicalProviders,
  hasLegacyLocalSignerData,
  subscribeCanonicalProvider,
  switchCanonicalProviderToYNX,
} from "../lib/walletProvider.js";

export function SquareAccountPanel() {
  const unsubscribeProviderRef = useRef(() => {});
  const [providers, setProviders] = useState([]);
  const [connection, setConnection] = useState({ state: "idle", account: "", chainId: "", entry: null });
  const [legacyDetected, setLegacyDetected] = useState(() => hasLegacyLocalSignerData());
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => discoverCanonicalProviders({ onChange: setProviders }), []);
  useEffect(() => () => unsubscribeProviderRef.current(), []);

  const connect = async (entry) => {
    await withBusy("connecting", async () => {
      const next = await connectCanonicalProvider(entry);
      unsubscribeProviderRef.current();
      unsubscribeProviderRef.current = subscribeCanonicalProvider(entry, handleProviderState);
      setConnection({ state: "connected", account: next.account, chainId: next.chainId, entry });
      setNotice(next.chainId === YNX_EVM_CHAIN_ID
        ? `${entry.identity.label} connected to YNX 6423 / 0x1917.`
        : `${entry.identity.label} connected. Switch to YNX 6423 before any account-bound action.`);
    });
  };

  const switchNetwork = async () => {
    if (!connection.entry) return;
    await withBusy("switching", async () => {
      const chainId = await switchCanonicalProviderToYNX(connection.entry, networkParams());
      setConnection((current) => ({ ...current, chainId }));
      setNotice("Wallet readback confirmed YNX 6423 / 0x1917.");
    });
  };

  const disconnect = () => {
    unsubscribeProviderRef.current();
    unsubscribeProviderRef.current = () => {};
    setConnection({ state: "idle", account: "", chainId: "", entry: null });
    setNotice("Website connection cleared. Wallet permissions remain under the wallet's control.");
    setError("");
  };

  const clearLegacy = () => {
    const confirmed = window.confirm([
      "Clear legacy local signer data from this website?",
      "",
      "The current website cannot open, export, or recover it. Back it up first using the original version or an isolated recovery tool. This action cannot be undone.",
    ].join("\n"));
    if (!confirmed) return;
    const result = clearLegacyLocalSignerData();
    setLegacyDetected(hasLegacyLocalSignerData());
    setNotice(result.removed
      ? "Legacy local signer data cleared without reading its contents. A non-sensitive browser audit event was emitted."
      : "No legacy local signer data remained.");
    setError("");
  };

  const handleProviderState = (event) => {
    if (event.type === "disconnect" || (event.type === "accountsChanged" && event.accounts.length === 0)) {
      disconnect();
      return;
    }
    if (event.type === "accountsChanged") {
      setConnection((current) => ({ ...current, account: event.accounts[0] || "" }));
      setNotice("Wallet account change read back from the selected provider.");
    }
    if (event.type === "chainChanged") {
      setConnection((current) => ({ ...current, chainId: event.chainId }));
      setNotice(event.chainId === YNX_EVM_CHAIN_ID
        ? "Wallet chain change readback confirmed YNX 6423 / 0x1917."
        : "Wallet left YNX 6423. Account-bound actions remain unavailable.");
    }
  };

  const withBusy = async (name, operation) => {
    setBusy(name); setError(""); setNotice("");
    try { await operation(); } catch (nextError) { setError(safeMessage(nextError)); }
    finally { setBusy(""); }
  };

  const ready = connection.state === "connected" && connection.chainId === YNX_EVM_CHAIN_ID;

  return (
    <section className="squareWorkspace canonicalWalletWorkspace" aria-label="YNX Square canonical wallet workspace">
      <div className="squareAccountPane">
        <div className="workspaceTitle"><WalletCards /><span><small>Canonical wallet provider</small><strong>{connection.entry ? connection.entry.identity.label : "Choose YNX Wallet or MetaMask"}</strong></span></div>

        {connection.state !== "connected" ? <div className="providerChooser">
          <p>The website never creates, imports, stores, decrypts, or signs with a private key. Account access stays inside the selected wallet.</p>
          {providers.length ? providers.map((entry, index) => (
            <button type="button" className="button primary" key={`${entry.info.uuid || entry.identity.rdns}-${index}`} onClick={() => connect(entry)} disabled={Boolean(busy)}>
              <WalletCards />{busy === "connecting" ? "Waiting for wallet" : `Connect ${entry.identity.label}`}
            </button>
          )) : <div className="providerUnavailable"><AlertTriangle /><span><strong>No canonical provider detected</strong><small>Install or enable YNX Wallet or MetaMask, then retry discovery.</small></span></div>}
          <button type="button" className="button quiet providerRetry" onClick={() => window.dispatchEvent(new Event("eip6963:requestProvider"))}><RefreshCw />Retry discovery</button>
        </div> : <div className="canonicalAccountStatus">
          <code>{connection.account}</code>
          <p className={ready ? "walletNetwork ready" : "walletNetwork"}>Chain readback: {connection.chainId || "unavailable"}{ready ? " · YNX 6423" : " · not YNX 6423"}</p>
          {!ready && <button type="button" className="button primary" onClick={switchNetwork} disabled={Boolean(busy)}>{busy === "switching" ? "Waiting for wallet" : "Switch to YNX 6423"}</button>}
          <button type="button" className="button quiet" onClick={disconnect}><LogOut />Disconnect website</button>
        </div>}

        {legacyDetected && <aside className="legacySignerNotice" aria-live="polite">
          <AlertTriangle />
          <div><strong>Legacy local signer data detected</strong><p>Its contents were not read. The current website cannot unlock or export it. Use the original version or an isolated recovery tool to make a backup before manually clearing this browser copy.</p></div>
          <button type="button" className="button danger" onClick={clearLegacy}><Trash2 />Clear legacy browser copy</button>
        </aside>}
      </div>

      <div className="squareComposer canonicalWriteBoundary">
        <div className="workspaceTitle"><ShieldCheck /><span><small>Provider-authenticated publishing</small><strong>{ready ? "Wallet connected · writes fail closed" : "Connect on YNX 6423"}</strong></span></div>
        <p>Square's deployed write API still expects the retired website-local signer protocol. This website will not recreate that authority or ask for a pointless signature. Publishing remains unavailable until Square accepts the canonical wallet provider session.</p>
        <textarea value="" readOnly disabled placeholder="Publishing is unavailable until the canonical provider session is accepted." aria-label="Square publishing unavailable" />
        <div className="composerFooter"><span>0/2000</span><button type="button" className="button primary" disabled>Publish unavailable</button></div>
      </div>

      {(error || notice) && <div className={`workspaceNotice ${error ? "error" : "success"}`} role="status">{error || notice}</div>}
    </section>
  );
}

function safeMessage(error) {
  const message = String(error?.message || "Canonical wallet operation failed.");
  if (/private|secret|token|vault|mnemonic/i.test(message)) return "Canonical wallet operation failed safely.";
  return message.slice(0, 180);
}
