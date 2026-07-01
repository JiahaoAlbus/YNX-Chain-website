export const apiConfig = {
  apiBase: import.meta.env.VITE_YNX_API_BASE_URL || "http://127.0.0.1:6420",
  evmRpc: import.meta.env.VITE_YNX_EVM_RPC_URL || `${import.meta.env.VITE_YNX_API_BASE_URL || "http://127.0.0.1:6420"}/evm`,
  explorerUrl: import.meta.env.VITE_YNX_EXPLORER_URL || "",
  faucetUrl: import.meta.env.VITE_YNX_FAUCET_URL || "",
  docsUrl: import.meta.env.VITE_YNX_DOCS_URL || "",
  grantUrl: import.meta.env.VITE_YNX_GRANT_URL || "",
  ecosystemUrl: import.meta.env.VITE_YNX_ECOSYSTEM_URL || "",
  exchangeUrl: import.meta.env.VITE_YNX_EXCHANGE_URL || ""
};

export async function loadJson(pathOrUrl) {
  const url = pathOrUrl.startsWith("http") ? pathOrUrl : `${apiConfig.apiBase}${pathOrUrl}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    return { error: error.message, endpoint: url, checkedAt: new Date().toISOString() };
  }
}

export async function loadEvmChainId() {
  try {
    const res = await fetch(apiConfig.evmRpc, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_chainId", params: [] })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    return { error: error.message, endpoint: apiConfig.evmRpc, checkedAt: new Date().toISOString() };
  }
}

export function networkParams() {
  return {
    chainId: "0x1917",
    chainName: "YNX Testnet",
    nativeCurrency: { name: "YNXT", symbol: "YNXT", decimals: 18 },
    rpcUrls: [apiConfig.evmRpc],
    blockExplorerUrls: apiConfig.explorerUrl ? [apiConfig.explorerUrl] : []
  };
}
