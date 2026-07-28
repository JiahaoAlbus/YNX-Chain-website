import React, { useState } from "react";
import { Check, Code2, Copy, ExternalLink, Server, ShieldCheck, Terminal } from "lucide-react";
import { apiConfig } from "../lib/api/ynxApi.js";

const endpoints = [
  ["Chain status", "GET", `${apiConfig.apiBase}/status`, "Network identity, current height, native asset, and build identity."],
  ["Validator roles", "GET", `${apiConfig.apiBase}/validators`, "Public role reachability and reported heights. Reachability alone is not BFT proof."],
  ["EVM JSON-RPC", "POST", apiConfig.evmRpc, "EVM-compatible reads, transactions, receipts, logs, balances, and chain identity."],
  ["Explorer", "GET", apiConfig.explorerUrl, "Human-readable blocks, transactions, accounts, validators, and indexed evidence."],
  ["Faucet", "GET", apiConfig.faucetUrl, "Rate-limited Testnet YNXT entry. Test assets have no represented monetary value."],
];

const statusExample = `curl --fail --silent --show-error \\
  ${apiConfig.apiBase}/status`;

const evmExample = `curl --fail --silent --show-error \\
  -H "content-type: application/json" \\
  --data '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}' \\
  ${apiConfig.evmRpc}`;

export function ApiPage() {
  return (
    <main className="apiPage">
      <header className="guideHero apiHero">
        <p className="sectionEyebrow">API reference</p>
        <h1>Public interfaces with explicit evidence boundaries.</h1>
        <p>YNX APIs expose Testnet state and integration surfaces. Clients must render loading, empty, stale, unavailable, and error states without inventing fallback metrics.</p>
        <div className="apiIdentity">
          <div><span>Network</span><strong>YNX Testnet</strong></div>
          <div><span>EVM Chain ID</span><strong>6423 / 0x1917</strong></div>
          <div><span>Native asset</span><strong>YNXT</strong></div>
          <div><span>Production Mainnet</span><strong>Not claimed</strong></div>
        </div>
      </header>

      <section className="endpointReference" aria-labelledby="endpoint-title">
        <div className="guideSectionHeader">
          <p className="sectionEyebrow">Endpoints</p>
          <h2 id="endpoint-title">Start from the narrowest public surface</h2>
        </div>
        <div className="endpointTable" role="table" aria-label="YNX public API endpoints">
          <div className="endpointReferenceHead" role="row"><span>Surface</span><span>Method</span><span>URL</span><span>Purpose</span></div>
          {endpoints.map(([name, method, url, purpose]) => (
            <div className="endpointReferenceRow" role="row" key={name}>
              <strong>{name}</strong>
              <code className={`method ${method.toLowerCase()}`}>{method}</code>
              <a href={url}>{url}{url.startsWith("http") && <ExternalLink aria-hidden="true" />}</a>
              <p>{purpose}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="apiExamples" aria-labelledby="examples-title">
        <div className="guideSectionHeader">
          <p className="sectionEyebrow">Examples</p>
          <h2 id="examples-title">Verify identity before application logic</h2>
        </div>
        <div className="apiExampleGrid">
          <CodeExample icon={Server} title="Read chain status" code={statusExample} />
          <CodeExample icon={Terminal} title="Confirm EVM chain ID" code={evmExample} />
        </div>
      </section>

      <section className="apiContract" aria-labelledby="contract-title">
        <ShieldCheck aria-hidden="true" />
        <div>
          <p className="sectionEyebrow">Client contract</p>
          <h2 id="contract-title">Fail visibly and recover deliberately.</h2>
        </div>
        <ul>
          <li>Set a bounded timeout and show an unavailable state.</li>
          <li>Do not replace missing values with zero or a sample metric.</li>
          <li>After a write timeout, query by transaction hash before retrying.</li>
          <li>Compare validator heights; do not infer convergence from HTTP success.</li>
          <li>Keep secrets and signing keys out of browser logs and support messages.</li>
        </ul>
      </section>
    </main>
  );
}

function CodeExample({ icon: Icon, title, code }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };
  return (
    <article>
      <header><Icon aria-hidden="true" /><h3>{title}</h3></header>
      <pre><code>{code}</code></pre>
      <button type="button" onClick={copy} aria-label={`Copy ${title} command`}>
        {copied ? <Check /> : <Copy />}{copied ? "Copied" : "Copy"}
      </button>
    </article>
  );
}
