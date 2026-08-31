import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { getCatalog } from "../src/lib/ecosystemCatalog.js";

test("only manifest-backed website artifacts are advertised as downloadable", () => {
  const hosted = getCatalog().flatMap((product) => Object.values(product.downloads || {})
    .filter((item) => item.downloadHosted));

  assert.equal(hosted.length, 2);
  for (const artifact of hosted) {
    assert.match(artifact.href, /^\/releases\/wallet\/60e7426c1758\//);
    assert.ok(fs.existsSync(path.join(process.cwd(), "public", artifact.href)));
    assert.match(artifact.sha256, /^[a-f0-9]{64}$/);
    assert.ok(Number.isInteger(artifact.sizeBytes) && artifact.sizeBytes > 0);
    assert.ok(artifact.signingClass);
    assert.ok(artifact.sourceCommit);
    assert.ok(artifact.installProof);
  }
});
