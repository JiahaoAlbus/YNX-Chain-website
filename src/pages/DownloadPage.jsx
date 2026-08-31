import React from "react";
import { ArrowUpRight, Download, FileJson2, ShieldCheck } from "lucide-react";
import { getCatalog, DOWNLOAD_LABELS, PLATFORM_STATUS, PRODUCT_STATUS } from "../lib/ecosystemCatalog.js";
import { useLocale } from "../lib/i18n.jsx";
import { getDownloadCopy } from "../content/businessLocaleContent.js";

function formatBytes(bytes, locale) {
  if (!Number.isFinite(Number(bytes))) return null;
  const units = ["B", "KB", "MB", "GB"];
  let value = Number(bytes);
  let index = 0;
  while (value >= 1024 && index < units.length - 1) { value /= 1024; index += 1; }
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value)} ${units[index]}`;
}

function renderTarget(platform, item, productName, locale, copy) {
  const name = DOWNLOAD_LABELS[platform] || platform;
  const status = PLATFORM_STATUS[item.status] || { text: copy.unavailable };
  const statusText = copy.statusLabels[item.status] || status.text;
  const canOpen = item.href && (item.downloadHosted || item.status === PRODUCT_STATUS.LIVE);
  if (!canOpen) {
    return <li key={`${productName}-${platform}`} className="downloadItem disabled"><span>{name}</span><em>{statusText}</em>{item.note ? <small>{item.note}</small> : null}</li>;
  }

  return (
    <li key={`${productName}-${platform}`} className={`downloadItem ${item.status}`}>
      <span>{name}</span>
      <a href={item.href} rel={item.external ? "noopener" : undefined} download={item.downloadHosted ? item.artifactPath : undefined}>
        <span>{item.downloadHosted ? copy.download : statusText}</span>
        {item.downloadHosted ? <Download size={14} /> : <ArrowUpRight size={14} />}
      </a>
      {item.note ? <small>{item.note}</small> : null}
      {item.downloadHosted ? <dl className="downloadEvidence" aria-label={`${productName} ${name} ${copy.evidence[5]}`}>
        <div><dt>{copy.evidence[0]}</dt><dd>{item.version || copy.unavailable}</dd></div>
        <div><dt>{copy.evidence[1]}</dt><dd>{formatBytes(item.sizeBytes, locale) || copy.unavailable}</dd></div>
        <div><dt>SHA-256</dt><dd><code>{item.sha256 || copy.unavailable}</code></dd></div>
        <div><dt>{copy.evidence[2]}</dt><dd>{item.signingClass || copy.unavailable}</dd></div>
        <div><dt>{copy.evidence[3]}</dt><dd><code>{item.sourceCommit || copy.unavailable}</code></dd></div>
        <div><dt>{copy.evidence[4]}</dt><dd>{item.installProof || copy.unavailable}</dd></div>
      </dl> : null}
    </li>
  );
}

export function DownloadPage() {
  const { locale } = useLocale();
  const copy = getDownloadCopy(locale);
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
        <span className={`appState ${product.status}`}>{copy.statusLabels[product.status]}</span>
      </div>

      <p>{product.detail}</p>
      <ul className="downloadList">
        {Object.entries(product.downloads)
          .filter(([platform]) => ["web", "pwa", "chromeEdge", "firefox", "android", "ios", "macos", "windows", "linux"].includes(platform))
          .map(([platform, item]) => renderTarget(platform, item, product.key, locale, copy))}
      </ul>

      <a href={product.route}>
        <Download size={14} />
        {copy.view}
        <span className="visuallyHidden"> for {product.name}</span>
      </a>
    </article>
  );

  return (
    <main className="downloadPage">
      <header className="productPageHeader">
        <p className="sectionEyebrow">{copy.hero[0]}</p>
        <h1>{copy.hero[1]}</h1>
        <p>{copy.hero[2]}</p>
      </header>

      <section className="downloadGroup" aria-labelledby="available-downloads-title">
        <div className="downloadGroupHeader">
          <div><p className="sectionEyebrow">{copy.available[0]}</p><h2 id="available-downloads-title">{copy.available[1]}</h2></div>
          <p>{copy.available[2]}</p>
        </div>
        <div className="downloadDirectory">{hostedProducts.map(renderProduct)}</div>
      </section>

      <section className="downloadGroup" aria-labelledby="release-directory-title">
        <div className="downloadGroupHeader">
          <div><p className="sectionEyebrow">{copy.other[0]}</p><h2 id="release-directory-title">{copy.other[1]}</h2></div>
          <p>{copy.other[2]}</p>
        </div>
        <div className="downloadDirectory">{directoryProducts.map(renderProduct)}</div>
      </section>

      <aside className="evidenceBoundary">
        <ShieldCheck />
        <div>
          <strong>{copy.boundary[0]}</strong>
          <p>{copy.boundary[1]}</p>
          <a className="textLink" href="/releases/ecosystem-release-registry.json"><FileJson2 size={16} /> {copy.boundary[2]}</a>
        </div>
      </aside>
    </main>
  );
}
