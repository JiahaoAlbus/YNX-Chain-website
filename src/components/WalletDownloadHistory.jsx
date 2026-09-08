import React from "react";
import { WALLET_DOWNLOAD_HISTORY_PATH } from "../content/walletCanonicalDownloads.js";
import { WALLET_DOWNLOAD_COPY } from "../content/walletDownloadCopy.js";

export function WalletDownloadHistory({ locale = "en" }) {
  const copy = WALLET_DOWNLOAD_COPY[locale] || WALLET_DOWNLOAD_COPY.en;
  return <p><a href={WALLET_DOWNLOAD_HISTORY_PATH}>{copy.downloadHistory}</a></p>;
}
