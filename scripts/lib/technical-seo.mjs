import fs from "node:fs";
import path from "node:path";

export const SITE_URL = "https://ynxweb4.com";

export const SEO_LOCALES = Object.freeze([
  { locale: "en", hreflang: "en" },
  { locale: "zh-CN", hreflang: "zh-Hans" },
  { locale: "zh-TW", hreflang: "zh-Hant" },
  { locale: "ja", hreflang: "ja" },
  { locale: "ko", hreflang: "ko" },
  { locale: "es", hreflang: "es" },
  { locale: "fr", hreflang: "fr" },
  { locale: "de", hreflang: "de" },
  { locale: "pt", hreflang: "pt" },
  { locale: "ru", hreflang: "ru" },
  { locale: "ar", hreflang: "ar" },
  { locale: "id", hreflang: "id" },
]);

const GLOBAL_JSON_LD = Object.freeze([
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "YNX Chain",
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/ynx-icon-512.png`,
    sameAs: [
      "https://github.com/JiahaoAlbus/YNX-Chain",
      "https://github.com/JiahaoAlbus/YNX-Chain-website",
      "https://x.com/YNXChain",
      "https://www.youtube.com/@YNX-Chain",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "YNX Chain",
    url: `${SITE_URL}/`,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: SEO_LOCALES.map(({ locale }) => locale),
  },
]);

export function indexingPolicy(environment = process.env.VERCEL_ENV) {
  return environment === "production" ? "index,follow,max-image-preview:large" : "noindex,nofollow,noarchive";
}

export function localeAlternates(route, siteUrl = SITE_URL) {
  const canonicalRoute = normalizeRoute(route);
  const canonical = `${stripTrailingSlash(siteUrl)}${canonicalRoute === "/" ? "/" : canonicalRoute}`;
  return [
    ...SEO_LOCALES.map(({ locale, hreflang }) => ({
      hreflang,
      href: locale === "en" ? canonical : `${canonical}?lang=${encodeURIComponent(locale)}`,
    })),
    { hreflang: "x-default", href: canonical },
  ];
}

export function breadcrumbJsonLd(route, title, siteUrl = SITE_URL) {
  const normalized = normalizeRoute(route);
  if (normalized === "/") return null;
  const parts = normalized.split("/").filter(Boolean);
  const parent = parts.length > 1 ? `/${parts[0]}` : null;
  const items = [{ "@type": "ListItem", position: 1, name: "YNX Chain", item: `${stripTrailingSlash(siteUrl)}/` }];
  if (parent) {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: parent === "/dapp" ? "YNX Ecosystem" : humanize(parts[0]),
      item: `${stripTrailingSlash(siteUrl)}${parent}`,
    });
  }
  items.push({
    "@type": "ListItem",
    position: items.length + 1,
    name: title,
    item: `${stripTrailingSlash(siteUrl)}${normalized}`,
  });
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items };
}

export function applyTechnicalSeo(html, {
  route = "/",
  title = "YNX Chain — Web4 Layer-1 Ecosystem",
  description = "Explore the YNX 6423 public testnet, YNXT, developer resources, documentation, downloads, and evidence-backed ecosystem software.",
  pageJsonLd = null,
  siteUrl = SITE_URL,
  robots = indexingPolicy(),
} = {}) {
  const normalized = normalizeRoute(route);
  const canonical = `${stripTrailingSlash(siteUrl)}${normalized === "/" ? "/" : normalized}`;
  const breadcrumb = breadcrumbJsonLd(normalized, title, siteUrl);
  const existingJsonLd = readExistingPageJsonLd(html);
  const pageSchemas = pageJsonLd ? (Array.isArray(pageJsonLd) ? pageJsonLd : [pageJsonLd]) : existingJsonLd;
  const jsonLd = [...GLOBAL_JSON_LD, ...pageSchemas, ...(breadcrumb ? [breadcrumb] : [])];
  const head = [
    `<meta name="robots" content="${escapeAttribute(robots)}" />`,
    `<link rel="canonical" href="${escapeAttribute(canonical)}" />`,
    ...localeAlternates(normalized, siteUrl).map(({ hreflang, href }) => `<link rel="alternate" hreflang="${hreflang}" href="${escapeAttribute(href)}" />`),
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="YNX Chain" />`,
    `<meta property="og:title" content="${escapeAttribute(title)}" />`,
    `<meta property="og:description" content="${escapeAttribute(description)}" />`,
    `<meta property="og:url" content="${escapeAttribute(canonical)}" />`,
    `<meta property="og:image" content="${escapeAttribute(`${stripTrailingSlash(siteUrl)}/ynx-og-1200x630.png`)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="YNX Chain 6423 public testnet" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttribute(title)}" />`,
    `<meta name="twitter:description" content="${escapeAttribute(description)}" />`,
    `<meta name="twitter:image" content="${escapeAttribute(`${stripTrailingSlash(siteUrl)}/ynx-og-1200x630.png`)}" />`,
    `<script type="application/ld+json" data-ynx-seo="global">${safeJson(jsonLd)}</script>`,
  ].join("\n    ");

  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${escapeAttribute(description)}" />`)
    .replace(/\s*<meta name="robots"[^>]*>/gi, "")
    .replace(/\s*<link rel="canonical"[^>]*>/gi, "")
    .replace(/\s*<link rel="alternate" hreflang="[^"]+"[^>]*>/gi, "")
    .replace(/\s*<meta (?:property|name)="(?:og:[^"]+|twitter:[^"]+)"[^>]*>/gi, "")
    .replace(/\s*<script type="application\/ld\+json" data-ynx-seo="global">[\s\S]*?<\/script>/gi, "")
    .replace("</head>", `    ${head}\n  </head>`);
}

