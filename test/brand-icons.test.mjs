import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createCoreRouteEntries } from "../scripts/lib/core-route-content.mjs";
import { loadDocsAuthority } from "../scripts/lib/docs-authority.mjs";
import { applyTechnicalSeo, writeStatic404 } from "../scripts/lib/technical-seo.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (file) => fs.readFileSync(path.join(root, file));
const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const sourceHtml = read("index.html").toString();
const iconLinks = (html) => html.match(/<link\b[^>]*\brel="(?:icon|apple-touch-icon|manifest)"[^>]*>/g) || [];

test("SVG favicon embeds the unchanged brand image and has no external resource dependency", () => {
  const svg = read("public/ynx-favicon.svg").toString();
  const imageReferences = [...svg.matchAll(/(?:href|xlink:href)="([^"]+)"/g)];
  assert.equal(imageReferences.length, 1);
  assert.match(imageReferences[0][1], /^data:image\/png;base64,/);
  assert.deepEqual(Buffer.from(imageReferences[0][1].split(",")[1], "base64"), read("public/ynx-icon-512.png"));
  assert.equal(sha256(read("public/ynx-icon-512.png")), "bb2528fe9bfa8ce2f5c52520c251c89eddf484403fdc91a129780cd93a964dd1");
  assert.doesNotMatch(svg, /<(?:script|foreignObject|use|style)\b|url\(/i);
});

test("default ICO is a valid 48px container around the approved white-background PNG", () => {
  const ico = read("public/favicon.ico");
  const png = read("public/ynx-favicon-48.png");
  assert.equal(sha256(png), "bf382c1cb986b92ede3a658a4190f843aee949c6e14ab5aa20d6f7c1f502e962");
  assert.equal(ico.readUInt16LE(0), 0);
  assert.equal(ico.readUInt16LE(2), 1);
  assert.equal(ico.readUInt16LE(4), 1);
  assert.equal(ico[6], 48);
  assert.equal(ico[7], 48);
  assert.equal(ico.readUInt16LE(10), 1);
  assert.equal(ico.readUInt16LE(12), 32);
  assert.equal(ico.readUInt32LE(14), png.length);
  assert.equal(ico.readUInt32LE(18), 22);
  assert.deepEqual(ico.subarray(22), png);
});

test("all prerendered routes and the static 404 preserve one versioned same-origin icon set", () => {
  const expected = iconLinks(sourceHtml);
  assert.equal(expected.length, 8);
  assert.equal(new Set(expected.map((link) => link.match(/href="([^"]+)"/)[1])).size, expected.length);
  for (const link of expected) {
    const href = link.match(/href="([^"]+)"/)[1];
    assert.match(href, /^\/[^?]+\?v=brand-20260906-v2$/);
    assert.ok(fs.existsSync(path.join(root, "public", href.split("?")[0])));
  }
  assert.ok(expected.some((link) => link.includes("/ynx-favicon-48.png?") && link.includes('sizes="48x48"')));
  assert.ok(expected.some((link) => link.includes("/ynx-favicon.svg?") && link.includes('sizes="any"')));
  const registry = JSON.parse(read("public/releases/ecosystem-release-registry.json"));
  const routes = new Set(["/", "/docs", ...createCoreRouteEntries(registry).map(({ route }) => route), ...loadDocsAuthority(root).articles.map(({ route }) => route)]);
  for (const route of routes) {
    const html = applyTechnicalSeo(sourceHtml, { route });
    assert.deepEqual(iconLinks(html), expected, route);
    assert.deepEqual(iconLinks(applyTechnicalSeo(html, { route })), expected, `${route} final SEO pass`);
  }
  const temporaryOutput = fs.mkdtempSync(path.join(os.tmpdir(), "ynx-icon-404-"));
  try {
    assert.deepEqual(iconLinks(writeStatic404({ dist: temporaryOutput, baseHtml: sourceHtml })), expected);
  } finally {
    fs.rmSync(temporaryOutput, { recursive: true, force: true });
  }
});

test("icon endpoints are real static files with image MIME and revalidation headers", () => {
  const config = JSON.parse(read("vercel.json"));
  const paths = [
    ["/favicon.ico", "image/vnd.microsoft.icon"],
    ["/ynx-tab-icon.png", "image/png"],
    ["/ynx-favicon.svg", "image/svg+xml"],
    ...["ynx-favicon-48", "ynx-icon-96", "ynx-icon-192", "ynx-icon-512", "ynx-icon-maskable-512"].map((file) => [`/${file}.png`, "image/png"]),
    ["/manifest.webmanifest", "application/manifest+json"],
  ];
  for (const [pathname, mime] of paths) {
    assert.ok(fs.statSync(path.join(root, "public", pathname)).isFile(), pathname);
    assert.ok(!config.rewrites.some(({ source }) => source === pathname), pathname);
    const headers = Object.fromEntries(config.headers.find(({ source }) => source === pathname)?.headers.map(({ key, value }) => [key.toLowerCase(), value]) || []);
    assert.equal(headers["content-type"], mime, pathname);
    assert.match(headers["cache-control"], /max-age=0.*must-revalidate/, pathname);
    assert.doesNotMatch(headers["cache-control"], /immutable/, pathname);
  }
  const globalCsp = config.headers.find(({ source }) => source === "/(.*)").headers.find(({ key }) => key === "Content-Security-Policy").value;
  assert.match(globalCsp, /img-src[^;]*data:/);
});

test("ecosystem icon handoff binds every reusable asset to its actual hash", () => {
  const handoff = JSON.parse(read("docs/integration/website-brand-icons-20260906.json"));
  assert.equal(handoff.deployed, false);
  for (const asset of handoff.assets) {
    const data = read(`public${asset.path}`);
    assert.equal(asset.sha256, sha256(data), asset.path);
    assert.equal(asset.bytes, data.length, asset.path);
  }
  assert.deepEqual(handoff.recommendedHead, iconLinks(sourceHtml));
  assert.deepEqual(handoff.recommendedManifest.icons, JSON.parse(read("public/manifest.webmanifest")).icons);
});
