import { WalletDownloadSafetyNotice, WalletDownloadInventoryNotice } from "../components/WalletDownloadSafetyNotice.jsx";
import { getWalletSafetyCopy } from "../content/walletSafetyCopy.js";
import { WalletDownloadHistory } from "../components/WalletDownloadHistory.jsx";
import React, { useState } from "react";
import { ArrowUpRight, Download, FileJson2, ShieldCheck } from "lucide-react";
import { getCatalog, DOWNLOAD_LABELS, PLATFORM_STATUS, PRODUCT_STATUS } from "../lib/ecosystemCatalog.js";
import { useLocale } from "../lib/i18n.jsx";
import { getDownloadCopy } from "../content/businessLocaleContent.js";
import { getProductPublicContract } from "../lib/productPublicContract.js";
import { getDownloadDirectoryProduct } from "../lib/downloadDirectory.js";
import { WALLET_DOWNLOAD_PLATFORMS, walletDownloadLabel, walletDownloadState } from "../lib/walletDownloads.js";
import { PRODUCT_UI_COPY } from "../content/productUiCopy.js";
import { WALLET_DOWNLOAD_COPY } from "../content/walletDownloadCopy.js";

function formatBytes(bytes, locale) {
  if (!Number.isFinite(Number(bytes))) return null;
  const units = ["B", "KB", "MB", "GB"];
  let value = Number(bytes);
  let index = 0;
  while (value >= 1024 && index < units.length - 1) { value /= 1024; index += 1; }
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value)} ${units[index]}`;
}

function renderTarget(platform, item, productName, locale, copy, registryAllowsDownloads) {
  const walletCopy = { ...(PRODUCT_UI_COPY[locale] || PRODUCT_UI_COPY.en), ...(WALLET_DOWNLOAD_COPY[locale] || WALLET_DOWNLOAD_COPY.en) };
  const name = productName === "wallet" ? walletDownloadLabel(platform, walletCopy) : DOWNLOAD_LABELS[platform] || platform;
  const status = PLATFORM_STATUS[item.status] || { text: copy.unavailable };
  const statusText = copy.statusLabels[item.status] || status.text;
  const walletFile = productName === "wallet" && platform !== "web"
    ? walletDownloadState(platform, item, registryAllowsDownloads) : null;
  const canOpen = item.href && (item.downloadHosted || item.status === PRODUCT_STATUS.LIVE) && (!walletFile || walletFile.available);
  if (!canOpen) {
    const hold = walletFile?.safetyHold;
    return <li key={`${productName}-${platform}`} className="downloadItem disabled"><span>{name}</span><em>{hold ? getWalletSafetyCopy(locale).pausedLabel : walletFile ? walletCopy.unavailableYet : statusText}</em>{walletFile ? <small>{hold ? <WalletDownloadSafetyNotice locale={locale} hold={hold} /> : walletCopy[walletFile.limitationKey]}</small> : item.note ? <small>{item.note}</small> : null}{hold && <><small>{walletCopy[walletFile.installProofKey]}</small><small>SHA-256 <code dir="ltr">{item.sha256}</code></small></>}</li>;
  }

  return (
    <li key={`${productName}-${platform}`} className={`downloadItem ${item.status}`}>
      <span>{name}</span>
      <a href={item.href} rel={item.external ? "noopener" : undefined} download={walletFile?.filename || (item.downloadHosted ? item.artifactPath : undefined)}>
        <span>{item.downloadHosted ? copy.download : statusText}</span>
        {item.downloadHosted ? <Download size={14} /> : <ArrowUpRight size={14} />}
      </a>
      {walletFile ? <small>{walletCopy[walletFile.limitationKey]}</small> : item.note ? <small>{item.note}</small> : null}
      {item.downloadHosted ? <dl className="downloadEvidence" aria-label={`${productName} ${name} ${copy.evidence[5]}`}>
        <div><dt>{!item.version && walletFile ? walletCopy.sourceCode : copy.evidence[0]}</dt><dd>{item.version || (walletFile ? item.sourceCommit?.slice(0, 12) : null) || copy.unavailable}</dd></div>
        <div><dt>{copy.evidence[1]}</dt><dd>{formatBytes(item.sizeBytes, locale) || copy.unavailable}</dd></div>
        <div><dt>SHA-256</dt><dd><code>{item.sha256 || copy.unavailable}</code></dd></div>
        <div><dt>{copy.evidence[2]}</dt><dd>{walletFile?.signingKey ? walletCopy[walletFile.signingKey] : item.signingClass || copy.unavailable}</dd></div>
        <div><dt>{copy.evidence[3]}</dt><dd><code>{item.sourceCommit || copy.unavailable}</code></dd></div>
        <div><dt>{copy.evidence[4]}</dt><dd>{walletFile?.installProofKey ? walletCopy[walletFile.installProofKey] : item.installProof || copy.unavailable}</dd></div>
      </dl> : null}
      {walletFile && item.previewManifest && <small>{item.sdkManifest && <><a href={item.sdkManifest}>{walletCopy.downloadManifest}</a> · </>}<a href={item.previewManifest}>{walletCopy.previewManifest}</a></small>}
    </li>
  );
}

export function DownloadPage() {
  const { locale } = useLocale();
  const copy = getDownloadCopy(locale);
  const [query, setQuery] = useState("");
  const [availability, setAvailability] = useState("all");
  const filterCopy = locale === "zh-CN"
    ? ["搜索产品", "输入产品名称", "可用方式", "全部产品", "可打开网页", "发布包", "个产品", "没有匹配的产品", "清除筛选"]
    : locale === "zh-TW"
      ? ["搜尋產品", "輸入產品名稱", "可用方式", "全部產品", "可開啟網頁", "發布套件", "個產品", "沒有符合的產品", "清除篩選"]
      : ["Search products", "Enter a product name", "Availability", "All products", "Public Web", "Release packages", "products", "No matching products", "Clear filters"];
  const catalog = getCatalog().map(getDownloadDirectoryProduct).filter(product =>
    product.name.toLowerCase().includes(query.trim().toLowerCase()) &&
    (availability === "all" || (availability === "web" ? Boolean(product.downloads.web?.href) : product.hasDownload))
  );
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
  const hostedProducts = products.filter((product) => product.hasDownload);
  const directoryProducts = products.filter((product) => !hostedProducts.includes(product));

  const renderProduct = (product) => (
    <article className="downloadCard" key={product.key} data-product={product.key}>
      <div className="downloadHeader">
        <strong>{product.name}</strong>
        <span className={`appState ${product.status}`}>{copy.statusLabels[product.status]}</span>
      </div>

      <p>{product.detail}</p>
      {product.key === "wallet" && <WalletDownloadInventoryNotice locale={locale} />}
      <ul className="downloadList">
        {Object.entries(product.downloads)
          .filter(([platform]) => (product.key === "wallet" ? ["web", ...WALLET_DOWNLOAD_PLATFORMS] : ["web", "pwa", "chromeEdge", "firefox", "android", "ios", "macos", "windows", "windowsX64", "windowsArm64", "linux"]).includes(platform))
          .map(([platform, item]) => renderTarget(platform, item, product.key, locale, copy, product.key !== "wallet" || getProductPublicContract(product).downloadHostedVerified))}
      </ul>
      {product.key === "wallet" && <WalletDownloadHistory locale={locale} />}

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

      <div className="downloadFilters" role="search" aria-label={filterCopy[0]}>
        <label>{filterCopy[0]}<input type="search" value={query} placeholder={filterCopy[1]} onChange={event => setQuery(event.target.value)} /></label>
        <label>{filterCopy[2]}<select value={availability} onChange={event => setAvailability(event.target.value)}>
          <option value="all">{filterCopy[3]}</option><option value="web">{filterCopy[4]}</option><option value="packages">{filterCopy[5]}</option>
        </select></label>
        <p role="status">{products.length} {filterCopy[6]}</p>
        {(query || availability !== "all") && <button type="button" onClick={() => { setQuery(""); setAvailability("all"); }}>{filterCopy[8]}</button>}
      </div>
      {!products.length && <p className="downloadEmpty">{filterCopy[7]}</p>}

      {hostedProducts.length > 0 && <section className="downloadGroup" aria-labelledby="available-downloads-title">
        <div className="downloadGroupHeader">
          <div><p className="sectionEyebrow">{copy.available[0]}</p><h2 id="available-downloads-title">{copy.available[1]}</h2></div>
          <p>{copy.available[2]}</p>
        </div>
        <div className="downloadDirectory">{hostedProducts.map(renderProduct)}</div>
      </section>}

      {directoryProducts.length > 0 && <section className="downloadGroup" aria-labelledby="release-directory-title">
        <div className="downloadGroupHeader">
          <div><p className="sectionEyebrow">{copy.other[0]}</p><h2 id="release-directory-title">{copy.other[1]}</h2></div>
          <p>{copy.other[2]}</p>
        </div>
        <div className="downloadDirectory">{directoryProducts.map(renderProduct)}</div>
      </section>}

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
