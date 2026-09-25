import assert from "node:assert/strict";
import test from "node:test";
import { getCatalog } from "../src/lib/ecosystemCatalog.js";
import { getDownloadDirectoryProduct } from "../src/lib/downloadDirectory.js";
import { ECOSYSTEM_CATEGORIES, ECOSYSTEM_CATEGORY_BY_PRODUCT } from "../src/lib/ecosystemCategories.js";
import { filterDownloadProducts } from "../src/lib/downloadFilters.js";

const products = getCatalog().map(getDownloadDirectoryProduct);

test("all 26 products remain in the unfiltered download directory", () => {
  assert.equal(products.length, 26);
  assert.equal(filterDownloadProducts(products).length, 26);
  assert.equal(new Set(ECOSYSTEM_CATEGORIES.flatMap((group) => group.keys)).size, 26);
  for (const product of products) assert.ok(ECOSYSTEM_CATEGORY_BY_PRODUCT.has(product.key));
});

test("category and search narrow products without inventing a public package", () => {
  const commerce = filterDownloadProducts(products, { category: "commerce" });
  assert.ok(commerce.some((product) => product.key === "card"));
  assert.ok(!commerce.some((product) => product.key === "wallet"));
  assert.deepEqual(filterDownloadProducts(products, { query: "card", category: "commerce" }).map((product) => product.key), ["card"]);
});

test("availability and platform filters use eligible public actions only", () => {
  assert.ok(filterDownloadProducts(products, { method: "web" }).some((product) => product.key === "card"));
  assert.ok(!filterDownloadProducts(products, { method: "packages" }).some((product) => product.key === "card"));
  assert.ok(filterDownloadProducts(products, { method: "packages", platform: "desktop" }).some((product) => product.key === "wallet"));
  assert.ok(!filterDownloadProducts(products, { method: "none" }).some((product) => product.key === "wallet"));
  assert.ok(filterDownloadProducts(products, { method: "none" }).length > 0);
});
