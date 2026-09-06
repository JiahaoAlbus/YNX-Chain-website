// Static preview archives only. SDK schema 1 has no PWA format; PWA provenance comes from the preview manifest.
export const WALLET_BROWSER_MANIFESTS = [
  {
    "url": "https://downloads.ynxweb4.com/wallet/sha256-7b5a3ecfec00501cbd0ab387c1e14e1cc6f6cc77689bad0c74cbe8fd316f0399/ynx-wallet-downloads.json",
    "sha256": "7b5a3ecfec00501cbd0ab387c1e14e1cc6f6cc77689bad0c74cbe8fd316f0399",
    "bytes": 644,
    "localPath": "/releases/wallet-downloads/20260906-r4c-browser/ynx-wallet-downloads.json"
  },
  {
    "url": "https://downloads.ynxweb4.com/wallet/sha256-814574df0d3e8e689d10446ee7358938a1ce407afcee249be1b5ba7d0a964887/ynx-wallet-download-preview-metadata.json",
    "sha256": "814574df0d3e8e689d10446ee7358938a1ce407afcee249be1b5ba7d0a964887",
    "bytes": 5256,
    "localPath": "/releases/wallet-downloads/20260906-r4c-browser/ynx-wallet-download-preview-metadata.json"
  }
];

export const WALLET_BROWSER_DOWNLOADS = {
  "chromeEdge": {
    "id": "web-chromium-f90ad90",
    "architecture": "any",
    "installation": "extension-unpacked",
    "artifactPath": "ynx-wallet-chrome-edge-f90ad90-local-qa.zip",
    "sizeBytes": 539744,
    "sha256": "061a25cb9b44e6a0e26667b4a46aacffd434780d5c705bea14d4fd7368eab0c5",
    "sourceCommit": "f90ad909fe30f11ad425adc4871131a82ebc2075",
    "publicUrl": "https://downloads.ynxweb4.com/wallet/sha256-061a25cb9b44e6a0e26667b4a46aacffd434780d5c705bea14d4fd7368eab0c5/ynx-wallet-chrome-edge-f90ad90-local-qa.zip",
    "publicationEvidence": "/releases/wallet-downloads/20260906-r4c-browser/ynx-wallet-download-preview-metadata.json",
    "previewManifest": "https://downloads.ynxweb4.com/wallet/sha256-814574df0d3e8e689d10446ee7358938a1ce407afcee249be1b5ba7d0a964887/ynx-wallet-download-preview-metadata.json",
    "mimeType": "application/zip",
    "signingClass": "unsigned; not production signed or store released",
    "installProof": "No browser store release. This is a manual-install test preview, not a store installation.",
    "note": "Current f90ad90 installed UI, permission-upgrade flow and public-sender E2E remain unverified; earlier installed extension evidence is not reused. No browser store release. This is a manual-install test preview, not a store installation. 新版安装界面、权限升级与公开发送全流程尚未验证；旧版本实装证据不能替代。当前为手动安装测试预览，尚未上架。",
    "releaseBatch": "wallet-static-20260906-r4c-browser",
    "historicalPreview": false,
    "downloadApproved": true,
    "publicDownloadVerified": true,
    "productionSigned": false,
    "storeReleased": false,
    "fullInstalledE2E": false,
    "newWalletGoalsAccepted": false,
    "pwaDeployed": false,
    "launchURL": null,
    "targetPlatform": "web-extension",
    "sdkManifest": "https://downloads.ynxweb4.com/wallet/sha256-7b5a3ecfec00501cbd0ab387c1e14e1cc6f6cc77689bad0c74cbe8fd316f0399/ynx-wallet-downloads.json"
  },
  "pwa": {
    "id": "web-pwa-f90ad90",
    "architecture": "any",
    "installation": "zip-archive",
    "artifactPath": "ynx-wallet-pwa-f90ad90-local-qa.zip",
    "sizeBytes": 310065,
    "sha256": "1a5277f178ca205f8e14fdf1eb6ceb6ab2770764ff5e7bac8b33fbbb501d1b2b",
    "sourceCommit": "f90ad909fe30f11ad425adc4871131a82ebc2075",
    "publicUrl": "https://downloads.ynxweb4.com/wallet/sha256-1a5277f178ca205f8e14fdf1eb6ceb6ab2770764ff5e7bac8b33fbbb501d1b2b/ynx-wallet-pwa-f90ad90-local-qa.zip",
    "publicationEvidence": "/releases/wallet-downloads/20260906-r4c-browser/ynx-wallet-download-preview-metadata.json",
    "previewManifest": "https://downloads.ynxweb4.com/wallet/sha256-814574df0d3e8e689d10446ee7358938a1ce407afcee249be1b5ba7d0a964887/ynx-wallet-download-preview-metadata.json",
    "mimeType": "application/zip",
    "signingClass": "unsigned; not production signed or store released",
    "installProof": "PWA is a static ZIP only; it has no deployed origin, launch URL, installed PWA or Auth callback proof.",
    "note": "Current f90ad90 installed UI, permission-upgrade flow and public-sender E2E remain unverified; earlier installed extension evidence is not reused. No browser store release. This is a manual-install test preview, not a store installation. 新版安装界面、权限升级与公开发送全流程尚未验证；旧版本实装证据不能替代。当前为手动安装测试预览，尚未上架。 PWA is a static ZIP only; it has no deployed origin, launch URL, installed PWA or Auth callback proof. PWA 仅提供静态 ZIP；尚未部署可安装入口，也没有已安装 PWA 或 Auth 回调验证。",
    "releaseBatch": "wallet-static-20260906-r4c-browser",
    "historicalPreview": false,
    "downloadApproved": true,
    "publicDownloadVerified": true,
    "productionSigned": false,
    "storeReleased": false,
    "fullInstalledE2E": false,
    "newWalletGoalsAccepted": false,
    "pwaDeployed": false,
    "launchURL": null,
    "targetPlatform": "pwa-archive"
  }
};
