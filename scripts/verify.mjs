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
  "src/main.jsx",
  "src/styles.css",
  "src/lib/api/ynxApi.js",
  "src/lib/address.js",
  "src/components/AddressConverter.jsx",
  "src/components/SquareAccountPanel.jsx",
  "src/pages/AppsPage.jsx",
  "src/pages/DownloadPage.jsx",
  "src/pages/DocsPage.jsx",
  "src/pages/ProductStatusPage.jsx",
  "src/pages/SquarePage.jsx",
  "src/lib/ecosystemCatalog.js",
  "src/lib/ynx-signer/index.js",
  "src/lib/ynx-signer/client.js",
  "src/lib/ynx-signer/vault.js",
  "src/lib/ynx-signer/SOURCE.json",
  "src/components/StatusCard.jsx",
  "src/components/ProductPanel.jsx",
  "src/components/LinkGrid.jsx",
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
const header = fs.readFileSync("src/components/SiteHeader.jsx", "utf8");
const appsPage = fs.readFileSync("src/pages/AppsPage.jsx", "utf8");
const downloadsPage = fs.readFileSync("src/pages/DownloadPage.jsx", "utf8");
const productStatusPage = fs.readFileSync("src/pages/ProductStatusPage.jsx", "utf8");
const ecosystemCatalog = fs.readFileSync("src/lib/ecosystemCatalog.js", "utf8");
const squarePage = fs.readFileSync("src/pages/SquarePage.jsx", "utf8");
const squareAccountPanel = fs.readFileSync("src/components/SquareAccountPanel.jsx", "utf8");
const docsPage = fs.readFileSync("src/pages/DocsPage.jsx", "utf8");
const appGateway = fs.readFileSync("server/app-gateway.mjs", "utf8");
const vercel = JSON.parse(fs.readFileSync("vercel.json", "utf8"));
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
const signerSource = JSON.parse(fs.readFileSync("src/lib/ynx-signer/SOURCE.json", "utf8"));
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
if (!main.includes('route === "/apps"') || !main.includes('route === "/download"') || !main.includes('route === "/docs"') || !main.includes('route === "/square"') || !main.includes("getProductByRoute(route)")) {
  console.error("first-party app, download, product-status, Square, and docs routes are not configured");
  process.exit(1);
}
if (!main.includes('navigator.serviceWorker.register("/sw.js")') || !indexHtml.includes('rel="manifest"') || manifest.start_url !== "/" || manifest.display !== "standalone") {
  console.error("installable PWA shell is incomplete");
  process.exit(1);
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
if (!header.includes('["Apps", "/apps"]') || !header.includes('["Download", "/download"]') || !header.includes('["Docs", "/docs"]') || !header.includes('["Status", "/status"]')) {
  console.error("stable Apps, Download, Docs, and Status navigation is missing");
  process.exit(1);
}
for (const requiredText of ["Public web", "Candidate", "Candidate incomplete", "Not ready", "evidence-backed status"]) {
  if (!appsPage.includes(requiredText)) {
    console.error(`application truth status missing: ${requiredText}`);
    process.exit(1);
  }
}
const productKeys = [...ecosystemCatalog.matchAll(/^\s+key: "([^"]+)",$/gm)].map((match) => match[1]);
if (productKeys.length !== 25 || new Set(productKeys).size !== 25 || !productKeys.includes("card") || !productKeys.includes("dex")) {
  console.error(`ecosystem catalog must contain 25 unique products; found ${productKeys.length}`);
  process.exit(1);
}
const registryKeys = releaseRegistry.products?.map((product) => product.key) || [];
if (registryKeys.length !== 25 || new Set(registryKeys).size !== 25 || productKeys.some((key) => !registryKeys.includes(key)) || releaseRegistry.products.some((product) => product.centralAccepted !== false || product.downloadHosted !== false) || releaseRegistry.rules?.localArtifactIsDownload !== false) {
  console.error("release registry must truthfully preserve 25 unaccepted, non-hosted product states");
  process.exit(1);
}
for (const requiredText of ["downloadHosted", "Local build only", "candidate incomplete", "Product status"]) {
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
if (!vercel.cleanUrls || vercel.rewrites?.[0]?.source !== "/(.*)" || vercel.rewrites?.[0]?.destination !== "/") {
  console.error("Vercel SPA deep-link fallback is not configured for clean URLs");
  process.exit(1);
}
const csp = vercel.headers?.[0]?.headers?.find((header) => header.key === "Content-Security-Policy")?.value || "";
if (!csp.includes("script-src 'self'") || !csp.includes("worker-src 'self'") || !csp.includes("connect-src 'self' https://api.ynxweb4.com") || !csp.includes("object-src 'none'")) {
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
