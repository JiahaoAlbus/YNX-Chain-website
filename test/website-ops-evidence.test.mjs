import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

test("website operations evidence remains complete and fail closed", () => {
  const result = spawnSync(process.execPath, ["scripts/verify-website-ops-evidence.mjs"], {
    cwd: process.cwd(),
    encoding: "utf8"
  });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /website operations evidence gate passed/);
});
