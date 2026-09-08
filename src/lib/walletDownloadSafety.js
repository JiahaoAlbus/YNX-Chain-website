// Website selection policy only. Original public manifests and package records stay immutable.
export const WALLET_DOWNLOAD_SAFETY_POLICY_PATH = "/releases/wallet-downloads/website-safety-policy.json";
export const WALLET_APPIMAGE_ADVISORY = Object.freeze({
  id: "GHSA-7g7r-gx96-252g",
  href: "https://github.com/electron-userland/electron-builder/security/advisories/GHSA-7g7r-gx96-252g",
  builderVersion: "26.0.12",
  affectedBuilderVersions: "<26.15.0"
});
export const WALLET_APPIMAGE_HELD_SHA256 = Object.freeze([
  // Current 0.6.5: x64, arm64.
  "3ba16d0372021471e13733425eaa39b155c122175e5bdcbc0e39b2554c199b00",
  "66dde56c9f8da969e9916d72c8929add581b1a0ea0695cd70a2e9fcb3c960a72",
  // Historical 0.6.4: x64, arm64. Never re-enable these bytes as a fallback.
  "dcaf1372b29e6d3cb58f9a37d3db3b6fcb45aa9e13feff1c7c247bf283cd9893",
  "5664be113dea0e06862fcc8e6d1918de86a60197d7ca1906bbb30e8e5b3c4183"
]);

export function walletDownloadSafetyHold(item) {
  return WALLET_APPIMAGE_HELD_SHA256.includes(String(item?.sha256 || "").toLowerCase())
    ? WALLET_APPIMAGE_ADVISORY : null;
}
