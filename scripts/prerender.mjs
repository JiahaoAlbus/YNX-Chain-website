#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHostedArtifactManifest, emitDocsAuthority, loadDocsAuthority, verifyHostedDocsAuthority } from "./lib/docs-authority.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const basePath = path.join(dist, "index.html");
const baseHtml = fs.readFileSync(basePath, "utf8");
const authority = loadDocsAuthority(root);
const siteUrl = authority.productMetadata.siteUrl.replace(/\/$/, "");
const hostedArtifact = createHostedArtifactManifest(authority);
const releaseRegistry = JSON.parse(fs.readFileSync(path.join(root, "public/releases/ecosystem-release-registry.json"), "utf8"));

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
  body: `<main class="authorityPage"><header class="authorityHeader"><p class="sectionEyebrow">YNX documentation</p><h1>Evidence-linked YNX documentation</h1><p>Public explanations and claim boundaries from the verified YNX website-content bundle.</p><a class="docsBundleDownload" href="${escapeAttribute(hostedArtifact.downloadPath)}" download><span><strong>Download verified documentation bundle</strong><small>ZIP · ${hostedArtifact.bytes.toLocaleString("en-US")} bytes · SHA-256 ${hostedArtifact.sha256}</small></span></a></header><nav class="authorityIndex" aria-label="YNX public documentation">${authority.articles.map((article) => `<a href="${article.route}"><strong>${escapeHtml(article.h1)}</strong><span>${escapeHtml(article.description)}</span></a>`).join("")}</nav></main>`,
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "YNX Chain Documentation",
    url: `${siteUrl}/docs`,
  },
});

writeWalletRoute();

emitDocsAuthority(path.join(dist, "docs-authority"), root);
writePublicMetadata();
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

function writeWalletRoute() {
  const route = "/dapp/wallet";
  const html = baseHtml
    .replace(/<link rel="manifest" href="\/manifest\.webmanifest"\s*\/?>/, '<link rel="manifest" href="/wallet/companion/manifest.webmanifest" />')
    .replace(/<title>[\s\S]*?<\/title>/, "<title>YNX Wallet Testnet Companion</title>");
  const directory = path.join(dist, route.replace(/^\/+/, ""));
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, "index.html"), html);
  fs.writeFileSync(path.join(dist, `${route.replace(/^\/+/, "")}.html`), html);
}

function writeDiscoveryFiles() {
  const routes = [
    "/",
    "/dapp",
    "/dapp/download",
    "/dapp/square",
    "/dapp/quant",
    "/docs",
    "/manual",
    "/api",
    "/status",
    ...releaseRegistry.products.map((product) => product.route),
    ...authority.articles.map((article) => article.route),
  ];
  const unique = [...new Set(routes)].sort();
  const lastModified = authority.artifact.sourceCommitTime.slice(0, 10);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${unique.map((route) => `  <url><loc>${escapeXml(`${siteUrl}${route}`)}</loc><lastmod>${lastModified}</lastmod></url>`).join("\n")}\n</urlset>\n`;
  fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap);
  fs.writeFileSync(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
}

function writePublicMetadata() {
  fs.writeFileSync(
    path.join(dist, "public-product-metadata.json"),
    `${JSON.stringify(authority.productMetadata, null, 2)}\n`,
  );
  fs.writeFileSync(
    path.join(dist, "product-release.json"),
    `${JSON.stringify(authority.releaseStatus, null, 2)}\n`,
  );
}

function verifyOutput() {
  const verifiedHostedArtifact = verifyHostedDocsAuthority(path.join(dist, "docs-authority"), authority);
  if (
    verifiedHostedArtifact.downloadHosted !== true ||
    verifiedHostedArtifact.productionSigned !== false ||
    verifiedHostedArtifact.downloadUrl !== hostedArtifact.downloadUrl
  ) {
    throw new Error("hosted YNX docs release state is not truthful");
  }
  const docsHtml = fs.readFileSync(path.join(dist, "docs.html"), "utf8");
  if (!docsHtml.includes(hostedArtifact.downloadPath) || !docsHtml.includes(hostedArtifact.sha256)) {
    throw new Error("prerendered docs route is missing the immutable hosted bundle");
  }
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
  const walletHtml = fs.readFileSync(path.join(dist, "dapp/wallet.html"), "utf8");
  const walletManifestLinks = [...walletHtml.matchAll(/<link\b[^>]*\brel="manifest"[^>]*>/g)];
  if (walletManifestLinks.length !== 1 || !walletManifestLinks[0][0].includes('href="/wallet/companion/manifest.webmanifest"')) {
    throw new Error("prerendered Wallet route is not bound to the exact Wallet manifest");
  }
  if (!baseHtml.includes('href="/manifest.webmanifest"') || baseHtml.includes('href="/wallet/companion/manifest.webmanifest"')) {
    throw new Error("site-wide manifest identity was changed by the Wallet route binding");
  }
  const publicMetadata = JSON.parse(fs.readFileSync(path.join(dist, "public-product-metadata.json"), "utf8"));
  const productRelease = JSON.parse(fs.readFileSync(path.join(dist, "product-release.json"), "utf8"));
  if (
    publicMetadata.canonicalUrl !== authority.productMetadata.canonicalUrl ||
    productRelease.states?.deployedPublic !== true ||
    productRelease.states?.productionSigned !== false
  ) {
    throw new Error("public product metadata or release truth is missing");
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
