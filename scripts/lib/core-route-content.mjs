const NETWORK_FACTS = Object.freeze({
  nativeChainId: "ynx_6423-1",
  evmChainId: "6423 / 0x1917",
  nativeAsset: "YNXT",
});

const coreRoutes = [
  ["/", "YNX 6423 Testnet Portal", "Understand YNX Chain, inspect the 6423 Testnet, find YNXT, open verified tools, and follow evidence-backed product links.", "Understand YNX 6423 before you act.", "Start with the network identity, then choose Explorer, documentation, downloads, or an independently status-labelled ecosystem product.", [["Explore the network", "/blockchain"], ["Browse the ecosystem", "/ecosystem"], ["Read the manual", "/manual"]]],
  ["/blockchain", "YNX 6423 Blockchain", "Inspect the canonical YNX 6423 Testnet identity and continue to the independent Explorer for live blocks, transactions, accounts, and contracts.", "Explore the YNX 6423 blockchain.", "This first response explains the canonical network. Current height and records load from verified public services only after the interactive application starts.", [["Open Explorer", "https://explorer.ynxweb4.com"], ["Check network status", "/status"], ["Read API boundaries", "/api"]]],
  ["/tokens", "YNXT Native Testnet Asset", "Learn how YNXT is used for gas, fees, and resources on YNX 6423 without inventing unverified price, market-cap, or supply data.", "Use YNXT on YNX 6423.", "YNXT is the native Testnet asset. Market and supply figures stay unavailable until an authoritative public source exists.", [["Open Testnet Faucet", "https://faucet.ynxweb4.com"], ["Verify in Explorer", "https://explorer.ynxweb4.com/tokens/YNXT"], ["Read the manual", "/manual"]]],
  ["/data", "YNX 6423 Data Center", "Find current YNX 6423 data sources and understand why historical charts remain unavailable without an authoritative public history service.", "Use YNX data with its source attached.", "RPC, Explorer, Faucet, and Monitor are separate sources. Live values appear only after identity and freshness checks run in the browser.", [["Open Explorer", "https://explorer.ynxweb4.com"], ["Open Monitor", "https://monitor.ynxweb4.com"], ["Review API sources", "/api"]]],
  ["/governance", "YNX Governance Boundaries", "Review the current YNX 6423 governance boundary without fabricated proposals, votes, parameters, or authority claims.", "Governance data is not inferred.", "No verified public governance index is configured. Source material and documentation remain available while live proposal data stays explicitly unavailable.", [["Read documentation", "/docs"], ["Open source", "https://github.com/JiahaoAlbus/YNX-Chain"], ["Review readiness", "/readiness"]]],
  ["/ecosystem", "YNX Ecosystem Directory", "Choose among evidence-labelled YNX Wallet, payments, finance, commerce, social, developer, AI, data, and infrastructure products.", "Choose a YNX product by the job it does.", "Every product keeps separate source, candidate, public web, hosted download, signing, and store-release states.", [["Browse every product", "/dapp"], ["Check product status", "/status"], ["Open downloads", "/downloads"]]],
  ["/developers", "Develop on YNX 6423", "Build for YNX 6423 with the canonical chain identity, bounded APIs, documentation, source repositories, and explicit wallet confirmation rules.", "Build against one canonical Testnet identity.", "Use 6423 and 0x1917 only where the relevant protocol expects them. Account access, signatures, and transactions always require explicit user action.", [["Read developer docs", "/docs"], ["Open API reference", "/api"], ["Open GitHub", "https://github.com/JiahaoAlbus/YNX-Chain"]]],
  ["/downloads", "Verified YNX Downloads", "Find YNX software packages with platform, checksum, source, signing state, and installation boundaries shown before download.", "Install only a release you can verify.", "A candidate, unsigned build, simulator package, or unavailable platform is never presented as a production release.", [["Open download center", "/dapp/download"], ["Read installation manual", "/manual"], ["View release registry", "/releases/ecosystem-release-registry.json"]]],
  ["/more", "YNX Project Resources", "Open YNX documentation, whitepaper material, repositories, public status, support, and official community destinations from one clear index.", "Find every official YNX destination.", "External links are labelled. Support never needs a recovery phrase, private key, password, or custody material.", [["Read documentation", "/docs"], ["Get support", "/support"], ["Join Discord", "https://discord.gg/t8KpAF2KE"]]],
  ["/manual", "YNX 6423 User and Operator Manual", "Follow platform-specific and one-command onboarding paths for YNX 6423, wallet configuration, public verification, recovery, and reviewed validator preparation.", "Use YNX 6423 with a recovery path.", "Verify network identity before state-changing actions. Check Explorer or a receipt before retrying, and never paste keys into a website or support chat.", [["Check status", "/status"], ["Read documentation", "/docs"], ["Open Explorer", "https://explorer.ynxweb4.com"]]],
  ["/api", "YNX 6423 API Reference", "Use bounded YNX 6423 REST, EVM JSON-RPC, Explorer, and product endpoints with explicit timeout, freshness, and unavailable-state handling.", "Build against bounded public interfaces.", "Endpoint reachability alone does not prove chain convergence. Live responses load after the browser verifies their identity and freshness.", [["Open developer portal", "/developers"], ["Read documentation", "/docs"], ["Check status", "/status"]]],
  ["/status", "YNX 6423 Network and Product Status", "Check the evidence boundaries for YNX 6423 network services and ecosystem releases without treating HTTP reachability as full runtime proof.", "Verify the network before relying on it.", "The static page identifies the expected network. Fresh service health, height, index lag, and product state load after hydration and may be unavailable or degraded.", [["Open Monitor", "https://monitor.ynxweb4.com"], ["Open Explorer", "https://explorer.ynxweb4.com"], ["Review readiness", "/readiness"]]],
  ["/dapp", "YNX Ecosystem Products", "Browse the complete evidence-labelled YNX software directory across Wallet, payments, finance, commerce, social, media, AI, developer, and infrastructure.", "Find the right YNX product without guessing its release state.", "The interactive directory loads filters and current evidence labels after hydration. Product source, public deployment, download hosting, signing, and store release remain separate.", [["Open downloads", "/dapp/download"], ["Check status", "/status"], ["Read ecosystem guide", "/ecosystem"]]],
];

