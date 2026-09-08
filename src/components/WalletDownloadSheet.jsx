import { WalletDownloadSafetyNotice, WalletDownloadInventoryNotice } from "./WalletDownloadSafetyNotice.jsx";
import { getWalletSafetyCopy } from "../content/walletSafetyCopy.js";
import { WalletDownloadHistory } from "./WalletDownloadHistory.jsx";
import React from "react";
import { ArrowUpRight, Download, Monitor, Smartphone } from "lucide-react";
import { getCatalog } from "../lib/ecosystemCatalog.js";
import { getProductPublicContract } from "../lib/productPublicContract.js";
import { walletDownloadLabel, walletDownloadOptions } from "../lib/walletDownloads.js";
import { PRODUCT_UI_COPY } from "../content/productUiCopy.js";
import { WALLET_DOWNLOAD_COPY } from "../content/walletDownloadCopy.js";

// Download actions remain file links. The separate guide never intercepts them.
export function WalletDownloadSheet({ locale = "en", noticeId }) {
  const copy = { ...(PRODUCT_UI_COPY[locale] || PRODUCT_UI_COPY.en), ...(WALLET_DOWNLOAD_COPY[locale] || WALLET_DOWNLOAD_COPY.en) };
  const safetyCopy = getWalletSafetyCopy(locale);
  const product = getCatalog().find(item => item.key === "wallet");
  const contract = getProductPublicContract(product);
  const options = walletDownloadOptions(product, contract.downloadHostedVerified);
  const renderOption = ({ platform, item, available, filename, requirements, limitationKey, installProofKey, signingKey, safetyHold }) => {
    const Icon = ["android", "androidUniversal", "ios"].includes(platform) ? Smartphone : Monitor;
    const platformLabel = walletDownloadLabel(platform, copy);
    const version = item?.version?.split("-testnet")[0];
    const size = item?.sizeBytes ? `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(item.sizeBytes / 1000000)} MB` : null;
    return <li key={platform} className="walletDownloadOption" data-platform={platform}>
      <Icon className="walletDownloadPlatformIcon" size={23} aria-hidden="true" />
      <div className="walletDownloadInfo">
        <h3>{platformLabel}</h3>
        {item?.historicalPreview && <p>{copy.historicalPreview}</p>}
        <p>{available || safetyHold ? [version, size, requirements].filter(Boolean).join(" · ") : copy[limitationKey]}</p>
        {(available || safetyHold) && <>
          <p className="walletDownloadFlowBoundary">{safetyHold ? <WalletDownloadSafetyNotice locale={locale} hold={safetyHold} /> : copy[limitationKey]}</p>
          {signingKey && <p className="walletDownloadFlowBoundary">{copy[signingKey]}</p>}
          {installProofKey && <p className="walletDownloadFlowBoundary">{copy[installProofKey]}</p>}
          <details className="walletDownloadDetails">
            <summary>{copy.releaseDetails}</summary>
            <p>SHA-256 <code dir="ltr">{item.sha256}</code></p>
            <p>{copy.sourceCode} <code dir="ltr">{item.sourceCommit}</code></p>
            <a href={item.publicationEvidence}>{copy.releases}<ArrowUpRight size={14} aria-hidden="true" /></a>
            {item.sdkManifest && <p><a href={item.sdkManifest}>{copy.downloadManifest}<ArrowUpRight size={14} aria-hidden="true" /></a></p>}
            {item.previewManifest && <p><a href={item.previewManifest}>{copy.previewManifest}<ArrowUpRight size={14} aria-hidden="true" /></a></p>}
          </details>
        </>}
      </div>
      {available ? <a className="walletDownloadFile" href={item.href} download={filename} aria-label={`${copy.download} ${platformLabel}`}>
        {copy.download}<Download size={16} aria-hidden="true" />
      </a> : <span className="walletDownloadUnavailable">{safetyHold ? safetyCopy.pausedLabel : copy.unavailableYet}</span>}
    </li>;
  };
  return <>
    <p className="walletDownloadNotice" id={noticeId}>{copy.choosePlatform}. {copy.installNotice}</p>
    <a className="walletDownloadGuide" href={`/manual?path=wallet&lang=${encodeURIComponent(locale)}`}>{copy.installation}<ArrowUpRight size={16} aria-hidden="true" /></a>
    <WalletDownloadInventoryNotice locale={locale} />
    <ul className="walletDownloadOptions">{options.filter(option => option.available || option.safetyHold).map(renderOption)}</ul>
    <details className="walletDownloadOtherPlatforms">
      <summary>{copy.otherPlatforms}</summary>
      <ul className="walletDownloadOptions">{options.filter(option => !option.available && !option.safetyHold).map(renderOption)}</ul>
    </details>
    <WalletDownloadHistory locale={locale} />
    <footer className="walletDownloadFooter">
      <span>{copy.testnetPreview}</span>
      <a href="/dapp/wallet/releases">{copy.releases}<ArrowUpRight size={16} aria-hidden="true" /></a>
    </footer>
  </>;
}
