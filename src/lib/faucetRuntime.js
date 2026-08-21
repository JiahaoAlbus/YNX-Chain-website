export const ACCEPTED_FAUCET_BUILD = Object.freeze({
  commit: "ea0e068becd9",
  release: "ynx-chain-ea0e068becd9",
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
  if (health.ok !== true || health.service !== "ynx-faucetd" || health.chainId !== 6423 || health.nativeSymbol !== "YNXT" || health.upstreamOk !== true || dependency?.ok !== true || leaksTopology || !buildMatches || version.build.commit !== ACCEPTED_FAUCET_BUILD.commit || version.build.release !== ACCEPTED_FAUCET_BUILD.release) {
    throw new Error("Faucet public health or release identity is incompatible. No availability is claimed.");
  }
  return Object.freeze({ health, version });
}

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
