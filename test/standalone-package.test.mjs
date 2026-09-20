import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import crypto from "node:crypto";
import test from "node:test";
import { pathToFileURL } from "node:url";
import { brotliDecompressSync, gunzipSync } from "node:zlib";
import { packageStandalone } from "../scripts/package-standalone.mjs";
import { readWebsiteBuildIdentity } from "../lib/build-identity.mjs";

const sourceIdentity = readWebsiteBuildIdentity({ YNX_WEBSITE_SOURCE_COMMIT: "a".repeat(40), YNX_WEBSITE_SOURCE_TREE: "b".repeat(40), YNX_WEBSITE_RELEASE: "standalone-package-test" });

test("offline package leaves dist intact, compresses only text, and runs with no node_modules", async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "ynx-standalone-package-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const distRoot = path.join(root, "input");
  const outputRoot = path.join(root, "package");
  await fs.mkdir(distRoot);
  const html = Buffer.from(`<!doctype html><h1>YNX</h1>${"<p>Existing content</p>".repeat(2000)}`);
  const installer = crypto.randomBytes(1024 * 64);
  await fs.writeFile(path.join(distRoot, "index.html"), html);
  await fs.writeFile(path.join(distRoot, "installer.exe"), installer);
  const summary = await packageStandalone({ distRoot, outputRoot, sourceIdentity, environment: {} });
  assert.equal(summary.compressedFiles, 2);
  assert.deepEqual(await fs.readdir(distRoot), ["index.html", "installer.exe"]);
  assert.deepEqual(await fs.readFile(path.join(distRoot, "index.html")), html);
  assert.deepEqual(await fs.readFile(path.join(outputRoot, "dist/installer.exe")), installer);
  assert.deepEqual(brotliDecompressSync(await fs.readFile(path.join(outputRoot, "dist/index.html.br"))), html);
  assert.deepEqual(gunzipSync(await fs.readFile(path.join(outputRoot, "dist/index.html.gz"))), html);
  await assert.rejects(fs.stat(path.join(outputRoot, "dist/installer.exe.br")), { code: "ENOENT" });
  await assert.rejects(fs.stat(path.join(outputRoot, "node_modules")), { code: "ENOENT" });
  await assert.rejects(packageStandalone({ distRoot, outputRoot, sourceIdentity, environment: {} }), /already exists/);
  await assert.rejects(packageStandalone({ distRoot, outputRoot: path.join(distRoot, "bad-output"), sourceIdentity, environment: {} }), /separate/);

  const { createStandaloneServer } = await import(pathToFileURL(path.join(outputRoot, "server/standalone.mjs")));
  const server = await createStandaloneServer({ distRoot: path.join(outputRoot, "dist"), identityFile: path.join(outputRoot, "source-identity.json"), environment: {} });
  await server.listenStandalone(0);
  t.after(async () => { server.closeAllConnections(); await new Promise((resolve) => server.close(resolve)); });
  const get = (headers) => new Promise((resolve, reject) => {
    const req = http.get({ hostname: "127.0.0.1", port: server.address().port, path: "/", headers, agent: false }, (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
    }); req.on("error", reject);
  });
  const br = await get({ "Accept-Encoding": "br, gzip" });
  assert.equal(br.headers["content-encoding"], "br");
  assert.equal(br.headers.vary, "Accept-Encoding");
  assert.deepEqual(brotliDecompressSync(br.body), html);
  assert.match(br.headers.etag, /^"[a-f0-9]{64}"$/);
  const gzip = await get({ "Accept-Encoding": "br;q=0, gzip" });
  assert.equal(gzip.headers["content-encoding"], "gzip");
  assert.deepEqual(gunzipSync(gzip.body), html);
  assert.notEqual(gzip.headers.etag, br.headers.etag);
  const unchanged = await get({ "Accept-Encoding": "br", "If-None-Match": br.headers.etag });
  assert.equal(unchanged.status, 304);
  assert.equal(unchanged.body.length, 0);
  assert.equal((await get({ "Accept-Encoding": "identity;q=0, *;q=0" })).status, 406);
});

test("packaging rejects symlinks instead of copying private files into public dist", async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "ynx-standalone-package-symlink-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const distRoot = path.join(root, "input");
  await fs.mkdir(distRoot);
  await fs.writeFile(path.join(distRoot, "index.html"), "home");
  await fs.writeFile(path.join(root, "secret"), "not public");
  await fs.symlink(path.join(root, "secret"), path.join(distRoot, "secret.txt"));
  await assert.rejects(packageStandalone({ distRoot, outputRoot: path.join(root, "output"), sourceIdentity, environment: {} }), /Symlink/);
  await assert.rejects(fs.stat(path.join(root, "output/package-manifest.json")), { code: "ENOENT" });
});
