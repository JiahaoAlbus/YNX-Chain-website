import { readWebsiteBuildIdentity } from "../lib/build-identity.mjs";

try {
  const identity = readWebsiteBuildIdentity(process.env);
  if (identity.release !== `website-${identity.sourceCommit.slice(0, 12)}`) {
    throw new Error("release:not-source-bound");
  }
} catch (error) {
  console.error(`Invalid website source identity: ${error.issues?.join(",") || "unavailable"}`);
  process.exit(1);
}
