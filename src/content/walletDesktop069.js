import { WALLET_DESKTOP068 } from "./walletDesktop068.js";

const sha256 = "0df01cecc47c4af179d651892623b7936ac6dac52a5d9961212bed90eccde7e1";
const artifactPath = "ynx-wallet-desktop-0.6.9-x64.exe";
const releaseTag = "wallet-desktop-testnet-preview-0.6.9-3045436";

// Only Windows x64 is promoted in this release. Keep 0.6.8 metadata and URLs
// immutable for every other desktop platform and historical downloads.
export const WALLET_DESKTOP069_WINDOWS_X64 = {
  ...WALLET_DESKTOP068.windowsX64,
  version: "0.6.9",
  sourceCommit: "3045436395fe636c91be417f41fc1e4ed2bc7515",
  artifactPath,
  sizeBytes: 120980075,
  sha256,
  publicUrl: `https://downloads.ynxweb4.com/wallet/sha256-${sha256}/${artifactPath}`,
  fallbackUrl: `https://github.com/JiahaoAlbus/YNX-Chain/releases/download/${releaseTag}/${artifactPath}`,
  releaseTag,
  publicationEvidence: "/releases/wallet-downloads/20260925-desktop069-windows-x64.json",
  releaseBatch: releaseTag,
  signingClass: "unsigned Windows x64 Testnet preview; no Authenticode signature or store release",
  installProof: "Native Windows CI: offline accounts, backup/restore, 0.6.8 upgrade, same-installer recheck and non-elevated-token launch. OS reboot, separate standard user, user hardware, SmartScreen, Defender and live transactions unverified."
};
