// Published ARM64 QA APK. No universal APK or real-hardware acceptance is inferred.
export const WALLET_ANDROID_MANIFESTS = [
  {
    "url": "https://downloads.ynxweb4.com/wallet/sha256-dd2932d9e67867e167d6a586cad101ead825d7f9e17b7152dcf2cbc0c6825bac/ynx-wallet-downloads.json",
    "sha256": "dd2932d9e67867e167d6a586cad101ead825d7f9e17b7152dcf2cbc0c6825bac",
    "bytes": 685,
    "localPath": "/releases/wallet-downloads/20260906-r5-android/ynx-wallet-downloads.json"
  },
  {
    "url": "https://downloads.ynxweb4.com/wallet/sha256-f14af90c79caac046ee5e283e96c4ebce9d50d323dcaeef9df774594da781cd2/ynx-wallet-download-preview-metadata.json",
    "sha256": "f14af90c79caac046ee5e283e96c4ebce9d50d323dcaeef9df774594da781cd2",
    "bytes": 3324,
    "localPath": "/releases/wallet-downloads/20260906-r5-android/ynx-wallet-download-preview-metadata.json"
  }
];

export const WALLET_ANDROID_DOWNLOADS = {
  "android": {
    "id": "android-107-08d8f67d",
    "version": "1.0.7",
    "versionCode": 8,
    "architecture": "arm64",
    "installation": "apk",
    "artifactPath": "ynx-wallet-1.0.7-testnet-preview-08d8f67d-local-test-signed.apk",
    "sizeBytes": 30977000,
    "sha256": "3ae55a7759bcbd610587cf018bb2de0a3a13a7a7c9100a495a36ad8d6a8dad7e",
    "sourceCommit": "08d8f67ded29355c663b63114c0e640b02cbc484",
    "publicUrl": "https://downloads.ynxweb4.com/wallet/sha256-3ae55a7759bcbd610587cf018bb2de0a3a13a7a7c9100a495a36ad8d6a8dad7e/ynx-wallet-1.0.7-testnet-preview-08d8f67d-local-test-signed.apk",
    "publicationEvidence": "/releases/wallet-downloads/20260906-r5-android/ynx-wallet-download-preview-metadata.json",
    "sdkManifest": "https://downloads.ynxweb4.com/wallet/sha256-dd2932d9e67867e167d6a586cad101ead825d7f9e17b7152dcf2cbc0c6825bac/ynx-wallet-downloads.json",
    "previewManifest": "https://downloads.ynxweb4.com/wallet/sha256-f14af90c79caac046ee5e283e96c4ebce9d50d323dcaeef9df774594da781cd2/ynx-wallet-download-preview-metadata.json",
    "mimeType": "application/vnd.android.package-archive",
    "signingClass": "Android Debug QA certificate; not production signed or store released",
    "installProof": "Code7 to code8 data-preserving upgrade, protected-key OS fingerprint unlock and read-only Auth inventory were verified on an independent emulator. Latest product login was not rerun on code8.",
    "note": "ARM64-only APK, signed with an Android Debug QA certificate. Not production-signed or a store release. Code7 to code8 data-preserving upgrade, protected-key OS fingerprint unlock and read-only Auth inventory were verified on an independent emulator. Latest product login was not rerun on code8. Real hardware/Pixel, upgrades from older public code4/code5, current product-session login and complete transfer E2E remain unverified. 仅 ARM64，使用 Android Debug QA 签名；不是生产签名或商店版本。 已验证独立模拟器上 code7→8 保留数据升级、受保护密钥的系统指纹解锁及只读账户清单；code8 最新产品登录未复验，真机与完整转账流程尚未完成。",
    "releaseBatch": "wallet-static-20260906-r5-android",
    "historicalPreview": false,
    "downloadApproved": true,
    "publicDownloadVerified": true,
    "productionSigned": false,
    "storeReleased": false,
    "fullInstalledE2E": false,
    "newWalletGoalsAccepted": false,
    "pwaDeployed": false,
    "launchURL": null,
    "targetPlatform": "android",
    "limitedInstalledEvidence": {
      "upgradeFromCode7": true,
      "protectedKeyOSFingerprintUnlock": true,
      "readOnlyAuthInventory": true,
      "latestProductLoginRerun": false,
      "realHardwareVerified": false
    }
  }
};
