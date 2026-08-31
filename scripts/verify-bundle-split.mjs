#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const html = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const entryMatch = html.match(/<script[^>]+type="module"[^>]+src="([^"]+\.js)"/);

if (!entryMatch) throw new Error("production HTML does not identify a JavaScript entry chunk");

const entryPath = path.join(dist, entryMatch[1].replace(/^\//, ""));
const entryBytes = fs.statSync(entryPath).size;
const javascriptAssets = fs.readdirSync(path.join(dist, "assets"))
  .filter((name) => name.endsWith(".js"))
  .map((name) => ({ name, bytes: fs.statSync(path.join(dist, "assets", name)).size }))
  .sort((left, right) => right.bytes - left.bytes);
const oversized = javascriptAssets.filter((asset) => asset.bytes > 500_000);

if (entryBytes > 450_000) {
  throw new Error(`production entry chunk is ${entryBytes} bytes; route-level splitting must keep it at or below 450000 bytes`);
}
if (oversized.length) {
  throw new Error(`production JavaScript assets exceed 500000 bytes: ${oversized.map(({ name, bytes }) => `${name}=${bytes}`).join(", ")}`);
}

process.stdout.write(`bundle split verified: entry=${path.basename(entryPath)} ${entryBytes}B; largest=${javascriptAssets[0].name} ${javascriptAssets[0].bytes}B; chunks=${javascriptAssets.length}\n`);
