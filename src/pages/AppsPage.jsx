import React, { useMemo, useState } from "react";
import { ArrowUpRight, Droplets, Search, ShieldCheck } from "lucide-react";
import { getCatalog, STATUS_CONFIG, DOWNLOAD_LABELS, PRODUCT_STATUS } from "../lib/ecosystemCatalog.js";
import { useLocale } from "../lib/i18n.jsx";

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

const zhCategoryCopy = {
  commerce: ["货币与商业", "支付、市场、商户运营、金融与交易工作流。"],
  community: ["身份与社区", "账户保管、通信、身份协作与日程安排。"],
  builders: ["构建与运维", "开发、可观测性、链数据、文档、浏览器与发现工具。"],
  media: ["AI、媒体与数据", "AI 辅助工作流、内容、存储、播放与创作工具。"],
  trust: ["信任与基础设施", "证据、治理、申诉、资源报价与结算边界。"],
};

function renderProductLink({ label, href, external }, notReady = "Not ready") {
  if (!href) {
    return (
      <span className="productLinkUnavailable">{label}: {notReady}</span>
    );
  }

  return (
    <a href={href} rel={external ? "noopener" : undefined}>
      {label} <ArrowUpRight size={15} />
      {external ? <span className="visuallyHidden"> external</span> : null}
    </a>
  );
}

