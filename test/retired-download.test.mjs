import assert from "node:assert/strict";
import test from "node:test";
import handler from "../api/retired-download.js";

function response() {
  const state = { headers: {}, body: null, statusCode: null };
  return {
    state,
    setHeader(name, value) { state.headers[name.toLowerCase()] = value; },
    status(statusCode) { state.statusCode = statusCode; return this; },
    json(body) { state.body = body; return this; }
  };
}

test("retired Shop Android download is explicitly gone with a manual Web/PWA replacement", () => {
  const result = response();
  handler({ method: "GET" }, result);
  assert.equal(result.state.statusCode, 410);
  assert.equal(result.state.body.code, "CLIENT_RETIRED");
  assert.equal(result.state.body.replacementUrl, "https://shop.ynxweb4.com/shop/");
  assert.equal(result.state.body.automaticRedirect, false);
  assert.equal(result.state.headers["cache-control"], "no-store, max-age=0");
});

test("retired Shop Android endpoint rejects mutations", () => {
  const result = response();
  handler({ method: "POST" }, result);
  assert.equal(result.state.statusCode, 405);
  assert.equal(result.state.headers.allow, "GET, HEAD");
});
