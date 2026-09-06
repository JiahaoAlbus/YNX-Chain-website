// Explicit download routes retained from the published release configuration.
// Hosting does not establish full wallet functionality or production signing.
export const publishedDownloadPaths = [
  "/downloads/wallet-web/sha256-417d9b9e5babf05fdfdf8161504389eb99c636be75f94444bf4ff91a9b4536b3/ynx-wallet-firefox-0.1.0.zip",
  "/downloads/wallet-web/sha256-63d83cd20925f2d52c0f21f548fa7a857a4d056e03e5fa16244f173164a7d287/ynx-wallet-web-pwa-0.1.0.zip",
  "/downloads/wallet-web/sha256-c733093dea47c6612c8a9d5ecea40be2227f62402f4b4966955c9e1accf4e2aa/ynx-wallet-chrome-edge-0.1.0.zip",
  "/downloads/wallet/sha256-21db36f1c80d4e88520918de141a7f71921817799270ff671db88179023b5591/ynx-wallet-cli-darwin-arm64.gz",
  "/downloads/wallet/sha256-43dfe20665c62f0c963f0d06dc6fca9800d49543b613678a76988879537924c5/ynx-wallet-1.0.0-testnet-preview-8e8d5644-local-test-signed.apk",
  "/downloads/wallet/sha256-66a0954f7955d800af4b205680ce879c786568cbf6af8a71307cddad31c216a0/ynx-wallet-1.0.2-testnet-preview-1f8820c5-local-test-signed.apk",
  "/downloads/wallet/sha256-856b2a260efc43c25f62508dabc6bb6b74b84da71c9b477e8a02a12d17598cd7/ynx-wallet-desktop-0.1.1-x64.exe",
  "/downloads/wallet/sha256-8cf24d83dd5da5851484eab14ce9e6cd16946c95699a7af1e11048bbd7692bea/ynx-wallet-desktop-0.1.0-x86_64.rpm",
  "/downloads/wallet/sha256-929315133c68eda1cabac51cec889c4aeca5e3ee1701578916bc67e096c5dc35/ynx-wallet-desktop-0.1.1-arm64.exe",
  "/downloads/wallet/sha256-99360e01307a64c7faa3060d72474f2fc3d43031fcb59a69751b836faa465e0b/ynx-wallet-1.0.0-testnet-preview-ec0b8295-local-test-signed.apk",
  "/downloads/wallet/sha256-afd686851ef07fbb07823295d07179b79e1a4a078d1b528bc149bd619c8689e0/ynx-wallet-1.0.3-testnet-preview-3ab8c24c-local-test-signed.apk",
  "/downloads/wallet/sha256-ffaf743529ba065c6996da17395c400fd1f0d7869e144a9a2f8d852e07ee8245/ynx-wallet-1.0.1-testnet-preview-c9d53912-local-test-signed.apk",
  "/downloads/ynx-developer-testnet-preview-macos-unsigned.zip",
  "/downloads/ynx-developer-testnet-preview-windows-x64-unsigned.zip",
  "/downloads/ynx-exchange-1.0.0-testnet-preview-1e5f48d2-test-signed.apk",
  "/downloads/ynx-finance-1.2.0-testnet-preview-307273b9-test-signed.apk",
  "/downloads/ynx-social-1.0.0-testnet-preview-aa852496-test-signed.apk",
  "/downloads/ynx-trust-center-4d40557229b4-linux-amd64.tar.gz",
  "https://downloads.ynxweb4.com/wallet/sha256-69b4fa5db7b8a9ab105af6633de44f5a5a4a9fceeaa0925a306f77b22381b044/ynx-wallet-macos-0.1.2-universal.dmg"
];

export const publishedDownloadMetadata = {
  "https://downloads.ynxweb4.com/wallet/sha256-69b4fa5db7b8a9ab105af6633de44f5a5a4a9fceeaa0925a306f77b22381b044/ynx-wallet-macos-0.1.2-universal.dmg": {
    "version": "0.1.2",
    "sizeBytes": 237777236,
    "sha256": "69b4fa5db7b8a9ab105af6633de44f5a5a4a9fceeaa0925a306f77b22381b044",
    "sourceCommit": "5a6b033897a1295d35fc325a92c6bb81c8b04a19",
    "signingClass": "unsigned; not store released",
    "installProof": "Launch and rejection verified; authorization approval, balance, signing and transfer not verified.",
    "publicationEvidence": "/releases/wallet-desktop/5a6b033897a1/macos-native-callback-dmg-publication.json"
  },
  "/downloads/wallet/sha256-856b2a260efc43c25f62508dabc6bb6b74b84da71c9b477e8a02a12d17598cd7/ynx-wallet-desktop-0.1.1-x64.exe": {
    "version": "0.1.1",
    "sizeBytes": 104334744,
    "sha256": "856b2a260efc43c25f62508dabc6bb6b74b84da71c9b477e8a02a12d17598cd7",
    "sourceCommit": "a8f36e4c57234efe5f19367c87035b4435d61b76",
    "signingClass": "unsigned; not store released",
    "installProof": "Install and launch lifecycle recorded; account, signing and transfer not verified.",
    "publicationEvidence": "/releases/wallet-desktop/a8f36e4c5723/windows-x64-exe-publication.json"
  },
  "/downloads/wallet/sha256-929315133c68eda1cabac51cec889c4aeca5e3ee1701578916bc67e096c5dc35/ynx-wallet-desktop-0.1.1-arm64.exe": {
    "version": "0.1.1",
    "sizeBytes": 103487635,
    "sha256": "929315133c68eda1cabac51cec889c4aeca5e3ee1701578916bc67e096c5dc35",
    "sourceCommit": "a8f36e4c57234efe5f19367c87035b4435d61b76",
    "signingClass": "unsigned; not store released",
    "installProof": "Install and launch lifecycle recorded; account, signing and transfer not verified.",
    "publicationEvidence": "/releases/wallet-desktop/a8f36e4c5723/windows-arm64-exe-publication.json"
  },
  "/downloads/wallet/sha256-afd686851ef07fbb07823295d07179b79e1a4a078d1b528bc149bd619c8689e0/ynx-wallet-1.0.3-testnet-preview-3ab8c24c-local-test-signed.apk": {
    "sizeBytes": 78233954,
    "sha256": "afd686851ef07fbb07823295d07179b79e1a4a078d1b528bc149bd619c8689e0",
    "signingClass": "local-test-signed",
    "installProof": "Android API 36 arm64 emulator install, two cold launches, biometric unlock, and authoritative Testnet balance 23 YNXT / nonce 1 / 2 activities recorded against this source.",
    "version": "1.0.3-testnet-preview-3ab8c24c",
    "sourceCommit": "3ab8c24cac04b8a5a745cdf8736cf0bffbd88274",
    "publicationEvidence": "/releases/wallet/3ab8c24c/product-release.json"
  }
};
