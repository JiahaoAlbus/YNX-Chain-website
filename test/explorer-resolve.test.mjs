import test from "node:test";
import assert from "node:assert/strict";
import handler from "../api/explorer/resolve.js";

function responseRecorder() {
  const value = { statusCode: 200, body: undefined, headers: {} };
  return {
    ...value,
    setHeader(key, headerValue) { this.headers[key] = headerValue; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; }
  };
}

test("global search returns only a safe Explorer deep link", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ type: "block", deepLink: "/block/1309850" }), { status: 200 });
  try {
    const response = responseRecorder();
    await handler({ method: "GET", query: { q: "1309850" } }, response);
    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.body, { type: "block", deepLink: "/block/1309850", query: "1309850" });
  } finally { globalThis.fetch = originalFetch; }
});

test("global search rejects an unsafe Explorer redirect", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ type: "block", deepLink: "//untrusted.example" }), { status: 200 });
  try {
    const response = responseRecorder();
    await handler({ method: "GET", query: { q: "1309850" } }, response);
    assert.equal(response.statusCode, 503);
    assert.match(response.body.error, /unverified/);
  } finally { globalThis.fetch = originalFetch; }
});
