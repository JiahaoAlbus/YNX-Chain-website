import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Activity, Bot, Code2, Database, Landmark, ShieldCheck, WalletCards } from "lucide-react";
import { apiConfig, loadJson, loadEvmChainId, networkParams } from "./lib/api/ynxApi.js";
import { Hero } from "./sections/Hero.jsx";
import { StatusCard } from "./components/StatusCard.jsx";
import { ProductPanel } from "./components/ProductPanel.jsx";
import { LinkGrid } from "./components/LinkGrid.jsx";
import "./styles.css";

function App() {
  const [status, setStatus] = useState({ loading: true });
  const [summary, setSummary] = useState({ loading: true });
  const [validators, setValidators] = useState({ loading: true });
  const [monitoring, setMonitoring] = useState({ loading: true });
  const [evm, setEvm] = useState({ loading: true });
  const lastChecked = useMemo(() => new Date().toISOString(), []);

  useEffect(() => {
    loadJson("/status").then(setStatus);
    loadJson("/explorer/summary").then(setSummary);
    loadJson("/validators").then(setValidators);
    loadJson("/monitoring/health").then(setMonitoring);
    loadEvmChainId().then(setEvm);
  }, []);

  return (
    <main>
      <Hero onAddNetwork={addNetwork} onSwitchNetwork={switchNetwork} />

      <section className="band" aria-label="Live network status">
        <div className="grid">
          <StatusCard icon={<Activity />} title="RPC Status" data={status} value={status.height} label="latest height" endpoint={`${apiConfig.apiBase}/status`} lastChecked={lastChecked} />
          <StatusCard icon={<Database />} title="Explorer Data" data={summary} value={summary.totalTransactions} label="transactions indexed" endpoint={`${apiConfig.apiBase}/explorer/summary`} lastChecked={lastChecked} />
          <StatusCard icon={<WalletCards />} title="EVM RPC" data={evm} value={evm.result} label="eth_chainId" endpoint={apiConfig.evmRpc} lastChecked={lastChecked} />
          <StatusCard icon={<ShieldCheck />} title="Validator View" data={validators} value={validators.validators?.length} label="validators returned by API" endpoint={`${apiConfig.apiBase}/validators`} lastChecked={lastChecked} />
          <StatusCard icon={<Activity />} title="Monitoring" data={monitoring} value={monitoring.ok === true ? "online" : "loading"} label="monitoring health" endpoint={`${apiConfig.apiBase}/monitoring/health`} lastChecked={lastChecked} />
          <StatusCard icon={<ShieldCheck />} title="Native Coin" data={status} value={status.nativeCurrencySymbol} label="gas token" endpoint={`${apiConfig.apiBase}/status`} lastChecked={lastChecked} />
        </div>
      </section>

      <section className="productGrid" aria-label="YNX product surface">
        <ProductPanel icon={<Bot />} title="YNX AI" text="Streaming AI gateway with session isolation and explicit confirmation for sensitive actions." statusEndpoint={`${apiConfig.apiBase}/ai/stream?session=website&q=status`} />
        <ProductPanel icon={<Landmark />} title="YNX Pay" text="Payment intent, invoice, webhook signing, refund records, merchant API and risk hooks." statusEndpoint={`${apiConfig.apiBase}/pay/intents`} />
        <ProductPanel icon={<ShieldCheck />} title="YNX Trust" text="Lot lineage, risk labels, evidence JSON and evidence PDF export for explainable review." statusEndpoint={`${apiConfig.apiBase}/trust/trace/{address}`} />
        <ProductPanel icon={<Code2 />} title="YNX IDE" text="Contract compile preflight, testnet deployment workflow, verifier and SDK examples." statusEndpoint={`${apiConfig.apiBase}/ide/compile`} />
      </section>

      <section className="readiness" aria-label="Review package entry points">
        <div>
          <p className="eyebrow dark">review packages</p>
          <h2>Built for reviewers, wallets and ecosystem teams</h2>
          <p>
            This website links outward to YNX Chain evidence packages. Dynamic network facts still come from the public chain APIs; when those APIs are unavailable, the page shows the failing endpoint and last check time.
          </p>
        </div>
        <LinkGrid />
      </section>
    </main>
  );
}

async function addNetwork() {
  const ethereum = window.ethereum;
  if (!ethereum) return alert("No EIP-1193 wallet detected.");
  await ethereum.request({ method: "wallet_addEthereumChain", params: [networkParams()] });
}

async function switchNetwork() {
  const ethereum = window.ethereum;
  if (!ethereum) return alert("No EIP-1193 wallet detected.");
  await ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: networkParams().chainId }] });
}

createRoot(document.getElementById("root")).render(<App />);
