import React from "react";
import { ArrowUpRight, Download, Globe, Monitor, Smartphone } from "lucide-react";
import { DOWNLOAD_LABELS } from "../lib/ecosystemCatalog.js";

const order = ["macos", "windowsX64", "windowsArm64", "windows", "linux", "android", "ios", "chromeEdge", "firefox", "pwa"];

function releasePresentation(productKey, platform, item) {
  const knownWallet = productKey === "wallet";
  const blocked = knownWallet && platform === "macos" && item.sourceCommit === "5a6b033897a1295d35fc325a92c6bb81c8b04a19";
  const requirements = knownWallet && platform === "android" ? "Android 7.0+ (API 24)"
    : blocked ? "macOS 13+ · Apple Silicon / Intel"
    : knownWallet && platform === "windowsX64" ? "Windows · x64"
    : knownWallet && platform === "windowsArm64" ? "Windows · ARM64"
    : knownWallet && platform === "chromeEdge" ? "Chrome / Edge 120+"
    : knownWallet && platform === "firefox" ? "Firefox 128+" : null;
  return { blocked, requirements, limitationKey: blocked ? "macLegacyBlocked" : "previewUnverified" };
}

export function ProductDownloads({ product, contract, copy, locale }) {
  const hosted = new Map(contract.downloads.items.map(item => [item.platform, item]));
  const platforms = order.filter(platform => product.downloads?.[platform] &&
    !(platform === "windows" && (product.downloads.windowsX64 || product.downloads.windowsArm64)));
  return <div className="productDownloads">
    <div className="productBrowserEntry">
      <Globe aria-hidden="true" />
      <div><h3>{copy.openInBrowser}</h3><p>{product.key === "wallet" ? copy.walletProviderRequired : copy.testnetPreview}</p></div>
      {contract.publicEntry.status === "available"
        ? <a className="button primary" href={contract.publicEntry.href} rel="noopener">{copy.openInBrowser}<ArrowUpRight size={16} /></a>
        : <span className="downloadUnavailable">{copy.noWebVersion}</span>}
    </div>
    <p className="downloadInstallNotice">{copy.installNotice}</p>
    <ul className="productDownloadRows">
      {platforms.map(platform => {
        const item = hosted.get(platform) || product.downloads[platform];
        const available = hosted.has(platform);
        const presentation = releasePresentation(product.key, platform, item);
        const Icon = ["ios", "android"].includes(platform) ? Smartphone : Monitor;
        const version = item.version?.split("-testnet")[0];
        const size = item.sizeBytes ? `${new Intl.NumberFormat(locale, {maximumFractionDigits:1}).format(item.sizeBytes / 1000000)} MB` : null;
        const platformLabel = copy.platformNames[platform] || DOWNLOAD_LABELS[platform] || platform;
        return <li key={platform} className="productDownloadRow">
          <Icon className="downloadPlatformIcon" aria-hidden="true" />
          <div className="downloadPlatformInfo">
            <h3>{platformLabel}</h3>
            <p className="downloadVersion">{[version && `${copy.version} ${version}`, size, available ? copy.testnetPreview : copy.unavailableYet].filter(Boolean).join(" · ")}</p>
            {presentation.requirements && <p>{presentation.requirements}</p>}
            <p className={presentation.blocked ? "downloadLimitation blocked" : "downloadLimitation"}>
              {!available ? copy.unavailable : copy[presentation.limitationKey]}
            </p>
            {(item.note || item.sha256) && <details className="downloadReleaseDetails">
              <summary>{copy.releaseDetails}</summary>
              {item.note && <p lang="en">{item.note}</p>}
              {item.sha256 && <p>SHA-256 <code dir="ltr">{item.sha256}</code></p>}
              {item.publicationEvidence && <a href={item.publicationEvidence}>{copy.releases}<ArrowUpRight size={14}/></a>}
              {available && presentation.blocked && <a href={item.href} rel={item.external ? "noopener" : undefined}>{copy.download} · {version}<Download size={14}/></a>}
            </details>}
          </div>
          {available && !presentation.blocked
            ? <a className="button secondary downloadPlatformAction" aria-label={`${copy.download} ${platformLabel}`} href={item.href} rel={item.external ? "noopener" : undefined}>{copy.download}<Download size={16}/></a>
            : <span className="downloadUnavailable downloadPlatformAction">{copy.unavailableYet}</span>}
        </li>;
      })}
    </ul>
  </div>;
}
