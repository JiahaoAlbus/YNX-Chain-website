import { WALLET_DESKTOP069_WINDOWS_X64 } from "./walletDesktop069.js";

const sha256 = "c4c3882d3693854def331a136200a5ed76be091591ba3c4e180b4e2cf89ad60f";
const artifactPath = "ynx-wallet-desktop-0.6.18-x64.exe";
const releaseTag = "wallet-desktop-testnet-preview-0.6.18-1dd948e98";

// Promote only the original Windows x64 CI installer. All other platform
// selections and the historical 0.6.9 record remain unchanged.
export const WALLET_DESKTOP0618_WINDOWS_X64 = {
  ...WALLET_DESKTOP069_WINDOWS_X64,
  id: "windows-x64-exe-0618-1dd948e98",
  version: "0.6.18",
  sourceCommit: "1dd948e986ef63e0b57374e9f08f45a0abad5141",
  artifactPath,
  sizeBytes: 121092869,
  sha256,
  publicUrl: `https://downloads.ynxweb4.com/wallet/sha256-${sha256}/${artifactPath}`,
  fallbackUrl: `https://github.com/JiahaoAlbus/YNX-Chain/releases/download/${releaseTag}/${artifactPath}`,
  releaseTag,
  publicationEvidence: "/releases/wallet-downloads/20261001-desktop0618-windows-x64.json",
  releaseBatch: releaseTag,
  signingClass: "unsigned Windows x64 Testnet preview; no Authenticode signature or store release",
  installProof: "Original installer passed Windows x64 CI password, backup/import, application restart and upgrade from an existing 0.6.8 account with address and encrypted vault hash preserved. OS reboot, user device, SmartScreen, Defender, WalletConnect Pair and MONSTER remain unverified."
};
