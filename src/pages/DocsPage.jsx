import React, { useMemo, useState } from "react";
import { BookOpen, Braces, Code2, Search, ShieldCheck, WalletCards, Radio, Bot, Megaphone, Cloud, Smartphone, CloudCog, CircleDollarSign, MessageCircle } from "lucide-react";
import { apiConfig } from "../lib/api/ynxApi.js";
import { getCatalog, PRODUCT_STATUS, STATUS_CONFIG } from "../lib/ecosystemCatalog.js";

const staticSections = [
  {
    id: "quickstart",
    title: "Quickstart",
    icon: BookOpen,
    body: "This site keeps the official status first: public testnet, chain status, and product links. YNXT is the native gas/resource asset and chain identity remains ynx1-first.",
    rows: [["Network", "YNX Testnet"], ["Chain ID", "6423"], ["EVM chain", "0x1917"], ["Native coin", "YNXT"], ["REST", apiConfig.apiBase], ["EVM RPC", apiConfig.evmRpc], ["Explorer", apiConfig.explorerUrl], ["Faucet", apiConfig.faucetUrl], ["Testnet Downloads", "/download"]],
  },
  {
    id: "wallet",
    title: "钱包",
    icon: WalletCards,
    body: "ynx1 identity is first-party and default. 0x compatibility remains in EVM adapter boundary and is used only for EVM-compatible signing.",
    rows: [["Address path", "YNX Wallet default + EVM compatibility"], ["Login", "Sign in with YNX Wallet"], ["Provider", "Wallet session + signed intent"], ["Docs", "Not claiming external wallet default support"]]
  },
  {
    id: "sdk",
    title: "SDK",
    icon: Braces,
    body: "Use the in-repo JS/Python API examples, client examples, and integration endpoints without claiming external package publishing yet.",
    code: `// js pseudocode
import { toYNXAddress } from "./address";
console.log(toYNXAddress("0x7e5f..."));`,
    rows: [["Client", "Built-in web sample only"], ["Publishing", "Not published as external package"], ["Source", apiConfig.docsUrl]]
  },
  {
    id: "explorer",
    title: "Explorer",
    icon: Search,
    body: "Explorer is the production-facing proof path for live blocks, txs, accounts, validators and indexed event evidence.",
    rows: [["Entry", apiConfig.explorerUrl], ["SSE", "Realtime updates and stale/catching-up labels"], ["Fallback", "Offline-aware error states"]]
  },
  {
    id: "exchange",
    title: "Exchange",
    icon: Megaphone,
    body: "Exchange flow is candidate integration for signed tx and order proof. No exchange listing claim is presented until external approval and formal custody checks exist.",
    rows: [["Exchange route", apiConfig.exchangeUrl], ["Closed loop", "Signed tx + nonce + block/receipt"], ["Boundary", "Not exchange listed"]]
  },
  {
    id: "pay",
    title: "Pay",
    icon: CircleDollarSign,
    body: "Pay API verifies merchant intent, idempotent requests and proof evidence for settlement/receipt. Checkout UI remains in candidate state, not production.",
    rows: [["Endpoint", "https://pay.ynxweb4.com/health"], ["Trace", "idempotency + webhook signature"], ["Boundary", "No production checkout package"]]
  },
  {
    id: "trust",
    title: "Trust",
    icon: ShieldCheck,
    body: "Trust Center records request validity, advisory evidence labels, transparency reports, appeals and correction events.",
    rows: [["Request validity", "Policy-bound and evidence-requiring"], ["Appeals", "/trust/appeals endpoint candidate"], ["Transparency", "/governance/transparency event trail"]]
  },
  {
    id: "ai",
    title: "AI",
    icon: Bot,
    body: "AI Gateway validates action proposals and signed scope before execution. AI output includes explicit refusal and fallback behavior under provider failure.",
    rows: [["Session", "Wallet-aware intent binding"], ["Policy", "Action approval + rollback path"], ["Output", "Chinese / English / custom response language"]]
  },
  {
    id: "chat",
    title: "Chat",
    icon: MessageCircle,
    body: "Chat surfaces are implemented as secure messaging loop but public network mode requires session-bound identity and moderation controls.",
    rows: [["Boundary", "Identity and wallet proof only"], ["Current mode", "private loop candidate"], ["Gap", "No global public social discovery claim"]]
  },
  {
    id: "shop",
    title: "Shop",
    icon: Radio,
    body: "Shop remains a priority product. Candidate loops exist for catalog and ordering, while settlement and lifecycle proof is still being closed in the thread.",
    rows: [["Catalog", "In product threads"], ["Order", "Intent + reconciliation candidate"], ["Boundary", "No published storefront app"]]
  },
  {
    id: "resource",
    title: "Resource",
    icon: CloudCog,
    body: "Resource market documents quote / intent / settlement model and failure recovery for non-financial resource credits.",
    rows: [["Scope", "Request + quote + settlement candidate"], ["State", "offline + unavailable + retry states"], ["Boundary", "No final settlement production route"]]
  },
  {
    id: "mobile",
    title: "Mobile 发布",
    icon: Smartphone,
    body: "Mobile is target-first for Wallet, Social, Pay, Exchange, Shop, AI, Music, Video, Cloud, Docs, Browser, Finance, Mail, Calendar. Android/iOS proof is required before status upgrade.",
    rows: [["Target", "Android + iOS"], ["Current", "Candidate + testnet proof"], ["Boundary", "No public store launch claim"]]
  },
  {
    id: "risk-boundary",
    title: "风控边界",
    icon: ShieldCheck,
    body: "No claims are made for mainnet launch, exchange listing, stablecoin issuer support, custody default, or third-party partnership without external proof.",
    rows: [["Replay", "Required rejection checks"], ["Tamper", "Request hash + signature verification"], ["Availability", "Loading / failure / retry / offline"], ["Compliance", "No hidden native YNXT freeze"]]
  }
];

