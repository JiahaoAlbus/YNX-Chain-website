import React, { useMemo, useState } from "react";
import { ArrowUpRight, Search, ShieldCheck } from "lucide-react";
import { getCatalog, STATUS_CONFIG, DOWNLOAD_LABELS, PLATFORM_STATUS, PRODUCT_STATUS } from "../lib/ecosystemCatalog.js";

const platformOrder = ["web", "android", "ios", "macos", "windows"];

const categories = [
  {
    id: "commerce",
    label: "Money & commerce",
    description: "Payments, markets, merchant operations, finance, and exchange workflows.",
    keys: ["pay", "merchantConsole", "card", "exchange", "shop", "sellerConsole", "finance", "dex"],
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

const statusFilters = [
  ["all", "All evidence states"],
  [PRODUCT_STATUS.LIVE, "Public web"],
  [PRODUCT_STATUS.LOCAL, "Candidate"],
  [PRODUCT_STATUS.PLANNED, "Candidate incomplete"],
];

function renderProductLink({ label, href, external }) {
  if (!href) {
    return (
      <span className="productLinkUnavailable">{label}: Not ready</span>
    );
  }

  return (
    <a href={href} rel={external ? "noopener" : undefined}>
      {label} <ArrowUpRight size={15} />
      {external ? <span className="visuallyHidden"> external</span> : null}
    </a>
  );
}

function renderDownloadItem(platform, item) {
  const platformText = PLATFORM_STATUS[item.status]?.text || "Not ready";
  const canOpen = item.href && (item.downloadHosted || item.status === PRODUCT_STATUS.LIVE);
  if (!canOpen) {
    return (
      <li key={platform} className="downloadItem disabled">
        <span>{DOWNLOAD_LABELS[platform] || platform}</span>
        <em>{platformText}</em>
        {item.note ? <small>{item.note}</small> : null}
      </li>
    );
  }

  return (
    <li key={platform} className={`downloadItem ${item.status}`}>
      <span>{DOWNLOAD_LABELS[platform] || platform}</span>
      <a href={item.href} rel={item.external ? "noopener" : undefined}>
        <span>{platformText}</span>
        <ArrowUpRight size={14} />
      </a>
      {item.note ? <small>{item.note}</small> : null}
    </li>
  );
}

function renderDownloadList(downloads) {
  const items = platformOrder
    .map((platform) => renderDownloadItem(platform, downloads[platform] || { status: "not-ready" }))
    .filter(Boolean);

  return <ul className="downloadList">{items}</ul>;
}

function ProductMetaSection({ title, children }) {
  return (
    <div className="appMeta">
      <span className="appSectionHeader">{title}</span>
      <span className="appMetaBlock">{children}</span>
    </div>
  );
}

function renderRelease(release) {
  if (!release) {
    return <span className="productLinkUnavailable">Release: Not yet bound</span>;
  }

  return (
    <span className="appMetaBlock">
      <span>Source commit: {release.commit}</span>
      {release.statusNote ? <span>{release.statusNote}</span> : null}
    </span>
  );
}

export function AppsPage() {
  const catalog = useMemo(() => getCatalog(), []);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const categoryByProduct = useMemo(() => new Map(categories.flatMap((group) => group.keys.map((key) => [key, group.id]))), []);
  const visibleGroups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return categories.map((group) => ({
      ...group,
      products: catalog.filter((product) => {
        if (category !== "all" && group.id !== category) return false;
        if (status !== "all" && product.status !== status) return false;
        if (!needle) return categoryByProduct.get(product.key) === group.id;
        const haystack = `${product.name} ${product.detail} ${product.metrics.flat().join(" ")}`.toLowerCase();
        return categoryByProduct.get(product.key) === group.id && haystack.includes(needle);
      }),
    })).filter((group) => group.products.length > 0);
  }, [catalog, category, categoryByProduct, query, status]);
  const visibleCount = visibleGroups.reduce((total, group) => total + group.products.length, 0);

  return (
    <main className="appsPage">
      <header className="productPageHeader">
        <p className="sectionEyebrow">YNX DApps</p>
        <h1>{catalog.length} software products, organized under one /dapp route.</h1>
        <p>This DApp directory shows only what is implemented and what is still blocked. Every label is an evidence-backed status; open entry, docs, release evidence, or downloads for each product.</p>
        <p className="statusMeta">Public web, candidate code, local builds, hosted downloads, production signing, and store release remain separate states.</p>
        <div className="statusLegend" aria-label="Application status legend">
          <span className="live">Public web</span>
          <span className="local">Candidate</span>
          <span className="planned">Candidate incomplete</span>
          <span className="not-ready">Not ready</span>
        </div>
      </header>

      <section className="appDiscovery" aria-label="Filter YNX DApps">
        <label className="appSearch">
          <Search aria-hidden="true" />
          <span className="visuallyHidden">Search DApps</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a product, workflow, or capability" />
        </label>
        <div className="appFilterRow" aria-label="DApp categories">
          <button className={category === "all" ? "active" : ""} onClick={() => setCategory("all")}>All categories <span>{catalog.length}</span></button>
          {categories.map((group) => <button key={group.id} className={category === group.id ? "active" : ""} onClick={() => setCategory(group.id)}>{group.label} <span>{group.keys.length}</span></button>)}
        </div>
        <div className="appStatusFilters" aria-label="Evidence status">
          {statusFilters.map(([value, label]) => <button key={value} className={status === value ? "active" : ""} onClick={() => setStatus(value)}>{label}</button>)}
          <p role="status">Showing <strong>{visibleCount}</strong> of {catalog.length} products</p>
        </div>
      </section>

      <div className="appGroups">
        {visibleGroups.map((group) => <section className="appGroup" key={group.id} aria-labelledby={`dapp-${group.id}`}>
          <header className="appGroupHeader">
            <div><p className="sectionEyebrow">DApp category</p><h2 id={`dapp-${group.id}`}>{group.label}</h2></div>
            <p>{group.description}</p>
            <strong>{group.products.length} product{group.products.length === 1 ? "" : "s"}</strong>
          </header>
          <div className="appDirectory">
          {group.products.map((product) => {
          const statusLabel = STATUS_CONFIG[product.status]?.label || product.status;
          const statusTone = STATUS_CONFIG[product.status]?.tone || product.status;

          return (
            <article className="appItem" key={product.key}>
              <span className="appIcon"><product.icon size={23} /></span>

              <span className="appCopy">
                <span className={`appState ${statusTone}`}>{statusLabel}</span>
                <strong>{product.name}</strong>
                <small>{product.detail}</small>
              </span>

              <span className="appLinks">
                <ProductMetaSection title="Entry">{renderProductLink(product.entry)}</ProductMetaSection>
                <ProductMetaSection title="Docs">{renderProductLink(product.docs)}</ProductMetaSection>
                <ProductMetaSection title="Release">{renderRelease(product.release)}</ProductMetaSection>
              </span>

              <ProductMetaSection title="Close-loop metrics">
                <span className="appMetrics">
                  {product.metrics.map(([label, value]) => (
                    <span key={`${product.key}-${label}`}><i>{label}</i><strong>{value}</strong></span>
                  ))}
                </span>
              </ProductMetaSection>

              <ProductMetaSection title="Downloads">
                {renderDownloadList(product.downloads)}
              </ProductMetaSection>

            </article>
          );
          })}
          </div>
        </section>)}
        {!visibleCount ? <section className="appsNoResults"><Search /><h2>No matching DApps</h2><p>Clear a filter or search by product name, workflow, evidence, or capability.</p></section> : null}
      </div>

      <aside className="evidenceBoundary">
        <ShieldCheck />
        <div>
          <strong>Product status follows evidence.</strong>
          <p>Backend code, readiness packages, and future plans do not become finished applications until user workflow, security boundary, deployment, and public verification exist.</p>
        </div>
      </aside>
    </main>
  );
}
