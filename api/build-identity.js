import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  BuildIdentityUnavailableError,
  readWebsiteBuildIdentity,
} from "../lib/build-identity.mjs";

const PACKAGED_IDENTITY = fileURLToPath(new URL("../dist/build-identity.json", import.meta.url));

export function readPackagedBuildIdentity(environment = process.env, path = PACKAGED_IDENTITY) {
  const published = JSON.parse(readFileSync(path, "utf8"));
  const identity = readWebsiteBuildIdentity({
    YNX_WEBSITE_SOURCE_COMMIT: published.sourceCommit,
    YNX_WEBSITE_SOURCE_TREE: published.sourceTree,
    YNX_WEBSITE_RELEASE: published.release,
    VERCEL_GIT_COMMIT_SHA: environment.VERCEL_GIT_COMMIT_SHA,
  });
  const expectedKeys = Object.keys(identity).sort();
  if (JSON.stringify(Object.keys(published).sort()) !== JSON.stringify(expectedKeys)
      || expectedKeys.some((key) => published[key] !== identity[key])) {
    throw new BuildIdentityUnavailableError(["packagedIdentity:mismatch"]);
  }
  for (const [key, expected] of [
    ["YNX_WEBSITE_SOURCE_COMMIT", identity.sourceCommit],
    ["YNX_WEBSITE_SOURCE_TREE", identity.sourceTree],
    ["YNX_WEBSITE_RELEASE", identity.release],
  ]) {
    if (environment[key] && environment[key] !== expected) {
      throw new BuildIdentityUnavailableError([`${key}:conflict`]);
    }
  }
  return identity;
}

function setIdentityHeaders(response) {
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store, max-age=0");
  response.setHeader("X-Content-Type-Options", "nosniff");
}

export function createBuildIdentityHandler(identitySource = () => readPackagedBuildIdentity()) {
  return function buildIdentityHandler(request, response) {
    setIdentityHeaders(response);

    if (request.method !== "GET") {
      response.setHeader("Allow", "GET");
      return response.status(405).json({ error: "METHOD_NOT_ALLOWED" });
    }

    try {
      return response.status(200).json(identitySource());
    } catch (error) {
      if (error instanceof BuildIdentityUnavailableError) {
        return response.status(503).json({
          error: "BUILD_IDENTITY_UNAVAILABLE",
          issues: error.issues,
        });
      }
      return response.status(503).json({ error: "BUILD_IDENTITY_UNAVAILABLE" });
    }
  };
}

export default createBuildIdentityHandler();
