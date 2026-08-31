import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  BUILD_IDENTITY_SCHEMA_VERSION,
  BuildIdentityUnavailableError,
  readWebsiteBuildIdentity,
} from "../lib/build-identity.mjs";
import { createBuildIdentityHandler } from "../api/build-identity.js";

const SOURCE_COMMIT = "a".repeat(40);
const SOURCE_TREE = "b".repeat(40);
const validEnvironment = {
  YNX_WEBSITE_SOURCE_COMMIT: SOURCE_COMMIT,
  YNX_WEBSITE_SOURCE_TREE: SOURCE_TREE,
  YNX_WEBSITE_RELEASE: "website-20260831.1",
};

function responseRecorder() {
  return {
    headers: {},
    statusCode: null,
    payload: null,
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    status(statusCode) {
      this.statusCode = statusCode;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
  };
}

test("build identity contains only exact deployment-bound 6423 identity", () => {
  assert.deepEqual(readWebsiteBuildIdentity(validEnvironment), {
    schemaVersion: BUILD_IDENTITY_SCHEMA_VERSION,
    sourceCommit: SOURCE_COMMIT,
    sourceTree: SOURCE_TREE,
    chainId: 6423,
    chainIdHex: "0x1917",
    nativeAsset: "YNXT",
    release: "website-20260831.1",
  });

  assert.equal(
    readWebsiteBuildIdentity({
      VERCEL_GIT_COMMIT_SHA: SOURCE_COMMIT,
      YNX_WEBSITE_SOURCE_TREE: SOURCE_TREE,
      YNX_WEBSITE_RELEASE: "dpl_test-1",
    }).sourceCommit,
    SOURCE_COMMIT,
  );
});

test("identity validation fails closed without leaking malformed values", () => {
  for (const environment of [
    {},
    { ...validEnvironment, YNX_WEBSITE_SOURCE_COMMIT: "uncommitted-source-tree" },
    { ...validEnvironment, YNX_WEBSITE_SOURCE_TREE: "unknown" },
    { ...validEnvironment, YNX_WEBSITE_RELEASE: "bad release value" },
    {
      ...validEnvironment,
      VERCEL_GIT_COMMIT_SHA: "c".repeat(40),
    },
  ]) {
    assert.throws(
      () => readWebsiteBuildIdentity(environment),
      (error) => error instanceof BuildIdentityUnavailableError && error.issues.length > 0,
    );
  }
});

test("public handler returns JSON/no-store/nosniff and 503 for unavailable identity", () => {
  const success = responseRecorder();
  createBuildIdentityHandler(() => validEnvironment)({ method: "GET" }, success);
  assert.equal(success.statusCode, 200);
  assert.equal(success.headers["content-type"], "application/json; charset=utf-8");
  assert.equal(success.headers["cache-control"], "no-store, max-age=0");
  assert.equal(success.headers["x-content-type-options"], "nosniff");
  assert.equal(success.payload.sourceCommit, SOURCE_COMMIT);

  const unavailable = responseRecorder();
  createBuildIdentityHandler(() => ({}))({ method: "GET" }, unavailable);
  assert.equal(unavailable.statusCode, 503);
  assert.equal(unavailable.payload.error, "BUILD_IDENTITY_UNAVAILABLE");
  assert.equal(JSON.stringify(unavailable.payload).includes("uncommitted"), false);
  assert.equal("sourceCommit" in unavailable.payload, false);

  const methodNotAllowed = responseRecorder();
  createBuildIdentityHandler(() => validEnvironment)({ method: "POST" }, methodNotAllowed);
  assert.equal(methodNotAllowed.statusCode, 405);
  assert.equal(methodNotAllowed.headers.allow, "GET");
});

test("Vercel maps the exact public JSON path before the SPA fallback", async () => {
  const configuration = JSON.parse(await readFile(new URL("../vercel.json", import.meta.url), "utf8"));
  const identityIndex = configuration.rewrites.findIndex(
    (rewrite) => rewrite.source === "/build-identity.json",
  );
  const fallbackIndex = configuration.rewrites.findIndex(
    (rewrite) => rewrite.source === "/(.*)" && rewrite.destination === "/",
  );

  assert.notEqual(identityIndex, -1);
  assert.equal(configuration.rewrites[identityIndex].destination, "/api/build-identity");
  assert.ok(identityIndex < fallbackIndex);
});
