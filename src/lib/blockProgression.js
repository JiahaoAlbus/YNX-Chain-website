export const PROGRESSION_WAIT_MS = 10_000;
const MIN_WINDOW_MS = 8_000;
const MAX_WINDOW_MS = 90_000;

function sample(snapshot) {
  const status = snapshot?.status;
  const checkedAt = Date.parse(snapshot?.checkedAt);
  const blockTime = Date.parse(status?.latestBlockTime);
  if (snapshot?.chainVerified !== true || !Number.isFinite(checkedAt) || !Number.isFinite(blockTime) || blockTime > checkedAt + 5000) return null;
  if (status?.chainId !== 6423 || status?.nativeCurrencySymbol !== "YNXT" || !Number.isSafeInteger(status?.height) || status.height <= 0 || !/^[0-9a-f]{64}$/i.test(status?.latestBlockHash ?? "")) return null;
  return { height: status.height, hash: status.latestBlockHash, blockTime, checkedAt };
}

export function observeBlockProgression(first, second) {
  const before = sample(first);
  const after = sample(second);
  const windowMs = before && after ? after.checkedAt - before.checkedAt : null;
  let state = "unverified";
  if (windowMs >= MIN_WINDOW_MS && windowMs <= MAX_WINDOW_MS) {
    if (after.height > before.height && after.hash !== before.hash && after.blockTime > before.blockTime) state = "observed";
    else if (after.height === before.height && after.hash === before.hash && after.blockTime === before.blockTime) state = "not_observed";
  }
  const verified = state === "observed";
  const ok = second?.chainVerified === true && second?.indexerVerified === true && verified;
  return {
    ...second,
    ok,
    degraded: !ok,
    progressionVerified: verified,
    degradedReason: second?.chainVerified !== true || second?.indexerVerified !== true ? second?.degradedReason : verified ? undefined : "Block progression was not verified by two bounded browser snapshots; this does not by itself prove a stopped chain.",
    observations: {
      ...second?.observations,
      progressionState: state,
      progressionSource: "browser-two-snapshot",
      progressionWindowMs: windowMs,
      progressionFromHeight: before?.height ?? null,
      progressionToHeight: after?.height ?? null,
    },
  };
}

export async function collectBrowserProgression({ fetchSnapshot, publish, isActive = () => true, wait = ms => new Promise(resolve => setTimeout(resolve, ms)) }) {
  const first = await fetchSnapshot();
  if (!isActive()) return first;
  publish(first);
  if (!sample(first)) return first;
  await wait(PROGRESSION_WAIT_MS);
  if (!isActive()) return first;
  const second = await fetchSnapshot();
  if (!isActive()) return second;
  const observed = observeBlockProgression(first, second);
  publish(observed);
  return observed;
}
