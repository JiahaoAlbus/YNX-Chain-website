import { FaucetClient } from "./faucetClient.js";
import { validateFaucetClaim, validateFaucetRuntime } from "./faucetRuntime.js";

export const FAUCET_ORIGINS = Object.freeze([
  "https://faucet-testnet.ynxweb4.com",
  "https://faucet.ynxweb4.com",
]);

// Reuse the Faucet's durable-intent implementation; this adapter only binds the
// website to verified identities, fixed origins and the exact claim receipt.
export function createFaucetSession({ origin, fetch, storage, crypto }) {
  if (!FAUCET_ORIGINS.includes(origin)) throw new Error("Unsupported Faucet origin");
  const client = new FaucetClient({ storage, crypto, fetch: async (path, options) => {
    if (!/^\/(health|request|request-status)(\?requestId=[A-Za-z0-9_-]{32,128})?$/.test(path)) throw new Error("Unsupported Faucet path");
    const response = await fetch(`${origin}${path}`, { ...options, redirect: "error" });
    if (options?.method === "POST" && response.ok) {
      const intent = JSON.parse(options.body);
      validateFaucetClaim(await response.clone().json(), intent.address, intent.amount, intent.requestId);
    }
    return response;
  } });
  client.key = "ynx.website.faucet.request.v1";
  return {
    client,
    async refresh() {
      client.config = null;
      const options = { cache: "no-store", credentials: "omit", redirect: "error", signal: AbortSignal.timeout(10000) };
      const [h, v] = await Promise.all([fetch(`${origin}/health`, options), fetch(`${origin}/version`, options)]);
      if (!h.ok || !v.ok) throw new Error("Faucet identity is unavailable");
      const result = validateFaucetRuntime(await h.json(), await v.json());
      // Old aliases remain selectable, but new website writes require the durable
      // service contract. A service rollback must never silently downgrade intent.
      if (!result.durable) throw new Error("Durable Faucet requests are unavailable");
      client.config = { ready: true, defaultAmount: 100, durable: true, statusPath: "/request-status" };
      client.restore();
      if (client.pending && client.pending.state !== "accepted") await client.reconcile();
      return result;
    },
    async submit(address) {
      client.restore();
      if (client.pending && client.pending.address !== address) throw client.error("newBlocked");
      await client.claim(address);
      return this.snapshot();
    },
    snapshot() {
      const p = client.pending;
      if (!p) return { state: "idle" };
      if (p.state !== "accepted") return { state: "pending", requestId: p.requestId, address: p.address };
      return { state: "success", requestId: p.requestId, hash: p.transactionHash,
        payload: { amount: p.amount, address: p.address, nativeSymbol: "YNXT" } };
    },
    reset() { client.restore(); client.newRequest(); },
  };
}
