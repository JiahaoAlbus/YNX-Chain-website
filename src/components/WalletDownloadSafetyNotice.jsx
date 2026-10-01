import React from "react";
import { WALLET_CANONICAL_DOWNLOADS } from "../content/walletCanonicalDownloads.js";
import { walletDownloadState } from "../lib/walletDownloads.js";
import { getWalletSafetyCopy } from "../content/walletSafetyCopy.js";
import { WALLET_DOWNLOAD_SAFETY_POLICY_PATH, WALLET_APPIMAGE_ADVISORY } from "../lib/walletDownloadSafety.js";

export function WalletDownloadSafetyNotice({ locale, hold }) {
  if (!hold) return null;
  const copy = getWalletSafetyCopy(locale);
  return <span data-wallet-safety-hold={hold.id}>{copy.appImageHold}{" "}<a href={hold.href} rel="noopener" style={{ display: "inline-flex", alignItems: "center", minHeight: 44 }}>{copy.advisoryLabel}</a></span>;
}

export function WalletDownloadInventoryNotice({ locale }) {
  const entries=Object.entries(WALLET_CANONICAL_DOWNLOADS);
  const available=entries.filter(([platform,item])=>walletDownloadState(platform,{...item,href:item.publicUrl,downloadHosted:true}).available).length;
  const inventory=getWalletSafetyCopy(locale).inventoryNote.replace('{total}',String(entries.length)).replace('{available}',String(available));
  return <p className="downloadInstallNotice" data-wallet-download-inventory={`current-${entries.length}-available-${available}`}>{inventory}{" "}<a href={WALLET_DOWNLOAD_SAFETY_POLICY_PATH} style={{ display: "inline-flex", alignItems: "center", minHeight: 44 }}>{WALLET_APPIMAGE_ADVISORY.id}</a></p>;
}
