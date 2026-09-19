export const ACCEPTED_FAUCET_BUILD = Object.freeze({
  commit: "64efa498fa99",
  release: "ynx-chain-64efa498fa99",
});

export const DURABLE_FAUCET_BUILD = Object.freeze({
  commit: "37adf89a2a2c5227335f77690d859a6d4dcb7459",
  release: "weekly-v3-faucet",
});

export function validateFaucetRuntime(health, version) {
  if (!isRecord(health) || !isRecord(version) || !isRecord(health.build) || !isRecord(version.build)) {
    throw new Error("Faucet public health or release identity is incompatible. No availability is claimed.");
  }
  const leaksTopology = ["rpcUrl", "requestLog", "lastError"].some((field) => Object.hasOwn(health, field));
  const dependency = Array.isArray(health.dependencies)
    ? health.dependencies.find((item) => isRecord(item) && item.name === "chain-rpc" && item.required === true)
    : null;
  const buildMatches = health.build.commit === version.build.commit && health.build.release === version.build.release;
  const upstreamReady = health.upstreamMode === "authoritative" ? health.upstreamOk === true : dependency?.ok === true;
  const durable = version.build.commit === DURABLE_FAUCET_BUILD.commit && version.build.release === DURABLE_FAUCET_BUILD.release;
  const legacy = version.build.commit === ACCEPTED_FAUCET_BUILD.commit && version.build.release === ACCEPTED_FAUCET_BUILD.release && !leaksTopology;
  const durableReady = health.fundingReady === true && health.idempotentRequests === true && health.requestStatusPath === "/request-status" && health.defaultAmount === 100 && health.maxAmount === 100;
  if (health.ok !== true || health.service !== "ynx-faucetd" || version.service !== "ynx-faucetd" || health.chainId !== 6423 || health.nativeSymbol !== "YNXT" || !upstreamReady || !buildMatches || !(legacy || (durable && durableReady))) {
    throw new Error("Faucet public health or release identity is incompatible. No availability is claimed.");
  }
  // This exact deployed durable build includes internal diagnostic fields. Never
  // retain/render them in the website view; the historic legacy gate stays strict.
  const { rpcUrl, requestLog, lastError, ...publicHealth } = health;
  return Object.freeze({ health: Object.freeze(publicHealth), version, durable });
}

export function validateFaucetClaim(payload, expectedAddress, expectedAmount, expectedRequestId) {
  if (!isRecord(payload) || !isRecord(payload.transaction)) throw new Error("The Faucet returned an incompatible response. No success is claimed.");
  const transaction = payload.transaction;
  const validHash = /^0x[0-9a-f]{64}$/.test(transaction.hash || "");
  const onChainRecipient = typeof payload.evmAddress === "string" ? payload.evmAddress : expectedAddress;
  const validRecipient = payload.address === expectedAddress && (expectedRequestId ? transaction.to === expectedAddress : payload.canonicalAddress === expectedAddress && transaction.to === onChainRecipient);
  const validIntent = !expectedRequestId || (payload.requestId === expectedRequestId && payload.transactionHash === transaction.hash && payload.status === "accepted");
  const validAmount = payload.amount === expectedAmount && transaction.amount === expectedAmount && payload.nativeSymbol === "YNXT";
  if (!validHash || !validRecipient || !validAmount || !validIntent || payload.truthfulStatus !== "rpc-backed-faucet") {
    throw new Error("The Faucet response did not match the requested recipient and amount. No success is claimed.");
  }
  return Object.freeze({ payload, hash: transaction.hash });
}

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
