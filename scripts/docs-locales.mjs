#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadDocsAuthority } from "./lib/docs-authority.mjs";
import { loadDocsLocales } from "./lib/docs-locales.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const authority = loadDocsAuthority(root);
const locales = loadDocsLocales(root, authority.articles);
const report = {
  schema: "ynx-docs-locale-missing-matrix/v1",
  articleCount: authority.articles.length,
  requestedLocaleCount: locales.requestedLocales.length,
  completeLocales: locales.requestedLocales.filter((locale) => locales.missingMatrix[locale].length === 0),
  incompleteLocales: locales.requestedLocales.filter((locale) => locales.missingMatrix[locale].length > 0),
  missingMatrix: locales.missingMatrix,
};
if (process.argv.includes("--write-report")) fs.writeFileSync(path.join(root, "content/docs-locales/missing-matrix.json"), `${JSON.stringify(report, null, 2)}\n`);
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
if (process.argv.includes("--verify-complete") && report.incompleteLocales.length) process.exitCode = 1;
