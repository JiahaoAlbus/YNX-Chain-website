import React, { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, CheckCircle2, Clipboard, Database, ExternalLink, FileWarning, Network, Search, ShieldCheck, WalletCards } from "lucide-react";
import { apiConfig, loadNetworkSnapshot, YNX_6423 } from "../lib/api/ynxApi.js";

const external = (label, href) => ({ label, href, external: /^https?:/.test(href) });

const pages = {
  "/blockchain": {
    eyebrow: "Network overview", title: "Explore YNX 6423 without leaving the official path.",
    lead: "The official website summarizes the verified YNX Testnet. Detailed blocks, transactions, addresses, contracts, validators and search live in the independent Explorer.",
    facts: ["Latest height is checked against RPC and Explorer Indexer together.", "A lower height is expected for a newly started Testnet; it is not migrated from retired networks.", "When RPC and Indexer differ, this site shows degraded rather than presenting a normal state."],
    actions: [external("Open YNX Explorer", apiConfig.explorerUrl), external("Open Network Monitor", apiConfig.monitorUrl)]
  },
  "/tokens": {
    eyebrow: "Native asset", title: "YNXT is visible, testnet-only, and verifiable.",
    lead: "YNXT is the native asset of YNX Testnet. It is used for gas, fees and network resources. No market price, market cap or supply is shown without an authoritative public source.",
    facts: ["Native asset: YNXT", "Network: YNX Testnet", "Supply and market data: currently unavailable through a public authority"],
    actions: [external("View YNXT in Explorer", `${apiConfig.explorerUrl}/tokens/YNXT`), external("Get Testnet YNXT", apiConfig.faucetUrl)]
  },
  "/data": {
    eyebrow: "Data center", title: "Verified data comes with a boundary.",
    lead: "Current network information is live only after chain identity and Indexer alignment succeed. Historical charts remain unavailable until a timestamped authoritative history service is published.",
    facts: ["Range controls do not manufacture a chart from a short live window.", "Every current value includes a source and refresh timestamp.", "Network health is read from RPC, Explorer, Faucet and Monitor separately."],
    actions: [external("Open Network Monitor", apiConfig.monitorUrl), external("Open Explorer data", apiConfig.explorerUrl)]
  },
  "/governance": {
    eyebrow: "Governance", title: "Governance data is not inferred.",
    lead: "The official site does not currently have a verified public governance index for YNX 6423. Proposal lists, votes and parameters are intentionally unavailable instead of being filled with sample records.",
    facts: ["No verified proposal endpoint is configured.", "No vote or parameter value is displayed as current.", "Use the documentation and source repository for implementation material."],
    actions: [external("Open governance source", "https://github.com/JiahaoAlbus/YNX-Chain/tree/main/docs"), external("Read Docs", "/docs")]
  },
  "/developers": {
    eyebrow: "Developer portal", title: "Build against one canonical Testnet identity.",
    lead: "RPC, EVM, Explorer and Faucet are presented as separate verified services. Connecting a wallet, adding a network, signing or sending never happens automatically.",
    facts: ["Cosmos chain ID: ynx_6423-1", "EVM chain ID: 6423 / 0x1917", "Native asset: YNXT"],
    actions: [external("Read Developer Docs", "/docs"), external("Open Chain GitHub", "https://github.com/JiahaoAlbus/YNX-Chain")]
  },
  "/downloads": {
    eyebrow: "Download center", title: "Only verified releases should be installed.",
    lead: "The download directory labels platform, version, checksum and signing state. A candidate, unsigned build, simulator or unavailable platform is never presented as a production release.",
    facts: ["Wallet and tools are separate products.", "Every enabled download must lead to a real release artifact.", "Use installation notes before replacing or importing a wallet."],
    actions: [external("Open verified downloads", "/dapp/download"), external("Read installation manual", "/manual")]
  },
  "/ecosystem": {
    eyebrow: "YNX Ecosystem", title: "Choose a product by what you need to do.",
    lead: "The ecosystem directory separates Wallet, DeFi, Payments, Developer, AI, Social, Data, Media, Commerce and Infrastructure. Each product remains independently status-labelled.",
    facts: ["A source repository alone does not mean a product is publicly deployed.", "A Testnet, Preview or Unavailable label stays visible at every entry.", "Wallet availability is kept distinct from MetaMask compatibility."],
    actions: [external("Open ecosystem directory", "/dapp"), external("Check product status", "/status")]
  },
  "/more": {
    eyebrow: "Project resources", title: "Everything else has a clear destination.",
    lead: "Find the whitepaper, documentation, source code, network monitor and official community channels here. External destinations are always marked before you leave the official website.",
    facts: ["YNX Website: ynxweb4.com", "Testnet only: Mainnet is not claimed", "Never share a recovery phrase, private key or password with support."],
    actions: [external("Read whitepaper", "/docs"), external("Open GitHub", "https://github.com/JiahaoAlbus/YNX-Chain"), external("Join Discord", "https://discord.gg/t8KpAF2KE")]
  }
};

