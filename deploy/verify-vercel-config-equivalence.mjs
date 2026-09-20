import assert from "node:assert/strict";
import fs from "node:fs";
import { execFileSync } from "node:child_process";

try {
  const committed = JSON.parse(execFileSync("git", ["show", "HEAD:vercel.json"], { encoding: "utf8", maxBuffer: 4 * 1024 * 1024 }));
  const worktree = JSON.parse(fs.readFileSync("vercel.json", "utf8"));
  assert.deepStrictEqual(worktree, committed);
} catch {
  console.error("Vercel-generated vercel.json is not semantically identical to exact HEAD");
  process.exit(1);
}
