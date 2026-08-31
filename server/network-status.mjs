const endpoints = Object.freeze({
  status: "https://rpc.ynxweb4.com/status",
  latestBlocks: "https://explorer.ynxweb4.com/api/blocks/latest",
  latestTransactions: "https://explorer.ynxweb4.com/api/txs?limit=5",
  explorer: "https://explorer.ynxweb4.com/health",
  validators: "https://rpc.ynxweb4.com/validators",
  evm: "https://evm.ynxweb4.com",
  faucet: "https://faucet.ynxweb4.com/health",
  ai: "https://ai.ynxweb4.com/health",
  pay: "https://pay.ynxweb4.com/health",
  trust: "https://trust.ynxweb4.com/health",
  resource: "https://resource.ynxweb4.com/health"
});

export async function collectNetworkStatus() {
  const checkedAt = new Date().toISOString();
  // Fetch the identity-bearing endpoints in sequence. The public ingress can
  // throttle concurrent requests from one deployment worker.
  const status = await getJson(endpoints.status);
  const explorer = await getJson(endpoints.explorer);
  const latestBlocks = await getJson(endpoints.latestBlocks);
  const latestTransactions = await getJson(endpoints.latestTransactions);
  const validators = await getJson(endpoints.validators);
  const evm = await getJson(endpoints.evm, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_chainId", params: [] })
  });
  const rpcHeight = Number(status.height);
  const explorerHeight = Number(explorer.rpcHeight);
  // The two public requests are made separately, so a one-block difference can
  // occur while a new block is committed. Anything larger is surfaced as a
  // degraded status instead of being presented as a healthy network.
  const rpcAndExplorerFresh = Number.isFinite(rpcHeight) && Number.isFinite(explorerHeight) && Math.abs(rpcHeight - explorerHeight) <= 1;
  const rpcMatchesExplorer = explorer.ok === true && explorer.network?.chainId === 6423 && explorer.rpcHeight === explorer.indexedHeight && explorer.indexerOk === true && rpcAndExplorerFresh;
  const identityValid = status.chainId === 6423 && status.nativeCurrencySymbol === "YNXT" && evm.result === "0x1917" && rpcMatchesExplorer;
  return {
    ok: identityValid,
    checkedAt,
    status,
    summary: {
      totalTransactions: explorer.indexedTxCount,
      indexedHeight: explorer.indexedHeight,
      indexedBlockCount: explorer.indexedBlockCount,
      syncLagBlocks: explorer.syncLagBlocks,
      error: explorer.error
    },
    explorer,
    latestBlocks,
    latestTransactions,
    validators,
    evm,
    sources: endpoints,
    degraded: !identityValid,
    degradedReason: !rpcMatchesExplorer
      ? (!rpcAndExplorerFresh ? "Public RPC and Explorer are more than one block apart." : "RPC and Explorer Indexer are not both verified for YNX 6423.")
      : undefined
  };
}

export async function collectServiceHealth() {
  const checkedAt = new Date().toISOString();
  const services = {};
  // Keep these sequential as several public hostnames share ingress capacity.
  for (const name of ["faucet", "ai", "pay", "trust", "resource"]) {
    services[name] = await getJson(endpoints[name], {}, 3000);
  }
  return { checkedAt, services };
}

async function getJson(url, init = {}, timeoutMs = 7000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...init, cache: "no-store", signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    return {
      error: error?.name === "AbortError" ? `Timed out after ${timeoutMs / 1000}s` : error.message,
      endpoint: url,
      checkedAt: new Date().toISOString()
    };
  } finally {
    clearTimeout(timeout);
  }
}