export function createCoreRouteEntries(releaseRegistry) {
  const entries = coreRoutes.map(([route, title, description, h1, lead, links]) => ({
    route,
    title,
    description,
    h1,
    lead,
    links: links.map(([label, href]) => ({ label, href })),
    type: route === "/" ? "WebSite" : "WebPage",
  }));
  const products = releaseRegistry.products.map((product) => ({
    route: product.route,
    title: `${product.name} | YNX Ecosystem`,
    description: `${product.name} is listed in the YNX 6423 ecosystem with an evidence-backed ${humanState(product.state)} release state.`,
    h1: `${product.name}: ${humanState(product.state)}`,
    lead: product.centralAccepted === true
      ? "This release has a Central acceptance record; public runtime and distribution still follow the separate states shown below."
      : "This product is not Central-accepted as a completed public release. Candidate code or an artifact does not prove installed or public runtime.",
    links: [
      { label: "Back to all YNX products", href: "/dapp" },
      { label: "Open product status", href: "/status" },
      ...(product.publicWeb ? [{ label: "Open public product", href: product.publicWeb }] : []),
      ...(product.productRelease ? [{ label: "Read release evidence", href: product.productRelease }] : []),
    ],
    type: "SoftwareApplication",
    product,
  }));
  return dedupeByRoute([...entries, ...products]);
}

