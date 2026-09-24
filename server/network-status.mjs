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
const collectorFailure = Symbol("collectorFailure");
const PROGRESSION_WINDOW_MS = 10_000;
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

export function collectNetworkStatus({ detailed = true, waitForProgression = ms => new Promise(resolve => setTimeout(resolve, ms)) } = {}) {
  return singleFlight(detailed ? "network-detail" : "network-summary", () => collectNetwork(detailed, waitForProgression));
}

async function collectNetwork(detailed, waitForProgression) {
  // Concurrent visitors share only the in-flight collection, never a completed
  // result. The process-wide semaphore also bounds different variants together.
  // Two bounded REST observations prove growth without guessing a block-time SLA.
  // A missing or inconclusive second observation is not evidence of a stopped chain.
  const initialStatusRead = await getObservedJson(endpoints.status);
  if (validBlockSample(initialStatusRead.body)) await waitForProgression(PROGRESSION_WINDOW_MS);
  const [statusRead, explorerRead, evmRead] = await limited([
    () => getObservedJson(endpoints.status),
    () => getObservedJson(endpoints.explorer),
    () => getObservedJson(endpoints.evm, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_chainId", params: [] })
    }, 8000)
  ]);
  const status = statusRead.body;
  const explorer = explorerRead.body;
  const evm = evmRead.body;
  const checkedAt = new Date().toISOString();
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
  const progressionState = blockProgression(initialStatusRead.body, status);
  const progressionVerified = progressionState === "observed";
  const indexedHeight = explorer.indexedHeight;
  const indexerLagBlocks = status.chainId === 6423 && explorer.network?.chainId === 6423 && Number.isSafeInteger(rpcHeight) && rpcHeight >= 0 && Number.isSafeInteger(indexedHeight) && indexedHeight >= 0 ? Math.max(0, rpcHeight - indexedHeight) : null;
  const blockTime = Date.parse(status.latestBlockTime);
  const blockAgeMs = validBlockSample(status) ? Math.max(0, Date.now() - blockTime) : null;
  return {
    ok: identityValid && progressionVerified,
    checkedAt,
    status,
    chainVerified,
    indexerVerified,
    progressionVerified,
    indexerLagBlocks,
    observations: {
      rpcCollectionMs: statusRead.collectionMs,
      rpcReadState: statusRead.readState,
      initialRpcCollectionMs: initialStatusRead.collectionMs,
      initialRpcReadState: initialStatusRead.readState,
      explorerCollectionMs: explorerRead.collectionMs,
      explorerReadState: explorerRead.readState,
      evmCollectionMs: evmRead.collectionMs,
      evmReadState: evmRead.readState,
      progressionState,
      progressionWindowMs: validBlockSample(initialStatusRead.body) ? PROGRESSION_WINDOW_MS : null,
      progressionFromHeight: validBlockSample(initialStatusRead.body) ? initialStatusRead.body.height : null,
      progressionToHeight: validBlockSample(status) ? status.height : null,
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
    degraded: !identityValid || !progressionVerified,
    degradedReason: !chainVerified ? "Public RPC and EVM chain identity are not both verified for YNX 6423."
      : !indexerVerified ? (!rpcAndExplorerFresh ? "Public RPC and Explorer are more than one block apart." : "Explorer Indexer is not verified and aligned with YNX 6423.")
      : !progressionVerified ? "Block progression was not verified in the bounded observation window; this does not by itself prove a stopped chain."
      : undefined
  };
}

function validBlockSample(status) {
  const blockTime = Date.parse(status.latestBlockTime);
  return status.chainId === 6423 && status.nativeCurrencySymbol === "YNXT" && Number.isSafeInteger(status.height) && status.height > 0 && /^[0-9a-f]{64}$/i.test(status.latestBlockHash ?? "") && Number.isFinite(blockTime) && blockTime <= Date.now() + 5000;
}

function blockProgression(before, after) {
  if (!validBlockSample(before) || !validBlockSample(after)) return "unverified";
  if (after.height > before.height && after.latestBlockHash !== before.latestBlockHash && Date.parse(after.latestBlockTime) > Date.parse(before.latestBlockTime)) return "observed";
  if (after.height === before.height && after.latestBlockHash === before.latestBlockHash) return "not_observed";
  return "unverified";
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
    return Object.defineProperty({
      error: error?.name === "AbortError" ? `Timed out after ${timeoutMs / 1000}s` : error.message,
      checkedAt: new Date().toISOString()
    }, collectorFailure, { value: error?.name === "AbortError" ? "timeout" : "error" });
  } finally {
    clearTimeout(timeout);
    releaseUpstream();
  }
}

async function getObservedJson(url, init = {}, timeoutMs = 3500) {
  const started = performance.now();
  const body = await getJson(url, init, timeoutMs);
  // Includes any wait for the bounded collector slot; not a claim about network RTT.
  return { body, collectionMs: Math.round(performance.now() - started), readState: body[collectorFailure] || "ok" };
}
