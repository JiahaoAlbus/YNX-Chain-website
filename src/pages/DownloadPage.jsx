import React from "react";
import { ArrowUpRight, Download, FileJson2, ShieldCheck } from "lucide-react";
import { getCatalog, DOWNLOAD_LABELS, PLATFORM_STATUS, PRODUCT_STATUS } from "../lib/ecosystemCatalog.js";
import { useLocale } from "../lib/i18n.jsx";

function renderTarget(platform, item, productName, zh) {
  const name = DOWNLOAD_LABELS[platform] || platform;
  const status = PLATFORM_STATUS[item.status] || { text: "Not ready" };
  const canOpen = item.href && (item.downloadHosted || item.status === PRODUCT_STATUS.LIVE);
  if (!canOpen) {
    return <li key={`${productName}-${platform}`} className="downloadItem disabled"><span>{name}</span><em>{status.text}</em>{item.note ? <small>{item.note}</small> : null}</li>;
  }

  return (
    <li key={`${productName}-${platform}`} className={`downloadItem ${item.status}`}>
      <span>{name}</span>
      <a href={item.href} rel={item.external ? "noopener" : undefined} download={item.downloadHosted ? item.artifactPath : undefined}>
        <span>{item.downloadHosted ? (zh ? "从官网下载" : "Download from YNX") : status.text}</span>
        {item.downloadHosted ? <Download size={14} /> : <ArrowUpRight size={14} />}
      </a>
      {item.note ? <small>{item.note}</small> : null}
    </li>
  );
}

export function DownloadPage() {
  const { locale } = useLocale();
  const zh = locale === "zh-CN";
  const catalog = getCatalog();
  const priority = {
    [PRODUCT_STATUS.LIVE]: 0,
    [PRODUCT_STATUS.LOCAL]: 1,
    [PRODUCT_STATUS.PLANNED]: 2,
    [PRODUCT_STATUS.NOT_READY]: 3
  };
  const products = [...catalog].sort((a, b) => {
    const scoreA = priority[a.status] ?? priority[PRODUCT_STATUS.NOT_READY];
    const scoreB = priority[b.status] ?? priority[PRODUCT_STATUS.NOT_READY];
    const nameSort = a.name.localeCompare(b.name);
    return scoreA - scoreB || nameSort;
  });
  const hostedProducts = products.filter((product) => Object.values(product.downloads || {}).some((item) => item.downloadHosted && item.href));
  const directoryProducts = products.filter((product) => !hostedProducts.includes(product));

  const renderProduct = (product) => (
    <article className="downloadCard" key={product.key}>
      <div className="downloadHeader">
        <strong>{product.name}</strong>
        <span className={`appState ${product.status}`}>{product.status === PRODUCT_STATUS.LIVE ? (zh ? "公开网页" : "public web") : product.status === PRODUCT_STATUS.LOCAL ? (zh ? "候选版本" : "candidate") : product.status === PRODUCT_STATUS.PLANNED ? (zh ? "候选版本未完整" : "candidate incomplete") : (zh ? "尚未就绪" : "not ready")}</span>
      </div>

      <p>{product.detail}</p>
      <ul className="downloadList">
        {Object.entries(product.downloads)
          .filter(([platform]) => ["web", "android", "ios", "macos", "windows", "linux"].includes(platform))
          .map(([platform, item]) => renderTarget(platform, item, product.key, zh))}
      </ul>

      <a href={product.route}>
        <Download size={14} />
        {zh ? "查看发布状态" : "View release status"}
        <span className="visuallyHidden"> for {product.name}</span>
      </a>
    </article>
  );

  return (
    <main className="downloadPage">
      <header className="productPageHeader">
        <p className="sectionEyebrow">{zh ? "下载中心" : "Download center"}</p>
        <h1>{zh ? "公开网页与可安装测试版本，状态清楚分开。" : "Public products and installable releases, separated."}</h1>
        <p>{zh ? "只有具备不可变托管地址，或已经验证的公开网页才提供链接。本地构建仍作为证据展示，但不能从这里下载。" : "Only immutable hosted artifacts or verified public web surfaces are links. Local builds remain visible as evidence, but cannot be downloaded here."}</p>
      </header>

      <section className="downloadGroup" aria-labelledby="available-downloads-title">
        <div className="downloadGroupHeader">
          <div><p className="sectionEyebrow">{zh ? "现在可下载" : "Available now"}</p><h2 id="available-downloads-title">{zh ? "已验证的官网安装包" : "Verified official downloads"}</h2></div>
          <p>{zh ? "目前发布 4 个通过哈希登记的 Testnet Preview，其中包括 YNX Shop Android 测试版。点击后直接从 YNX 官方下载地址获取，不再跳转 GitHub。" : "Four hash-registered Testnet Preview artifacts are available, including YNX Shop for Android. Downloads stay on the official YNX address instead of redirecting to GitHub."}</p>
        </div>
        <div className="downloadDirectory">{hostedProducts.map(renderProduct)}</div>
      </section>

      <section className="downloadGroup" aria-labelledby="release-directory-title">
        <div className="downloadGroupHeader">
          <div><p className="sectionEyebrow">{zh ? "其他产品" : "Other products"}</p><h2 id="release-directory-title">{zh ? "网页入口与开发状态" : "Web entries and release status"}</h2></div>
          <p>{zh ? "没有安装包的产品会明确显示网页入口、候选状态或尚未就绪，避免把本地构建误写成公开下载。" : "Products without installers show their web entry, candidate state, or not-ready status clearly."}</p>
        </div>
        <div className="downloadDirectory">{directoryProducts.map(renderProduct)}</div>
      </section>

      <aside className="evidenceBoundary">
        <ShieldCheck />
        <div>
          <strong>{zh ? "不伪造发布状态。" : "No fake release states."}</strong>
          <p>{zh ? "测试签名和本地构建目录都不是生产发布。只有登记了 URL、哈希、字节数、签名类别和安装证据后，下载才会出现。所有 Testnet Preview 都可能变更或重置，请勿导入真实资产或生产私钥。" : "Test signatures and local build folders are not production releases. A download appears only after URL, hash, size, signing class, and installation evidence are registered. Testnet Previews may change or reset; never import real assets or production private keys."}</p>
          <a className="textLink" href="/releases/ecosystem-release-registry.json"><FileJson2 size={16} /> {zh ? "机器可读发布登记表" : "Machine-readable release registry"}</a>
        </div>
      </aside>
    </main>
  );
}