const formatStatus = (status) => STATUS_CONFIG[status]?.label || status;

const platformSummary = (product) => {
  const available = Object.entries(product.downloads || {})
    .filter(([, item]) => item?.href && (item.downloadHosted || item.status === PRODUCT_STATUS.LIVE))
    .map(([platform]) => platform);

  return available.length > 0 ? available.join(", ") : "Not ready";
};

const productSections = (catalog) => catalog.map((product) => ({
  id: `product-${product.key}`,
  title: product.name,
  icon: product.icon,
  body: product.detail,
  rows: [
    ["Status", formatStatus(product.status)],
    ["Entry", product.entry?.label || "Not ready"],
    ["Docs", product.docs?.label || "Not ready"],
    ["Release", product.release ? `${product.release.branch}@${product.release.commit}` : "Not available"],
    ["Public access / download", platformSummary(product)]
  ]
}));

export function DocsPage() {
  const catalog = useMemo(() => getCatalog(), []);
  const [query, setQuery] = useState("");

  const sections = useMemo(() => [...staticSections, ...productSections(catalog)], [catalog]);
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return sections;

    return sections.filter((section) => {
      const allText = `${section.title} ${section.body} ${JSON.stringify(section.rows || [])}`.toLowerCase();
      return allText.includes(needle);
    });
  }, [query, sections]);

  return (
    <main className="docsPage">
      <header className="docsHeader">
        <p className="sectionEyebrow">Developer documentation</p>
        <h1>Build with the real YNX production-boundary testnet.</h1>
        <p>All documentation here is in-site by default; external repo links appear only when local paths are unavailable.</p>
      </header>
      <div className="docsSearch">
        <Search />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search YNX documentation" aria-label="Search documentation" aria-describedby="docs-search-status" />
      </div>
      <p className="docsSearchStatus" id="docs-search-status" role="status">{query.trim() ? `${visible.length} matching sections` : `${sections.length} documentation sections`}</p>

      <div className="docsLayout">
        <nav className="docsNav" aria-label="Documentation sections">
          {visible.map((section) => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
        </nav>

        <div className="docsContent">
          {visible.map((section) => <DocSection key={section.id} section={section} />)}
          {!visible.length && <section className="docsNoResults"><Search /><h2>No matching documentation</h2><p>Try wallet, trust, AI, pay, exchange, shop, resource, mobile, or product keywords.</p></section>}
        </div>
      </div>
    </main>
  );
}

function DocSection({ section }) {
  const Icon = section.icon;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(section.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="docSection" id={section.id}>
      <div className="docTitle"><Icon /><div><h2>{section.title}</h2><p>{section.body}</p></div></div>
      {section.rows && <dl className="docRows">{section.rows.map(([term, value]) => <div key={term}><dt>{term}</dt><dd>{value}</dd></div>)}</dl>}
      {section.code && (
        <div className="codeBlock">
          <button onClick={copy} aria-label={`Copy ${section.title} example`} title={`Copy ${section.title} example`}>
            <Code2 />
            {copied && <span>Copied</span>}
          </button>
          <pre><code>{section.code}</code></pre>
        </div>
      )}
    </section>
  );
}
