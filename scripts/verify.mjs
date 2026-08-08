import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { normalizeAddress, toEVMAddress, toYNXAddress } from "../src/lib/address.js";

const required = [
  "package.json",
  "index.html",
  "public/manifest.webmanifest",
  "public/sw.js",
  "public/ynx-logo.png",
  "public/ynx-icon-512.png",
  "public/ynx-icon-maskable-512.png",
  "public/ynx-favicon-48.png",
  "public/releases/ecosystem-release-registry.json",
  "public/releases/owner-record-index.json",
  "public/releases/exchange/fc2276e1ce4c/exchange-status.json",
  "public/releases/exchange/fc2276e1ce4c/manifest.json",
  "public/releases/exchange/fc2276e1ce4c/product-release.json",
  "public/releases/exchange/fc2276e1ce4c/public-product-metadata.json",
  "public/releases/exchange/fc2276e1ce4c/rpc-capabilities.json",
  "public/releases/exchange/fc2276e1ce4c/signed-transaction-vectors.json",
  "public/releases/exchange/fc2276e1ce4c/ynx-testnet-exchange-profile.json",
  "public/da45868fe3e0818f27f187b21a56ccb5.txt",
  "src/main.jsx",
  "src/styles.css",
  "src/lib/api/ynxApi.js",
  "src/lib/address.js",
  "src/lib/i18n.jsx",
  "src/components/AddressConverter.jsx",
  "src/components/SquareAccountPanel.jsx",
  "src/pages/AppsPage.jsx",
  "src/pages/AuthorityArticlePage.jsx",
  "src/pages/DownloadPage.jsx",
  "src/pages/DocsPage.jsx",
  "src/pages/ProductStatusPage.jsx",
  "src/pages/SquarePage.jsx",
  "src/pages/ManualPage.jsx",
  "src/pages/ApiPage.jsx",
  "src/lib/ecosystemCatalog.js",
  "src/lib/ynx-signer/index.js",
  "src/lib/ynx-signer/client.js",
  "src/lib/ynx-signer/vault.js",
  "src/lib/ynx-signer/SOURCE.json",
  "src/components/StatusCard.jsx",
  "src/components/ProductPanel.jsx",
  "src/components/LinkGrid.jsx",
  "src/components/CommandPalette.jsx",
  "src/sections/Hero.jsx",
  "server/network-status.mjs",
  "server/app-gateway.mjs",
  "api/network/status.js",
  "api/services/health.js",
  "api/apps/health.js",
  "api/apps/square/feed.js",
  "api/apps/square/post.js",
  "vite.config.js",
  "app/README.md",
  "components/README.md",
  "sections/README.md",
  "styles/README.md",
  "lib/api/README.md",
  "content/site-map.json",
  "docs-linking/README.md",
  "grant/README.md",
  "ecosystem/README.md",
  "deploy/vercel-env-check.mjs",
  "deploy/vercel-deploy.sh",
  "scripts/docs-authority.mjs",
  "scripts/lib/docs-authority.mjs",
  "scripts/prerender.mjs",
  "scripts/indexnow.mjs",
  "vendor/ynx-docs/artifact-manifest.json",
  "vercel.json"
];
for (const file of required) {
  if (!fs.existsSync(file)) {
    console.error(`missing ${file}`);
    process.exit(1);
  }
}
if (fs.existsSync("public/ynx-mark.svg")) {
  console.error("legacy YNX logo asset is still present");
  process.exit(1);
}
for (const file of ["public/ynx-logo.png", "public/ynx-icon-512.png", "public/ynx-icon-maskable-512.png", "public/ynx-favicon-48.png"]) {
  const image = fs.readFileSync(file);
  if (image.length < 100 || image.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") {
    console.error(`invalid official YNX PNG asset: ${file}`);
    process.exit(1);
  }
}

