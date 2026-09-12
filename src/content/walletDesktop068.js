const files = [
  [
    "macos",
    "ynx-wallet-macos-0.6.8-universal.dmg",
    258681947,
    "f7c8a6d3f639ba950e701355f567608542aaf6fd4bdd8a15c956330f831bd25f"
  ],
  [
    "linuxX64Deb",
    "ynx-wallet-desktop-0.6.8-amd64.deb",
    95869208,
    "0a06a27486c7eabf3569d0e9d225ae9f0ec6e2e7a31076cc789c1cbce7bf6dce"
  ],
  [
    "linuxArm64Deb",
    "ynx-wallet-desktop-0.6.8-arm64.deb",
    89954040,
    "e8d3f5e902b290432fc4ee27952bbcd1972124ace89b0ac3d1e83ec4d1c43fb7"
  ],
  [
    "windowsX64",
    "ynx-wallet-desktop-0.6.8-x64.exe",
    120954701,
    "da2e564eb680de0595202bd388eda9d524f40d62052b03da9b0bba4bf9da3716"
  ],
  [
    "windowsArm64",
    "ynx-wallet-desktop-0.6.8-arm64.exe",
    114596628,
    "122027d7f5668876ae5bdae8bab31c4bd34dee517096eae07813f66775b02902"
  ]
];
export const WALLET_DESKTOP068 = Object.fromEntries(files.map(([platform, artifactPath, sizeBytes, sha256]) => [platform, {
 version: "0.6.8", sourceCommit: "6f332753baae5deaf6b05c8276b20a02cc4887c5", artifactPath, sizeBytes, sha256,
 publicUrl: "https://github.com/JiahaoAlbus/YNX-Chain/releases/download/wallet-desktop-testnet-preview-6f332753/" + artifactPath,
 publicationEvidence: "/releases/wallet-downloads/20260912-desktop068.json", releaseBatch: "wallet-desktop068-20260912",
 canonicalDownload: true, downloadApproved: true, historicalPreview: false, publicDownloadVerified: true,
 productionSigned: false, storeReleased: false, fullInstalledE2E: false, newWalletGoalsAccepted: false,
 signingClass: platform === "macos" ? "ad-hoc signed; not notarized" : "unsigned testnet preview",
 installProof: "Two empty locked cold starts per platform; Windows/Linux native CI and macOS ARM64. Real wallet upgrade, signing and transactions are not verified.",
 architecture: platform === "macos" ? "universal" : platform.includes("Arm64") ? "arm64" : "x64"
}]));
