import fs from "node:fs";
import path from "node:path";
import { markdownToHtml } from "./docs-authority.mjs";

const BANNED_PUBLIC_TEXT = [/(?:^|\W)9102(?:\W|$)/, /0x238e/i, /\bNYXT\b/, /\bCodex\b/i, /\bworktree\b/i, /\bbranch\b/i, /(?:\/Users\/|\/private\/tmp\/|\/tmp\/)/];

export function loadDocsLocales(root, sourceArticles) {
  const localeRoot = path.join(root, "content/docs-locales");
  const manifest = readJson(path.join(localeRoot, "manifest.json"));
  assertManifest(manifest);
  const sourceRoutes = sourceArticles.map((article) => article.route).sort();
  const byLocale = { en: sourceArticles.map((article) => ({ ...article, locale: "en", direction: "ltr" })) };
  const missingMatrix = { en: [] };
  for (const locale of manifest.requestedLocales) {
    if (locale === manifest.sourceLocale) continue;
    const artifactName = manifest.artifacts[locale];
    if (!artifactName) {
      missingMatrix[locale] = [...sourceRoutes];
      continue;
    }
    const records = validateArtifact(readJson(path.join(localeRoot, artifactName)), locale, sourceArticles, manifest.direction[locale]);
    byLocale[locale] = records;
    missingMatrix[locale] = sourceRoutes.filter((route) => !records.some((article) => article.route === route));
  }
  for (const locale of manifest.publishedLocales) {
    if (missingMatrix[locale]?.length) throw new Error(`published docs locale ${locale} is incomplete`);
  }
  return { schema: manifest.schema, sourceLocale: manifest.sourceLocale, requestedLocales: manifest.requestedLocales, publishedLocales: manifest.publishedLocales, direction: manifest.direction, byLocale, missingMatrix };
}

function validateArtifact(artifact, locale, sourceArticles, direction) {
  if (artifact.schema !== "ynx-docs-locale-artifact/v1" || artifact.locale !== locale || artifact.direction !== direction) throw new Error(`invalid docs locale artifact: ${locale}`);
  if (!Array.isArray(artifact.articles)) throw new Error(`docs locale has no articles: ${locale}`);
  const sourceByRoute = new Map(sourceArticles.map((article) => [article.route, article]));
  const seen = new Set();
  return artifact.articles.map((record) => {
    const source = sourceByRoute.get(record.route);
    if (!source || seen.has(record.route)) throw new Error(`invalid or duplicate localized route: ${locale}:${record.route}`);
    seen.add(record.route);
    for (const field of ["h1", "description", "markdown"]) if (typeof record[field] !== "string" || !record[field].trim()) throw new Error(`empty ${field}: ${locale}:${record.route}`);
    if (!record.markdown.includes("## ") || !record.markdown.includes("## 变更记录")) throw new Error(`localized article lacks body or change log: ${locale}:${record.route}`);
    const publicText = `${record.h1}\n${record.description}\n${record.markdown}`;
    for (const pattern of BANNED_PUBLIC_TEXT) if (pattern.test(publicText)) throw new Error(`localized article exposes banned text: ${locale}:${record.route}`);
    if (normalized(publicText) === normalized(`${source.h1}\n${source.description}\n${source.markdown}`)) throw new Error(`localized article silently copies English: ${locale}:${record.route}`);
    return { ...source, locale, direction, h1: record.h1, title: record.title || record.h1, description: record.description, markdown: record.markdown, html: markdownToHtml(record.markdown) };
  });
}

function assertManifest(manifest) {
  if (manifest.schema !== "ynx-docs-locales/v1" || manifest.sourceLocale !== "en") throw new Error("invalid docs locale manifest");
  if (!Array.isArray(manifest.requestedLocales) || new Set(manifest.requestedLocales).size !== manifest.requestedLocales.length) throw new Error("invalid requested docs locales");
  if (!Array.isArray(manifest.publishedLocales) || !manifest.publishedLocales.includes("en")) throw new Error("invalid published docs locales");
  if (manifest.direction?.ar !== "rtl") throw new Error("Arabic docs must be RTL");
}

function readJson(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function normalized(value) { return value.replace(/\s+/g, " ").trim(); }
