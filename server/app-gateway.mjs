const appGatewayBase = "https://api.ynxweb4.com/app";

export async function getSquareFeed({ limit = 30, cursor = "" } = {}) {
  const boundedLimit = Math.min(Math.max(Number.parseInt(limit, 10) || 30, 1), 50);
  const url = new URL(`${appGatewayBase}/square/feed`);
  url.searchParams.set("limit", String(boundedLimit));
  if (cursor && /^[A-Za-z0-9._:-]{1,160}$/.test(cursor)) url.searchParams.set("cursor", cursor);
  const data = await getJson(url);
  return { ...data, source: "YNX Square persisted read API", checkedAt: new Date().toISOString() };
}

export async function getSquarePost(id) {
  if (!/^[A-Za-z0-9._:-]{1,160}$/.test(id || "")) throw new PublicError(400, "invalid post id");
  const encoded = encodeURIComponent(id);
  const post = await getJson(`${appGatewayBase}/square/posts/${encoded}`);
  const commentResult = await getJson(`${appGatewayBase}/square/posts/${encoded}/comments`);
  return { post, comments: Array.isArray(commentResult.comments) ? commentResult.comments : [], source: "YNX Square persisted read API", checkedAt: new Date().toISOString() };
}

export async function getAppHealth() {
  return getJson(`${appGatewayBase}/health`);
}

async function getJson(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url, { cache: "no-store", signal: controller.signal, headers: { accept: "application/json" } });
    if (!response.ok) throw new PublicError(response.status === 404 ? 404 : 502, response.status === 404 ? "record not found" : "upstream unavailable");
    const data = await response.json();
    if (!data || typeof data !== "object") throw new PublicError(502, "invalid upstream response");
    return data;
  } catch (error) {
    if (error instanceof PublicError) throw error;
    throw new PublicError(502, error?.name === "AbortError" ? "upstream timed out" : "upstream unavailable");
  } finally {
    clearTimeout(timeout);
  }
}

export class PublicError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
