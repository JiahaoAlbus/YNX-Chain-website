import React, { lazy, useEffect } from "react";
import { ECONOMIC_ROUTES } from "../lib/economicsEvidence.js";
import { getLegacyDAppRedirect, getProductRouteMatch } from "../lib/ecosystemCatalog.js";
import docsAuthority from "virtual:ynx-docs-authority";
const portalRoutes = new Set(["/blockchain", "/tokens", "/data", "/governance", "/developers", "/downloads", "/ecosystem", "/more"]);

const RoutePage = lazyNamed(() => import("../components/RoutePage.jsx"), "RoutePage");
const EconomicPage = lazyNamed(() => import("../pages/EconomicPage.jsx"), "EconomicPage");
const AppsPage = lazyNamed(() => import("../pages/AppsPage.jsx"), "AppsPage");
const DownloadPage = lazyNamed(() => import("../pages/DownloadPage.jsx"), "DownloadPage");
const DocsPage = lazyNamed(() => import("../pages/DocsPage.jsx"), "DocsPage");
const AuthorityArticlePage = lazyNamed(() => import("../pages/AuthorityArticlePage.jsx"), "AuthorityArticlePage");
const ProductStatusPage = lazyNamed(() => import("../pages/ProductStatusPage.jsx"), "ProductStatusPage");
const SquarePage = lazyNamed(() => import("../pages/SquarePage.jsx"), "SquarePage");
const ManualPage = lazyNamed(() => import("../pages/ManualPage.jsx"), "ManualPage");
const ApiPage = lazyNamed(() => import("../pages/ApiPage.jsx"), "ApiPage");
const FaucetPage = lazyNamed(() => import("../pages/FaucetPage.jsx"), "FaucetPage");
const WalletAuthCallbackPage = lazyNamed(() => import("../pages/WalletAuthCallbackPage.jsx"), "WalletAuthCallbackPage");
const PortalPage = lazyNamed(() => import("../pages/PortalPage.jsx"), "PortalPage");

export function RoutedContent({ route, copy }) {
    if (route === "/dapp/wallet/wallet-auth/callback") return <WalletAuthCallbackPage />;
    const legacyTarget = getLegacyRouteTarget(route);
    if (legacyTarget) {
      return <LegacyRouteRedirect target={legacyTarget} copy={copy.utility.moved} />;
    }
    let page = ECONOMIC_ROUTES.has(route) ? <EconomicPage path={route} /> : portalRoutes.has(route) ? <PortalPage path={route} /> : <RoutePage path={route} />;
    const productMatch = getProductRouteMatch(route);
    const authorityArticle = docsAuthority.articles.find((article) => article.route === route);
    if (productMatch) page = <ProductStatusPage product={productMatch.product} sectionId={productMatch.sectionId} article={authorityArticle} artifact={docsAuthority.artifact} />;
    else if (authorityArticle) page = <AuthorityArticlePage sourceArticle={authorityArticle} artifact={docsAuthority.artifact} />;
    if (route === "/dapp/download") page = <DownloadPage />;
    if (route === "/dapp") page = <AppsPage />;
    if (route === "/docs") page = <DocsPage />;
    if (route === "/manual") page = <ManualPage />;
    if (route === "/api") page = <ApiPage />;
    if (route === "/dapp/faucet") page = <FaucetPage />;
    if (route === "/dapp/square" || route.startsWith("/dapp/square/")) page = <SquarePage path={route} />;
    return page;
}

function getLegacyRouteTarget(path) {
  if (path === "/apps") return "/dapp";
  if (path === "/download") return "/dapp/download";
  if (path === "/square") return "/dapp/square";
  if (path.startsWith("/square/")) return `/dapp/square/${path.slice("/square/".length)}`;
  if (path === "/quant") return "/dapp/quant";
  if (path === "/faucet") return "/dapp/faucet";
  return getLegacyDAppRedirect(path);
}

function LegacyRouteRedirect({ target, copy: moved }) {
  const destination = `${target}${window.location.search}${window.location.hash}`;
  useEffect(() => {
    window.location.replace(destination);
  }, [destination]);
  return (
    <main className="routePage">
      <div className="routeInner">
        <p className="sectionEyebrow">{moved[0]}</p>
        <h1>{moved[1]}</h1>
        <p className="routeLead">{moved[2]}</p>
        <a className="button primary" href={destination}>{moved[3]}</a>
      </div>
    </main>
  );
}

function lazyNamed(loader, name) { return lazy(() => loader().then((module) => ({ default: module[name] }))); }
