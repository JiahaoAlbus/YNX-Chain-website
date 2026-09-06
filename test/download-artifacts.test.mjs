import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { getCatalog } from "../src/lib/ecosystemCatalog.js";

test("only manifest-backed website artifacts are advertised as downloadable", () => {
  const hosted = getCatalog().flatMap((product) => Object.values(product.downloads || {})
    .filter((item) => item.downloadHosted));

  assert.ok(hosted.length >= 7);
  const rewrites = JSON.parse(fs.readFileSync("vercel.json", "utf8")).rewrites;
  for (const artifact of hosted) {
    assert.ok(artifact.href.startsWith("https://downloads.ynxweb4.com/") || rewrites.some((entry) => entry.source === artifact.href && entry.destination.startsWith("https://")), artifact.href);
    if (artifact.publicationEvidence) {
      assert.ok(fs.existsSync(path.join(process.cwd(), "public", artifact.publicationEvidence)));
      assert.match(artifact.sha256, /^[a-f0-9]{64}$/);
      assert.ok(Number.isInteger(artifact.sizeBytes) && artifact.sizeBytes > 0);
      assert.ok(artifact.signingClass);
      assert.match(artifact.sourceCommit, /^[a-f0-9]{40}$/);
      assert.ok(artifact.installProof);
    }
  }
});

test("Wallet download entries preserve current Android and both Windows architectures", () => {
  const downloads = getCatalog().find((product) => product.key === "wallet").downloads;
  for (const platform of ["android", "macos", "windowsX64", "windowsArm64"]) {
    assert.equal(downloads[platform].downloadHosted, true, platform);
    assert.ok(downloads[platform].publicationEvidence, platform);
    assert.ok(downloads[platform].href.includes(downloads[platform].sha256), platform);
  }
  assert.equal(downloads.ios.downloadHosted, undefined);
  assert.equal(downloads.linux.downloadHosted, false);
});
