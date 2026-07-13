import fs from "node:fs";
import path from "node:path";
import { normalizeAddress, toEVMAddress, toYNXAddress } from "../src/lib/address.js";

const required = [
  "package.json",
  "index.html",
  "src/main.jsx",
  "src/styles.css",
  "src/lib/api/ynxApi.js",
  "src/lib/address.js",
  "src/components/AddressConverter.jsx",
  "src/components/StatusCard.jsx",
  "src/components/ProductPanel.jsx",
  "src/components/LinkGrid.jsx",
  "src/sections/Hero.jsx",
  "server/network-status.mjs",
  "api/network/status.js",
  "api/services/health.js",
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
const vercel = JSON.parse(fs.readFileSync("vercel.json", "utf8"));
if (!styles.includes("--blue: #002fa7") || !styles.includes(".heroStage.isPulling")) {
  console.error("missing Klein blue palette or draggable hero interaction");
  process.exit(1);
}
if (!hero.includes("executionScene") || !hero.includes("onPointerMove") || hero.includes("<img") || hero.includes("ynx-execution-sculpture.png")) {
  console.error("CSS execution scene or pull interaction is not configured correctly");
  process.exit(1);
}
if (!vercel.cleanUrls || vercel.rewrites?.[0]?.source !== "/(.*)" || vercel.rewrites?.[0]?.destination !== "/") {
  console.error("Vercel SPA deep-link fallback is not configured for clean URLs");
  process.exit(1);
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
