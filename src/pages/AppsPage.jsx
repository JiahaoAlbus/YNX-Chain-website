import React, { useMemo, useState } from "react";
import { ArrowUpRight, Droplets, Search, ShieldCheck } from "lucide-react";
import { getCatalog, STATUS_CONFIG, DOWNLOAD_LABELS, PRODUCT_STATUS } from "../lib/ecosystemCatalog.js";
import { getProductPublicContract, getProductPublicDisplayStatus, productSectionRoute } from "../lib/productPublicContract.js";
import { useLocale } from "../lib/i18n.jsx";
import { getAppsCopy } from "../content/businessLocaleContent.js";

const categories = [
  {
    id: "commerce",
    label: "Money & commerce",
    description: "Payments, markets, merchant operations, finance, and exchange workflows.",
    keys: ["pay", "merchantConsole", "card", "exchange", "quant", "shop", "sellerConsole", "finance", "dex"],
  },
  {
    id: "community",
    label: "Identity & community",
    description: "Account custody, communication, identity-aware collaboration, and scheduling.",
    keys: ["wallet", "social", "mail", "calendar"],
  },
  {
    id: "builders",
    label: "Build & operate",
    description: "Developer, observability, chain-data, documentation, browser, and discovery tools.",
    keys: ["developer", "explorer", "monitor", "docs", "browser", "search"],
  },
  {
    id: "media",
    label: "AI, media & data",
    description: "AI-assisted workflows, content, storage, playback, and creator surfaces.",
    keys: ["ai", "music", "video", "creatorStudio", "cloud"],
  },
  {
    id: "trust",
    label: "Trust & infrastructure",
    description: "Evidence, governance, appeals, resource quotes, and settlement boundaries.",
    keys: ["trust", "resource"],
  },
];

function renderProductLink({ label, href, external }, notReady = "Not ready") {
  if (!href) {
    return (
      <span className="productLinkUnavailable">{label}: {notReady}</span>
    );
  }

  return (
    <a href={href} rel={external ? "noopener" : undefined}>
      {label} <ArrowUpRight size={15} />
      {external ? <span className="visuallyHidden">↗</span> : null}
    </a>
  );
}

