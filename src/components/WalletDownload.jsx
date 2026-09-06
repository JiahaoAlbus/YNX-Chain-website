import React, { lazy, Suspense, useId, useRef, useState } from "react";
import { Download, X } from "lucide-react";
import { useLocale } from "../lib/i18n.jsx";
import { WALLET_DOWNLOAD_COPY } from "../content/walletDownloadCopy.js";
import "./WalletDownload.css";

const WalletDownloadSheet = lazy(() => import("./WalletDownloadSheet.jsx").then(module => ({ default: module.WalletDownloadSheet })));

// The catalog loads only after the visitor opens the chooser. Keep the native
// dialog and its close control mounted while the content loads.
export function WalletDownload({ locale: localeOverride, label, className = "button primary" }) {
  const { locale: contextLocale } = useLocale();
  const locale = localeOverride || contextLocale;
  const copy = WALLET_DOWNLOAD_COPY[locale] || WALLET_DOWNLOAD_COPY.en;
  const [requested, setRequested] = useState(false);
  const dialog = useRef(null);
  const trigger = useRef(null);
  const closeButton = useRef(null);
  const headingId = useId();
  const noticeId = useId();
  const open = () => {
    setRequested(true);
    if (!dialog.current.open) dialog.current.showModal();
    closeButton.current?.focus({ preventScroll: true });
  };
  const close = () => dialog.current?.close();
  const loading = <p className="walletDownloadNotice" id={noticeId} role="status">{copy.loading}</p>;
  return <>
    <button ref={trigger} type="button" className={className} onClick={open} aria-haspopup="dialog">
      {label || copy.downloadWallet}<Download size={16} aria-hidden="true" />
    </button>
    <dialog ref={dialog} className="walletDownloadDialog" aria-labelledby={headingId} aria-describedby={noticeId}
      dir={locale === "ar" ? "rtl" : "ltr"} lang={locale}
      onClose={() => trigger.current?.focus({ preventScroll: true })}
      onClick={event => { if (event.target === dialog.current) close(); }}>
      <div className="walletDownloadSheet">
        <header className="walletDownloadHeading">
          <div><p>YNX Wallet</p><h2 id={headingId}>{copy.downloadWallet}</h2></div>
          <button ref={closeButton} type="button" className="walletDownloadClose" aria-label={copy.close} onClick={close}><X size={22} aria-hidden="true" /></button>
        </header>
        {requested ? <Suspense fallback={loading}><WalletDownloadSheet locale={locale} noticeId={noticeId} /></Suspense> : loading}
      </div>
    </dialog>
  </>;
}
