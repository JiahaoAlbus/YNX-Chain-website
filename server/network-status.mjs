const endpoints = Object.freeze({
  status: "https://rpc.ynxweb4.com/status",
  summary: "https://rpc.ynxweb4.com/explorer/summary",
  validators: "https://rpc.ynxweb4.com/validators",
  evm: "https://rpc.ynxweb4.com/evm",
  faucet: "https://faucet.ynxweb4.com/health",
  ai: "https://ai.ynxweb4.com/health",
  pay: "https://pay.ynxweb4.com/health",
  trust: "https://trust.ynxweb4.com/health",
  resource: "https://resource.ynxweb4.com/health"
});

export async function collectNetworkStatus() {
  const checkedAt = new Date().toISOString();
  const servicesPromise = Promise.all([
    getJson(endpoints.faucet, {}, 3500),
    getJson(endpoints.ai, {}, 3500),
    getJson(endpoints.pay, {}, 3500),
    getJson(endpoints.trust, {}, 3500),
    getJson(endpoints.resource, {}, 3500)
  ]);
  // Fetch the identity-bearing endpoints in sequence. The public ingress can
  // throttle concurrent requests from one deployment worker.
  const status = await getJson(endpoints.status);
  const summary = await getJson(endpoints.summary);
  const validators = await getJson(endpoints.validators);
  const evm = await getJson(endpoints.evm, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_chainId", params: [] })
  });
  const [faucet, ai, pay, trust, resource] = await servicesPromise;

  const identityValid = status.chainId === 6423 && status.nativeCurrencySymbol === "YNXT" && evm.result === "0x1917";
  return {
    ok: identityValid,
    checkedAt,
    status,
    summary,
    validators,
    evm,
    services: { faucet, ai, pay, trust, resource },
    sources: endpoints
  };
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
