#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHostedArtifactManifest, emitDocsAuthority, loadDocsAuthority, verifyHostedDocsAuthority } from "./lib/docs-authority.mjs";
import { createCoreRouteEntries, coreRouteJsonLd, renderCoreRouteBody, verifyCoreRouteEntries } from "./lib/core-route-content.mjs";
import { applyTechnicalSeo, indexingPolicy, normalizeRoute, validateInternalLinks, validateRedirects, writeSitemapIndex, writeStatic404 } from "./lib/technical-seo.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const basePath = path.join(dist, "index.html");
const baseHtml = fs.readFileSync(basePath, "utf8");
const authority = loadDocsAuthority(root);
const siteUrl = authority.productMetadata.siteUrl.replace(/\/$/, "");
const hostedArtifact = createHostedArtifactManifest(authority);
const releaseRegistry = JSON.parse(fs.readFileSync(path.join(root, "public/releases/ecosystem-release-registry.json"), "utf8"));
const coreRouteEntries = createCoreRouteEntries(releaseRegistry);
verifyCoreRouteEntries(coreRouteEntries, releaseRegistry);

for (const article of authority.articles) {
  const jsonLd = article.route === "/faq" ? faqJsonLd(article) : articleJsonLd(article);
  writeRoute(article.route, {
    title: article.title,
    description: article.description,
    body: `<main class="authorityPage"><header class="authorityHeader"><p class="sectionEyebrow">YNX public authority</p><h1>${escapeHtml(article.h1)}</h1><p>${escapeHtml(article.description)}</p><p class="authorityStaticSource">Verified bundle source <code>${authority.artifact.sourceCommit.slice(0, 12)}</code></p></header><article class="authorityArticle">${article.html}</article></main>`,
    jsonLd,
  });
}

