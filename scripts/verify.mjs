import fs from "node:fs";
import path from "node:path";

const required = [
  "package.json",
  "index.html",
  "src/main.jsx",
  "src/styles.css",
  "src/lib/api/ynxApi.js",
  "src/components/StatusCard.jsx",
  "src/components/ProductPanel.jsx",
  "src/components/LinkGrid.jsx",
  "src/sections/Hero.jsx",
  "server/network-status.mjs",
  "api/network/status.js",
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
if (!styles.includes("--blue: #002fa7") || !styles.includes(".hero.isPulling")) {
  console.error("missing Klein blue palette or draggable hero interaction");
  process.exit(1);
}
if (!hero.includes("ynx-execution-sculpture.png") || !hero.includes("onPointerMove") || hero.includes("ynx-validator-system.png")) {
  console.error("hero asset or pull interaction is not configured correctly");
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
