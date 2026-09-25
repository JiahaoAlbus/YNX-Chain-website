import { WalletDownloadSafetyNotice, WalletDownloadInventoryNotice } from "../components/WalletDownloadSafetyNotice.jsx";
import { getWalletSafetyCopy } from "../content/walletSafetyCopy.js";
import { WalletDownloadHistory } from "../components/WalletDownloadHistory.jsx";
import React, { useMemo, useState } from "react";
import { ArrowUpRight, Download, FileJson2, Search, ShieldCheck } from "lucide-react";
import { getCatalog, DOWNLOAD_LABELS, PLATFORM_STATUS, PRODUCT_STATUS } from "../lib/ecosystemCatalog.js";
import { useLocale } from "../lib/i18n.jsx";
import { getAppsCopy, getDownloadCopy } from "../content/businessLocaleContent.js";
import { getDownloadCategoryLabels, getDownloadExperienceCopy } from "../content/downloadExperienceCopy.js";
import { DOWNLOAD_TILE_KEYS, getDownloadTileSummary } from "../content/downloadTileSummaries.js";
import { getProductPublicContract, productSectionRoute } from "../lib/productPublicContract.js";
import { getDownloadDirectoryProduct } from "../lib/downloadDirectory.js";
import { ECOSYSTEM_CATEGORIES } from "../lib/ecosystemCategories.js";
import { filterDownloadProducts } from "../lib/downloadFilters.js";
import { getEligiblePackageEntries, hasEligibleWebEntry } from "../lib/downloadActions.js";
import { WALLET_DOWNLOAD_PLATFORMS, walletDownloadLabel, walletDownloadState } from "../lib/walletDownloads.js";
import { PRODUCT_UI_COPY } from "../content/productUiCopy.js";
import { WALLET_DOWNLOAD_COPY } from "../content/walletDownloadCopy.js";
import { localizeCardProduct } from "../content/cardPublicCopy.js";
import "./DownloadPage.css";

