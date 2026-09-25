import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  BUILD_IDENTITY_SCHEMA_VERSION,
  BuildIdentityUnavailableError,
  readWebsiteBuildIdentity,
} from "../lib/build-identity.mjs";
import { createBuildIdentityHandler, readPackagedBuildIdentity } from "../api/build-identity.js";
import { writeBuildIdentity } from "../scripts/write-build-identity.mjs";

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
  createBuildIdentityHandler(() => readWebsiteBuildIdentity(validEnvironment))({ method: "GET" }, success);
  assert.equal(success.statusCode, 200);
  assert.equal(success.headers["content-type"], "application/json; charset=utf-8");
  assert.equal(success.headers["cache-control"], "no-store, max-age=0");
  assert.equal(success.headers["x-content-type-options"], "nosniff");
  assert.equal(success.payload.sourceCommit, SOURCE_COMMIT);

  const unavailable = responseRecorder();
  createBuildIdentityHandler(() => { throw new BuildIdentityUnavailableError(["packagedIdentity:missing"]); })({ method: "GET" }, unavailable);
  assert.equal(unavailable.statusCode, 503);
  assert.equal(unavailable.payload.error, "BUILD_IDENTITY_UNAVAILABLE");
  assert.equal(JSON.stringify(unavailable.payload).includes("uncommitted"), false);
  assert.equal("sourceCommit" in unavailable.payload, false);

  const methodNotAllowed = responseRecorder();
  createBuildIdentityHandler(() => validEnvironment)({ method: "POST" }, methodNotAllowed);
  assert.equal(methodNotAllowed.statusCode, 405);
  assert.equal(methodNotAllowed.headers.allow, "GET");
});

test("build writes the deployment-bound identity as a static public artifact", async (t) => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "ynx-build-identity-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const outputPath = path.join(directory, "build-identity.json");

  assert.deepEqual(
    await writeBuildIdentity({ environment: validEnvironment, outputPath }),
    readWebsiteBuildIdentity(validEnvironment),
  );
  assert.deepEqual(
    JSON.parse(await readFile(outputPath, "utf8")),
    readWebsiteBuildIdentity(validEnvironment),
  );
  assert.deepEqual(readPackagedBuildIdentity({ VERCEL_GIT_COMMIT_SHA: SOURCE_COMMIT }, outputPath), readWebsiteBuildIdentity(validEnvironment));
  assert.throws(() => readPackagedBuildIdentity({ VERCEL_GIT_COMMIT_SHA: "c".repeat(40) }, outputPath), BuildIdentityUnavailableError);
  assert.throws(() => readPackagedBuildIdentity({ YNX_WEBSITE_SOURCE_TREE: "c".repeat(40) }, outputPath), BuildIdentityUnavailableError);
  const altered = { ...readWebsiteBuildIdentity(validEnvironment), sourceTree: "c".repeat(40) };
  await writeFile(outputPath, `${JSON.stringify(altered)}\n`);
  assert.throws(() => readPackagedBuildIdentity({ YNX_WEBSITE_SOURCE_TREE: SOURCE_TREE }, outputPath), BuildIdentityUnavailableError);
  for (const mutation of [{ chainId: 1 }, { schemaVersion: "wrong" }]) {
    await writeFile(outputPath, `${JSON.stringify({ ...readWebsiteBuildIdentity(validEnvironment), ...mutation })}\n`);
    assert.throws(() => readPackagedBuildIdentity({}, outputPath), BuildIdentityUnavailableError);
  }
  await rm(outputPath);
  assert.throws(() => readPackagedBuildIdentity({}, outputPath), /ENOENT/);
});

test("Vercel serves the static identity with no-store headers before the SPA fallback", async () => {
  const configuration = JSON.parse(await readFile(new URL("../vercel.json", import.meta.url), "utf8"));
  const fallbackIndex = configuration.rewrites.findIndex(
    (rewrite) => rewrite.destination === "/",
  );
  const identityHeaders = configuration.headers.find(
    (entry) => entry.source === "/build-identity.json",
  );
  const headerMap = new Map(
    identityHeaders?.headers?.map((header) => [header.key.toLowerCase(), header.value]),
  );

  assert.equal(
    configuration.rewrites.some((rewrite) => rewrite.source === "/build-identity.json"),
    false,
  );
  assert.equal(headerMap.get("content-type"), "application/json; charset=utf-8");
  assert.equal(headerMap.get("cache-control"), "no-store, max-age=0");
  assert.equal(headerMap.get("x-content-type-options"), "nosniff");
  assert.equal(configuration.functions["api/build-identity.js"].includeFiles, "dist/build-identity.json");
  assert.equal(configuration.functions["api/**/*.js"].includeFiles, undefined);
  assert.equal(fallbackIndex, configuration.rewrites.length - 1);
  assert.equal(new RegExp("^" + configuration.rewrites[fallbackIndex].source + "$" ).test("/build-identity.json"), false);
});
