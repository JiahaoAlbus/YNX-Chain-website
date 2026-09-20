import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  SEO_LOCALES,
  applyTechnicalSeo,
  indexingPolicy,
  localeAlternates,
  validateInternalLinks,
  validateRedirects,
  writeSitemapIndex,
  writeStatic404,
} from "../scripts/lib/technical-seo.mjs";

const baseHtml = `<!doctype html><html><head><meta name="description" content="old" /><link rel="canonical" href="https://example.invalid" /><title>old</title></head><body><div id="root"></div></body></html>`;

test("technical metadata has twelve language alternates plus x-default", () => {
  assert.equal(SEO_LOCALES.length, 12);
  const alternates = localeAlternates("/docs");
  assert.equal(alternates.length, 13);
  assert.deepEqual(new Set(alternates.map(({ hreflang }) => hreflang)), new Set(["en", "zh-Hans", "zh-Hant", "ja", "ko", "es", "fr", "de", "pt", "ru", "ar", "id", "x-default"]));
  assert.equal(alternates.find(({ hreflang }) => hreflang === "ar").href, "https://ynxweb4.com/docs?lang=ar");
});

test("route SEO is canonical, shareable, structured, and preview-safe", () => {
  const html = applyTechnicalSeo(baseHtml, {
    route: "/dapp/wallet",
    title: "YNX Wallet — YNX Chain",
    description: "Evidence-backed YNX Wallet information.",
    robots: indexingPolicy("preview"),
  });
  assert.match(html, /<link rel="canonical" href="https:\/\/ynxweb4\.com\/dapp\/wallet"/);
  assert.match(html, /noindex,nofollow,noarchive/);
  assert.match(html, /property="og:image" content="https:\/\/ynxweb4\.com\/ynx-og-1200x630\.png"/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.match(html, /"@type":"Organization"/);
  assert.match(html, /"@type":"WebSite"/);
  assert.match(html, /"@type":"BreadcrumbList"/);
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
  assert.equal(indexingPolicy("production"), "index,follow,max-image-preview:large");
});

test("sitemap index separates pages, products, docs, and releases", () => {
  const dist = fs.mkdtempSync(path.join(os.tmpdir(), "ynx-seo-sitemap-"));
  try {
    const names = writeSitemapIndex({
      dist,
      lastModified: "2026-09-01",
      groups: {
        pages: ["/", "/developers"],
        products: ["/dapp/wallet"],
        docs: ["/docs"],
        releases: ["/releases/ecosystem-release-registry.json"],
      },
    });
    assert.deepEqual(names, ["pages", "products", "docs", "releases"]);
    const index = fs.readFileSync(path.join(dist, "sitemap.xml"), "utf8");
    for (const name of names) assert.match(index, new RegExp(`/sitemaps/${name}\\.xml`));
    assert.match(fs.readFileSync(path.join(dist, "sitemaps/products.xml"), "utf8"), /\/dapp\/wallet/);
  } finally {
    fs.rmSync(dist, { recursive: true, force: true });
  }
});

test("redirect graph rejects cycles and non-canonical destinations", () => {
  const canonical = new Set(["/", "/dapp", "/dapp/wallet"]);
  const redirects = validateRedirects([
    { source: "/apps", destination: "/dapp", permanent: true },
    { source: "/wallet", destination: "/dapp/wallet", permanent: true },
  ], canonical);
  assert.equal(redirects.get("/wallet"), "/dapp/wallet");
  assert.throws(() => validateRedirects([
    { source: "/a", destination: "/b" },
    { source: "/b", destination: "/a" },
  ], canonical), /redirect cycle/);
  assert.throws(() => validateRedirects([{ source: "/old", destination: "/missing" }], canonical), /not canonical/);
});

test("broken internal links fail while redirects and public artifacts pass", () => {
  const canonical = new Set(["/", "/docs", "/dapp/wallet"]);
  const redirects = new Map([["/wallet", "/dapp/wallet"]]);
  assert.equal(validateInternalLinks([{ route: "/", html: '<a href="/docs">Docs</a><a href="/wallet">Wallet</a><a href="/releases/a.json">Evidence</a>' }], canonical, redirects), true);
  assert.throws(() => validateInternalLinks([{ route: "/", html: '<a href="/does-not-exist">Broken</a>' }], canonical, redirects), /broken internal links/);
});

test("static 404 is noindex and not a soft copy of home", () => {
  const dist = fs.mkdtempSync(path.join(os.tmpdir(), "ynx-seo-404-"));
  try {
    const notFound = writeStatic404({ dist, baseHtml });
    assert.match(notFound, /Page not found — YNX Chain/);
    assert.match(notFound, /noindex,nofollow,noarchive/);
    assert.match(notFound, /This address is not a published YNX page/);
    assert.notEqual(notFound, applyTechnicalSeo(baseHtml, { route: "/" }));
  } finally {
    fs.rmSync(dist, { recursive: true, force: true });
  }
});

test("source index carries share metadata and a safe preview default", () => {
  const index = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
  for (const required of ["Organization", "WebSite", "summary_large_image", "ynx-og-1200x630.png", "noindex,nofollow,noarchive", 'hreflang="x-default"', "ynx-favicon.svg", "ynx-icon-96.png", "ynx-icon-192.png", "ynx-icon-512.png"]) {
    assert.ok(index.includes(required), `index.html is missing ${required}`);
  }
});

test("favicon, social preview, and maskable assets have exact dimensions", () => {
  const root = new URL("../", import.meta.url);
  for (const [file, width, height] of [
    ["public/ynx-icon-96.png", 96, 96],
    ["public/ynx-icon-192.png", 192, 192],
    ["public/ynx-icon-512.png", 512, 512],
    ["public/ynx-icon-maskable-512.png", 512, 512],
    ["public/ynx-og-1200x630.png", 1200, 630],
  ]) {
    const png = fs.readFileSync(new URL(file, root));
    assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", `${file} must be a PNG`);
    assert.equal(png.readUInt32BE(16), width, `${file} width`);
    assert.equal(png.readUInt32BE(20), height, `${file} height`);
  }
  const manifest = JSON.parse(fs.readFileSync(new URL("public/manifest.webmanifest", root), "utf8"));
  assert.ok(manifest.icons.some(({ src, sizes, purpose }) => src === "/ynx-icon-maskable-512.png" && sizes === "512x512" && purpose === "maskable"));
});
