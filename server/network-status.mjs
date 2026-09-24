import { YNX_SERVICE_DIRECTORY } from "../src/lib/api/ynxApi.js";

const endpoints = Object.freeze({
  status: YNX_SERVICE_DIRECTORY.rpc.healthEndpoint,
  latestBlocks: YNX_SERVICE_DIRECTORY.explorer.latestBlocksEndpoint,
  latestTransactions: YNX_SERVICE_DIRECTORY.explorer.latestTransactionsEndpoint,
  explorer: YNX_SERVICE_DIRECTORY.explorer.healthEndpoint,
  validators: YNX_SERVICE_DIRECTORY.rpc.validatorsEndpoint,
  evm: YNX_SERVICE_DIRECTORY.evm.healthEndpoint,
  faucet: YNX_SERVICE_DIRECTORY.faucet.healthEndpoint,
  ai: YNX_SERVICE_DIRECTORY.ai.healthEndpoint,
  pay: YNX_SERVICE_DIRECTORY.pay.healthEndpoint,
  trust: YNX_SERVICE_DIRECTORY.trust.healthEndpoint,
  resource: YNX_SERVICE_DIRECTORY.resource.healthEndpoint
});

const inFlight = new Map();
let activeUpstream = 0;
const upstreamQueue = [];

async function acquireUpstream() {
  if (activeUpstream < 2) { activeUpstream++; return; }
  await new Promise(resolve => upstreamQueue.push(resolve));
}

function releaseUpstream() {
  const next = upstreamQueue.shift();
  // Transfer the reserved slot directly, so a new arrival cannot overtake it.
  if (next) next();
  else activeUpstream--;
}

function singleFlight(key, collect) {
  if (!inFlight.has(key)) {
    const promise = Promise.resolve().then(collect).finally(() => inFlight.delete(key));
    inFlight.set(key, promise);
  }
  return inFlight.get(key);
}

async function limited(tasks, concurrency = 2) {
  const results = [], queue = tasks.map((task, index) => ({ task, index }));
  const worker = async () => { while (queue.length) { const { task, index } = queue.shift(); results[index] = await task(); } };
  await Promise.all(Array.from({ length: Math.min(concurrency, tasks.length) }, worker));
  return results;
}

export function collectNetworkStatus({ detailed = true } = {}) {
  return singleFlight(detailed ? "network-detail" : "network-summary", () => collectNetwork(detailed));
}

async function collectNetwork(detailed) {
  const checkedAt = new Date().toISOString();
  // Concurrent visitors share only the in-flight collection, never a completed
  // result. The process-wide semaphore also bounds different variants together.
  const [statusRead, explorerRead, evmRead] = await limited([
    () => getObservedJson(endpoints.status),
    () => getObservedJson(endpoints.explorer),
    () => getObservedJson(endpoints.evm, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_chainId", params: [] })
    })
  ]);
  const status = statusRead.body;
  const explorer = explorerRead.body;
  const evm = evmRead.body;
  const [latestBlocks, latestTransactions, validators] = detailed ? await limited([
    () => getJson(endpoints.latestBlocks),
    () => getJson(endpoints.latestTransactions),
    () => getJson(endpoints.validators)
  ]) : [{}, {}, {}];
  const rpcHeight = status.height;
  const explorerHeight = explorer.rpcHeight;
  // The two public requests are made separately, so a one-block difference can
  // occur while a new block is committed. Anything larger is surfaced as a
  // degraded status instead of being presented as a healthy network.
  const rpcAndExplorerFresh = Number.isSafeInteger(rpcHeight) && Number.isSafeInteger(explorerHeight) && Math.abs(rpcHeight - explorerHeight) <= 1;
  const chainVerified = status.chainId === 6423 && status.nativeCurrencySymbol === "YNXT" && evm.result === "0x1917";
  const indexerVerified = explorer.ok === true && explorer.network?.chainId === 6423 && explorer.rpcHeight === explorer.indexedHeight && explorer.indexerOk === true && rpcAndExplorerFresh;
  const identityValid = chainVerified && indexerVerified;
  const indexedHeight = explorer.indexedHeight;
  const indexerLagBlocks = Number.isSafeInteger(rpcHeight) && Number.isSafeInteger(indexedHeight) ? Math.max(0, rpcHeight - indexedHeight) : null;
  const blockTime = Date.parse(status.latestBlockTime);
  const blockAgeMs = Number.isFinite(blockTime) && blockTime <= Date.now() + 5000 ? Math.max(0, Date.now() - blockTime) : null;
  return {
    ok: identityValid,
    checkedAt,
    status,
    chainVerified,
    indexerVerified,
    indexerLagBlocks,
    observations: {
      rpcCollectionMs: statusRead.collectionMs,
      explorerCollectionMs: explorerRead.collectionMs,
      evmCollectionMs: evmRead.collectionMs,
      blockAgeMs
    },
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
    serviceDirectory: Object.fromEntries(Object.entries(YNX_SERVICE_DIRECTORY).map(([name, service]) => [name, {
      name: service.name,
      officialUrl: service.officialUrl,
      compatibilityUrl: name === "rpc" ? "https://rpc.ynxweb4.com" : name === "evm" ? "https://evm.ynxweb4.com" : null,
      healthEndpoint: service.healthEndpoint,
      expectedChainId: service.expectedChainId,
      schema: service.schema,
      timeoutMs: service.timeoutMs,
      cache: service.cache,
      degraded: service.degraded,
      lastVerifiedAt: checkedAt
    }])),
    degraded: !identityValid,
    degradedReason: !chainVerified ? "Public RPC and EVM chain identity are not both verified for YNX 6423."
      : !indexerVerified ? (!rpcAndExplorerFresh ? "Public RPC and Explorer are more than one block apart." : "Explorer Indexer is not verified and aligned with YNX 6423.")
      : undefined
  };
}

export function collectServiceHealth() {
  return singleFlight("services", collectServices);
}
async function collectServices() {
  const checkedAt = new Date().toISOString();
  const services = {};
  const names = ["faucet", "ai", "pay", "trust", "resource"];
  const values = await limited(names.map(name => () => getJson(endpoints[name], {}, 2500)));
  names.forEach((name, index) => { services[name] = values[index]; });
  return { checkedAt, services };
}

async function getJson(url, init = {}, timeoutMs = 3500) {
  await acquireUpstream();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...init, cache: "no-store", signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const body = await response.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("Invalid JSON object");
    return body;
  } catch (error) {
    return {
      error: error?.name === "AbortError" ? `Timed out after ${timeoutMs / 1000}s` : error.message,
      checkedAt: new Date().toISOString()
    };
  } finally {
    clearTimeout(timeout);
    releaseUpstream();
  }
}

async function getObservedJson(url, init = {}, timeoutMs = 3500) {
  const started = performance.now();
  const body = await getJson(url, init, timeoutMs);
  // Includes any wait for the bounded collector slot; not a claim about network RTT.
  return { body, collectionMs: Math.round(performance.now() - started) };
}
