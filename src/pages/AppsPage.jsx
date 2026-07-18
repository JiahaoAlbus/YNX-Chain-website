import React from "react";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { getCatalog, STATUS_CONFIG, DOWNLOAD_LABELS, PLATFORM_STATUS, PRODUCT_STATUS } from "../lib/ecosystemCatalog.js";

const platformOrder = ["web", "android", "ios", "macos", "windows"];

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
      <span>Branch: {release.branch}</span>
      <span>Commit: {release.commit}</span>
      {release.statusNote ? <span>{release.statusNote}</span> : null}
    </span>
  );
}

export function AppsPage() {
  const catalog = getCatalog();

  return (
    <main className="appsPage">
      <header className="productPageHeader">
        <p className="sectionEyebrow">YNX ecosystem</p>
        <h1>{catalog.length} independent products, each with an evidence-backed status.</h1>
        <p>This directory shows only what is implemented and what is still blocked. Click entry/docs/download for each product.</p>
        <p className="statusMeta">Public web, candidate code, local builds, hosted downloads, production signing, and store release remain separate states.</p>
        <div className="statusLegend" aria-label="Application status legend">
          <span className="live">Public web</span>
          <span className="local">Candidate</span>
          <span className="planned">Candidate incomplete</span>
          <span className="not-ready">Not ready</span>
        </div>
      </header>

      <section className="appDirectory" aria-label="YNX application directory">
        {catalog.map((product) => {
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
      </section>

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
