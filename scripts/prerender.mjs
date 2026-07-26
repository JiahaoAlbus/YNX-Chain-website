#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { emitDocsAuthority, loadDocsAuthority } from "./lib/docs-authority.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const basePath = path.join(dist, "index.html");
const baseHtml = fs.readFileSync(basePath, "utf8");
const authority = loadDocsAuthority(root);
const siteUrl = authority.productMetadata.siteUrl.replace(/\/$/, "");

for (const article of authority.articles) {
  const jsonLd = article.route === "/faq" ? faqJsonLd(article) : articleJsonLd(article);
  writeRoute(article.route, {
    title: article.title,
    description: article.description,
    body: `<main class="authorityPage"><header class="authorityHeader"><p class="sectionEyebrow">YNX public authority</p><h1>${escapeHtml(article.h1)}</h1><p>${escapeHtml(article.description)}</p><p class="authorityStaticSource">Verified bundle source <code>${authority.artifact.sourceCommit.slice(0, 12)}</code></p></header><article class="authorityArticle">${article.html}</article></main>`,
    jsonLd,
  });
}

writeRoute("/docs", {
  title: "YNX Chain Documentation and Public Evidence",
  description: "Evidence-linked documentation for YNX Chain, YNX Web4, YNXT, YNX Testnet, products, security, economics and risks.",
  body: `<main class="authorityPage"><header class="authorityHeader"><p class="sectionEyebrow">YNX documentation</p><h1>Evidence-linked YNX documentation</h1><p>Public explanations and claim boundaries from the verified YNX website-content bundle.</p></header><nav class="authorityIndex" aria-label="YNX public documentation">${authority.articles.map((article) => `<a href="${article.route}"><strong>${escapeHtml(article.h1)}</strong><span>${escapeHtml(article.description)}</span></a>`).join("")}</nav></main>`,
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "YNX Chain Documentation",
    url: `${siteUrl}/docs`,
  },
});

emitDocsAuthority(path.join(dist, "docs-authority"), root);
writeDiscoveryFiles();
verifyOutput();
process.stdout.write(`prerendered ${authority.articles.length + 1} authority routes\n`);

function writeRoute(route, { title, description, body, jsonLd }) {
  const canonical = `${siteUrl}${route}`;
  let html = baseHtml
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${escapeAttribute(description)}" />`)
    .replace("</head>", `<link rel="canonical" href="${escapeAttribute(canonical)}" />\n    <script type="application/ld+json">${safeJson(jsonLd)}</script>\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  const directory = path.join(dist, route.replace(/^\/+/, ""));
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, "index.html"), html);
  fs.writeFileSync(path.join(dist, `${route.replace(/^\/+/, "")}.html`), html);
}

function writeDiscoveryFiles() {
  const routes = [
    "/",
    "/apps",
    "/download",
    "/docs",
    "/status",
    ...authority.articles.map((article) => article.route),
  ];
  const unique = [...new Set(routes)].sort();
  const lastModified = authority.artifact.sourceCommitTime.slice(0, 10);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${unique.map((route) => `  <url><loc>${escapeXml(`${siteUrl}${route}`)}</loc><lastmod>${lastModified}</lastmod></url>`).join("\n")}\n</urlset>\n`;
  fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap);
  fs.writeFileSync(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
}

function verifyOutput() {
  for (const article of authority.articles) {
    const html = fs.readFileSync(path.join(dist, `${article.route.replace(/^\/+/, "")}.html`), "utf8");
    for (const required of [article.h1, `rel="canonical"`, `application/ld+json`, authority.artifact.sourceCommit.slice(0, 12)]) {
      if (!html.includes(required)) throw new Error(`prerendered route ${article.route} is missing ${required}`);
    }
  }
  for (const required of ["/what-is-ynx-chain", "/what-is-ynxt", "/faq"]) {
    if (!fs.readFileSync(path.join(dist, "sitemap.xml"), "utf8").includes(required)) {
      throw new Error(`sitemap is missing ${required}`);
    }
  }
}

function articleJsonLd(article) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: article.h1,
    description: article.description,
    dateModified: article.lastReviewed || article.effectiveDate,
    version: article.version,
    url: `${siteUrl}${article.route}`,
    isPartOf: { "@type": "WebSite", name: "YNX Chain", url: siteUrl },
  };
}

function faqJsonLd(article) {
  const questions = article.markdown.split(/^##\s+/m).slice(1)
    .map((section) => {
      const [name, ...bodyLines] = section.split("\n");
      return { name: name.trim(), body: bodyLines.join("\n") };
    })
    .filter(({ name }) => name !== "Change log")
    .map(({ name, body }) => ({
      "@type": "Question",
      name,
      acceptedAnswer: {
        "@type": "Answer",
        text: body.split(/\n\s*\n/)[0].replace(/\n/g, " ").trim(),
      },
    }));
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions,
    url: `${siteUrl}${article.route}`,
  };
}

function safeJson(value) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("'", "&#39;");
}

function escapeXml(value) {
  return escapeHtml(value).replaceAll("'", "&apos;");
}
