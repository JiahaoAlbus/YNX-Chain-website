const DEFAULTS = {
  apiBase: "https://rpc.ynxweb4.com",
  evmRpc: "https://evm.ynxweb4.com",
  explorerUrl: "https://explorer.ynxweb4.com",
	monitorUrl: "https://monitor.ynxweb4.com",
  faucetUrl: "https://faucet.ynxweb4.com",
  docsUrl: "/docs",
  docsRepoUrl: "https://github.com/JiahaoAlbus/YNX-Chain/tree/main/docs",
  grantUrl: "https://github.com/JiahaoAlbus/YNX-Chain/tree/main/docs/grants",
  ecosystemUrl: "/dapp",
  ecosystemRepoUrl: "https://github.com/JiahaoAlbus/YNX-Chain/tree/main/docs/ecosystem",
  exchangeUrl: "/trading",
  exchangeRepoUrl: "https://github.com/JiahaoAlbus/YNX-Chain/tree/main/docs/exchange-listing"
};

export const apiConfig = Object.freeze({
  apiBase: trim(import.meta.env.VITE_YNX_API_BASE_URL || DEFAULTS.apiBase),
  evmRpc: trim(import.meta.env.VITE_YNX_EVM_RPC_URL || DEFAULTS.evmRpc),
  explorerUrl: trim(import.meta.env.VITE_YNX_EXPLORER_URL || DEFAULTS.explorerUrl),
	monitorUrl: trim(import.meta.env.VITE_YNX_MONITOR_URL || DEFAULTS.monitorUrl),
  faucetUrl: trim(import.meta.env.VITE_YNX_FAUCET_URL || DEFAULTS.faucetUrl),
  docsUrl: normalizePath(trim(import.meta.env.VITE_YNX_DOCS_URL || DEFAULTS.docsUrl), DEFAULTS.docsRepoUrl),
  grantUrl: trim(import.meta.env.VITE_YNX_GRANT_URL || DEFAULTS.grantUrl),
  docsRepoUrl: DEFAULTS.docsRepoUrl,
  ecosystemUrl: normalizePath(trim(import.meta.env.VITE_YNX_ECOSYSTEM_URL || DEFAULTS.ecosystemUrl), DEFAULTS.ecosystemRepoUrl),
  ecosystemRepoUrl: DEFAULTS.ecosystemRepoUrl,
  exchangeUrl: normalizePath(trim(import.meta.env.VITE_YNX_EXCHANGE_URL || DEFAULTS.exchangeUrl), DEFAULTS.exchangeRepoUrl),
  exchangeRepoUrl: DEFAULTS.exchangeRepoUrl
});

export async function loadJson(pathOrUrl, options = {}) {
  const url = absolute(pathOrUrl) ? pathOrUrl : `${apiConfig.apiBase}${pathOrUrl}`;
  return requestJson(url, options);
}

export async function loadEvmChainId(options = {}) {
  return requestJson(apiConfig.evmRpc, {
    ...options,
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_chainId", params: [] })
  });
}

export async function loadNetworkSnapshot() {
  return requestJson(`${window.location.origin}/api/network/status`, { timeoutMs: 20000 });
}

export async function loadServiceHealth() {
  return requestJson(`${window.location.origin}/api/services/health`, { timeoutMs: 20000 });
}

export function networkParams() {
  return {
    chainId: "0x1917",
    chainName: "YNX Testnet",
    nativeCurrency: { name: "YNXT", symbol: "YNXT", decimals: 18 },
    rpcUrls: [apiConfig.evmRpc],
    blockExplorerUrls: [apiConfig.explorerUrl]
  };
}

async function requestJson(url, { timeoutMs = 8000, ...init } = {}) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...init, cache: "no-store", signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    const message = error?.name === "AbortError" ? `Timed out after ${timeoutMs / 1000}s` : error.message;
    return { error: message, endpoint: url, checkedAt: new Date().toISOString() };
  } finally {
    window.clearTimeout(timer);
  }
}

function trim(value) {
  return value.replace(/\/$/, "");
}

function normalizePath(candidate, fallbackExternal) {
  if (!candidate) {
    return fallbackExternal;
  }
  return candidate.startsWith("/") ? candidate : fallbackExternal;
}

function absolute(value) {
  return /^https?:\/\//i.test(value);
}
