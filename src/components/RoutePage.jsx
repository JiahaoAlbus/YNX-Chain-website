import React from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { apiConfig } from "../lib/api/ynxApi.js";

const pages = {
  "/docs": ["Developer docs", "Build against the live YNX Testnet", "Use ynx1 as the default account identity with the public RPC, Explorer, Faucet, JavaScript SDK, and Python SDK. The equivalent 0x value belongs only to the EVM compatibility surface used by standard MetaMask and Solidity tooling.", [["Address converter", "/#address"], ["Chain documentation", "https://github.com/JiahaoAlbus/YNX-Chain/tree/main/docs"], ["JavaScript SDK", "https://github.com/JiahaoAlbus/YNX-Chain/tree/main/sdk/js"], ["Python SDK", "https://github.com/JiahaoAlbus/YNX-Chain/tree/main/sdk/python"]]],
  "/testnet": ["Public testnet", "Connect to YNX Testnet", "The current public network uses chain ID 6423, EVM chain ID 0x1917, and YNXT as its native gas and resource asset. It currently runs an authoritative producer/follower topology while the independently reviewed public BFT migration remains pending.", [["Open Explorer", apiConfig.explorerUrl], ["Request YNXT", apiConfig.faucetUrl]]],
  "/validators": ["Network", "Four public validator roles", "Primary, Singapore, Silicon Valley, and Seoul roles are remotely deployed and converge on fixed-height block hashes. Public CometBFT voting is not active yet, so these roles must not be described as live BFT consensus validators.", [["Live validator API", `${apiConfig.apiBase}/validators`], ["Network status", `${apiConfig.apiBase}/status`]]],
  "/builders": ["Developers", "Build with verifiable surfaces", "Use EVM-compatible RPC, read-only SDK clients, Faucet, Explorer, Pay, Trust, Resource, and bounded IDE tooling. Treat the current network as a public testnet, not mainnet infrastructure.", [["Developer docs", "/docs"], ["GitHub", "https://github.com/JiahaoAlbus/YNX-Chain"]]],
  "/readiness": ["Readiness", "Current evidence, not future claims", "The authoritative public testnet, ecosystem services, ynx1 account mapping, and signed exchange-candidate transaction flows are live. A production YNX native wallet, public BFT, independent public-vantage proof, production custody completion, mainnet audit/legal readiness, listings, issuer integrations, and partnerships remain incomplete.", [["Ecosystem package", apiConfig.ecosystemUrl], ["Exchange readiness", apiConfig.exchangeUrl]]],
  "/about": ["Project", "A full-stack blockchain ecosystem", "YNX Chain is designed to grow from a verifiable public testnet deployment into an EVM-compatible Web4 L1 ecosystem with YNXT economics, AI-native services, payments, Trust tracing, developer tooling, wallet integration, Explorer infrastructure, and global ecosystem readiness.", [["Source repository", "https://github.com/JiahaoAlbus/YNX-Chain"]]],
  "/privacy": ["Disclosure", "Privacy boundary", "Public blockchain activity is inherently observable. YNX Trust labels and tracing are advisory and evidence-bound; they do not create a hidden native YNXT freeze mechanism. Do not submit secrets, private keys, mnemonics, or unnecessary personal data to public endpoints.", []],
  "/terms": ["Disclosure", "Public testnet terms", "YNX Chain is experimental public testnet software. Test assets have no promised monetary value. Availability, compatibility, data retention, and interfaces may change. No mainnet launch, listing, custody, issuer, wallet-default, or partnership commitment is made.", []],
  "/risk": ["Disclosure", "Risk boundaries", "The current topology is authoritative replication rather than public BFT consensus. Provider-backed AI generation can fail when upstream capacity is unavailable. Smart-contract execution is bounded, custody work is incomplete, and production/mainnet assurances require independent review.", []],
  "/security": ["Security", "Verify before trust", "Deployment uses strict SSH, checksummed releases, scoped backups, fail-closed approvals, and secret scanning. These controls are engineering evidence, not an external audit. Report security issues without including private keys or exploitable secrets in public channels.", [["Source repository", "https://github.com/JiahaoAlbus/YNX-Chain"]]],
  "/support": ["Support", "Use public evidence first", "Check live status, Explorer data, documentation, and repository issues. Never send mnemonics, private keys, passwords, or custody material to anyone claiming to provide support.", [["Live status", `${apiConfig.apiBase}/status`], ["GitHub issues", "https://github.com/JiahaoAlbus/YNX-Chain/issues"]]],
  "/test-assets": ["Testnet", "Request testnet YNXT", "The Faucet distributes rate-limited testnet YNXT for gas and resource testing. Test assets are not mainnet assets and carry no promised monetary value.", [["Open Faucet", apiConfig.faucetUrl]]],
  "/bridge": ["Readiness", "Bridge integration is not claimed live", "Bridge readiness material exists for review, but this website does not claim a production bridge or automatic cross-chain release path for the current YNX Testnet.", [["Readiness overview", "/readiness"]]],
  "/withdraw": ["Readiness", "No production withdrawal promise", "YNX Chain does not currently claim a production bridge withdrawal service. Do not send assets based on legacy route assumptions.", [["Readiness overview", "/readiness"]]],
  "/trading": ["Readiness", "Integration candidate, not a listing", "The public testnet verifies signed native transaction broadcast, nonce, block lookup, exact transaction history, receipts, and logs for exchange integration review. YNX Chain and YNXT are not claimed as exchange-listed; external review and approval remain required.", [["Exchange readiness", apiConfig.exchangeUrl]]],
  "/quant": ["Exchange surface", "Quant Lab remains a candidate interface", "Quant Lab is an Exchange product release surface for bounded strategy research and approval workflows. It is not a live trading system, does not control real funds, and has no public deployment or performance claim.", [["Exchange product status", "/exchange"], ["Readiness boundaries", "/readiness"]]],
  "/status": ["Network status", "Public testnet evidence and limitations", "The authoritative chain and ecosystem health endpoints are publicly reachable. Remote role heights must be compared with the primary height in the live status response; role reachability alone does not prove convergence or public BFT readiness.", [["Live chain status", `${apiConfig.apiBase}/status`], ["Explorer", apiConfig.explorerUrl], ["Readiness boundaries", "/readiness"]]],
  "/ai": ["AI-native services", "Policy-bounded AI actions", "The public AI Gateway supports session and permission architecture, action proposal, approval, and audit flows. Provider-backed generation is not currently complete proof because upstream quota can fail.", [["AI health", "https://ai.ynxweb4.com/health"], ["Readiness overview", "/readiness"]]]
};

export function RoutePage({ path }) {
  const page = pages[path] || pages["/docs"];
  const [eyebrow, title, text, links] = page;
  return (
    <main className="routePage">
      <div className="routeInner">
        <a className="backLink" href="/"><ArrowLeft size={17} /> YNX Chain</a>
        <p className="sectionEyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="routeLead">{text}</p>
        <div className="routeFacts">
          <div><span>Network</span><strong>YNX Testnet</strong></div>
          <div><span>Chain ID</span><strong>6423 / 0x1917</strong></div>
          <div><span>Native coin</span><strong>YNXT</strong></div>
          <div><span>Mainnet</span><strong>Not launched</strong></div>
        </div>
        {links.length > 0 && <div className="routeLinks">{links.map(([label, href]) => <a key={label} className="button primary" href={href}>{label}<ArrowUpRight size={17} /></a>)}</div>}
      </div>
    </main>
  );
}