export function writeSitemapIndex({ dist, siteUrl = SITE_URL, lastModified, groups }) {
  const output = path.join(dist, "sitemaps");
  fs.mkdirSync(output, { recursive: true });
  const sitemapNames = [];
  for (const [name, routes] of Object.entries(groups)) {
    const unique = [...new Set(routes.map(normalizeRoute))].sort();
    if (unique.length === 0) continue;
    sitemapNames.push(name);
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${unique.map((route) => `  <url><loc>${escapeXml(`${stripTrailingSlash(siteUrl)}${route === "/" ? "/" : route}`)}</loc><lastmod>${lastModified}</lastmod></url>`).join("\n")}\n</urlset>\n`;
    fs.writeFileSync(path.join(output, `${name}.xml`), xml);
  }
  const index = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapNames.map((name) => `  <sitemap><loc>${escapeXml(`${stripTrailingSlash(siteUrl)}/sitemaps/${name}.xml`)}</loc><lastmod>${lastModified}</lastmod></sitemap>`).join("\n")}\n</sitemapindex>\n`;
  fs.writeFileSync(path.join(dist, "sitemap.xml"), index);
  return sitemapNames;
}

export function writeStatic404({ dist, baseHtml, siteUrl = SITE_URL }) {
  const body = `<main id="main-content" class="authorityPage"><header class="authorityHeader"><p class="sectionEyebrow">YNX Chain</p><h1>Page not found</h1><p>This address is not a published YNX page. Use the verified navigation instead of relying on an old or untrusted link.</p><p><a href="/">Return to YNX Chain</a> · <a href="/docs">Open documentation</a></p></header></main>`;
  const html = applyTechnicalSeo(baseHtml.replace('<div id="root"></div>', `<div id="root">${body}</div>`), {
    route: "/404",
    title: "Page not found — YNX Chain",
    description: "This address is not a published YNX Chain page.",
    siteUrl,
    robots: "noindex,nofollow,noarchive",
  });
  fs.writeFileSync(path.join(dist, "404.html"), html);
  return html;
}

export function validateRedirects(redirects, canonicalRoutes) {
  const exact = new Map();
  for (const redirect of redirects) {
    if (!redirect.source?.includes(":")) exact.set(normalizeRoute(redirect.source), normalizeRoute(redirect.destination));
  }
  for (const source of exact.keys()) {
    const seen = new Set([source]);
    let current = exact.get(source);
    while (exact.has(current)) {
      if (seen.has(current)) throw new Error(`redirect cycle detected at ${current}`);
      seen.add(current);
      current = exact.get(current);
    }
    if (!canonicalRoutes.has(current)) throw new Error(`redirect destination is not canonical: ${source} -> ${current}`);
  }
  return exact;
}

export function validateInternalLinks(documents, canonicalRoutes, redirects = new Map()) {
  const broken = [];
  for (const { route, html } of documents) {
    for (const match of html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)) {
      const href = match[1];
      if (/^(?:https?:|mailto:|tel:|data:|#)/i.test(href)) continue;
      const pathname = normalizeRoute(new URL(href, `${SITE_URL}${normalizeRoute(route)}`).pathname);
      const destination = redirects.get(pathname) || pathname;
      if (!canonicalRoutes.has(destination) && !looksLikePublicAsset(destination)) broken.push(`${route} -> ${href}`);
    }
  }
  if (broken.length) throw new Error(`broken internal links: ${broken.join(", ")}`);
  return true;
}

export function normalizeRoute(route) {
  const value = String(route || "/").split(/[?#]/)[0];
  const prefixed = value.startsWith("/") ? value : `/${value}`;
  return prefixed.length > 1 ? prefixed.replace(/\/+$/, "") : "/";
}

function humanize(value) {
  return String(value).replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function readExistingPageJsonLd(html) {
  const raw = html.match(/<script type="application\/ld\+json" data-ynx-seo="global">([\s\S]*?)<\/script>/i)?.[1];
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    const entries = Array.isArray(parsed) ? parsed : [parsed];
    return entries.filter((entry) => !["Organization", "WebSite", "BreadcrumbList"].includes(entry?.["@type"]));
  } catch {
    throw new Error("existing YNX SEO JSON-LD is malformed");
  }
}

function looksLikePublicAsset(value) {
  return /\.[a-z0-9]{2,8}$/i.test(value) || value.startsWith("/api/") || value.startsWith("/releases/") || value.startsWith("/downloads/") || value.startsWith("/docs-authority/");
}

function stripTrailingSlash(value) {
  return String(value).replace(/\/+$/, "");
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
