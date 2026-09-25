import { WALLET_DESKTOP069_WINDOWS_X64 } from "./walletDesktop069.js";

const sha256 = "c7f76121988f58e88979e049f820514bc352c039850e8251b86ae10badefb4f8";
const artifactPath = "ynx-wallet-desktop-0.6.10-x64.exe";
const releaseTag = "wallet-desktop-testnet-preview-0.6.10-ffaf3ca0";

// Promote only the original Windows x64 CI installer. All other platform
// selections and the historical 0.6.9 record remain unchanged.
export const WALLET_DESKTOP0610_WINDOWS_X64 = {
  ...WALLET_DESKTOP069_WINDOWS_X64,
  id: "windows-x64-exe-0610-ffaf3ca0",
  version: "0.6.10",
  sourceCommit: "ffaf3ca0d85f81622e6b1ba20c7648abb09a2574",
  artifactPath,
  sizeBytes: 121050861,
  sha256,
  publicUrl: `https://downloads.ynxweb4.com/wallet/sha256-${sha256}/${artifactPath}`,
  fallbackUrl: `https://github.com/JiahaoAlbus/YNX-Chain/releases/download/${releaseTag}/${artifactPath}`,
  releaseTag,
  publicationEvidence: "/releases/wallet-downloads/20260925-desktop0610-windows-x64.json",
  releaseBatch: releaseTag,
  signingClass: "unsigned Windows x64 Testnet preview; no Authenticode signature or store release",
  installProof: "Original installer passed native Windows CI upgrades from 0.6.8 and 0.6.9 with address and encrypted vault hash preserved. OS reboot, user machine, failed-profile recovery, SmartScreen, Defender and live transactions remain unverified."
};
