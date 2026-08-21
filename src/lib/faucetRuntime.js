export const ACCEPTED_FAUCET_BUILD = Object.freeze({
  commit: "02cf44d17b50",
  release: "ynx-chain-02cf44d17b50",
});

// This is a bundled consumer contract, not a remote configuration channel.
// The Website must not accept a different Faucet deployment merely because it
// happens to answer the same origin.
export const ACCEPTED_FAUCET_MANIFEST = Object.freeze({
  version: "1.0.0-p0.4",
  payloadSha256: "6d8ca3adfef00d1dc55367fee13ff2ada96953a1dcaab43547428edfee40a998",
  sourceCommit: "b97c6dc08fa7a2741262a005163d632e580cb0aa",
});

const PUBLIC_HEALTH_FIELDS = new Set([
  "ok",
  "service",
  "chainId",
  "height",
  "nativeSymbol",
  "upstreamOk",
  "dependencies",
  "build",
  "startedAt",
  "truthfulStatus",
]);
const PUBLIC_VERSION_FIELDS = new Set(["service", "build", "startedAt"]);

export function validateFaucetRuntime(health, version) {
  if (!isRecord(health) || !isRecord(version) || !isRecord(health.build) || !isRecord(version.build)) {
    throw new Error("Faucet public health or release identity is incompatible. No availability is claimed.");
  }
  const onlyPublicHealth = Object.keys(health).every((field) => PUBLIC_HEALTH_FIELDS.has(field));
  const onlyPublicVersion = Object.keys(version).every((field) => PUBLIC_VERSION_FIELDS.has(field));
  const leaksTopology = ["rpcUrl", "requestLog", "lastError", "requestPath", "upstreamMode", "defaultAmount", "maxAmount", "rateLimit"].some((field) => Object.hasOwn(health, field) || Object.hasOwn(version, field));
  const dependency = Array.isArray(health.dependencies)
    ? health.dependencies.find((item) => isRecord(item) && item.name === "chain-rpc" && item.required === true)
    : null;
  const upstreamIsHealthy = health.upstreamOk === true && dependency?.ok === true;
  const buildMatches = health.build.commit === version.build.commit && health.build.release === version.build.release;
  if (!onlyPublicHealth || !onlyPublicVersion || health.ok !== true || health.service !== "ynx-faucetd" || version.service !== "ynx-faucetd" || health.chainId !== 6423 || !Number.isSafeInteger(health.height) || health.height <= 0 || health.nativeSymbol !== "YNXT" || typeof health.startedAt !== "string" || health.startedAt.length === 0 || !upstreamIsHealthy || leaksTopology || !buildMatches || version.build.commit !== ACCEPTED_FAUCET_BUILD.commit || version.build.release !== ACCEPTED_FAUCET_BUILD.release) {
    throw new Error("Faucet public health or release identity is incompatible. No availability is claimed.");
  }
  return Object.freeze({ health, version });
}

export function validateFaucetClaim(payload, expectedAddress, expectedAmount) {
  if (!isRecord(payload) || !isRecord(payload.transaction)) throw new Error("The Faucet returned an incompatible response. No success is claimed.");
  const transaction = payload.transaction;
  const validHash = /^0x[0-9a-f]{64}$/.test(transaction.hash || "");
  const validRecipient = payload.address === expectedAddress && payload.canonicalAddress === expectedAddress && transaction.to === payload.evmAddress;
  const validAmount = payload.amount === expectedAmount && transaction.amount === expectedAmount && payload.nativeSymbol === "YNXT";
  if (!validHash || !validRecipient || !validAmount || payload.truthfulStatus !== "rpc-backed-faucet") {
    throw new Error("The Faucet response did not match the requested recipient and amount. No success is claimed.");
  }
  return Object.freeze({ payload, hash: transaction.hash });
}

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
