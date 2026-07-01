import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Activity, Bot, Code2, Database, ExternalLink, Landmark, ShieldCheck, WalletCards } from "lucide-react";
import "./styles.css";

const API_BASE = import.meta.env.VITE_YNX_API_BASE_URL || "http://127.0.0.1:6420";
const EVM_RPC = import.meta.env.VITE_YNX_EVM_RPC_URL || `${API_BASE}/evm`;
const EXPLORER_URL = import.meta.env.VITE_YNX_EXPLORER_URL || "";
const FAUCET_URL = import.meta.env.VITE_YNX_FAUCET_URL || "";
const DOCS_URL = import.meta.env.VITE_YNX_DOCS_URL || "";

function App() {
  const [status, setStatus] = useState({ loading: true });
  const [summary, setSummary] = useState({ loading: true });
  const [evm, setEvm] = useState({ loading: true });
  const lastChecked = useMemo(() => new Date().toISOString(), []);

  useEffect(() => {
    loadJson(`${API_BASE}/status`).then(setStatus);
    loadJson(`${API_BASE}/explorer/summary`).then(setSummary);
    loadEvmChainId().then(setEvm);
  }, []);

  return (
    <main>
      <section className="hero">
        <div className="heroInner">
          <p className="eyebrow">Web4 L1 infrastructure</p>
          <h1>YNX Chain</h1>
          <p className="sub">
            AI-native, payment-native, resource-native, Trust-native infrastructure for YNXT settlement and verifiable developer workflows.
          </p>
          <div className="actions">
            <button onClick={addNetwork}><WalletCards size={18}/> Add YNX Testnet</button>
            <button onClick={switchNetwork}><Activity size={18}/> Switch Network</button>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="grid">
          <StatusCard icon={<Activity/>} title="RPC Status" data={status} value={status.height} label="latest height" endpoint={`${API_BASE}/status`} lastChecked={lastChecked}/>
          <StatusCard icon={<Database/>} title="Explorer Data" data={summary} value={summary.totalTransactions} label="transactions indexed" endpoint={`${API_BASE}/explorer/summary`} lastChecked={lastChecked}/>
          <StatusCard icon={<WalletCards/>} title="EVM RPC" data={evm} value={evm.result} label="eth_chainId" endpoint={EVM_RPC} lastChecked={lastChecked}/>
          <StatusCard icon={<ShieldCheck/>} title="Native Coin" data={status} value={status.nativeCurrencySymbol} label="gas token" endpoint={`${API_BASE}/status`} lastChecked={lastChecked}/>
        </div>
      </section>

      <section className="productGrid">
        <Product icon={<Bot/>} title="YNX AI" text="Streaming AI gateway with session isolation and explicit confirmation for sensitive actions."/>
        <Product icon={<Landmark/>} title="YNX Pay" text="Payment intent, invoice, webhook signing, refund records, merchant API and risk hooks."/>
        <Product icon={<ShieldCheck/>} title="YNX Trust" text="Lot lineage and pro-rata taint tracking for explainable evidence, not default fund freezing."/>
        <Product icon={<Code2/>} title="YNX IDE" text="Contract templates, compile preflight, testnet deploy workflow, verifier and SDK examples."/>
      </section>

      <section className="links">
        <External label="Explorer" href={EXPLORER_URL}/>
        <External label="Faucet" href={FAUCET_URL}/>
        <External label="Docs" href={DOCS_URL}/>
        <External label="API Status" href={`${API_BASE}/status`}/>
      </section>
    </main>
  );
}

async function loadJson(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    return { error: error.message, endpoint: url, checkedAt: new Date().toISOString() };
  }
}

async function loadEvmChainId() {
  try {
    const res = await fetch(EVM_RPC, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_chainId", params: [] })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    return { error: error.message, endpoint: EVM_RPC, checkedAt: new Date().toISOString() };
  }
}

async function addNetwork() {
  const ethereum = window.ethereum;
  if (!ethereum) return alert("No EIP-1193 wallet detected.");
  await ethereum.request({ method: "wallet_addEthereumChain", params: [networkParams()] });
}

async function switchNetwork() {
  const ethereum = window.ethereum;
  if (!ethereum) return alert("No EIP-1193 wallet detected.");
  await ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: "0x1917" }] });
}

function networkParams() {
  return {
    chainId: "0x1917",
    chainName: "YNX Testnet",
    nativeCurrency: { name: "YNXT", symbol: "YNXT", decimals: 18 },
    rpcUrls: [EVM_RPC],
    blockExplorerUrls: EXPLORER_URL ? [EXPLORER_URL] : []
  };
}

function StatusCard({ icon, title, data, value, label, endpoint, lastChecked }) {
  const error = data?.error;
  return (
    <article className={`card ${error ? "error" : ""}`}>
      <div className="cardTop">{icon}<span>{title}</span></div>
      {error ? <><strong>Service unavailable</strong><p>{endpoint}</p><p>{error}</p><p>{data.checkedAt}</p></> : <><strong>{value ?? "loading"}</strong><p>{label}</p><p>{endpoint}</p><p>{lastChecked}</p></>}
    </article>
  );
}

function Product({ icon, title, text }) {
  return <article className="product">{icon}<h2>{title}</h2><p>{text}</p></article>;
}

function External({ label, href }) {
  const disabled = !href;
  return <a className={disabled ? "disabled" : ""} href={disabled ? undefined : href}>{label}<ExternalLink size={16}/></a>;
}

createRoot(document.getElementById("root")).render(<App />);