const disallowed = ["fake TPS", "fake TVL", "NYXT"];
for (const file of walk(".")) {
  if (file.includes("node_modules/") || file.includes("dist/") || file.includes(".git/")) continue;
  if (file === "deploy/vercel-env-check.mjs") continue;
  const source = fs.readFileSync(file, "utf8");
  for (const term of disallowed) {
    if (source.includes(term)) {
      console.error(`disallowed term in ${file}: ${term}`);
      process.exit(1);
    }
  }
}
const prohibitedPublicReferences = [
  /\bcodex\//i,
  /\bbranch\b/i,
  /\bworktree\b/i,
  /\brefs\/heads\b/i,
  /\borigin\//i,
  /\/users\//i,
];
for (const root of ["public", "src"]) {
  for (const file of walk(root)) {
    if (!/\.(html|js|jsx|json|md|txt|xml)$/i.test(file)) continue;
    const source = fs.readFileSync(file, "utf8");
    for (const pattern of prohibitedPublicReferences) {
      if (pattern.test(source)) {
        console.error(`internal reference in public website source: ${file}`);
        process.exit(1);
      }
    }
  }
}
for (const file of walk("src")) {
  if (!file.endsWith(".jsx")) continue;
  const source = fs.readFileSync(file, "utf8");
  if (!source.includes('from "react"')) {
    console.error(`JSX module does not import React: ${file}`);
    process.exit(1);
  }
}
const env = fs.readFileSync(".env.example", "utf8");
for (const key of ["VITE_YNX_API_BASE_URL", "VITE_YNX_EVM_RPC_URL", "VITE_YNX_EXPLORER_URL", "VITE_YNX_FAUCET_URL", "VITE_YNX_DOCS_URL", "VITE_YNX_GRANT_URL", "VITE_YNX_ECOSYSTEM_URL", "VITE_YNX_EXCHANGE_URL"]) {
  if (!env.includes(`${key}=`)) {
    console.error(`missing env key ${key}`);
    process.exit(1);
  }
}
const styles = fs.readFileSync("src/styles.css", "utf8");
const hero = fs.readFileSync("src/sections/Hero.jsx", "utf8");
const addressConverter = fs.readFileSync("src/components/AddressConverter.jsx", "utf8");
const main = fs.readFileSync("src/main.jsx", "utf8");
const indexHtml = fs.readFileSync("index.html", "utf8");
const serviceWorker = fs.readFileSync("public/sw.js", "utf8");
const manifest = JSON.parse(fs.readFileSync("public/manifest.webmanifest", "utf8"));
const releaseRegistry = JSON.parse(fs.readFileSync("public/releases/ecosystem-release-registry.json", "utf8"));
const ownerRecordIndex = JSON.parse(fs.readFileSync("public/releases/owner-record-index.json", "utf8"));
const exchangeReleaseRoot = "public/releases/exchange/fc2276e1ce4c";
const exchangeManifest = JSON.parse(fs.readFileSync(`${exchangeReleaseRoot}/manifest.json`, "utf8"));
const exchangeProductRelease = JSON.parse(fs.readFileSync(`${exchangeReleaseRoot}/product-release.json`, "utf8"));
const exchangePublicMetadata = JSON.parse(fs.readFileSync(`${exchangeReleaseRoot}/public-product-metadata.json`, "utf8"));
const header = fs.readFileSync("src/components/SiteHeader.jsx", "utf8");
const footer = fs.readFileSync("src/components/SiteFooter.jsx", "utf8");
const i18n = fs.readFileSync("src/lib/i18n.jsx", "utf8");
const commandPalette = fs.readFileSync("src/components/CommandPalette.jsx", "utf8");
const routePage = fs.readFileSync("src/components/RoutePage.jsx", "utf8");
const manualPage = fs.readFileSync("src/pages/ManualPage.jsx", "utf8");
const apiPage = fs.readFileSync("src/pages/ApiPage.jsx", "utf8");
const appsPage = fs.readFileSync("src/pages/AppsPage.jsx", "utf8");
const downloadsPage = fs.readFileSync("src/pages/DownloadPage.jsx", "utf8");
const productStatusPage = fs.readFileSync("src/pages/ProductStatusPage.jsx", "utf8");
const ecosystemCatalog = fs.readFileSync("src/lib/ecosystemCatalog.js", "utf8");
const squarePage = fs.readFileSync("src/pages/SquarePage.jsx", "utf8");
const squareAccountPanel = fs.readFileSync("src/components/SquareAccountPanel.jsx", "utf8");
const docsPage = fs.readFileSync("src/pages/DocsPage.jsx", "utf8");
const communityPage = fs.readFileSync("src/pages/CommunityPage.jsx", "utf8");
const appGateway = fs.readFileSync("server/app-gateway.mjs", "utf8");
const vercel = JSON.parse(fs.readFileSync("vercel.json", "utf8"));
const siteMap = JSON.parse(fs.readFileSync("content/site-map.json", "utf8"));
const prerender = fs.readFileSync("scripts/prerender.mjs", "utf8");
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
const indexNowKey = fs.readFileSync("public/da45868fe3e0818f27f187b21a56ccb5.txt", "utf8").trim();
const indexNowScript = fs.readFileSync("scripts/indexnow.mjs", "utf8");
const viteConfig = fs.readFileSync("vite.config.js", "utf8");
const signerSource = JSON.parse(fs.readFileSync("src/lib/ynx-signer/SOURCE.json", "utf8"));
for (const officialUrl of ["https://discord.gg/t8KpAF2KE", "https://www.reddit.com/r/YNX_Chain/", "https://www.youtube.com/@YNX-Chain", "https://x.com/YNXChain"]) {
  if (!communityPage.includes(officialUrl) || !footer.includes(officialUrl) || !prerender.includes(officialUrl)) {
    console.error(`official community link missing from a required surface: ${officialUrl}`);
    process.exit(1);
  }
}
if (!header.includes('["community", "/community"]') || !prerender.includes('"/community"')) {
  console.error("community route is missing from navigation or discovery output");
  process.exit(1);
}
if (releaseRegistry.products.some((product) => Object.hasOwn(product, "branch"))) {
  console.error("public release registry exposes internal branch names");
  process.exit(1);
}
const ownerProductIds = ownerRecordIndex.records?.map((record) => record.productId) || [];
const approvedOwnerPublicEvidence = new Map([
  ["03", { sourceCommit: "aa8524960d6efd9881598fb65832c6237e5af056", publicUrl: "https://www.ynxweb4.com/dapp/social" }],
  ["10", { sourceCommit: "88c0f3a546b463fb270c4bea5d944178865660a5", publicUrl: "https://seller.ynxweb4.com/seller/" }],
  ["11", { sourceCommit: "ed81241ec11dcc9fdd59bbddeae6fae9ccb91f54", publicUrl: "https://developer.ynxweb4.com/" }],
  ["13", { sourceCommit: "5d42be028b22f10253facfc4f779fcccf0fd69b1", publicUrl: "https://monitor.ynxweb4.com/" }],
  ["14", { sourceCommit: "16d6d71e2f93418e37fe9d024f58c492ca1baad4", publicUrl: "https://assistant.ynxweb4.com/" }],
  ["22", { sourceCommit: "d8c1ad24bc88c481fd9350456124f353c8c43e35", publicUrl: "https://www.ynxweb4.com/downloads/ynx-browser-0.2.6-testnet-preview-d8c1ad24-macos-arm64-adhoc.zip" }],
  ["25", { sourceCommit: "e13b5d7ac191d2d0b163d9b94cf22ae3d47350a1", publicUrl: "https://mail-testnet.43.153.202.237.sslip.io/" }],
]);
if (
  ownerRecordIndex.owner !== "28-website" ||
  ownerRecordIndex.rules?.observedBranchIsNotCentralAcceptance !== true ||
  ownerRecordIndex.rules?.missingPublicEvidenceRemainsNull !== true ||
  ownerProductIds.length !== 35 ||
  new Set(ownerProductIds).size !== 35 ||
  ownerProductIds.includes("28") ||
  ownerRecordIndex.records.some((record) => {
    const approved = approvedOwnerPublicEvidence.get(record.productId);
    return !/^\d{2}$/.test(record.productId) ||
      !/^[0-9a-f]{40}$/.test(record.sourceCommit) ||
      typeof record.publicVerified !== "boolean" ||
      typeof record.downloadHosted !== "boolean" ||
      (approved
        ? record.sourceCommit !== approved.sourceCommit || record.publicUrl !== approved.publicUrl || !record.publicVerified
        : record.publicUrl !== null || record.publicVerified);
  })
) {
  console.error("35-product owner record index is missing, duplicated, unbound, or overclaims public evidence");
  process.exit(1);
}
if (
  exchangeManifest.gitCommit !== "fc2276e1ce4c8ac6001ebb9888fd4835111f2f9e" ||
  exchangeManifest.schema !== "ynx-exchange-candidate/v1" ||
  exchangeManifest.status?.candidatePublicRuntimeDeployed !== true ||
  Object.entries(exchangeManifest.status || {}).some(([key, value]) => key !== "candidatePublicRuntimeDeployed" && key !== "truthfulStatus" && value !== false) ||
  exchangeProductRelease.schema !== "ynx-product-release/v1" ||
  exchangeProductRelease.release !== "1.0.0-testnet-candidate" ||
  Object.values(exchangeProductRelease.externalStates || {}).some((value) => value !== false) ||
  exchangePublicMetadata.schema !== "ynx-public-product-metadata/v1" ||
  exchangePublicMetadata.canonicalUrl !== "https://www.ynxweb4.com/exchange" ||
  exchangePublicMetadata.routes?.product !== "/exchange"
) {
  console.error("exchange release identity or truthful external-state boundary is invalid");
  process.exit(1);
}
const exchangeManifestFiles = new Map(exchangeManifest.files?.map((entry) => [entry.file, entry]) || []);
const expectedExchangeFiles = [
  "exchange-status.json",
  "product-release.json",
  "public-product-metadata.json",
  "rpc-capabilities.json",
  "signed-transaction-vectors.json",
  "ynx-testnet-exchange-profile.json",
];
if (
  exchangeManifestFiles.size !== expectedExchangeFiles.length ||
  expectedExchangeFiles.some((file) => !exchangeManifestFiles.has(file)) ||
  exchangeProductRelease.sourceCommitBoundByManifest !== true ||
  Object.values(exchangeProductRelease.evidence || {}).some((value) => value !== true) ||
  ["product", "manual", "developerDocs", "api", "faq", "security", "status", "support"].some((route) => !exchangePublicMetadata.routes?.[route])
) {
  console.error("exchange release file set, evidence, or website handoff routes are incomplete");
  process.exit(1);
}
for (const [file, record] of exchangeManifestFiles) {
  const body = fs.readFileSync(`${exchangeReleaseRoot}/${file}`);
  const digest = crypto.createHash("sha256").update(body).digest("hex");
  if (record.bytes !== body.length || record.sha256 !== digest) {
    console.error(`exchange release artifact digest mismatch: ${file}`);
    process.exit(1);
  }
}
if (!styles.includes("--blue: #002fa7") || !styles.includes(".heroStage.isPulling")) {
  console.error("missing Klein blue palette or draggable hero interaction");
  process.exit(1);
}
if (!hero.includes("executionScene") || !hero.includes("onPointerMove") || hero.includes("<img") || hero.includes("ynx-execution-sculpture.png")) {
  console.error("CSS execution scene or pull interaction is not configured correctly");
  process.exit(1);
}
const nativeOutput = addressConverter.indexOf('label="YNX native (default)"');
const compatibilityOutput = addressConverter.indexOf('label="EVM compatibility / MetaMask"');
if (nativeOutput < 0 || compatibilityOutput < 0 || nativeOutput > compatibilityOutput || !addressConverter.includes("isolated to the EVM compatibility layer")) {
  console.error("YNX-native address identity is not the truthful default");
  process.exit(1);
}
if (!main.includes("Exchange Integration Candidate") || !main.includes("No exchange listing is claimed")) {
  console.error("website does not expose the verified exchange candidate boundary");
  process.exit(1);
}
if (!main.includes('route === "/dapp"') || !main.includes('route === "/dapp/download"') || !main.includes('route === "/dapp/faucet"') || !main.includes('route === "/docs"') || !main.includes('route === "/dapp/square"') || !main.includes("getProductByRoute(route)") || !main.includes("getLegacyDAppRedirect") || !main.includes("LegacyRouteRedirect")) {
  console.error("canonical DApp, download, product-status, Square, docs, or legacy compatibility routes are not configured");
  process.exit(1);
}
if (!main.includes("AuthorityArticlePage") || !main.includes("docsAuthority.articles") || !viteConfig.includes("docsAuthorityPlugin")) {
  console.error("verified YNX documentation authority is not wired into the website runtime");
  process.exit(1);
}
if (!packageJson.scripts?.build?.includes("scripts/prerender.mjs") || !packageJson.scripts?.test?.includes("--verify-hosting")) {
  console.error("docs authority verification and prerender gates are not enforced");
  process.exit(1);
}
if (
  indexNowKey !== "da45868fe3e0818f27f187b21a56ccb5" ||
  !packageJson.scripts?.build?.includes("scripts/indexnow.mjs --dry-run") ||
  packageJson.scripts?.["release:indexnow"] !== "node scripts/indexnow.mjs" ||
  !indexNowScript.includes("https://api.indexnow.org/indexnow") ||
  !indexNowScript.includes("keyLocation") ||
  !indexNowScript.includes("urlList")
) {
  console.error("IndexNow public release integration is incomplete");
  process.exit(1);
}
const hostedDocsHeaders = vercel.headers?.find((entry) => entry.source === "/docs-authority/packages/(.*)")?.headers || [];
if (
  !hostedDocsHeaders.some((entry) => entry.key === "Cache-Control" && entry.value.includes("immutable")) ||
  !hostedDocsHeaders.some((entry) => entry.key === "Content-Disposition" && entry.value === "attachment") ||
  !docsPage.includes("docsAuthority.artifact.downloadHosted") ||
  !docsPage.includes("docsAuthority.artifact.downloadPath") ||
  !docsPage.includes("docsAuthority.artifact.sha256")
) {
  console.error("immutable hosted documentation bundle is not wired into deployment and UI");
  process.exit(1);
}
if (!main.includes('navigator.serviceWorker.register("/sw.js")') || !indexHtml.includes('rel="manifest"') || manifest.start_url !== "/" || manifest.display !== "standalone") {
  console.error("installable PWA shell is incomplete");
  process.exit(1);
}
if (!indexHtml.includes('class="notranslate"') || !indexHtml.includes('translate="no"') || !indexHtml.includes('<meta name="google" content="notranslate"') || !indexHtml.includes('<body class="notranslate" translate="no" dir="ltr">')) {
  console.error("browser machine-translation opt-out is missing; native locale content could be mistranslated or mirrored");
  process.exit(1);
}
for (const requiredText of ['direction: ltr !important', 'body, #root { direction: ltr !important; }']) {
  if (!styles.includes(requiredText)) {
    console.error(`native LTR layout guard is missing: ${requiredText}`);
    process.exit(1);
  }
}
if (!header.includes('src="/ynx-logo.png"') || !indexHtml.includes('/ynx-favicon-48.png') || !indexHtml.includes('/ynx-icon-512.png') || manifest.icons?.length !== 2 || manifest.icons[0]?.src !== "/ynx-icon-512.png" || manifest.icons[1]?.src !== "/ynx-icon-maskable-512.png") {
  console.error("official YNX logo is not wired through navigation, favicon, and PWA icons");
  process.exit(1);
}
for (const boundary of ['url.origin !== self.location.origin', 'url.pathname.startsWith("/api/")', 'request.method !== "GET"']) {
  if (!serviceWorker.includes(boundary)) {
    console.error(`PWA cache safety boundary missing: ${boundary}`);
    process.exit(1);
  }
}
if (!header.includes('["dapps", "/dapp"]') || !header.includes('["ecosystem", "/dapp"]') || !header.includes('["docs", "/docs"]') || !header.includes('["status", "/status"]')) {
  console.error("stable DApps, Ecosystem, Docs, and Status navigation is missing");
  process.exit(1);
}
for (const requiredText of ["metaKey", "ctrlKey", "ynx-theme", "localStorage.removeItem(\"ynx-direction\")", "CommandPalette", 't("skip")']) {
  if (!header.includes(requiredText)) {
    console.error(`global navigation capability missing: ${requiredText}`);
    process.exit(1);
  }
}
for (const requiredText of ["LocaleProvider", "SUPPORTED_LOCALES", '"zh-CN"', "ynx-locale", "enforceNativeLtr", "MutationObserver", 'style.setProperty("direction", "ltr", "important")', "navigator.language"]) {
  const localeSource = requiredText === "LocaleProvider" ? main : i18n;
  if (!localeSource.includes(requiredText)) {
    console.error(`native locale capability missing: ${requiredText}`);
    process.exit(1);
  }
}
if (!header.includes("localeButton") || !header.includes('setLocale(locale === "en" ? "zh-CN" : "en")')) {
  console.error("native English/Simplified Chinese locale control is missing");
  process.exit(1);
}
for (const requiredText of ["role=\"dialog\"", "aria-modal=\"true\"", "ArrowDown", "ArrowUp", "No matching YNX resource", "API reference"]) {
  if (!commandPalette.includes(requiredText)) {
    console.error(`command palette capability missing: ${requiredText}`);
    process.exit(1);
  }
}
for (const requiredText of ['"/manual"', '"/api"', "Page unavailable", "Get support"]) {
  if (!routePage.includes(requiredText)) {
    console.error(`public information architecture or recovery route missing: ${requiredText}`);
    process.exit(1);
  }
}
for (const requiredText of ["From zero to a verified testnet action", "Recovery", "A timeout is not proof", "Security boundary", "Node join manual", "Validator manual", "Mining manual", "no active automatic one-YNXT-per-block issuance", "external submission is disabled", "historical block cannot receive a new transaction"]) {
  if (!manualPage.includes(requiredText)) {
    console.error(`user manual capability missing: ${requiredText}`);
    process.exit(1);
  }
}
for (const requiredText of ["Chain status", "Validator roles", "EVM JSON-RPC", "Fail visibly and recover deliberately", "eth_chainId"]) {
  if (!apiPage.includes(requiredText)) {
    console.error(`API reference capability missing: ${requiredText}`);
    process.exit(1);
  }
}
for (const requiredText of ['[data-theme="dark"]', ":focus-visible", ".commandPalette"]) {
  if (!styles.includes(requiredText)) {
    console.error(`accessibility or adaptive appearance styles missing: ${requiredText}`);
    process.exit(1);
  }
}
for (const requiredText of ["Public web", "Candidate", "Candidate incomplete", "Not ready", "evidence-backed status", "Money & commerce", "Identity & community", "Build & operate", "AI, media & data", "Trust & infrastructure", "Find a product, workflow, or capability", "Available surfaces", "View product", "appCardFacts"]) {
  if (!appsPage.includes(requiredText)) {
    console.error(`application truth status missing: ${requiredText}`);
    process.exit(1);
  }
}
for (const requiredText of ["Transactions & blocks", "Node operations", "Validator candidate", "Mining truth", "Bridge evidence", "Historical block mutation", "Finalized locally; no external submission"]) {
  if (!docsPage.includes(requiredText)) {
    console.error(`detailed documentation capability missing: ${requiredText}`);
    process.exit(1);
  }
}
const productKeys = [...ecosystemCatalog.matchAll(/^\s+key: "([^"]+)",$/gm)].map((match) => match[1]);
if (productKeys.length !== 26 || new Set(productKeys).size !== 26 || !productKeys.includes("card") || !productKeys.includes("dex") || !productKeys.includes("quant")) {
  console.error(`ecosystem catalog must contain 26 unique products; found ${productKeys.length}`);
  process.exit(1);
}
const registryKeys = releaseRegistry.products?.map((product) => product.key) || [];
const acceptedProducts = releaseRegistry.products?.filter((product) => product.centralAccepted === true) || [];
const hostedPreviewProducts = releaseRegistry.products?.filter((product) => product.downloadHosted === true) || [];
const acceptedByKey = new Map(acceptedProducts.map((product) => [product.key, product]));
const exchangeRegistry = acceptedByKey.get("exchange");
const walletRegistry = acceptedByKey.get("wallet");
const financeRegistry = acceptedByKey.get("finance");
const socialAcceptedRegistry = acceptedByKey.get("social");
const resourceAcceptedRegistry = acceptedByKey.get("resource");
const musicAcceptedRegistry = acceptedByKey.get("music");
const videoAcceptedRegistry = acceptedByKey.get("video");
const creatorAcceptedRegistry = acceptedByKey.get("creatorStudio");
const cloudAcceptedRegistry = acceptedByKey.get("cloud");
const docsAcceptedRegistry = acceptedByKey.get("docs");
const browserAcceptedRegistry = acceptedByKey.get("browser");
const registryByKey = new Map(releaseRegistry.products?.map((product) => [product.key, product]) || []);
const payRegistry = registryByKey.get("pay");
const merchantRegistry = registryByKey.get("merchantConsole");
const cardRegistry = registryByKey.get("card");
const socialRegistry = registryByKey.get("social");
const resourceRegistry = registryByKey.get("resource");
const musicRegistry = registryByKey.get("music");
const videoRegistry = registryByKey.get("video");
const creatorRegistry = registryByKey.get("creatorStudio");
const cloudRegistry = registryByKey.get("cloud");
const docsRegistry = registryByKey.get("docs");
const browserRegistry = registryByKey.get("browser");
if (
  registryKeys.length !== 26 ||
  new Set(registryKeys).size !== 26 ||
  productKeys.some((key) => !registryKeys.includes(key)) ||
  hostedPreviewProducts.length !== 8 ||
  hostedPreviewProducts.map((product) => product.key).sort().join(",") !== "browser,developer,exchange,finance,shop,social,trust,wallet" ||
  hostedPreviewProducts.some((product) => {
    const expectedState = product.key === "developer"
      ? "public-testnet-web-and-desktop-preview"
      : "hosted-testnet-preview";
    return product.state !== expectedState || !product.releaseTag || !product.downloads?.length || product.downloads.some((download) => !/^[0-9a-f]{64}$/.test(download.sha256) || !(download.bytes > 0) || !download.signingClass);
  }) ||
  acceptedProducts.length !== 11 ||
  [...acceptedByKey.keys()].sort().join(",") !== "browser,cloud,creatorStudio,docs,exchange,finance,music,resource,social,video,wallet" ||
  exchangeRegistry?.key !== "exchange" ||
  exchangeRegistry.commit !== "1e5f48d2" ||
  exchangeRegistry.acceptedIntegrationCommit !== "fc2276e1ce4c" ||
  exchangeRegistry.productRelease !== "/releases/exchange/fc2276e1ce4c/product-release.json" ||
  exchangeRegistry.publicProductMetadata !== "/releases/exchange/fc2276e1ce4c/public-product-metadata.json" ||
  walletRegistry?.commit !== "ccaf878cdeeb" ||
  walletRegistry.releaseTag !== "wallet-auth-v1.0.0-testnet-preview.5" ||
  walletRegistry.gatewayUrl !== "https://wallet-auth.ynxweb4.com" ||
  financeRegistry.state !== "hosted-testnet-preview" ||
  financeRegistry.acceptedIntegrationCommit !== "6b6cb8f5b125" ||
  financeRegistry.commit !== "307273b9" ||
  financeRegistry.releaseTag !== "finance-v1.2.0-testnet-preview.2" ||
  financeRegistry.publicWeb !== "https://finance.ynxweb4.com/" ||
  socialAcceptedRegistry?.commit !== "aa852496" ||
  socialAcceptedRegistry.acceptedIntegrationCommit !== "5b2c10c753c1" ||
  socialAcceptedRegistry.releaseTag !== "social-v1.0.0-testnet-preview.1" ||
  socialAcceptedRegistry.apiUrl !== "https://api.ynxweb4.com/social" ||
  resourceAcceptedRegistry?.commit !== "11bd6b7c" ||
  resourceAcceptedRegistry.acceptedIntegrationCommit !== "805df7556031" ||
  resourceAcceptedRegistry.releaseTag !== "resource-market-v0.3.0-public-testnet-preview.1" ||
  resourceAcceptedRegistry.publicWeb !== "https://resource.ynxweb4.com/app/" ||
  musicAcceptedRegistry?.commit !== "09b658b0" ||
  musicAcceptedRegistry.acceptedIntegrationCommit !== "805df7556031" ||
  musicAcceptedRegistry.releaseTag !== "music-v0.3.0-testnet-preview.2" ||
  videoAcceptedRegistry?.commit !== "f3a20484" ||
  videoAcceptedRegistry.acceptedIntegrationCommit !== "e0999c976f20" ||
  videoAcceptedRegistry.releaseTag !== "video-v0.2.0-testnet-preview.1" ||
  creatorAcceptedRegistry?.commit !== "3353bdfa" ||
  creatorAcceptedRegistry.acceptedIntegrationCommit !== "ac5a412abcb0" ||
  creatorAcceptedRegistry.releaseTag !== "creator-studio-v0.3.0-testnet-preview.1" ||
  cloudAcceptedRegistry?.acceptedIntegrationCommit !== "cfcaa6accad6" ||
  cloudAcceptedRegistry.releaseTag !== "cloud-v1.0.0-testnet-preview.1" ||
  docsAcceptedRegistry?.acceptedIntegrationCommit !== "5acec59fa572" ||
  docsAcceptedRegistry.releaseTag !== "docs-v1.0.0-testnet-preview.1" ||
  browserAcceptedRegistry?.acceptedIntegrationCommit !== "2a78ace0a647" ||
  browserAcceptedRegistry.releaseTag !== "browser-v0.2.6-testnet-preview.1" ||
  payRegistry?.state !== "public-testnet-web" ||
  payRegistry.publicWeb !== "https://pay-app.ynxweb4.com/" ||
  payRegistry.apiUrl !== "https://pay.ynxweb4.com" ||
  merchantRegistry?.state !== "public-testnet-web" ||
  merchantRegistry.publicWeb !== "https://merchant.ynxweb4.com/" ||
  cardRegistry?.state !== "public-testnet-web-sandbox" ||
  cardRegistry.publicWeb !== "https://card.ynxweb4.com/" ||
  socialRegistry?.state !== "hosted-testnet-preview" ||
  socialRegistry.commit !== "aa852496" ||
  socialRegistry.apiUrl !== "https://api.ynxweb4.com/social" ||
  socialRegistry.releaseTag !== "social-v1.0.0-testnet-preview.1" ||
  resourceRegistry?.state !== "public-testnet-web-preview" ||
  resourceRegistry.commit !== "11bd6b7c" ||
  resourceRegistry.publicWeb !== "https://resource.ynxweb4.com/app/" ||
  resourceRegistry.apiUrl !== "https://resource.ynxweb4.com" ||
  resourceRegistry.centralAccepted !== true ||
  resourceRegistry.downloadHosted !== false ||
  resourceRegistry.releaseTag !== "resource-market-v0.3.0-public-testnet-preview.1" ||
  musicRegistry?.state !== "public-testnet-web-preview" ||
  musicRegistry.commit !== "09b658b0" ||
  musicRegistry.publicWeb !== "https://web4.ynxweb4.com/music/" ||
  musicRegistry.apiUrl !== "https://web4.ynxweb4.com/music" ||
  musicRegistry.centralAccepted !== true ||
  musicRegistry.downloadHosted !== false ||
  musicRegistry.releaseTag !== "music-v0.3.0-testnet-preview.2" ||
  videoRegistry?.state !== "public-testnet-web-preview" ||
  videoRegistry.commit !== "f3a20484" ||
  videoRegistry.publicWeb !== "https://web4.ynxweb4.com/video/" ||
  videoRegistry.apiUrl !== "https://web4.ynxweb4.com/video/api" ||
  videoRegistry.centralAccepted !== true ||
  creatorRegistry?.state !== "public-testnet-web-preview" ||
  creatorRegistry.commit !== "3353bdfa" ||
  creatorRegistry.publicWeb !== "https://web4.ynxweb4.com/video/studio/" ||
  creatorRegistry.centralAccepted !== true ||
  cloudRegistry?.state !== "public-testnet-web-preview" ||
  cloudRegistry.commit !== "fd90fa64" ||
  cloudRegistry.publicWeb !== "https://web4.ynxweb4.com/cloud/" ||
  cloudRegistry.apiUrl !== "https://web4.ynxweb4.com/cloud/api" ||
  cloudRegistry.centralAccepted !== true ||
  docsRegistry?.state !== "public-testnet-web-preview" ||
  docsRegistry.commit !== "fd90fa64" ||
  docsRegistry.publicWeb !== "https://web4.ynxweb4.com/docs-app/" ||
  docsRegistry.apiUrl !== "https://web4.ynxweb4.com/docs-app/api" ||
  docsRegistry.centralAccepted !== true ||
  docsRegistry.downloadHosted !== false ||
  browserRegistry?.commit !== "d8c1ad24bc88" ||
  browserRegistry.state !== "hosted-testnet-preview" ||
  browserRegistry.centralAccepted !== true ||
  browserRegistry.downloadHosted !== true ||
  browserRegistry.downloads?.[0]?.sha256 !== "3d8544efea04132b53ce53e3227e7e96bc494f301d964da5d1d55911d030af45" ||
  browserRegistry.downloads?.[0]?.bytes !== 146068 ||
  browserRegistry.downloads?.[0]?.visualQa !== "windowserver-standard-minimum-second-launch-light-dark-fullscreen-pass" ||
  crypto.createHash("sha256").update(fs.readFileSync("public/downloads/ynx-browser-0.2.6-testnet-preview-d8c1ad24-macos-arm64-adhoc.zip")).digest("hex") !== browserRegistry.downloads?.[0]?.sha256 ||
  releaseRegistry.products.some((product) => !product.route.startsWith("/dapp/")) ||
  releaseRegistry.rules?.localArtifactIsDownload !== false
) {
  console.error("release registry must preserve 26 truthful states, eight distributable source-bound hosted previews, the system-verified Browser package, and the exact centrally accepted product set");
  process.exit(1);
}
for (const requiredText of ["downloadHosted", "Local build only", "Download Testnet Preview", "candidate incomplete", "Product status", "wallet-auth-v1.0.0-testnet-preview.5", "exchange-v1.0.0-testnet-preview.3", "shop-v0.3.0-testnet-preview.1", "developer-v0.2.0-testnet-preview.1", "trust-center-v0.1.0-testnet-preview.2"]) {
  if (!ecosystemCatalog.includes(requiredText)) {
    console.error(`ecosystem release boundary missing: ${requiredText}`);
    process.exit(1);
  }
}
for (const requiredText of ["Only immutable hosted artifacts or verified public web surfaces are links", "Local builds remain visible as evidence", "View release status", "No fake release states"]) {
  if (!downloadsPage.includes(requiredText)) {
    console.error(`download truth boundary missing: ${requiredText}`);
    process.exit(1);
  }
}
for (const requiredText of ["No committed product-release.json", "Hosted installer", "Production signing / store release", "Status is narrower than ambition"]) {
  if (!productStatusPage.includes(requiredText)) {
    console.error(`product status evidence boundary missing: ${requiredText}`);
    process.exit(1);
  }
}
if (!squarePage.includes("No sample posts are inserted") || !squarePage.includes("signed writes beta") || !squarePage.includes("SquareAccountPanel") || !docsPage.includes("Search YNX documentation")) {
  console.error("Square truth boundary or in-site documentation is incomplete");
  process.exit(1);
}
for (const requiredText of ["sealSignerVault", "openSignerVault", "Connect signed session", "createPost", "disconnect({ revokeDevice: true })", "finally {", "local signing keys cleared", "Delete local copy", "Remote device state was not changed"]) {
  if (!squareAccountPanel.includes(requiredText)) {
    console.error(`Square signed account workflow is incomplete: ${requiredText}`);
    process.exit(1);
  }
}
if (squareAccountPanel.includes("X-YNX-Square-Key") || squareAccountPanel.includes("X-YNX-Chat-Key")) {
  console.error("Square browser workflow contains a server-side service credential header");
  process.exit(1);
}
if (appGateway.includes("/chat/") || /method:\s*["']POST["']/.test(appGateway) || !appGateway.includes("/square/feed")) {
  console.error("website app proxy must remain read-only Square-only");
  process.exit(1);
}
const spaFallback = vercel.rewrites?.find((rewrite) => rewrite.source === "/(.*)");
if (!vercel.cleanUrls || spaFallback?.destination !== "/") {
  console.error("Vercel SPA deep-link fallback is not configured for clean URLs");
  process.exit(1);
}
const requiredOfficialDownloads = new Map([
  ["/downloads/ynx-developer-testnet-preview-macos-unsigned.zip", "https://developer.ynxweb4.com/downloads/ynx-developer-0.2.0-testnet-preview-macos-arm64-unsigned.zip"],
  ["/downloads/ynx-developer-testnet-preview-windows-x64-unsigned.zip", "https://developer.ynxweb4.com/downloads/ynx-developer-0.2.0-testnet-preview-windows-x64-unsigned.zip"],
  ["/downloads/ynx-trust-center-4d40557229b4-linux-amd64.tar.gz", "https://dyggjsbxsiew8l6u.public.blob.vercel-storage.com/downloads/ynx-trust-center-4d40557229b4-linux-amd64.tar.gz"],
  ["/downloads/ynx-shop-0.3.0-testnet-preview-6fa2d6c5-debug-signed.apk", "https://dyggjsbxsiew8l6u.public.blob.vercel-storage.com/downloads/ynx-shop-0.3.0-testnet-preview-6fa2d6c5-debug-signed.apk"],
  ["/downloads/ynx-wallet-1.0.0-testnet-preview-ccaf878c-test-signed.apk", "https://dyggjsbxsiew8l6u.public.blob.vercel-storage.com/downloads/ynx-wallet-1.0.0-testnet-preview-ccaf878c-test-signed-gwrQJydXGTCeQfwpnIUokylkukF8CD.apk"],
  ["/downloads/ynx-exchange-1.0.0-testnet-preview-1e5f48d2-test-signed.apk", "https://dyggjsbxsiew8l6u.public.blob.vercel-storage.com/downloads/ynx-exchange-1.0.0-testnet-preview-1e5f48d2-test-signed.apk"],
  ["/downloads/ynx-finance-1.2.0-testnet-preview-307273b9-test-signed.apk", "https://dyggjsbxsiew8l6u.public.blob.vercel-storage.com/downloads/ynx-finance-1.2.0-testnet-preview-307273b9-test-signed-8WRdkqJCJnHBCsuyDsRj4XjEreyeYT.apk"],
  ["/downloads/ynx-social-1.0.0-testnet-preview-aa852496-test-signed.apk", "https://dyggjsbxsiew8l6u.public.blob.vercel-storage.com/downloads/ynx-social-1.0.0-testnet-preview-aa852496-test-signed-15JR16t0lzmvyKU06tyaYXcUGC0sjQ.apk"]
]);
for (const [source, destination] of requiredOfficialDownloads) {
  if (!vercel.rewrites?.some((rewrite) => rewrite.source === source && rewrite.destination === destination)) {
    console.error(`official download rewrite is missing: ${source}`);
    process.exit(1);
  }
}
const requiredDAppRedirects = new Map([
  ["/apps", "/dapp"], ["/download", "/dapp/download"], ["/faucet", "/dapp/faucet"], ["/square", "/dapp/square"],
  ["/wallet", "/dapp/wallet"], ["/social", "/dapp/social"], ["/pay", "/dapp/pay"],
  ["/merchant", "/dapp/merchant"], ["/card", "/dapp/card"], ["/exchange", "/dapp/exchange"],
  ["/quant", "/dapp/quant"],
  ["/shop", "/dapp/shop"], ["/seller", "/dapp/seller"], ["/developer", "/dapp/developer"],
  ["/explorer", "/dapp/explorer"], ["/monitor", "/dapp/monitor"], ["/ai", "/dapp/ai"],
  ["/trust", "/dapp/trust"], ["/resource", "/dapp/resource"], ["/music", "/dapp/music"],
  ["/video", "/dapp/video"], ["/creator", "/dapp/creator"], ["/cloud", "/dapp/cloud"],
  ["/docs-app", "/dapp/docs-app"], ["/browser", "/dapp/browser"], ["/search", "/dapp/search"],
  ["/finance", "/dapp/finance"], ["/mail", "/dapp/mail"], ["/calendar", "/dapp/calendar"],
  ["/dex", "/dapp/dex"]
]);
const configuredRedirects = new Map((vercel.redirects || []).map((redirect) => [redirect.source, redirect]));
if (
  [...requiredDAppRedirects].some(([source, destination]) => configuredRedirects.get(source)?.destination !== destination || configuredRedirects.get(source)?.permanent !== true) ||
  configuredRedirects.get("/square/:path*")?.destination !== "/dapp/square/:path*" ||
  !Array.isArray(siteMap.dappRoutes) || siteMap.dappRoutes.length !== 30 ||
  siteMap.dappRoutes.some((route) => !route.startsWith("dapp")) ||
  !prerender.includes("releaseRegistry.products.map((product) => product.route)")
) {
  console.error("DApp route hierarchy, permanent compatibility redirects, or discovery routes are incomplete");
  process.exit(1);
}
const csp = vercel.headers
  ?.find((entry) => entry.source === "/(.*)")
  ?.headers?.find((header) => header.key === "Content-Security-Policy")?.value || "";
if (!csp.includes("script-src 'self'") || !csp.includes("worker-src 'self'") || !csp.includes("connect-src 'self' https://api.ynxweb4.com https://faucet.ynxweb4.com") || !csp.includes("object-src 'none'")) {
  console.error("strict browser signer CSP is missing");
  process.exit(1);
}
if (packageJson.dependencies?.["@noble/curves"] !== "2.2.0" || packageJson.dependencies?.["@noble/hashes"] !== "2.2.0") {
  console.error("browser signer cryptography dependencies are not exactly pinned");
  process.exit(1);
}
if (signerSource.repository !== "https://github.com/JiahaoAlbus/YNX-Chain" || signerSource.commit !== "5bab0e0") {
  console.error("browser signer provenance is missing or stale");
  process.exit(1);
}
for (const [file, digest] of Object.entries(signerSource.files)) {
  const actual = crypto.createHash("sha256").update(fs.readFileSync(`src/lib/ynx-signer/${file}`)).digest("hex");
  if (actual !== digest) {
    console.error(`browser signer source digest mismatch: ${file}`);
    process.exit(1);
  }
}
const addressVectors = [
  ["0x0000000000000000000000000000000000000000", "ynx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqgrm2qr"],
  ["0x7e5f4552091a69125d5dfcb7b8c2659029395bdf", "ynx10e0525sfrf53yh2aljmm3sn9jq5njk7llqhn80"],
  ["0xffffffffffffffffffffffffffffffffffffffff", "ynx1llllllllllllllllllllllllllllllllyj698f"]
];
for (const [hex, ynx] of addressVectors) {
  if (toYNXAddress(hex) !== ynx || toEVMAddress(ynx) !== hex || normalizeAddress(ynx).evmAddress !== hex) {
    console.error(`address vector mismatch: ${hex}`);
    process.exit(1);
  }
}
const validYNX = addressVectors[1][1];
for (const invalid of ["0x1234", `Y${validYNX.slice(1)}`, `${validYNX.slice(0, -1)}q`, `eth${validYNX.slice(3)}`]) {
  try {
    toEVMAddress(invalid);
    console.error(`invalid address passed: ${invalid}`);
    process.exit(1);
  } catch {
    // Expected strict rejection.
  }
}
const signer = await import("../src/lib/ynx-signer/index.js");
const signerAccountSecret = Uint8Array.from({ length: 32 }, (_, index) => index === 31 ? 1 : 0);
const signerDeviceSecret = new Uint8Array(32).fill(0x41);
if (signer.accountIdentity(signerAccountSecret).account !== validYNX || signer.deviceIdentifier(signerDeviceSecret) !== "web-9a92d2b54a9a5402de3e65a0") {
  console.error("vendored browser signer vectors do not match the chain package");
  process.exit(1);
}
const signerVault = await signer.sealSignerVault({ accountSecret: signerAccountSecret, deviceSecret: signerDeviceSecret }, "website verification password");
const openedSignerVault = await signer.openSignerVault(signerVault, "website verification password");
if (Buffer.from(openedSignerVault.accountSecret).toString("hex") !== Buffer.from(signerAccountSecret).toString("hex")) {
  console.error("vendored browser signer vault did not round-trip");
  process.exit(1);
}
signer.zeroize(openedSignerVault.accountSecret, openedSignerVault.deviceSecret);
const originalFetch = globalThis.fetch;
let requestedSquareUrl = "";
globalThis.fetch = async (url) => {
  requestedSquareUrl = String(url);
  return new Response(JSON.stringify({ posts: [] }), { status: 200, headers: { "content-type": "application/json" } });
};
const { getSquareFeed, getSquarePost } = await import("../server/app-gateway.mjs");
const feed = await getSquareFeed({ limit: 500, cursor: "cursor-1" });
if (!Array.isArray(feed.posts) || requestedSquareUrl !== "https://api.ynxweb4.com/app/square/feed?limit=50&cursor=cursor-1") {
  console.error(`Square feed proxy is not fixed and bounded: ${requestedSquareUrl}`);
  process.exit(1);
}
let invalidPostRejected = false;
try { await getSquarePost("../chat/devices"); } catch (error) { invalidPostRejected = error?.status === 400; }
globalThis.fetch = originalFetch;
if (!invalidPostRejected) {
  console.error("Square post proxy did not reject an unsafe identifier");
  process.exit(1);
}
console.log("website verification passed");

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (/\.(js|jsx|json|md|html|css)$/.test(full)) {
      yield full.replace(/^\.\//, "");
    }
  }
}
