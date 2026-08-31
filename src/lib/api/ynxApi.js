export const YNX_6423 = Object.freeze({
  cosmosChainId: "ynx_6423-1",
  chainId: 6423,
  evmChainId: "0x1917",
  networkName: "YNX Testnet",
  nativeCurrency: Object.freeze({ name: "YNXT", symbol: "YNXT", decimals: 18 }),
  mainnet: false,
  services: Object.freeze({
    rpc: "https://rpc.ynxweb4.com",
    evm: "https://evm.ynxweb4.com",
    explorer: "https://explorer.ynxweb4.com",
    faucet: "https://faucet.ynxweb4.com",
    monitor: "https://monitor.ynxweb4.com",
    gateway: "https://api.ynxweb4.com"
  })
});

// The canonical public-service directory is intentionally descriptive as well
// as executable. UI and server adapters consume this same source so a service
// cannot silently drift to an old chain, host, cache policy, or health route.
export const YNX_SERVICE_DIRECTORY = Object.freeze({
  rpc: Object.freeze({ name: "Chain RPC", officialUrl: YNX_6423.services.rpc, healthEndpoint: `${YNX_6423.services.rpc}/status`, expectedChainId: 6423, schema: "ynx-rpc-status/v1", timeoutMs: 7000, cache: "no-store", degraded: "Show unavailable; do not reuse cached height.", validatorsEndpoint: `${YNX_6423.services.rpc}/validators` }),
  evm: Object.freeze({ name: "EVM JSON-RPC", officialUrl: YNX_6423.services.evm, healthEndpoint: YNX_6423.services.evm, expectedChainId: "0x1917", schema: "JSON-RPC 2.0 eth_chainId", timeoutMs: 7000, cache: "no-store", degraded: "Show unavailable; do not claim EVM compatibility." }),
  explorer: Object.freeze({ name: "YNX Explorer", officialUrl: YNX_6423.services.explorer, healthEndpoint: `${YNX_6423.services.explorer}/health`, expectedChainId: 6423, schema: "ynx-explorer-health/v1", timeoutMs: 7000, cache: "no-store", degraded: "Show degraded; keep full record lookup in the independent Explorer.", latestBlocksEndpoint: `${YNX_6423.services.explorer}/api/blocks/latest`, latestTransactionsEndpoint: `${YNX_6423.services.explorer}/api/txs?limit=5` }),
  faucet: Object.freeze({ name: "YNXT Faucet", officialUrl: YNX_6423.services.faucet, healthEndpoint: `${YNX_6423.services.faucet}/health`, expectedChainId: 6423, schema: "ynx-faucet-health/v1", timeoutMs: 3000, cache: "no-store", degraded: "Disable requests and explain that test assets are unavailable." }),
  monitor: Object.freeze({ name: "YNX Monitor", officialUrl: YNX_6423.services.monitor, healthEndpoint: null, expectedChainId: 6423, schema: "signed public status projection", timeoutMs: 7000, cache: "no-store", degraded: "Offer the Monitor entry without inferring private operations health." }),
  gateway: Object.freeze({ name: "YNX Gateway", officialUrl: YNX_6423.services.gateway, healthEndpoint: null, expectedChainId: 6423, schema: "product gateway health", timeoutMs: 3000, cache: "no-store", degraded: "Mark product capability unavailable independently of chain health." }),
  ai: Object.freeze({ name: "YNX AI", officialUrl: "https://ai.ynxweb4.com", healthEndpoint: "https://ai.ynxweb4.com/health", expectedChainId: 6423, schema: "product health", timeoutMs: 3000, cache: "no-store", degraded: "Show service unavailable; never synthesize an AI response." }),
  pay: Object.freeze({ name: "YNX Pay", officialUrl: "https://pay.ynxweb4.com", healthEndpoint: "https://pay.ynxweb4.com/health", expectedChainId: 6423, schema: "product health", timeoutMs: 3000, cache: "no-store", degraded: "Show service unavailable; do not present settlement as successful." }),
  trust: Object.freeze({ name: "YNX Trust Center", officialUrl: "https://trust.ynxweb4.com", healthEndpoint: "https://trust.ynxweb4.com/health", expectedChainId: 6423, schema: "product health", timeoutMs: 3000, cache: "no-store", degraded: "Show service unavailable; do not make a trust decision." }),
  resource: Object.freeze({ name: "YNX Resource Market", officialUrl: "https://resource.ynxweb4.com", healthEndpoint: "https://resource.ynxweb4.com/health", expectedChainId: 6423, schema: "product health", timeoutMs: 3000, cache: "no-store", degraded: "Show service unavailable; do not confirm a quote or settlement." })
});

const env = import.meta.env || {};

const DEFAULTS = {
  apiBase: YNX_SERVICE_DIRECTORY.rpc.officialUrl,
  evmRpc: YNX_SERVICE_DIRECTORY.evm.officialUrl,
  explorerUrl: YNX_SERVICE_DIRECTORY.explorer.officialUrl,
	monitorUrl: YNX_SERVICE_DIRECTORY.monitor.officialUrl,
  faucetUrl: YNX_SERVICE_DIRECTORY.faucet.officialUrl,
  docsUrl: "/docs",
  docsRepoUrl: "https://github.com/JiahaoAlbus/YNX-Chain/tree/main/docs",
  grantUrl: "https://github.com/JiahaoAlbus/YNX-Chain/tree/main/docs/grants",
  ecosystemUrl: "/dapp",
  ecosystemRepoUrl: "https://github.com/JiahaoAlbus/YNX-Chain/tree/main/docs/ecosystem",
  exchangeUrl: "/trading",
  exchangeRepoUrl: "https://github.com/JiahaoAlbus/YNX-Chain/tree/main/docs/exchange-listing"
};

export const apiConfig = Object.freeze({
  apiBase: trim(env.VITE_YNX_API_BASE_URL || DEFAULTS.apiBase),
  evmRpc: trim(env.VITE_YNX_EVM_RPC_URL || DEFAULTS.evmRpc),
  explorerUrl: trim(env.VITE_YNX_EXPLORER_URL || DEFAULTS.explorerUrl),
	monitorUrl: trim(env.VITE_YNX_MONITOR_URL || DEFAULTS.monitorUrl),
  faucetUrl: trim(env.VITE_YNX_FAUCET_URL || DEFAULTS.faucetUrl),
  docsUrl: normalizePath(trim(env.VITE_YNX_DOCS_URL || DEFAULTS.docsUrl), DEFAULTS.docsRepoUrl),
  grantUrl: trim(env.VITE_YNX_GRANT_URL || DEFAULTS.grantUrl),
  docsRepoUrl: DEFAULTS.docsRepoUrl,
  ecosystemUrl: normalizePath(trim(env.VITE_YNX_ECOSYSTEM_URL || DEFAULTS.ecosystemUrl), DEFAULTS.ecosystemRepoUrl),
  ecosystemRepoUrl: DEFAULTS.ecosystemRepoUrl,
  exchangeUrl: normalizePath(trim(env.VITE_YNX_EXCHANGE_URL || DEFAULTS.exchangeUrl), DEFAULTS.exchangeRepoUrl),
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
    chainId: YNX_6423.evmChainId,
    chainName: YNX_6423.networkName,
    nativeCurrency: YNX_6423.nativeCurrency,
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
    return { error: message, checkedAt: new Date().toISOString() };
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
