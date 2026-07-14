import React from "react";
import {
  Bot, Braces, CircleDollarSign, Code2, Compass, ExternalLink, Landmark,
  MessageCircle, Search, ShieldCheck, ShoppingBag, WalletCards
} from "lucide-react";
import { apiConfig } from "../lib/api/ynxApi.js";

const apps = [
  { name: "Explorer", icon: Search, state: "Live", tone: "live", detail: "Blocks, transactions, accounts, validators, search, and current testnet evidence.", href: apiConfig.explorerUrl, external: true },
  { name: "Square", icon: Compass, state: "Read-only beta", tone: "beta", detail: "A real persisted public feed. Posting stays locked until chain-account ownership proof is complete.", href: "/square" },
  { name: "Wallet", icon: WalletCards, state: "Foundation verified", tone: "local", detail: "ynx1-native identity and device cryptography are verified. Production custody and recovery remain incomplete.", href: "/docs#wallet" },
  { name: "Chat", icon: MessageCircle, state: "Backend deployed", tone: "local", detail: "Encrypted direct-message core runs privately. Public access is blocked pending chain-account ownership proof.", href: "/docs#chat" },
  { name: "AI", icon: Bot, state: "API live", tone: "live", detail: "Permissioned AI sessions, governed actions, and audit surfaces. Provider capacity can still be unavailable.", href: "/ai" },
  { name: "Pay", icon: CircleDollarSign, state: "API live", tone: "live", detail: "Merchant intents, invoices, idempotency, refunds, webhook signatures, and payment events.", href: "/docs#pay" },
  { name: "Trust", icon: ShieldCheck, state: "API live", tone: "live", detail: "Request validity, evidence-bound tracing, appeals, corrections, and transparency records.", href: "/docs#trust" },
  { name: "IDE", icon: Code2, state: "Bounded engine verified", tone: "local", detail: "Compile and pinned contract execution are verified. A complete production IDE window is not delivered.", href: "/docs#ide" },
  { name: "Developer SDK", icon: Braces, state: "Local artifacts verified", tone: "local", detail: "Reproducible JavaScript and Python clients exist; registry publication is still pending approval.", href: "/docs#sdk" },
  { name: "Bank", icon: Landmark, state: "Planned", tone: "planned", detail: "No consumer banking product is currently implemented or licensed.", href: "/docs#roadmap" },
  { name: "Shop", icon: ShoppingBag, state: "Planned", tone: "planned", detail: "No production marketplace application is currently implemented.", href: "/docs#roadmap" }
];

export function AppsPage() {
  return (
    <main className="appsPage">
      <header className="productPageHeader">
        <p className="sectionEyebrow">YNX ecosystem</p>
        <h1>Apps built on YNX Chain.</h1>
        <p>Live products, verified foundations, and planned applications are separated by evidence.</p>
        <div className="statusLegend" aria-label="Application status legend">
          <span className="live">Live</span><span className="beta">Read-only beta</span><span className="local">Verified foundation</span><span className="planned">Planned</span>
        </div>
      </header>
      <section className="appDirectory" aria-label="YNX application directory">
        {apps.map(({ name, icon: Icon, state, tone, detail, href, external }) => (
          <a className="appItem" href={href} key={name}>
            <span className="appIcon"><Icon /></span>
            <span className="appCopy"><span className={`appState ${tone}`}>{state}</span><strong>{name}</strong><small>{detail}</small></span>
            <span className="appOpen" aria-hidden="true">{external ? <ExternalLink /> : <span>→</span>}</span>
          </a>
        ))}
      </section>
      <aside className="evidenceBoundary">
        <ShieldCheck />
        <div><strong>Product status follows evidence.</strong><p>Backend code, readiness packages, and future plans do not become finished applications until their user workflow, security boundary, deployment, and public verification exist.</p></div>
      </aside>
    </main>
  );
}
