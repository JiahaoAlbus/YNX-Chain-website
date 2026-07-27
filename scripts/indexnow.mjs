#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const key = "da45868fe3e0818f27f187b21a56ccb5";
const keyFile = path.join(root, "public", `${key}.txt`);
const sitemapFile = path.join(root, "dist", "sitemap.xml");
const endpoint = "https://api.indexnow.org/indexnow";
const dryRun = process.argv.includes("--dry-run");

if (fs.readFileSync(keyFile, "utf8").trim() !== key) {
  throw new Error("IndexNow verification key does not match its public filename");
}
if (!fs.existsSync(sitemapFile)) {
  throw new Error("dist/sitemap.xml is required; run the production build first");
}

const sitemap = fs.readFileSync(sitemapFile, "utf8");
const urlList = [...sitemap.matchAll(/<loc>(https:\/\/[^<]+)<\/loc>/g)].map((match) => match[1]);
if (urlList.length === 0 || new Set(urlList).size !== urlList.length) {
  throw new Error("sitemap must contain a non-empty unique HTTPS URL list");
}

const canonical = new URL(urlList[0]);
if (urlList.some((value) => new URL(value).host !== canonical.host)) {
  throw new Error("IndexNow submission cannot mix public hosts");
}

const payload = {
  host: canonical.host,
  key,
  keyLocation: `${canonical.origin}/${key}.txt`,
  urlList,
};

if (dryRun) {
  process.stdout.write(`IndexNow payload verified: ${urlList.length} URLs for ${canonical.host}\n`);
  process.exit(0);
}

const response = await fetch(endpoint, {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload),
  signal: AbortSignal.timeout(30_000),
});
if (![200, 202].includes(response.status)) {
  throw new Error(`IndexNow rejected the submission with HTTP ${response.status}`);
}
process.stdout.write(`IndexNow accepted ${urlList.length} URLs with HTTP ${response.status}\n`);