export function AppsPage() {
  const { locale } = useLocale();
  const zh = locale === "zh-CN";
  const catalog = useMemo(() => getCatalog(), []);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const localizedCategories = useMemo(() => categories.map((group) => zh ? { ...group, label: zhCategoryCopy[group.id][0], description: zhCategoryCopy[group.id][1] } : group), [zh]);
  const statusFilters = zh ? [["all", "全部证据状态"], [PRODUCT_STATUS.LIVE, "公开网页"], [PRODUCT_STATUS.LOCAL, "候选版本"], [PRODUCT_STATUS.PLANNED, "候选版本未完整"]] : [["all", "All evidence states"], [PRODUCT_STATUS.LIVE, "Public web"], [PRODUCT_STATUS.LOCAL, "Candidate"], [PRODUCT_STATUS.PLANNED, "Candidate incomplete"]];
  const categoryByProduct = useMemo(() => new Map(categories.flatMap((group) => group.keys.map((key) => [key, group.id]))), []);
  const visibleGroups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return localizedCategories.map((group) => ({
      ...group,
      products: catalog.filter((product) => {
        if (category !== "all" && group.id !== category) return false;
        if (status !== "all" && product.status !== status) return false;
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
        <h1>{zh ? `${catalog.length} 个软件产品，统一归入 /dapp 路由。` : `${catalog.length} software products, organized under one /dapp route.`}</h1>
        <p>{zh ? "该目录如实区分已经实现与仍被阻塞的能力。每个状态都以证据为依据，并提供产品入口、文档、发布证据或下载信息。" : "This DApp directory shows only what is implemented and what is still blocked. Every label is an evidence-backed status; open entry, docs, release evidence, or downloads for each product."}</p>
        <p className="statusMeta">{zh ? "公开网页、候选代码、本地构建、托管下载、生产签名与应用商店发布始终是相互独立的状态。" : "Public web, candidate code, local builds, hosted downloads, production signing, and store release remain separate states."}</p>
        <div className="statusLegend" aria-label={zh ? "应用状态图例" : "Application status legend"}>
          <span className="live">{zh ? "公开网页" : "Public web"}</span>
          <span className="local">{zh ? "候选版本" : "Candidate"}</span>
          <span className="planned">{zh ? "候选版本未完整" : "Candidate incomplete"}</span>
          <span className="not-ready">{zh ? "尚未就绪" : "Not ready"}</span>
        </div>
      </header>

      <section className="appTryNow" aria-labelledby="try-now-title">
        <span className="appIcon"><Droplets /></span>
        <div><p className="sectionEyebrow">{zh ? "现在就试" : "Try it now"}</p><h2 id="try-now-title">YNX Testnet Faucet</h2><p>{zh ? "直接在官网领取 100 YNXT 测试币，随后跳转 Explorer 验证真实链上交易。" : "Claim 100 Testnet YNXT directly on the official website, then verify the real transaction in Explorer."}</p></div>
        <a className="button primary" href="/dapp/faucet">{zh ? "打开 Faucet" : "Open Faucet"}<ArrowUpRight /></a>
      </section>

      <section className="appDiscovery" aria-label={zh ? "筛选 YNX DApp" : "Filter YNX DApps"}>
        <label className="appSearch">
          <Search aria-hidden="true" />
          <span className="visuallyHidden">{zh ? "搜索 DApp" : "Search DApps"}</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={zh ? "查找产品、工作流或能力" : "Find a product, workflow, or capability"} />
        </label>
        <div className="appFilterRow" aria-label="DApp categories">
          <button className={category === "all" ? "active" : ""} onClick={() => setCategory("all")}>{zh ? "全部分类" : "All categories"} <span>{catalog.length}</span></button>
          {localizedCategories.map((group) => <button key={group.id} className={category === group.id ? "active" : ""} onClick={() => setCategory(group.id)}>{group.label} <span>{group.keys.length}</span></button>)}
        </div>
        <div className="appStatusFilters" aria-label="Evidence status">
          {statusFilters.map(([value, label]) => <button key={value} className={status === value ? "active" : ""} onClick={() => setStatus(value)}>{label}</button>)}
          <p role="status">{zh ? <>共 {catalog.length} 个产品，当前显示 <strong>{visibleCount}</strong> 个</> : <>Showing <strong>{visibleCount}</strong> of {catalog.length} products</>}</p>
        </div>
      </section>

      <div className="appGroups">
        {visibleGroups.map((group) => <section className="appGroup" key={group.id} aria-labelledby={`dapp-${group.id}`}>
          <header className="appGroupHeader">
            <div><p className="sectionEyebrow">{zh ? "DApp 分类" : "DApp category"}</p><h2 id={`dapp-${group.id}`}>{group.label}</h2></div>
            <p>{group.description}</p>
            <strong>{zh ? `${group.products.length} 个产品` : `${group.products.length} product${group.products.length === 1 ? "" : "s"}`}</strong>
          </header>
          <div className="appDirectory">
          {group.products.map((product) => {
          const statusLabel = zh ? ({ [PRODUCT_STATUS.LIVE]: "公开网页", [PRODUCT_STATUS.LOCAL]: "候选版本", [PRODUCT_STATUS.PLANNED]: "候选版本未完整" }[product.status] || product.status) : (STATUS_CONFIG[product.status]?.label || product.status);
          const statusTone = STATUS_CONFIG[product.status]?.tone || product.status;
          const surfaces = Object.entries(product.downloads || {})
            .filter(([, item]) => item?.href)
            .map(([platform]) => DOWNLOAD_LABELS[platform] || platform);

          return (
            <article className="appItem" key={product.key}>
              <header className="appCardHead">
                <span className="appIcon"><product.icon size={23} /></span>
                <span className={`appState ${statusTone}`}>{statusLabel}</span>
              </header>
              <div className="appCopy"><strong>{product.name}</strong><small>{product.detail}</small></div>
              <dl className="appCardFacts">{product.metrics.map(([label, value]) => <div key={`${product.key}-${label}`}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
              <div className="appSurfaces"><span>{zh ? "可用平台" : "Available surfaces"}</span><strong>{surfaces.length ? surfaces.join(" · ") : (zh ? "暂无公开软件包" : "No public package")}</strong></div>
              <footer className="appCardActions">
                <a className="appPrimaryLink" href={product.route}>{zh ? "查看产品" : "View product"} <ArrowUpRight /></a>
                {renderProductLink(product.docs, zh ? "尚未就绪" : "Not ready")}
                {product.release?.productRelease?.href ? renderProductLink({ label: zh ? "发布证据" : "Release evidence", href: product.release.productRelease.href, external: /^https?:\/\//.test(product.release.productRelease.href) }, zh ? "尚未就绪" : "Not ready") : null}
                {product.status === PRODUCT_STATUS.LIVE && product.entry?.href ? renderProductLink(product.entry, zh ? "尚未就绪" : "Not ready") : null}
              </footer>
            </article>
          );
          })}
          </div>
        </section>)}
        {!visibleCount ? <section className="appsNoResults"><Search /><h2>{zh ? "没有匹配的 DApp" : "No matching DApps"}</h2><p>{zh ? "清除筛选条件，或按产品名称、工作流、证据或能力搜索。" : "Clear a filter or search by product name, workflow, evidence, or capability."}</p></section> : null}
      </div>

      <aside className="evidenceBoundary">
        <ShieldCheck />
        <div>
          <strong>{zh ? "产品状态服从证据。" : "Product status follows evidence."}</strong>
          <p>{zh ? "只有在用户工作流、安全边界、部署和公开验证均存在时，后端代码、就绪包和未来计划才能被视为完成的应用。" : "Backend code, readiness packages, and future plans do not become finished applications until user workflow, security boundary, deployment, and public verification exist."}</p>
        </div>
      </aside>
    </main>
  );
}
