import React, { useMemo, useState } from "react";
import { BookOpen, Braces, Code2, Copy, Search, ShieldCheck, WalletCards } from "lucide-react";
import { apiConfig } from "../lib/api/ynxApi.js";

const sections = [
  { id: "quickstart", title: "Quickstart", icon: BookOpen, body: "Connect to the current public testnet with YNXT as the native gas and resource asset.", rows: [["Network", "YNX Testnet"], ["Chain ID", "6423"], ["EVM chain ID", "0x1917"], ["Native coin", "YNXT"], ["REST RPC", apiConfig.apiBase], ["EVM JSON-RPC", apiConfig.evmRpc], ["Explorer", apiConfig.explorerUrl], ["Faucet", apiConfig.faucetUrl]] },
  { id: "wallet", title: "Addresses and wallet", icon: WalletCards, body: "First-party YNX surfaces use ynx1 as the default identity. Standard EVM tooling uses the equivalent 0x address only inside the compatibility boundary.", code: `await ethereum.request({\n  method: "wallet_addEthereumChain",\n  params: [{\n    chainId: "0x1917",\n    chainName: "YNX Testnet",\n    nativeCurrency: { name: "YNXT", symbol: "YNXT", decimals: 18 },\n    rpcUrls: ["${apiConfig.evmRpc}"],\n    blockExplorerUrls: ["${apiConfig.explorerUrl}"]\n  }]\n});` },
  { id: "rpc", title: "RPC", icon: Code2, body: "The REST surface exposes chain status, blocks, accounts, transactions, validators, and ecosystem APIs. EVM JSON-RPC supports the verified compatibility subset.", code: `curl ${apiConfig.apiBase}/status\n\ncurl -X POST ${apiConfig.evmRpc} \\\n  -H 'content-type: application/json' \\\n  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'` },
  { id: "sdk", title: "SDKs", icon: Braces, body: "Dependency-free JavaScript and Python clients have reproducible local artifacts. They are not yet claimed as published npm or PyPI packages.", rows: [["JavaScript", "sdk/js"], ["Python", "sdk/python"], ["Address vectors", "testdata/address-vectors.json"], ["Registry status", "Not published"]] },
  { id: "pay", title: "Pay API", icon: Code2, body: "Merchant-authenticated intents, invoices, refunds, webhook signatures, idempotency, and event records are deployed. The website does not expose merchant secrets.", rows: [["Health", "https://pay.ynxweb4.com/health"], ["Asset", "YNXT testnet"], ["Consumer checkout UI", "Not delivered"]] },
  { id: "trust", title: "Trust and governance", icon: ShieldCheck, body: "Request validity, evidence requirements, overbroad-request rejection, native YNXT protection, appeals, corrections, and transparency records are implemented.", rows: [["Health", "https://trust.ynxweb4.com/health"], ["Native YNXT freeze", "Not allowed"], ["Labels", "Advisory and evidence-bound"]] },
  { id: "chat", title: "Chat", icon: ShieldCheck, body: "The encrypted direct-message backend is deployed on a private loopback boundary. Public Chat is blocked until device sessions prove control of the claimed on-chain account.", rows: [["Backend", "Deployed privately"], ["Public route", "Disabled"], ["Groups and media", "Not implemented"]] },
  { id: "ide", title: "IDE and contracts", icon: Code2, body: "Compiler and pinned bounded contract execution have verification evidence. Arbitrary EVM completeness and a production IDE application are not claimed.", rows: [["Compile", "Verified"], ["Pinned deploy/call", "Verified candidate proof"], ["Full arbitrary EVM", "Not implemented"], ["IDE product UI", "Not delivered"]] },
  { id: "roadmap", title: "Readiness boundaries", icon: ShieldCheck, body: "Bank, Shop, production desktop apps, mainnet, exchange listings, stablecoin issuer support, wallet default support, and third-party partnerships remain future work or external approvals.", rows: [["Public network", "Testnet"], ["Mainnet", "Not launched"], ["Bank / Shop", "Planned"], ["macOS / Windows", "Not delivered"]] }
];

export function DocsPage() {
  const [query, setQuery] = useState("");
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle ? sections.filter((section) => `${section.title} ${section.body} ${JSON.stringify(section.rows || [])}`.toLowerCase().includes(needle)) : sections;
  }, [query]);

  return (
    <main className="docsPage">
      <header className="docsHeader"><p className="sectionEyebrow">Developer documentation</p><h1>Build on YNX Testnet.</h1><p>Network parameters, public surfaces, and current implementation boundaries in one place.</p></header>
      <div className="docsSearch"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search YNX documentation" aria-label="Search documentation" /></div>
      <div className="docsLayout">
        <nav className="docsNav" aria-label="Documentation sections">{sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}</nav>
        <div className="docsContent">
          {visible.map((section) => <DocSection key={section.id} section={section} />)}
          {!visible.length && <section className="docsNoResults"><Search /><h2>No matching documentation</h2><p>Try a network, wallet, Pay, Trust, Chat, IDE, or readiness term.</p></section>}
        </div>
      </div>
    </main>
  );
}

function DocSection({ section }) {
  const Icon = section.icon;
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(section.code); setCopied(true); window.setTimeout(() => setCopied(false), 1400); } catch { setCopied(false); }
  };
  return (
    <section className="docSection" id={section.id}>
      <div className="docTitle"><Icon /><div><h2>{section.title}</h2><p>{section.body}</p></div></div>
      {section.rows && <dl className="docRows">{section.rows.map(([term, value]) => <div key={term}><dt>{term}</dt><dd>{value}</dd></div>)}</dl>}
      {section.code && <div className="codeBlock"><button onClick={copy} aria-label={`Copy ${section.title} example`} title={`Copy ${section.title} example`}><Copy />{copied && <span>Copied</span>}</button><pre><code>{section.code}</code></pre></div>}
    </section>
  );
}
