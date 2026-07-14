import React from "react";
import { apiConfig } from "../lib/api/ynxApi.js";

export function SiteFooter() {
  return (
    <footer className="siteFooter">
      <div><strong>YNX Chain</strong><p>Web4 L1 ecosystem built around YNXT.</p></div>
      <div className="footerLinks">
        <a href="/apps">Apps</a><a href="/square">Square</a><a href={apiConfig.explorerUrl}>Explorer</a><a href="/docs">Docs</a><a href="/readiness">Readiness</a><a href="/risk">Risk</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a>
      </div>
      <p className="footerBoundary">Public testnet project. No mainnet launch, exchange listing, stablecoin issuer support, wallet default support, or third-party partnership is claimed.</p>
    </footer>
  );
}
