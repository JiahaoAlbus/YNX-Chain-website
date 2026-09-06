import React from "react";
import { ArrowUpRight, Download, Globe, Monitor, Smartphone } from "lucide-react";
import { DOWNLOAD_LABELS } from "../lib/ecosystemCatalog.js";
import { WALLET_DOWNLOAD_PLATFORMS, walletDownloadLabel, walletDownloadState } from "../lib/walletDownloads.js";
import { WALLET_DOWNLOAD_COPY } from "../content/walletDownloadCopy.js";

const order = ["macos", "windowsX64", "windowsArm64", "windows", "linux", "android", "ios", "chromeEdge", "firefox", "pwa"];

function releasePresentation(productKey, platform, item) {
  if (productKey === "wallet") {
    const state = walletDownloadState(platform, item);
    return { ...state, blocked: !state.available };
  }
  return { blocked: false, requirements: null, limitationKey: "previewUnverified" };
}

export function ProductDownloads({ product, contract, copy, locale }) {
  const downloadCopy = { ...copy, ...(WALLET_DOWNLOAD_COPY[locale] || WALLET_DOWNLOAD_COPY.en) };
  const hosted = new Map(contract.downloads.items.map(item => [item.platform, item]));
  const platforms = (product.key === "wallet" ? WALLET_DOWNLOAD_PLATFORMS : order).filter(platform => product.downloads?.[platform] &&
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
        const platformLabel = product.key === "wallet" ? walletDownloadLabel(platform, copy) : copy.platformNames[platform] || DOWNLOAD_LABELS[platform] || platform;
        return <li key={platform} className="productDownloadRow">
          <Icon className="downloadPlatformIcon" aria-hidden="true" />
          <div className="downloadPlatformInfo">
            <h3>{platformLabel}</h3>
            <p className="downloadVersion">{[version && `${copy.version} ${version}`, size, item.historicalPreview ? downloadCopy.historicalPreview : available ? copy.testnetPreview : copy.unavailableYet].filter(Boolean).join(" · ")}</p>
            {presentation.requirements && <p>{presentation.requirements}</p>}
            <p className={presentation.blocked ? "downloadLimitation blocked" : "downloadLimitation"}>
              {!available ? copy.unavailable : downloadCopy[presentation.limitationKey]}
            </p>
            {presentation.signingKey && <p className="downloadLimitation">{downloadCopy[presentation.signingKey]}</p>}
            {presentation.installProofKey && <p className="downloadLimitation">{downloadCopy[presentation.installProofKey]}</p>}
            {(item.note || item.sha256) && <details className="downloadReleaseDetails">
              <summary>{copy.releaseDetails}</summary>
              {item.note && !presentation.installProofKey && <p lang="en">{item.note}</p>}
              {item.sourceCommit && <p>{downloadCopy.sourceCode} <code dir="ltr">{item.sourceCommit}</code></p>}
              {item.sha256 && <p>SHA-256 <code dir="ltr">{item.sha256}</code></p>}
              {item.publicationEvidence && <a href={item.publicationEvidence}>{copy.releases}<ArrowUpRight size={14}/></a>}
              {item.sdkManifest && <p><a href={item.sdkManifest}>{downloadCopy.downloadManifest}<ArrowUpRight size={14}/></a></p>}
              {item.previewManifest && <p><a href={item.previewManifest}>{downloadCopy.previewManifest}<ArrowUpRight size={14}/></a></p>}
            </details>}
          </div>
          {available && !presentation.blocked
            ? <a className="button secondary downloadPlatformAction" aria-label={`${copy.download} ${platformLabel}`} href={item.href} download={presentation.filename || item.artifactPath} rel={item.external ? "noopener" : undefined}>{copy.download}<Download size={16}/></a>
            : <span className="downloadUnavailable downloadPlatformAction">{copy.unavailableYet}</span>}
        </li>;
      })}
    </ul>
  </div>;
}