export function renderCoreRouteBody(entry) {
  const productFacts = entry.product ? `
      <dl class="coreStaticFacts coreStaticProductFacts">
        <div><dt>Evidence state</dt><dd>${escapeHtml(humanState(entry.product.state))}</dd></div>
        <div><dt>Central accepted</dt><dd>${entry.product.centralAccepted === true ? "Yes" : "No"}</dd></div>
        <div><dt>Public web</dt><dd>${entry.product.publicWeb ? `<a href="${escapeAttribute(entry.product.publicWeb)}">Published entry</a>` : "Not proven"}</dd></div>
        <div><dt>Hosted download</dt><dd>${entry.product.downloadHosted === true ? "Available with separate package evidence" : "Not proven"}</dd></div>
      </dl>` : "";
  return `<main class="authorityPage coreStaticPage" data-prerendered-route="${escapeAttribute(entry.route)}">
    <header class="authorityHeader coreStaticHero">
      <p class="sectionEyebrow">YNX 6423 official portal</p>
      <h1>${escapeHtml(entry.h1)}</h1>
      <p>${escapeHtml(entry.lead)}</p>
      <p class="authorityStaticSource"><strong>Static first response:</strong> network identity and navigation are ready now. Live chain and product data load after hydration and remain unavailable if verification fails.</p>
    </header>
    <dl class="coreStaticFacts" aria-label="Canonical YNX Testnet identity">
      <div><dt>Native chain</dt><dd>${NETWORK_FACTS.nativeChainId}</dd></div>
      <div><dt>EVM chain</dt><dd>${NETWORK_FACTS.evmChainId}</dd></div>
      <div><dt>Native asset</dt><dd>${NETWORK_FACTS.nativeAsset}</dd></div>
    </dl>
    ${productFacts}
    <nav class="authorityIndex coreStaticActions" aria-label="Continue from ${escapeAttribute(entry.h1)}">
      ${entry.links.map(({ label, href }) => `<a href="${escapeAttribute(href)}"><strong>${escapeHtml(label)}</strong><span>${isExternal(href) ? "External destination; opens the named YNX service." : "Continue on the official YNX website."}</span></a>`).join("")}
    </nav>
  </main>`;
}

export function coreRouteJsonLd(entry, siteUrl) {
  const common = {
    "@context": "https://schema.org",
    "@type": entry.type,
    name: entry.h1,
    description: entry.description,
    url: `${siteUrl}${entry.route === "/" ? "" : entry.route}`,
    isPartOf: { "@type": "WebSite", name: "YNX Chain", url: siteUrl },
    about: {
      "@type": "Thing",
      name: "YNX 6423 Testnet",
      identifier: [NETWORK_FACTS.nativeChainId, "0x1917", NETWORK_FACTS.nativeAsset],
    },
  };
  if (!entry.product) return common;
  return {
    ...common,
    applicationCategory: "BlockchainApplication",
    softwareVersion: entry.product.commit || undefined,
    releaseNotes: `Evidence state: ${humanState(entry.product.state)}; Central accepted: ${entry.product.centralAccepted === true ? "yes" : "no"}.`,
  };
}

export function verifyCoreRouteEntries(entries, releaseRegistry) {
  const expected = new Set([...coreRoutes.map(([route]) => route), ...releaseRegistry.products.map((product) => product.route)]);
  const routes = new Set(entries.map((entry) => entry.route));
  if (routes.size !== entries.length) throw new Error("core prerender routes must be unique");
  for (const route of expected) {
    if (!routes.has(route)) throw new Error(`core prerender route missing: ${route}`);
  }
  for (const entry of entries) {
    for (const field of ["title", "description", "h1", "lead"]) {
      if (!entry[field]?.trim()) throw new Error(`${entry.route} is missing ${field}`);
    }
    if (!entry.links?.length) throw new Error(`${entry.route} requires a clear continuation link`);
  }
  for (const field of ["title", "description", "h1"]) {
    const values = entries.map((entry) => entry[field]);
    if (new Set(values).size !== values.length) throw new Error(`core prerender ${field} values must be unique`);
  }
  return true;
}

export const canonicalNetworkFacts = NETWORK_FACTS;

function humanState(value) {
  return String(value || "unavailable").replaceAll("-", " ");
}

function dedupeByRoute(entries) {
  const seen = new Set();
  return entries.filter((entry) => {
    if (seen.has(entry.route)) return false;
    seen.add(entry.route);
    return true;
  });
}

function isExternal(href) {
  return /^https?:\/\//.test(href);
}

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("'", "&#39;");
}
