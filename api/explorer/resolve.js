const BASE = "https://explorer.ynxweb4.com";
const allowedTypes = new Set(["block", "transaction", "account", "token", "contract", "validator"]);

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "method not allowed" });
  }
  const query = String(request.query?.q || "").trim();
  if (!query || query.length > 256) return response.status(400).json({ error: "Enter a block, transaction, address, contract, token, or validator." });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const upstream = await fetch(`${BASE}/api/search?q=${encodeURIComponent(query)}`, { cache: "no-store", signal: controller.signal });
    if (upstream.status === 404) return response.status(404).json({ error: "No matching record was found in the current 6423 Explorer." });
    if (!upstream.ok) return response.status(503).json({ error: "Explorer search is temporarily unavailable. Try again." });
    const result = await upstream.json();
    if (!allowedTypes.has(result.type) || typeof result.deepLink !== "string" || !result.deepLink.startsWith("/") || result.deepLink.startsWith("//")) {
      return response.status(503).json({ error: "Explorer returned an unverified search result." });
    }
    response.setHeader("Cache-Control", "no-store, max-age=0");
    return response.status(200).json({ type: result.type, deepLink: result.deepLink, query });
  } catch {
    return response.status(503).json({ error: "Explorer search is temporarily unavailable. Try again." });
  } finally {
    clearTimeout(timeout);
  }
}
