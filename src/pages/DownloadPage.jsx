import React from "react";
import { ArrowUpRight, Download, FileJson2, ShieldCheck } from "lucide-react";
import { getCatalog, DOWNLOAD_LABELS, PLATFORM_STATUS, PRODUCT_STATUS } from "../lib/ecosystemCatalog.js";

function renderTarget(platform, item, productName) {
  const name = DOWNLOAD_LABELS[platform] || platform;
  const status = PLATFORM_STATUS[item.status] || { text: "Not ready" };
  const canOpen = item.href && (item.downloadHosted || item.status === PRODUCT_STATUS.LIVE);
  if (!canOpen) {
    return <li key={`${productName}-${platform}`} className="downloadItem disabled"><span>{name}</span><em>{status.text}</em>{item.note ? <small>{item.note}</small> : null}</li>;
  }

  return (
    <li key={`${productName}-${platform}`} className={`downloadItem ${item.status}`}>
      <span>{name}</span>
      <a href={item.href} rel={item.external ? "noopener" : undefined}>
        <span>{status.text}</span>
        <ArrowUpRight size={14} />
      </a>
      {item.note ? <small>{item.note}</small> : null}
    </li>
  );
}

export function DownloadPage() {
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

  return (
    <main className="downloadPage">
      <header className="productPageHeader">
        <p className="sectionEyebrow">Download center</p>
        <h1>Public products and installable releases, separated.</h1>
        <p>Only immutable hosted artifacts or verified public web surfaces are links. Local builds remain visible as evidence, but cannot be downloaded here.</p>
      </header>

      <section className="downloadDirectory" aria-label="Download center">
        {products.map((product) => (
        <article className="downloadCard" key={product.key}>
          <div className="downloadHeader">
            <strong>{product.name}</strong>
            <span className={`appState ${product.status}`}>{product.status === PRODUCT_STATUS.LIVE ? "public web" : product.status === PRODUCT_STATUS.LOCAL ? "candidate" : product.status === PRODUCT_STATUS.PLANNED ? "candidate incomplete" : "not ready"}</span>
          </div>

          <p>{product.detail}</p>
          <ul className="downloadList">
            {Object.entries(product.downloads)
              .filter(([platform]) => ["web", "android", "ios", "macos", "windows"].includes(platform))
              .map(([platform, item]) => renderTarget(platform, item, product.key))}
          </ul>

          <a href={product.route}>
            <Download size={14} />
            View release status
            <span className="visuallyHidden"> for {product.name}</span>
          </a>
        </article>
        ))}
      </section>

      <aside className="evidenceBoundary">
        <ShieldCheck />
        <div>
          <strong>No fake release states.</strong>
          <p>Test signatures and local build folders are not production releases. A download appears only after URL, hash, size, signing class, and installation evidence are registered.</p>
          <a className="textLink" href="/releases/ecosystem-release-registry.json"><FileJson2 size={16} /> Machine-readable release registry</a>
        </div>
      </aside>
    </main>
  );
}
