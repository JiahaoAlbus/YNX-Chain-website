import { WALLET_ANDROID15 } from "./walletAndroid15.js";
// Compact current selections. Full source manifests and all historical bodies are served from public/releases only.
export const WALLET_CANONICAL_MANIFESTS = [
  {
    "url": "https://downloads.ynxweb4.com/wallet/sha256-344651e9f6f4324a9dddbc2bd7b103aad1bfc1bc855b412e62048b4f48fad0ef/ynx-wallet-downloads.json",
    "sha256": "344651e9f6f4324a9dddbc2bd7b103aad1bfc1bc855b412e62048b4f48fad0ef",
    "bytes": 6012,
    "localPath": "/releases/wallet-downloads/20260908-canonical-r1/ynx-wallet-downloads.json"
  },
  {
    "url": "https://downloads.ynxweb4.com/wallet/sha256-28162c332f04f0a683457f7dc0f53172a02a58cb0008eafa979f38e83973b6ca/ynx-wallet-download-preview-metadata.json",
    "sha256": "28162c332f04f0a683457f7dc0f53172a02a58cb0008eafa979f38e83973b6ca",
    "bytes": 29774,
    "localPath": "/releases/wallet-downloads/20260908-canonical-r1/ynx-wallet-download-preview-metadata.json"
  }
];
export const WALLET_DOWNLOAD_HISTORY_PATH = "/releases/wallet-downloads/20260908-canonical-r1/history.json";
const SHARED = {
  "canonicalAggregateId": "wallet-published-17-history-11-active-r3",
  "canonicalDownload": true,
  "historicalPreview": false,
  "downloadApproved": true,
  "publicDownloadVerified": true,
  "productionSigned": false,
  "storeReleased": false,
  "fullInstalledE2E": false,
  "newWalletGoalsAccepted": false,
  "pwaDeployed": false,
  "launchURL": null
};
const PROFILES = {
  "0": {
    "id": "android-107-08d8f67d",
    "architecture": "arm64",
    "installation": "apk",
    "artifactPath": "ynx-wallet-1.0.7-testnet-preview-08d8f67d-local-test-signed.apk",
    "sizeBytes": 30977000,
    "sha256": "3ae55a7759bcbd610587cf018bb2de0a3a13a7a7c9100a495a36ad8d6a8dad7e",
    "sourceCommit": "08d8f67ded29355c663b63114c0e640b02cbc484",
    "mimeType": "application/vnd.android.package-archive",
    "observedHTTPContentType": "application/vnd.android.package-archive",
    "signingClass": "Android Debug QA certificate; no production signature or store release",
    "installProof": "ARM64-only APK, signed with an Android Debug QA certificate. Not production-signed or a store release. Code7 to code8 data-preserving upgrade, protected-key OS fingerprint unlock and read-only Auth inventory were verified on an independent emulator. Latest product login was not rerun on code8. Real hardware/Pixel, upgrades from older public code4/code5, current product-session login and complete transfer E2E remain unverified.",
    "releaseBatch": "wallet-static-20260906-r5-android",
    "publicationReceiptSHA256": "d365d51ca0a91b8c625eddc8da8f890f35aeffd2b09bd13f7e9ba8a71a95d8dd",
    "targetPlatform": "android",
    "limitedInstalledEvidence": {
      "latestProductLoginRerun": false,
      "protectedKeyOSFingerprintUnlock": true,
      "readOnlyAuthInventory": true,
      "realHardwareVerified": false,
      "upgradeFromCode7": true
    },
    "version": "1.0.7",
    "versionCode": 8
  },
  "1": {
    "id": "android-107-universal-08d8f67d",
    "architecture": "universal",
    "installation": "apk",
    "artifactPath": "ynx-wallet-1.0.7-testnet-preview-08d8f67d-universal-local-test-signed.apk",
    "sizeBytes": 78715443,
    "sha256": "7de53e6709fbef3577dc6b1342990f7c0d32bb1d2af715d0cce42f8a2d2eb1d9",
    "sourceCommit": "08d8f67ded29355c663b63114c0e640b02cbc484",
    "mimeType": "application/vnd.android.package-archive",
    "observedHTTPContentType": "application/vnd.android.package-archive",
    "signingClass": "Android Debug QA certificate; no production signature or store release",
    "installProof": "Contains arm64-v8a, armeabi-v7a, x86 and x86_64 native libraries. Signed with Android Debug QA certificate; not production-signed or store-released. This same-source versionCode8 universal APK has limited installed upgrade/OS-unlock evidence on an independent ARM64 emulator. Other ABIs and real devices are not asserted as installed-tested. Latest product login was not rerun. Pixel, older public v4/v5 upgrade paths and complete product/transfer E2E remain unverified.",
    "releaseBatch": "wallet-static-20260906-r7-android-universal",
    "publicationReceiptSHA256": "aada092e96d827b946a0aab4e47537739a64ccf0cadbaa7a8296c4bb0372affa",
    "targetPlatform": "android",
    "limitedInstalledEvidence": {
      "latestProductLoginRerun": false,
      "otherABIsInstalledVerified": false,
      "realHardwareVerified": false,
      "sameSourceUniversalInstalledOnArm64Emulator": true
    },
    "version": "1.0.7",
    "versionCode": 8
  },
  "2": {
    "installation": "appimage",
    "sourceCommit": "4e7023c435a90c45cbe0b7539d6d01b5995d5e1c",
    "mimeType": "application/octet-stream",
    "observedHTTPContentType": "application/vnd.appimage",
    "signingClass": "test preview; no production signature or store release",
    "installProof": "Test preview without production-signing or store-release assurance. Native CI is not the user computer. This AppImage was built and hashed only; it was not installed or launched in these CI jobs. Each platform passed 226 source tests. Native installed EXE/DEB checks cover 83 Wallet/SDK runtime files and two visible locked cold starts only. Receive QR display/decoding, complete account creation, authorization callback, signatures and transfers were not verified.",
    "releaseBatch": "wallet-static-20260906-r9-desktop-065",
    "publicationReceiptSHA256": "0c5853d0804944608f8dfcfa024d4214e82f299e7e4a20343eedf22abe09ad10",
    "targetPlatform": "linux",
    "limitedInstalledEvidence": {
      "appImageBuildOnly": true,
      "completeAccountCallbackSigningTransferVerified": false,
      "receiveQRDisplayedAndDecoded": false,
      "sourceTests": 226,
      "thisFormatInstalledOnNativeCI": false,
      "visibleLockedColdLaunches": 0,
      "walletSDKRuntimeSourcesVerified": null
    },
    "version": "0.6.5"
  },
  "3": {
    "sourceCommit": "4e7023c435a90c45cbe0b7539d6d01b5995d5e1c",
    "signingClass": "test preview; no production signature or store release",
    "installProof": "Test preview without production-signing or store-release assurance. Native CI is not the user computer. Each platform passed 226 source tests. Native installed EXE/DEB checks cover 83 Wallet/SDK runtime files and two visible locked cold starts only. Receive QR display/decoding, complete account creation, authorization callback, signatures and transfers were not verified.",
    "releaseBatch": "wallet-static-20260906-r9-desktop-065",
    "publicationReceiptSHA256": "0c5853d0804944608f8dfcfa024d4214e82f299e7e4a20343eedf22abe09ad10",
    "limitedInstalledEvidence": {
      "appImageBuildOnly": false,
      "completeAccountCallbackSigningTransferVerified": false,
      "receiveQRDisplayedAndDecoded": false,
      "sourceTests": 226,
      "thisFormatInstalledOnNativeCI": true,
      "visibleLockedColdLaunches": 2,
      "walletSDKRuntimeSourcesVerified": 83
    },
    "version": "0.6.5"
  },
  "4": {
    "id": "macos-064-e1945298",
    "architecture": "universal",
    "installation": "dmg",
    "artifactPath": "ynx-wallet-macos-0.6.4-universal-testnet-preview.dmg",
    "sizeBytes": 257243798,
    "sha256": "f904e4d32fa949fb936fd69c6aae5e32025564fb864e8a710deb1f93d9ccceef",
    "sourceCommit": "e1945298b843385f9d8d44fd1ccff99c29815ece",
    "mimeType": "application/x-apple-diskimage",
    "observedHTTPContentType": "application/x-apple-diskimage",
    "signingClass": "ad-hoc signature; no Developer ID signature or notarization; Gatekeeper spctl rejected",
    "installProof": "Ad-hoc signature; Gatekeeper spctl assessment rejected. No Developer ID production signature or notarization. This is a test preview, not an ordinary trusted macOS release. Actual DMG installation, embedded source and limited cold locked launch were verified. Current password-unlock, clipboard and full installed account/transfer E2E remain unverified. Amount-unit capability is unknown at the recorded validation checkpoint; sending stays disabled. No public signing/broadcast is asserted.",
    "releaseBatch": "wallet-static-20260906-r6-macos",
    "publicationReceiptSHA256": "f0a82cd4b27a9b4cacf58980bbf60d9f20259f7dd33450e51f718547236c8d40",
    "targetPlatform": "macos",
    "version": "0.6.4",
    "notarized": false,
    "developerIdSigned": false,
    "spctlAccepted": false
  },
  "5": {
    "architecture": "any",
    "sourceCommit": "f90ad909fe30f11ad425adc4871131a82ebc2075",
    "mimeType": "application/zip",
    "observedHTTPContentType": "application/zip",
    "signingClass": "test preview; no production signature or store release",
    "releaseBatch": "wallet-static-20260906-r4c-browser",
    "publicationReceiptSHA256": "4281803c90efeda36a69397f181bda23849484057c89f9c72c0780ded3ad1b29"
  }
};
const FILES = {
  "android": {
    "profile": 0
  },
  "androidUniversal": {
    "profile": 1
  },
  "linuxArm64AppImage": {
    "profile": 2,
    "id": "linux-arm64-appimage-065-4e7023c4",
    "architecture": "arm64",
    "artifactPath": "ynx-wallet-desktop-0.6.5-arm64.AppImage",
    "sizeBytes": 142510542,
    "sha256": "66dde56c9f8da969e9916d72c8929add581b1a0ea0695cd70a2e9fcb3c960a72"
  },
  "linuxX64AppImage": {
    "profile": 2,
    "id": "linux-x64-appimage-065-4e7023c4",
    "architecture": "x64",
    "artifactPath": "ynx-wallet-desktop-0.6.5-x86_64.AppImage",
    "sizeBytes": 143154535,
    "sha256": "3ba16d0372021471e13733425eaa39b155c122175e5bdcbc0e39b2554c199b00"
  },
  "linuxArm64Deb": {
    "profile": 3,
    "id": "linux-arm64-deb-065-4e7023c4",
    "architecture": "arm64",
    "installation": "deb",
    "artifactPath": "ynx-wallet-desktop-0.6.5-arm64.deb",
    "sizeBytes": 89954468,
    "sha256": "fc9489cf621eac69a9e83456d641b2f65da7173ca47972d8e4f552bdcaf61d4f",
    "mimeType": "application/vnd.debian.binary-package",
    "observedHTTPContentType": "application/vnd.debian.binary-package",
    "targetPlatform": "linux"
  },
  "linuxX64Deb": {
    "profile": 3,
    "id": "linux-x64-deb-065-4e7023c4",
    "architecture": "x64",
    "installation": "deb",
    "artifactPath": "ynx-wallet-desktop-0.6.5-amd64.deb",
    "sizeBytes": 95883428,
    "sha256": "3f58a19010ee8b071cf22021df99c0e9b4b288dd1801f07a630ce985684eb397",
    "mimeType": "application/vnd.debian.binary-package",
    "observedHTTPContentType": "application/vnd.debian.binary-package",
    "targetPlatform": "linux"
  },
  "windowsArm64": {
    "profile": 3,
    "id": "windows-arm64-exe-065-4e7023c4",
    "architecture": "arm64",
    "installation": "exe",
    "artifactPath": "ynx-wallet-desktop-0.6.5-arm64.exe",
    "sizeBytes": 114079960,
    "sha256": "c51bcf37f2c3bd50875fd9903c0938950bb5730735f93a8b240cf3ef7aa22740",
    "mimeType": "application/vnd.microsoft.portable-executable",
    "observedHTTPContentType": "application/x-msdownload",
    "targetPlatform": "windows"
  },
  "windowsX64": {
    "profile": 3,
    "id": "windows-x64-exe-065-4e7023c4",
    "architecture": "x64",
    "installation": "exe",
    "artifactPath": "ynx-wallet-desktop-0.6.5-x64.exe",
    "sizeBytes": 114927221,
    "sha256": "c6b4c6ab1562978b697ab17348a92b8940f54c75359e0cf755e4bc8e15518231",
    "mimeType": "application/vnd.microsoft.portable-executable",
    "observedHTTPContentType": "application/x-msdownload",
    "targetPlatform": "windows"
  },
  "macos": {
    "profile": 4
  },
  "pwa": {
    "profile": 5,
    "id": "web-pwa-f90ad90",
    "installation": "zip-archive",
    "artifactPath": "ynx-wallet-pwa-f90ad90-local-qa.zip",
    "sizeBytes": 310065,
    "sha256": "1a5277f178ca205f8e14fdf1eb6ceb6ab2770764ff5e7bac8b33fbbb501d1b2b",
    "installProof": "Current f90ad90 installed UI, permission-upgrade flow and public-sender E2E remain unverified; earlier installed extension evidence is not reused. No browser store release. This is a manual-install test preview, not a store installation. PWA is a static ZIP only; it has no deployed origin, launch URL, installed PWA or Auth callback proof.",
    "targetPlatform": "pwa-archive"
  },
  "chromeEdge": {
    "profile": 5,
    "id": "web-chromium-f90ad90",
    "installation": "extension-unpacked",
    "artifactPath": "ynx-wallet-chrome-edge-f90ad90-local-qa.zip",
    "sizeBytes": 539744,
    "sha256": "061a25cb9b44e6a0e26667b4a46aacffd434780d5c705bea14d4fd7368eab0c5",
    "installProof": "Current f90ad90 installed UI, permission-upgrade flow and public-sender E2E remain unverified; earlier installed extension evidence is not reused. No browser store release. This is a manual-install test preview, not a store installation.",
    "targetPlatform": "web-extension"
  }
};

export const WALLET_PREVIOUS_CANONICAL_DOWNLOADS = Object.fromEntries(Object.entries(FILES).map(([key, { profile, ...file }]) => {
  const item = { ...SHARED, ...PROFILES[profile], ...file };
  return [key, { ...item,
    publicUrl: `https://downloads.ynxweb4.com/wallet/sha256-${item.sha256}/${item.artifactPath}`,
    publicationEvidence: WALLET_CANONICAL_MANIFESTS[1].localPath,
    previewManifest: WALLET_CANONICAL_MANIFESTS[1].url,
    ...(item.targetPlatform === "pwa-archive" ? {} : { sdkManifest: WALLET_CANONICAL_MANIFESTS[0].url })
  }];
}));

export const WALLET_CANONICAL_DOWNLOADS = { ...WALLET_PREVIOUS_CANONICAL_DOWNLOADS, android: WALLET_ANDROID15, androidUniversal: WALLET_ANDROID15 };
