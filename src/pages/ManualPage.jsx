import React from "react";
import {
  ArrowUpRight, CheckCircle2, CircleAlert, ExternalLink, LifeBuoy, Network,
  RefreshCw, Search, ShieldCheck, WalletCards
} from "lucide-react";
import { apiConfig } from "../lib/api/ynxApi.js";

const steps = [
  {
    number: "01",
    title: "Verify the network",
    text: "Confirm that the status surface reports YNX Testnet and chain ID 6423 before connecting a wallet or sending a transaction.",
    href: "/status",
    label: "Check status",
    icon: Network,
  },
  {
    number: "02",
    title: "Use a testnet account",
    text: "Keep the ynx1 address as the first-party identity. Use the matching 0x form only inside EVM-compatible tools such as MetaMask or Solidity workflows.",
    href: "/#address",
    label: "Convert an address",
    icon: WalletCards,
  },
  {
    number: "03",
    title: "Get test YNXT",
    text: "Use the public Faucet only for testnet gas. YNXT on YNX Testnet has no represented monetary value or guaranteed liquidity.",
    href: apiConfig.faucetUrl,
    label: "Open Faucet",
    icon: CheckCircle2,
  },
  {
    number: "04",
    title: "Verify every result",
    text: "After a write, confirm its transaction hash and receipt in Explorer. A timeout is not proof that a transaction failed.",
    href: apiConfig.explorerUrl,
    label: "Open Explorer",
    icon: Search,
  },
];

const recovery = [
  ["Loading takes too long", "Wait once, then refresh status. Do not submit a state-changing request repeatedly."],
  ["The API is unavailable", "Preserve the request or transaction hash, check Status and Explorer, then retry only when the outcome is known."],
  ["A transaction is not visible", "Search both the ynx1 and equivalent 0x account form. Confirm the selected chain ID is 6423."],
  ["The wallet shows another network", "Reject the request, switch back to YNX Testnet, and re-check the destination and amount."],
  ["A support message asks for secrets", "Stop. YNX support never needs a mnemonic, private key, password, or local signer vault."],
];

export function ManualPage() {
  return (
    <main className="guidePage">
      <header className="guideHero">
        <p className="sectionEyebrow">User manual</p>
        <h1>Operate on YNX Testnet with evidence at every step.</h1>
        <p>This manual covers the public network path from connection through recovery. It separates live Testnet behavior from future Mainnet, signing, listing, and store-release claims.</p>
        <div className="guideActions">
          <a className="button primary" href="/status">Check network status <ArrowUpRight /></a>
          <a className="button secondary" href="/faq">Read FAQ</a>
        </div>
      </header>

      <section className="guideSteps" aria-labelledby="manual-start">
        <div className="guideSectionHeader">
          <p className="sectionEyebrow">Safe start</p>
          <h2 id="manual-start">From zero to a verified testnet action</h2>
        </div>
        <ol>
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <li key={step.number}>
                <span className="guideNumber">{step.number}</span>
                <Icon aria-hidden="true" />
                <div><h3>{step.title}</h3><p>{step.text}</p></div>
                <a href={step.href}>{step.label} {step.href.startsWith("http") ? <ExternalLink /> : <ArrowUpRight />}</a>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="recoverySection" aria-labelledby="recovery-title">
        <div className="recoveryIntro">
          <RefreshCw aria-hidden="true" />
          <p className="sectionEyebrow">Recovery</p>
          <h2 id="recovery-title">Uncertainty is a state, not a reason to guess.</h2>
          <p>When a surface is stale, empty, unavailable, or returns an error, preserve evidence and establish the last confirmed state before retrying.</p>
        </div>
        <div className="recoveryList">
          {recovery.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="supportCallout" aria-labelledby="manual-support">
        <ShieldCheck aria-hidden="true" />
        <div>
          <p className="sectionEyebrow">Security boundary</p>
          <h2 id="manual-support">Use public evidence before asking anyone to intervene.</h2>
          <p>Never share a mnemonic, private key, password, one-time code, or custody material. Report suspected security issues without posting exploitable details publicly.</p>
        </div>
        <div>
          <a href="/security"><CircleAlert /> Security guidance</a>
          <a href="/support"><LifeBuoy /> Support and recovery</a>
        </div>
      </section>
    </main>
  );
}
