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
    const artifactUrl = new URL(artifact.href, "https://ynxweb4.com");
    assert.ok(artifactUrl.hostname === "downloads.ynxweb4.com" || (["ynxweb4.com", "www.ynxweb4.com"].includes(artifactUrl.hostname) && rewrites.some((entry) => entry.source === artifactUrl.pathname && entry.destination.startsWith("https://"))), artifact.href);
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

test("historical Wallet public record preserves exact owner bindings without private inventory data", () => {
  const raw = fs.readFileSync("public/releases/wallet-downloads/20260906/historical-previews.json", "utf8");
  const record = JSON.parse(raw);
  assert.equal(record.sourceInventorySHA256, "788dd352b51c2fbb6d1d23a29b23043f498cb3626cd1a11fed87998d661bd14e");
  assert.equal(record.artifacts.length, 6);
  assert.doesNotMatch(raw, /\/Users\/|headerEvidence|localPaths|candidateHost|localArtifacts|nextCandidates/);
  for (const artifact of record.artifacts) {
    assert.match(artifact.sourceCommit, /^[a-f0-9]{40}$/);
    assert.match(artifact.sha256, /^[a-f0-9]{64}$/);
    assert.ok(artifact.url.includes(artifact.sha256));
    assert.equal(artifact.historicalPreview, true);
    assert.equal(artifact.newWalletGoalsAccepted, false);
    assert.equal(artifact.productionSigned, false);
    assert.equal(artifact.storeReleased, false);
    assert.equal(artifact.httpVerification.fullGETSHA256Verified, true);
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
