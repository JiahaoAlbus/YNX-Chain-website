import React from "react";
import { apiConfig } from "../lib/api/ynxApi.js";
import { useLocale } from "../lib/i18n.jsx";

export function SiteFooter() {
  const { t } = useLocale();
  return (
    <footer className="siteFooter">
      <div><strong>YNX Chain</strong><p>{t("footerLead")}</p></div>
      <div className="footerLinks">
        <a href="/dapp">{t("ecosystem")}</a>
        <a href="/manual">{t("userManual")}</a>
        <a href="/docs">{t("developerDocs")}</a>
        <a href="/api">{t("api")}</a>
        <a href="/faq">{t("faq")}</a>
        <a href="/dapp">{t("dapps")}</a>
        <a href="/status">{t("status")}</a>
        <a href="/security">{t("security")}</a>
        <a href="/support">{t("support")}</a>
        <a href="/dapp/square">{t("square")}</a>
        <a href={apiConfig.explorerUrl}>{t("explorer")}</a>
        <a href="/readiness">{t("readiness")}</a>
        <a href="/risk">{t("risk")}</a>
        <a href="/privacy">{t("privacy")}</a>
        <a href="/terms">{t("terms")}</a>
      </div>
      <p className="footerBoundary">{t("footerBoundary")}</p>
    </footer>
  );
}
