#!/usr/bin/env node
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { pipeline } from "node:stream/promises";
import { createBrotliCompress, createGzip, constants } from "node:zlib";
import { fixedSourceIdentity } from "../server/standalone.mjs";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const COMPRESSIBLE = new Set([".html", ".css", ".js", ".mjs", ".json", ".svg", ".xml", ".webmanifest", ".txt", ".md", ".csv"]);
const RUNTIME_FILES = ["server/standalone.mjs", "server/network-status.mjs", "lib/build-identity.mjs", "src/lib/api/ynxApi.js", "vercel.json", "server/app-gateway.mjs", "src/lib/economicsEvidence.js", "api/apps/health.js", "api/apps/square/feed.js", "api/apps/square/post.js", "api/explorer/resolve.js", "api/economics/evidence.js"];

async function fingerprint(file) {
  const hash = crypto.createHash("sha256");
  let bytes = 0;
  for await (const chunk of fs.createReadStream(file, { highWaterMark: 64 * 1024 })) { hash.update(chunk); bytes += chunk.length; }
  return { bytes, sha256: hash.digest("hex") };
}

async function canonicalOutputPath(target) {
  const missing = [];
  let current = path.resolve(target);
  while (true) {
    try { return path.join(await fsp.realpath(current), ...missing.reverse()); }
    catch (error) {
      if (error.code !== "ENOENT") throw error;
      missing.push(path.basename(current));
      current = path.dirname(current);
    }
  }
}

async function* filesIn(directory, relative = "") {
  for (const entry of (await fsp.readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name.startsWith(".") || /[\x00-\x20\x7f\\%]/.test(entry.name)) throw new Error(`Unsupported public asset path: ${path.join(relative, entry.name)}`);
    const name = path.join(relative, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Symlink cannot enter release package: ${name}`);
    if (entry.isDirectory()) yield* filesIn(path.join(directory, entry.name), name);
    else if (entry.isFile()) yield name;
    else throw new Error(`Non-regular public asset: ${name}`);
  }
}

export async function packageStandalone({ distRoot, outputRoot, sourceIdentity, identityFile, environment = process.env, sourceRoot = ROOT } = {}) {
  if (!distRoot || !outputRoot) throw new Error("An existing dist directory and a new output directory are required");
  const source = await fsp.realpath(distRoot);
  // Resolve existing parent symlinks before checking overlap (e.g. /var on macOS).
  const output = await canonicalOutputPath(outputRoot);
  if (output === source || output.startsWith(`${source}${path.sep}`) || source.startsWith(`${output}${path.sep}`)) throw new Error("Package output must be separate from dist");
  try { await fsp.lstat(output); throw new Error("Package output already exists; choose a fresh directory"); } catch (error) { if (error.code !== "ENOENT") throw error; }
  if (!(await fsp.stat(path.join(source, "index.html"))).isFile()) throw new Error("Existing dist/index.html is required; this script never runs a build");
  const identity = fixedSourceIdentity({ sourceIdentity, identityFile, environment });
  await fsp.mkdir(output, { recursive: true });
  const destination = path.join(output, "dist");
  await fsp.mkdir(destination);
  const assets = {};
  const runtimeFiles = {};
  let compressedFiles = 0;
  for await (const relative of filesIn(source)) {
    // Ignore previous sidecars for textual files; regenerate them from this input.
    if (/\.(?:br|gz)$/.test(relative) && COMPRESSIBLE.has(path.extname(relative.replace(/\.(?:br|gz)$/, "")))) continue;
    if (["source-identity.json", "asset-manifest.json", "package-manifest.json"].includes(relative)) throw new Error("Private package metadata cannot be inside dist");
    const from = path.join(source, relative);
    const to = path.join(destination, relative);
    await fsp.mkdir(path.dirname(to), { recursive: true });
    await fsp.copyFile(from, to, fs.constants.COPYFILE_EXCL);
    const key = `/${relative.split(path.sep).join("/")}`;
    assets[key] = await fingerprint(to);
    // Installers, archives, PDFs, images and large text exports are never recompressed.
    if (COMPRESSIBLE.has(path.extname(relative).toLowerCase()) && assets[key].bytes >= 256 && assets[key].bytes <= 8 * 1024 * 1024) {
      for (const [suffix, transform] of [
        [".br", () => createBrotliCompress({ params: { [constants.BROTLI_PARAM_QUALITY]: 5 } })],
        [".gz", () => createGzip({ level: 9 })],
      ]) {
        await pipeline(fs.createReadStream(to, { highWaterMark: 64 * 1024 }), transform(), fs.createWriteStream(to + suffix, { flags: "wx" }));
        const compressed = await fingerprint(to + suffix);
        if (compressed.bytes < assets[key].bytes) { assets[key + suffix] = compressed; compressedFiles += 1; }
        else await fsp.unlink(to + suffix);
      }
    }
  }
  for (const relative of RUNTIME_FILES) {
    const target = path.join(output, relative);
    await fsp.mkdir(path.dirname(target), { recursive: true });
    await fsp.copyFile(path.join(sourceRoot, relative), target, fs.constants.COPYFILE_EXCL);
    runtimeFiles[relative] = await fingerprint(target);
  }
  await fsp.writeFile(path.join(output, "package.json"), `${JSON.stringify({ name: "ynx-website-standalone", private: true, type: "module", engines: { node: ">=22" } }, null, 2)}\n`, { flag: "wx" });
  await fsp.writeFile(path.join(output, "source-identity.json"), `${JSON.stringify(identity, null, 2)}\n`, { flag: "wx" });
  await fsp.writeFile(path.join(output, "asset-manifest.json"), `${JSON.stringify({ schemaVersion: 1, files: assets }, null, 2)}\n`, { flag: "wx" });
  const summary = { schemaVersion: 1, sourceIdentity: identity, runtimeFiles, assetCount: Object.keys(assets).length, compressedFiles, inputDistUntouched: true, compression: { concurrency: 1, streamBufferBytes: 65536, textSizeLimitBytes: 8 * 1024 * 1024, brotliQuality: 5, gzipLevel: 9 } };
  await fsp.writeFile(path.join(output, "package-manifest.json"), `${JSON.stringify(summary, null, 2)}\n`, { flag: "wx" });
  return summary;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length !== 4) throw new Error("Usage: node scripts/package-standalone.mjs <existing-dist> <new-output-directory>");
    const summary = await packageStandalone({ distRoot: process.argv[2], outputRoot: process.argv[3] });
    process.stdout.write(`${JSON.stringify(summary)}\n`);
  } catch (error) { process.stderr.write(`Packaging failed: ${error.message}\n`); process.exitCode = 1; }
}
