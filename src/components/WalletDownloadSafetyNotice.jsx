import React from "react";
import { getWalletSafetyCopy } from "../content/walletSafetyCopy.js";
import { WALLET_DOWNLOAD_SAFETY_POLICY_PATH, WALLET_APPIMAGE_ADVISORY } from "../lib/walletDownloadSafety.js";

export function WalletDownloadSafetyNotice({ locale, hold }) {
  if (!hold) return null;
  const copy = getWalletSafetyCopy(locale);
  return <span data-wallet-safety-hold={hold.id}>{copy.appImageHold}{" "}<a href={hold.href} rel="noopener" style={{ display: "inline-flex", alignItems: "center", minHeight: 44 }}>{copy.advisoryLabel}</a></span>;
}

export function WalletDownloadInventoryNotice({ locale }) {
  return <p className="downloadInstallNotice" data-wallet-download-inventory="upstream-11-available-9">{getWalletSafetyCopy(locale).inventoryNote}{" "}<a href={WALLET_DOWNLOAD_SAFETY_POLICY_PATH} style={{ display: "inline-flex", alignItems: "center", minHeight: 44 }}>{WALLET_APPIMAGE_ADVISORY.id}</a></p>;
}
