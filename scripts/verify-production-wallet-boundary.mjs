import fs from "node:fs";
import path from "node:path";

const assetRoot = "dist/assets";
if (!fs.existsSync(assetRoot)) {
  console.error("production assets are unavailable for wallet-boundary verification");
  process.exit(1);
}

const forbidden = [
  "ynx-signer/",
  "sealSignerVault",
  "openSignerVault",
  "generateAccountSecret",
  "importAccountSecret",
  "Account private key",
  "PBKDF2-SHA256",
  "AES-256-GCM",
  "X-YNX-Device-Signature",
  "ynx-square-http-v1",
];

for (const file of walk(assetRoot)) {
  if (!/\.(?:js|css)$/u.test(file)) continue;
  const source = fs.readFileSync(file, "utf8");
  for (const term of forbidden) {
    if (source.includes(term)) {
      console.error(`production bundle contains retired website-local signer entry: ${term} in ${file}`);
      process.exit(1);
    }
  }
}

console.log("production wallet boundary PASS: canonical provider only; retired local signer absent");

function walk(root) {
  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(root, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}