for (const entry of coreRouteEntries) {
  const supportingArticle = authority.articles.find((article) => article.route === entry.route);
  const supportingBody = supportingArticle
    ? `<section class="authorityArticle coreStaticSupportingAuthority" aria-labelledby="supporting-authority-${escapeAttribute(entry.route.replace(/\W+/g, "-"))}"><p class="sectionEyebrow">Supporting public documentation</p><h2 id="supporting-authority-${escapeAttribute(entry.route.replace(/\W+/g, "-"))}">${escapeHtml(supportingArticle.h1)}</h2><p>${escapeHtml(supportingArticle.description)}</p>${supportingArticle.html}<p class="authorityStaticSource">Verified bundle source <code>${authority.artifact.sourceCommit.slice(0, 12)}</code></p></section>`
    : "";
  writeRoute(entry.route, {
    title: entry.title,
    description: entry.description,
    body: `${renderCoreRouteBody(entry)}${supportingBody}`,
    jsonLd: coreRouteJsonLd(entry, siteUrl),
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

emitDocsAuthority(path.join(dist, "docs-authority"), root);
writePublicMetadata();
writeDiscoveryFiles();
finalizeTechnicalSeo();
verifyOutput();
process.stdout.write(`prerendered ${authority.articles.length + 1} authority routes and ${coreRouteEntries.length} core routes\n`);

function writeRoute(route, { title, description, body, jsonLd }) {
  const html = applyTechnicalSeo(baseHtml.replace('<div id="root"></div>', `<div id="root">${body}</div>`), {
    route,
    title,
    description,
    pageJsonLd: jsonLd,
    siteUrl,
    robots: indexingPolicy(),
  });
  const relativeRoute = route.replace(/^\/+/, "");
  const directory = path.join(dist, relativeRoute);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, "index.html"), html);
  if (relativeRoute) fs.writeFileSync(path.join(dist, `${relativeRoute}.html`), html);
}

function writeDiscoveryFiles() {
  const groups = discoveryGroups();
  const lastModified = authority.artifact.sourceCommitTime.slice(0, 10);
  writeSitemapIndex({ dist, siteUrl, lastModified, groups });
  fs.writeFileSync(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
}

function discoveryGroups() {
  const pages = [
    "/",
    "/dapp",
    "/dapp/download",
    "/dapp/faucet",
    "/dapp/square",
    "/dapp/quant",
    "/manual",
    "/api",
    "/status",
    "/blockchain",
    "/tokens",
    "/data",
    "/governance",
    "/ecosystem",
    "/developers",
    "/downloads",
    "/more",
  ];
  const configuredRedirects = new Map(
    (JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf8")).redirects || [])
      .filter((redirect) => !redirect.source.includes(":"))
      .map((redirect) => [normalizeRoute(redirect.source), normalizeRoute(redirect.destination)]),
  );
  const registeredProductRoutes = releaseRegistry.products.map((product) => product.route);
  const products = registeredProductRoutes.map((route) => configuredRedirects.get(normalizeRoute(route)) || normalizeRoute(route));
  const docs = ["/docs", ...authority.articles.map((article) => article.route)];
  const releases = [
    "/releases/ecosystem-release-registry.json",
    ...releaseRegistry.products.flatMap((product) => [product.productRelease, product.publicProductMetadata].filter(Boolean)),
  ].filter((route) => fs.existsSync(path.join(dist, route.replace(/^\/+/, ""))));
  const reserved = new Set([...products, ...docs].map(normalizeRoute));
  return { pages: pages.filter((route) => !reserved.has(normalizeRoute(route))), products, docs, releases };
}

function finalizeTechnicalSeo() {
  const htmlFiles = walkHtml(dist).filter((file) => path.basename(file) === "index.html");
  for (const file of htmlFiles) {
    const relative = path.relative(dist, path.dirname(file));
    const route = normalizeRoute(relative === "" ? "/" : `/${relative}`);
    const html = fs.readFileSync(file, "utf8");
    const title = decodeHtml(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "YNX Chain — Web4 Layer-1 Ecosystem");
    const description = decodeHtml(html.match(/<meta name="description" content="([^"]*)"\s*\/?>/)?.[1] || "Explore the YNX 6423 public testnet and evidence-backed ecosystem software.");
    fs.writeFileSync(file, applyTechnicalSeo(html, { route, title, description, siteUrl, robots: indexingPolicy() }));
  }
  writeStatic404({ dist, baseHtml, siteUrl });
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
  const baseShellBytes = Buffer.byteLength(baseHtml);
  const seenBodies = new Set();
  for (const entry of coreRouteEntries) {
    const output = routeOutputPath(entry.route);
    const html = fs.readFileSync(output, "utf8");
    const canonical = `${siteUrl}${entry.route === "/" ? "" : entry.route}`;
    const body = html.match(/<div id="root">([\s\S]*?)<\/div>/)?.[1] || "";
    for (const required of [entry.h1, entry.description, `href="${canonical}"`, "application/ld+json", "ynx_6423-1", "0x1917", "YNXT", "Live chain and product data load after hydration"]) {
      if (!html.includes(required)) throw new Error(`prerendered core route ${entry.route} is missing ${required}`);
    }
    if (Buffer.byteLength(html) <= baseShellBytes || body.length < 500) {
      throw new Error(`prerendered core route ${entry.route} is still an empty application shell`);
    }
    if (seenBodies.has(body)) throw new Error(`prerendered core route ${entry.route} reuses another route body`);
    seenBodies.add(body);
  }
  const sitemapIndex = fs.readFileSync(path.join(dist, "sitemap.xml"), "utf8");
  for (const required of ["pages", "products", "docs", "releases"]) {
    if (!sitemapIndex.includes(`/sitemaps/${required}.xml`)) {
      throw new Error(`sitemap is missing ${required}`);
    }
  }
  const docsSitemap = fs.readFileSync(path.join(dist, "sitemaps/docs.xml"), "utf8");
  for (const required of ["/what-is-ynx-chain", "/what-is-ynxt", "/faq"]) {
    if (!docsSitemap.includes(required)) throw new Error(`docs sitemap is missing ${required}`);
  }
  const notFound = fs.readFileSync(path.join(dist, "404.html"), "utf8");
  if (!notFound.includes("Page not found") || !notFound.includes("noindex,nofollow,noarchive")) {
    throw new Error("static 404 must be explicit and noindex");
  }
  const groups = discoveryGroups();
  const canonicalRoutes = new Set(Object.values(groups).flat().map(normalizeRoute));
  canonicalRoutes.add("/404");
  const vercel = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf8"));
  const redirects = validateRedirects(vercel.redirects || [], canonicalRoutes);
  const documents = walkHtml(dist).map((file) => ({
    route: path.basename(file) === "index.html"
      ? normalizeRoute(path.relative(dist, path.dirname(file)) || "/")
      : normalizeRoute(`/${path.relative(dist, file).replace(/\.html$/, "")}`),
    html: fs.readFileSync(file, "utf8"),
  }));
  validateInternalLinks(documents, canonicalRoutes, redirects);
  const home = fs.readFileSync(path.join(dist, "index.html"), "utf8");
  if (home === notFound || !notFound.includes("This address is not a published YNX page")) {
    throw new Error("static 404 is a soft copy of the home page");
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

function routeOutputPath(route) {
  return route === "/" ? path.join(dist, "index.html") : path.join(dist, route.replace(/^\/+/, ""), "index.html");
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

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("'", "&#39;");
}

function walkHtml(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walkHtml(target) : entry.name.endsWith(".html") ? [target] : [];
  });
}

function decodeHtml(value) {
  return String(value).replaceAll("&quot;", '"').replaceAll("&gt;", ">").replaceAll("&lt;", "<").replaceAll("&amp;", "&");
}
