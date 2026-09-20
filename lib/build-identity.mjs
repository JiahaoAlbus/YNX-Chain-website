const LOWER_HEX_40 = /^[0-9a-f]{40}$/;
const RELEASE_ID = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;

export const BUILD_IDENTITY_SCHEMA_VERSION = "ynx.website.build-identity.v1";

export class BuildIdentityUnavailableError extends Error {
  constructor(issues) {
    super("Website build identity is unavailable");
    this.name = "BuildIdentityUnavailableError";
    this.issues = [...new Set(issues)].sort();
  }
}

function optionalValue(environment, name) {
  const value = environment?.[name];
  return typeof value === "string" && value.length > 0 ? value : null;
}

function exactCommit(environment, issues) {
  const injected = optionalValue(environment, "YNX_WEBSITE_SOURCE_COMMIT");
  const vercel = optionalValue(environment, "VERCEL_GIT_COMMIT_SHA");

  if (injected && vercel && injected !== vercel) {
    issues.push("sourceCommit:conflict");
    return null;
  }

  const value = injected || vercel;
  if (!value) issues.push("sourceCommit:missing");
  else if (!LOWER_HEX_40.test(value)) issues.push("sourceCommit:invalid");
  return value;
}

export function readWebsiteBuildIdentity(environment = process.env) {
  const issues = [];
  const sourceCommit = exactCommit(environment, issues);
  const sourceTree = optionalValue(environment, "YNX_WEBSITE_SOURCE_TREE");
  const release = optionalValue(environment, "YNX_WEBSITE_RELEASE");

  if (!sourceTree) issues.push("sourceTree:missing");
  else if (!LOWER_HEX_40.test(sourceTree)) issues.push("sourceTree:invalid");

  if (!release) issues.push("release:missing");
  else if (!RELEASE_ID.test(release)) issues.push("release:invalid");

  if (issues.length > 0) throw new BuildIdentityUnavailableError(issues);

  return Object.freeze({
    schemaVersion: BUILD_IDENTITY_SCHEMA_VERSION,
    sourceCommit,
    sourceTree,
    chainId: 6423,
    chainIdHex: "0x1917",
    nativeAsset: "YNXT",
    release,
  });
}
