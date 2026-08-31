import React from "react";
import { apiConfig } from "../lib/api/ynxApi.js";
import { useLocale } from "../lib/i18n.jsx";

export function SiteFooter() {
  const { t } = useLocale();
  return (
    <footer className="siteFooter">
      <div><strong>YNX Chain</strong><p>{t("footerLead")}</p></div>
      <div className="footerLinks">
        <a href="/ecosystem">{t("ecosystem")}</a><a href="/downloads">{t("downloads")}</a><a href="/docs">{t("developerDocs")}</a><a href="/developers">{t("developers")}</a>
        <a href="/status">{t("status")}</a><a href={apiConfig.explorerUrl}>{t("explorer")}</a><a href={apiConfig.faucetUrl}>{t("faucet")}</a><a href="/security">{t("security")}</a>
        <a href="https://github.com/JiahaoAlbus/YNX-Chain">GitHub</a><a href="https://github.com/JiahaoAlbus/YNX-Chain-website">Website GitHub</a><a href="https://x.com/YNXChain">X</a><a href="https://discord.gg/t8KpAF2KE">Discord</a><a href="https://www.youtube.com/@YNX-Chain">YouTube</a>
        <a href="/privacy">{t("privacy")}</a><a href="/terms">{t("terms")}</a>
      </div>
      <p className="footerBoundary">{t("footerBoundary")}</p>
    </footer>
  );
}
