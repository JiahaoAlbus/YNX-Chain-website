import test from "node:test";
import assert from "node:assert/strict";
import { resolveRuntimeCopy, getRuntimeLoadingNotice } from "../src/lib/runtimeCopyRecovery.js";
import { getRuntimeCopy, RUNTIME_LOCALES } from "../src/content/runtimeLocaleContent.js";

test("available runtime languages do not invoke the deferred loader", async () => {
  const result = await resolveRuntimeCopy("en", () => { throw new Error("unexpected load"); });
  assert.equal(result.copy, getRuntimeCopy("en")); assert.equal(result.failed, false);
});

test("deferred runtime language retains its own text on success", async () => {
  const localized = { utility: { loading: "読み込み中" } };
  const result = await resolveRuntimeCopy("ja", async () => localized);
  assert.equal(result.copy, localized); assert.equal(result.failed, false);
});

test("rejected and absent language bundles recover with explicit English fallback state", async () => {
  for (const load of [async () => { throw new Error("network failed"); }, async () => null]) {
    const result = await resolveRuntimeCopy("de", load);
    assert.equal(result.failed, true); assert.equal(result.copy, getRuntimeCopy("en"));
    assert.ok(result.copy.utility.loading); assert.ok(result.copy.ecosystem.products.length);
  }
});

test("a language import that never settles reaches the fallback deadline", { timeout: 1000 }, async () => {
  const result = await resolveRuntimeCopy("ja", () => new Promise(() => {}), { timeoutMs: 5 });
  assert.equal(result.failed, true);
  assert.equal(result.copy, getRuntimeCopy("en"));
});

test("a late shared-import rejection after fallback is handled", { timeout: 1000 }, async () => {
  let rejectImport;
  const sharedImport = new Promise((_, reject) => { rejectImport = reject; });
  const unhandled = [];
  const recordUnhandled = reason => unhandled.push(reason);
  process.on("unhandledRejection", recordUnhandled);
  try {
    const result = await resolveRuntimeCopy("de", () => sharedImport, { timeoutMs: 5 });
    assert.equal(result.failed, true);
    rejectImport(new Error("late network failure"));
    await new Promise(resolve => setImmediate(resolve));
    assert.deepEqual(unhandled, []);
  } finally {
    process.removeListener("unhandledRejection", recordUnhandled);
  }
});

test("successful and rejected imports clear their pending deadline", async t => {
  const clear = t.mock.method(globalThis, "clearTimeout");
  const localized = { utility: { loading: "読み込み中" } };
  const result = await resolveRuntimeCopy("ja", async () => localized, { timeoutMs: 1000 });
  assert.equal(result.copy, localized);
  assert.equal(result.failed, false);
  const failed = await resolveRuntimeCopy("de", async () => { throw new Error("network failed"); }, { timeoutMs: 1000 });
  assert.equal(failed.failed, true);
  assert.equal(clear.mock.callCount(), 2);
  assert.ok(clear.mock.calls.every(call => call.arguments[0] !== undefined));
});

test("each supported locale has a distinct fallback notice and reload action", () => {
  for (const locale of RUNTIME_LOCALES) {
    const notice = getRuntimeLoadingNotice(locale);
    assert.equal(notice.length, 2); assert.ok(notice.every(text => text.trim()));
    if (locale !== "en") assert.notEqual(notice[0], getRuntimeLoadingNotice("en")[0]);
  }
});