export function AppsPage() {
  const { locale } = useLocale();
  const copy = getAppsCopy(locale);
  const catalog = useMemo(() => getCatalog().map((product) => {
    const publicContract = getProductPublicContract(product);
    return { ...product, publicContract, publicStatus: getProductPublicDisplayStatus(publicContract) };
  }), []);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const localizedCategories = useMemo(() => categories.map((group, index) => ({ ...group, label: copy.categories[index][0], description: copy.categories[index][1] })), [copy]);
  const statusFilters = copy.statusFilters;
  const categoryByProduct = useMemo(() => new Map(categories.flatMap((group) => group.keys.map((key) => [key, group.id]))), []);
  const visibleGroups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return localizedCategories.map((group) => ({
      ...group,
      products: catalog.filter((product) => {
        if (category !== "all" && group.id !== category) return false;
        if (status !== "all" && product.publicStatus !== status) return false;
        if (!needle) return categoryByProduct.get(product.key) === group.id;
        const haystack = `${product.name} ${product.detail} ${product.metrics.flat().join(" ")}`.toLowerCase();
        return categoryByProduct.get(product.key) === group.id && haystack.includes(needle);
      }),
    })).filter((group) => group.products.length > 0);
  }, [catalog, category, categoryByProduct, localizedCategories, query, status]);
  const visibleCount = visibleGroups.reduce((total, group) => total + group.products.length, 0);

  return (
    <main className="appsPage">
      <header className="productPageHeader">
        <p className="sectionEyebrow">YNX DApps</p>
        <h1>{catalog.length} {copy.title}</h1>
        <p>{copy.lead}</p>
        <p className="statusMeta">{copy.statusLead}</p>
        <div className="statusLegend" aria-label={copy.statusFilters[0][1]}>
          <span className="live">{copy.statusLabels[PRODUCT_STATUS.LIVE]}</span>
          <span className="local">{copy.statusLabels[PRODUCT_STATUS.LOCAL]}</span>
          <span className="planned">{copy.statusLabels[PRODUCT_STATUS.PLANNED]}</span>
          <span className="not-ready">{copy.statusLabels[PRODUCT_STATUS.NOT_READY]}</span>
        </div>
      </header>

      <section className="appTryNow" aria-labelledby="try-now-title">
        <span className="appIcon"><Droplets /></span>
        <div><p className="sectionEyebrow">{copy.tryEyebrow}</p><h2 id="try-now-title">YNX Testnet Faucet</h2><p>{copy.tryLead}</p></div>
        <a className="button primary" href="/dapp/faucet">Faucet<ArrowUpRight /></a>
      </section>

      <section className="appDiscovery" aria-label={copy.search}>
        <label className="appSearch">
          <Search aria-hidden="true" />
          <span className="visuallyHidden">{copy.search}</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.search} />
        </label>
        <div className="appFilterRow" aria-label={copy.allCategories}>
          <button className={category === "all" ? "active" : ""} onClick={() => setCategory("all")}>{copy.allCategories} <span>{catalog.length}</span></button>
          {localizedCategories.map((group) => <button key={group.id} className={category === group.id ? "active" : ""} onClick={() => setCategory(group.id)}>{group.label} <span>{group.keys.length}</span></button>)}
        </div>
        <div className="appStatusFilters" aria-label={copy.statusFilters[0][1]}>
          {statusFilters.map(([value, label]) => <button key={value} className={status === value ? "active" : ""} onClick={() => setStatus(value)}>{label}</button>)}
          <p role="status"><strong>{visibleCount}</strong> / {catalog.length}</p>
        </div>
      </section>

      <div className="appGroups">
        {visibleGroups.map((group) => <section className="appGroup" key={group.id} aria-labelledby={`dapp-${group.id}`}>
          <header className="appGroupHeader">
            <div><p className="sectionEyebrow">DApp</p><h2 id={`dapp-${group.id}`}>{group.label}</h2></div>
            <p>{group.description}</p>
            <strong>{group.products.length}</strong>
          </header>
          <div className="appDirectory">
          {group.products.map((product) => {
          const statusLabel = copy.statusLabels[product.publicStatus] || product.publicStatus;
          const statusTone = STATUS_CONFIG[product.publicStatus]?.tone || product.publicStatus;
          const surfaces = [
            ...(product.publicContract.publicWebVerified ? ["Web"] : []),
            ...product.publicContract.downloads.items.map((item) => DOWNLOAD_LABELS[item.platform] || item.platform),
          ];

          return (
            <article className="appItem" key={product.key}>
              <header className="appCardHead">
                <span className="appIcon"><product.icon size={23} /></span>
                <span className={`appState ${statusTone}`}>{statusLabel}</span>
              </header>
              <div className="appCopy"><strong>{product.name}</strong><small>{product.detail}</small></div>
              <dl className="appCardFacts">{product.metrics.map(([label, value]) => <div key={`${product.key}-${label}`}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
              <div className="appSurfaces"><span>{copy.available}</span><strong>{surfaces.length ? surfaces.join(" · ") : copy.noPackage}</strong></div>
              <footer className="appCardActions">
                <a className="appPrimaryLink" href={productSectionRoute(product.route, "overview")}>{copy.view} <ArrowUpRight /></a>
                <a href={productSectionRoute(product.route, "open-download")}>{copy.openDownload} <ArrowUpRight size={15} /></a>
                <a href={productSectionRoute(product.route, "risks")}>{copy.risks} <ArrowUpRight size={15} /></a>
                {renderProductLink(product.docs, copy.statusLabels[PRODUCT_STATUS.NOT_READY])}
                {product.publicContract.releaseEvidence.status === "available" ? renderProductLink({ label: copy.release, href: product.publicContract.releaseEvidence.href, external: /^https?:\/\//.test(product.publicContract.releaseEvidence.href) }, copy.statusLabels[PRODUCT_STATUS.NOT_READY]) : null}
              </footer>
            </article>
          );
          })}
          </div>
        </section>)}
        {!visibleCount ? <section className="appsNoResults"><Search /><h2>{copy.noneTitle}</h2><p>{copy.noneLead}</p></section> : null}
      </div>

      <aside className="evidenceBoundary">
        <ShieldCheck />
        <div>
          <strong>{copy.boundaryTitle}</strong>
          <p>{copy.boundary}</p>
        </div>
      </aside>
    </main>
  );
}
