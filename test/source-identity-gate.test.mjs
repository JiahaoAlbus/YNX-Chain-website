import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import test from "node:test";

const gate = path.resolve("deploy/source-identity.sh");

function git(cwd, ...args) {
  return execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
}

function fixture() {
  const cwd = mkdtempSync(path.join(tmpdir(), "ynx-website-identity-"));
  git(cwd, "init", "-q");
  git(cwd, "config", "user.name", "YNX Test");
  git(cwd, "config", "user.email", "test@ynx.invalid");
  writeFileSync(path.join(cwd, "source.txt"), "clean\n");
  git(cwd, "add", "source.txt");
  git(cwd, "commit", "-qm", "fixture");
  return cwd;
}

function run(cwd, environment = {}) {
  return spawnSync("bash", ["-c", 'source "$1" && printf "%s\\n%s\\n%s\\n" "$YNX_WEBSITE_SOURCE_COMMIT" "$YNX_WEBSITE_SOURCE_TREE" "$YNX_WEBSITE_RELEASE"', "identity-test", gate], {
    cwd,
    encoding: "utf8",
    env: { PATH: process.env.PATH, ...environment },
  });
}

test("source identity gate derives exact clean HEAD, tree and deterministic release", () => {
  const cwd = fixture();
  const result = run(cwd);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(result.stdout.trim().split("\n"), [
    git(cwd, "rev-parse", "HEAD"),
    git(cwd, "rev-parse", "HEAD^{tree}"),
    `website-${git(cwd, "rev-parse", "--short=12", "HEAD")}`,
  ]);
});

test("source identity gate rejects dirty, partial and inconsistent identities", () => {
  const partial = fixture();
  assert.notEqual(run(partial, { YNX_WEBSITE_SOURCE_COMMIT: git(partial, "rev-parse", "HEAD") }).status, 0);

  const inconsistent = fixture();
  assert.notEqual(run(inconsistent, {
    YNX_WEBSITE_SOURCE_COMMIT: "0".repeat(40),
    YNX_WEBSITE_SOURCE_TREE: git(inconsistent, "rev-parse", "HEAD^{tree}"),
    YNX_WEBSITE_RELEASE: "website-test",
  }).status, 0);

  const dirty = fixture();
  writeFileSync(path.join(dirty, "source.txt"), "dirty\n");
  const dirtyResult = run(dirty);
  assert.notEqual(dirtyResult.status, 0);
  assert.match(dirtyResult.stderr, / M source\.txt/);

  const untracked = fixture();
  writeFileSync(path.join(untracked, "unexpected-source.js"), "export default true;\n");
  const untrackedResult = run(untracked);
  assert.notEqual(untrackedResult.status, 0);
  assert.match(untrackedResult.stderr, /\?\? unexpected-source\.js/);
});

test("an archive build without Git requires the complete injected identity", () => {
  const cwd = mkdtempSync(path.join(tmpdir(), "ynx-website-archive-"));
  assert.notEqual(run(cwd).status, 0);
  const environment = {
    YNX_WEBSITE_SOURCE_COMMIT: "a".repeat(40),
    YNX_WEBSITE_SOURCE_TREE: "b".repeat(40),
    YNX_WEBSITE_RELEASE: "website-aaaaaaaaaaaa",
  };
  assert.equal(run(cwd, environment).status, 0);
  assert.notEqual(run(cwd, { ...environment, YNX_WEBSITE_RELEASE: "website-other" }).status, 0);
  assert.notEqual(run(cwd, { ...environment, VERCEL_GIT_COMMIT_SHA: "c".repeat(40) }).status, 0);
});

test("Vercel deployment injects the verified identity into build and runtime", () => {
  const current = execFileSync("sed", ["-n", "1,220p", "deploy/vercel-deploy.sh"], { encoding: "utf8" });
  assert.match(current, /source deploy\/source-identity\.sh/);
  for (const key of ["YNX_WEBSITE_SOURCE_COMMIT", "YNX_WEBSITE_SOURCE_TREE", "YNX_WEBSITE_RELEASE"]) {
    assert.match(current, new RegExp(`--build-env "${key}=\\$${key}"`));
    assert.match(current, new RegExp(`--env "${key}=\\$${key}"`));
  }
});
