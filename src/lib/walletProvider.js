export function walletKind(provider, info = {}) {
  if (provider?.isYNXWallet === true && provider?.isMetaMask !== true) return "YNX Wallet";
  if (provider?.isMetaMask === true && provider?.isYNXWallet !== true) return "MetaMask";
  return info.name || "Compatible EIP-1193 wallet";
}
