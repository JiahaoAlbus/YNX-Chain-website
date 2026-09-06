// Hosted universal test-preview DMG. Ad-hoc signing and locked launch are not full installed Wallet acceptance.
export const WALLET_MACOS_MANIFESTS = [
  {
    "url": "https://downloads.ynxweb4.com/wallet/sha256-8269fe58132125d810c86d6f93de2ba84ad3a98984393db2bb3f4fc2f6050c62/ynx-wallet-downloads.json",
    "sha256": "8269fe58132125d810c86d6f93de2ba84ad3a98984393db2bb3f4fc2f6050c62",
    "bytes": 654,
    "localPath": "/releases/wallet-downloads/20260906-r6-macos/ynx-wallet-downloads.json"
  },
  {
    "url": "https://downloads.ynxweb4.com/wallet/sha256-162dce80ecf62238c718b6bd0ecbe3773102ec303a0de289e929327e8955e855/ynx-wallet-download-preview-metadata.json",
    "sha256": "162dce80ecf62238c718b6bd0ecbe3773102ec303a0de289e929327e8955e855",
    "bytes": 3145,
    "localPath": "/releases/wallet-downloads/20260906-r6-macos/ynx-wallet-download-preview-metadata.json"
  }
];

export const WALLET_MACOS_DOWNLOADS = {
  "macos": {
    "id": "macos-064-e1945298",
    "version": "0.6.4",
    "architecture": "universal",
    "installation": "dmg",
    "artifactPath": "ynx-wallet-macos-0.6.4-universal-testnet-preview.dmg",
    "sizeBytes": 257243798,
    "sha256": "f904e4d32fa949fb936fd69c6aae5e32025564fb864e8a710deb1f93d9ccceef",
    "sourceCommit": "e1945298b843385f9d8d44fd1ccff99c29815ece",
    "publicUrl": "https://downloads.ynxweb4.com/wallet/sha256-f904e4d32fa949fb936fd69c6aae5e32025564fb864e8a710deb1f93d9ccceef/ynx-wallet-macos-0.6.4-universal-testnet-preview.dmg",
    "publicationEvidence": "/releases/wallet-downloads/20260906-r6-macos/ynx-wallet-download-preview-metadata.json",
    "sdkManifest": "https://downloads.ynxweb4.com/wallet/sha256-8269fe58132125d810c86d6f93de2ba84ad3a98984393db2bb3f4fc2f6050c62/ynx-wallet-downloads.json",
    "previewManifest": "https://downloads.ynxweb4.com/wallet/sha256-162dce80ecf62238c718b6bd0ecbe3773102ec303a0de289e929327e8955e855/ynx-wallet-download-preview-metadata.json",
    "mimeType": "application/x-apple-diskimage",
    "signingClass": "ad-hoc signature; no Developer ID signature or notarization; Gatekeeper spctl rejected",
    "installProof": "Actual DMG installation, embedded source and limited cold locked launch were verified. Current password-unlock, clipboard and full installed account/transfer E2E remain unverified.",
    "note": "Ad-hoc signature; Gatekeeper spctl assessment rejected. No Developer ID production signature or notarization. This is a test preview, not an ordinary trusted macOS release. Actual DMG installation, embedded source and limited cold locked launch were verified. Current password-unlock, clipboard and full installed account/transfer E2E remain unverified. Amount-unit capability is unknown at the recorded validation checkpoint; sending stays disabled. No public signing/broadcast is asserted. 临时 ad-hoc 签名，Gatekeeper 检查拒绝，未完成 Developer ID 签名与公证；仅测试预览，不能标为完整可用。 已验证实际 DMG 安装及有限锁定启动；新包解锁、剪贴板和完整账户／转账流程尚未完成。金额单位能力未验证时发送保持禁用。",
    "releaseBatch": "wallet-static-20260906-r6-macos",
    "historicalPreview": false,
    "downloadApproved": true,
    "publicDownloadVerified": true,
    "productionSigned": false,
    "storeReleased": false,
    "fullInstalledE2E": false,
    "newWalletGoalsAccepted": false,
    "pwaDeployed": false,
    "launchURL": null,
    "targetPlatform": "macos",
    "notarized": false,
    "developerIdSigned": false,
    "spctlAccepted": false
  }
};