const DIRECTORY_RANK = new Map(DOWNLOAD_TILE_KEYS.map((key, index) => [key, index]));
const CATEGORY_ORDER = ["community", "commerce", "builders", "media", "trust"];
const FEATURE_PACKAGE_ORDER = ["windowsX64", "macos", "linuxX64Deb", "android", "chromeEdge", "pwa", "windowsArm64", "linuxArm64Deb", "firefox", "androidUniversal"];
const FEATURE_PACKAGE_RANK = new Map(FEATURE_PACKAGE_ORDER.map((key, index) => [key, index]));

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
      <a href={item.href} rel={item.external ? "noopener" : undefined} download={walletFile?.filename || (item.downloadHosted ? item.artifactPath : undefined)} data-download-source={walletFile ? "official" : undefined}>
        <span>{item.downloadHosted ? copy.download : statusText}</span>
        {item.downloadHosted ? <Download size={14} /> : <ArrowUpRight size={14} />}
      </a>
      {walletFile?.fallbackHref && <><a href={walletFile.fallbackHref} rel="noopener" download={walletFile.filename} data-download-source="github-fallback">{walletCopy.githubFallback}<ArrowUpRight size={14}/></a><small>{walletCopy.fallbackManual}</small></>}
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
  const experience = getDownloadExperienceCopy(locale);
  const appsCopy = getAppsCopy(locale);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [method, setMethod] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [selectedKey, setSelectedKey] = useState("wallet");
  const catalog = useMemo(() => getCatalog().map(source => {
    const product = localizeCardProduct(source, locale);
    return { ...getDownloadDirectoryProduct(product), publicContract: getProductPublicContract(product) };
  }).sort((a, b) => (DIRECTORY_RANK.get(a.key) ?? 99) - (DIRECTORY_RANK.get(b.key) ?? 99)), [locale]);
  const products = filterDownloadProducts(catalog, { query, category, method, platform });
  const selected = products.find(product => product.key === selectedKey) || products[0] || null;
  const packageEntries = selected ? getEligiblePackageEntries(selected) : [];
  const featurePackages = [...packageEntries].sort(([a], [b]) => (FEATURE_PACKAGE_RANK.get(a) ?? 99) - (FEATURE_PACKAGE_RANK.get(b) ?? 99)).slice(0, 6);
  const publicWeb = selected && hasEligibleWebEntry(selected) ? selected.downloads.web.href : null;
  const categories = CATEGORY_ORDER.map((id, index) => ({ ...ECOSYSTEM_CATEGORIES.find(group => group.id === id), label: getDownloadCategoryLabels(locale)[index] }));
  const clearFilters = () => { setQuery(""); setCategory("all"); setMethod("all"); setPlatform("all"); };

  return (
    <main className="downloadPage downloadHub" dir={locale === "ar" ? "rtl" : undefined}>
      <header className="downloadHubHeader">
        <p className="downloadHubCrumb"><a href="/">YNX</a><span aria-hidden="true">/</span>{experience.title}</p>
        <h1>{experience.title}</h1>
        <p>{experience.lead}</p>
      </header>

      <section className="downloadHubDiscovery" aria-label={experience.search}>
        <label className="downloadHubSearch"><Search aria-hidden="true" size={22}/><span className="visuallyHidden">{experience.search}</span><input type="search" value={query} placeholder={experience.search} onChange={event => setQuery(event.target.value)} /></label>
        <div className="downloadHubCategories" role="group" aria-label={appsCopy.allCategories}>
          <button type="button" className={category === "all" ? "active" : ""} aria-pressed={category === "all"} onClick={() => setCategory("all")}>{experience.all} <span>({catalog.length})</span></button>
          {categories.map(group => <button type="button" key={group.id} className={category === group.id ? "active" : ""} aria-pressed={category === group.id} onClick={() => setCategory(group.id)}>{group.label} <span>({group.keys.length})</span></button>)}
        </div>
        <div className="downloadHubRefine">
          <label><span className="visuallyHidden">{experience.allMethods}</span><select value={method} onChange={event => setMethod(event.target.value)} aria-label={experience.allMethods}><option value="all">{experience.allMethods}</option><option value="web">{experience.web}</option><option value="packages">{experience.packagesMethod}</option><option value="none">{experience.unavailable}</option></select></label>
          <label><span className="visuallyHidden">{experience.allPlatforms}</span><select value={platform} onChange={event => setPlatform(event.target.value)} aria-label={experience.allPlatforms}><option value="all">{experience.allPlatforms}</option><option value="desktop">{experience.desktop}</option><option value="mobile">{experience.mobile}</option><option value="browser">{experience.browser}</option></select></label>
          <p role="status"><strong>{products.length}</strong> / {catalog.length} {experience.productCount}</p>
          {(query || category !== "all" || method !== "all" || platform !== "all") && <button type="button" onClick={clearFilters}>{experience.clear}</button>}
        </div>
      </section>

      {selected ? <section className="downloadHubFeature" aria-label={`${selected.name} ${experience.choose}`} data-selected-product={selected.key}>
        <div className="downloadHubFeatureIdentity"><span className="downloadHubFeatureIcon"><selected.icon size={36} strokeWidth={1.7}/></span><div><span className={`appState ${selected.status}`}>{copy.statusLabels[selected.status]}</span><h2>{selected.name}</h2><p>{getDownloadTileSummary(locale, selected.key)}</p></div></div>
        <div className="downloadHubFeatureChoices"><strong>{experience.choose}</strong>{featurePackages.length || publicWeb ? <div className="downloadHubPackageLinks">{featurePackages.map(([key, item]) => <a key={key} href={item.href} rel={item.external ? "noopener" : undefined} download={item.artifactPath || undefined} aria-label={`${selected.name} ${DOWNLOAD_LABELS[key] || key} ${copy.download}`}><Download size={15}/>{selected.key === "wallet" ? walletDownloadLabel(key, { ...(PRODUCT_UI_COPY[locale] || PRODUCT_UI_COPY.en), ...(WALLET_DOWNLOAD_COPY[locale] || WALLET_DOWNLOAD_COPY.en) }) : DOWNLOAD_LABELS[key] || key}</a>)}{publicWeb && <a className="downloadHubWebLink" href={publicWeb} rel="noopener" aria-label={`${selected.name} ${experience.openWeb}`}><ArrowUpRight size={15}/>{experience.openWeb}</a>}</div> : <p>{experience.noPublic}</p>}</div>
        <div className="downloadHubFeatureActions"><a className="downloadHubPrimary" href={productSectionRoute(selected.route, "open-download")}>{experience.versions}<ArrowUpRight size={17}/></a></div>
      </section> : <section className="downloadHubNoResults"><Search size={25}/><h2>{experience.empty}</h2><p>{experience.selectHint}</p><button type="button" onClick={clearFilters}>{experience.clear}</button></section>}

      <section className="downloadHubGrid" aria-label={experience.title}>
        {products.map(product => { const Icon = product.icon; return <button type="button" key={product.key} data-product={product.key} className={`downloadHubTile ${selected?.key === product.key ? "selected" : ""}`} aria-pressed={selected?.key === product.key} onClick={() => setSelectedKey(product.key)}><Icon size={32} strokeWidth={1.8}/><strong>{product.name}</strong><span>{getDownloadTileSummary(locale, product.key)}</span></button>; })}
      </section>

      {catalog.map(product => <article key={product.key} data-product={product.key} hidden={selected?.key !== product.key}><details className="downloadHubDetails"><summary>{experience.details}<ArrowUpRight size={17}/></summary><div className="downloadHubDetailsBody"><p>{experience.testnetNotice}</p>{product.key === "wallet" && <WalletDownloadInventoryNotice locale={locale} />}<ul className="downloadList">{Object.entries(product.downloads).filter(([key]) => (product.key === "wallet" ? ["web", ...WALLET_DOWNLOAD_PLATFORMS] : ["web", "pwa", "chromeEdge", "firefox", "android", "ios", "macos", "windows", "windowsX64", "windowsArm64", "linux"]).includes(key)).map(([key, item]) => renderTarget(key, item, product.key, locale, copy, product.key !== "wallet" || product.publicContract.downloadHostedVerified))}</ul>{product.key === "wallet" && <WalletDownloadHistory locale={locale} />}<a className="textLink" href={productSectionRoute(product.route, "releases")}>{experience.viewStatus}<ArrowUpRight size={15}/></a></div></details></article>)}

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
