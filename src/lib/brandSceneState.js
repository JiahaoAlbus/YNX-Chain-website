export const WALKTHROUGH_STAGE_SECONDS = 1.9;

export function walkthroughAt(seconds) {
  const progress = Math.max(0, Number.isFinite(seconds) ? seconds : 0) / WALKTHROUGH_STAGE_SECONDS;
  return { step: Math.min(3, Math.floor(progress)), phase: progress >= 4 ? 1 : progress % 1, complete: progress >= 4 };
}

// Device hints only choose the lightweight presentation; all explanatory controls remain available.
export function preferStaticScene(device = {}) {
  return device.connection?.saveData === true || ["slow-2g", "2g"].includes(device.connection?.effectiveType)
    || (device.hardwareConcurrency > 0 && device.hardwareConcurrency <= 2)
    || (device.deviceMemory > 0 && device.deviceMemory <= 2);
}