export const portalRoutes = new Set(Object.keys(pages));

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  return <button type="button" className="copyMini" onClick={async () => { await navigator.clipboard?.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1600); }} aria-label={`Copy ${value}`}>{copied ? <CheckCircle2 /> : <Clipboard />}</button>;
}

export function PortalPage({ path }) {
  const page = pages[path];
  const [network, setNetwork] = useState({});
  useEffect(() => { loadNetworkSnapshot().then(setNetwork); }, []);
  const health = useMemo(() => network.ok === true ? "Verified" : network.degraded ? "Degraded" : network.error ? "Unavailable" : "Checking", [network]);
  if (!page) return null;
  const config = [
    ["Cosmos", YNX_6423.cosmosChainId], ["EVM", YNX_6423.evmChainId], ["RPC", apiConfig.apiBase], ["Explorer", apiConfig.explorerUrl]
  ];
  return <main className="portalPage" id="main-content">
    <section className="portalHero"><p className="sectionEyebrow">{page.eyebrow}</p><h1>{page.title}</h1><p>{page.lead}</p><div className="portalActions">{page.actions.map((action) => <a className="button primary" key={action.label} href={action.href}>{action.label}{action.external && <ExternalLink size={16} />}{!action.external && <ArrowUpRight size={16} />}</a>)}</div></section>
    <section className="portalStatus" aria-label="Current network verification"><div><span className={`statusPill ${health.toLowerCase()}`}>{health === "Verified" ? <ShieldCheck /> : <FileWarning />}{health}</span><h2>Current 6423 verification</h2><p>{network.checkedAt ? `Checked ${new Date(network.checkedAt).toLocaleString()}` : "Fetching canonical public services…"}</p></div><div className="portalLiveValues"><span><small>RPC height</small><strong>{network.status?.height ?? "Unavailable"}</strong></span><span><small>Indexer height</small><strong>{network.explorer?.indexedHeight ?? "Unavailable"}</strong></span><span><small>Indexer state</small><strong>{network.explorer?.indexerOk === true ? "Aligned" : "Unavailable"}</strong></span></div></section>
    <section className="portalLayout"><article className="portalFacts"><h2>What this means</h2><ul>{page.facts.map((fact) => <li key={fact}><CheckCircle2 />{fact}</li>)}</ul></article><aside className="portalConfig"><div className="portalConfigHead"><Network /><div><h2>YNX 6423 configuration</h2><p>One shared configuration source.</p></div></div>{config.map(([label, value]) => <div className="portalConfigRow" key={label}><span>{label}</span><code>{value}</code><CopyButton value={value} /></div>)}</aside></section>
    {path === "/data" && <section className="unavailableChart"><div><Database /><h2>Historical charts unavailable</h2><p>A public history API has not been independently verified. Select a different source when it becomes available; this page will not generate a synthetic trend.</p></div><button type="button" disabled><Search />Range: unavailable</button></section>}
    {path === "/tokens" && <section className="ynxtCard"><WalletCards /><div><p className="sectionEyebrow">YNXT</p><h2>Testnet gas, fees and resources</h2><p>Get test assets from the faucet, then verify the resulting transaction in the separate Explorer.</p></div><a href={apiConfig.faucetUrl} className="button primary">Get Testnet YNXT <ExternalLink size={16} /></a></section>}
  </main>;
}
