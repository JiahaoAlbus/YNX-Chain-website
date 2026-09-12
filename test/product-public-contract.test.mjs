import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { getCatalog, getProductRouteMatch } from "../src/lib/ecosystemCatalog.js";
import {
  PRODUCT_PUBLIC_CONTRACT_SCHEMA,
  PRODUCT_PUBLIC_SECTIONS,
  RELEASE_REGISTRY_PRODUCT_COUNT,
  assertProductPublicContract,
  getProductPublicContract,
  getProductPublicDisplayStatus,
  productSectionRoute,
} from "../src/lib/productPublicContract.js";

const registry = JSON.parse(fs.readFileSync("public/releases/ecosystem-release-registry.json", "utf8"));
const catalog = getCatalog();
const registryByKey = new Map(registry.products.map((product) => [product.key, product]));

test("all 26 registry products and the 26-product catalog expose the complete public contract", () => {
  assert.equal(RELEASE_REGISTRY_PRODUCT_COUNT, 26);
  assert.equal(catalog.length, 26);
  assert.equal(PRODUCT_PUBLIC_SECTIONS.length, 8);
  assert.equal(new Set(PRODUCT_PUBLIC_SECTIONS.map((section) => section.id)).size, 8);
  assert.deepEqual(catalog.filter((product) => !registryByKey.has(product.key)).map((product) => product.key), []);

  for (const product of catalog) {
    const contract = getProductPublicContract(product);
    assert.equal(contract.schema, PRODUCT_PUBLIC_CONTRACT_SCHEMA);
    assert.equal(assertProductPublicContract(contract), true);
    assert.equal(contract.sections.length, PRODUCT_PUBLIC_SECTIONS.length);
    assert.equal(contract.registryLinked, registryByKey.has(product.key));
    assert.equal(contract.publicWebVerified, Boolean(registryByKey.get(product.key)?.publicWeb));
    assert.equal(contract.centralAccepted, registryByKey.get(product.key)?.centralAccepted === true);
    assert.equal(contract.publicEntry.status === "available", contract.publicWebVerified);
    assert.equal(contract.downloads.status === "available", contract.downloadHostedVerified);
    assert.equal(getProductPublicDisplayStatus(contract), contract.publicWebVerified ? "live" : contract.registryLinked ? (/incomplete/i.test(contract.registryState) ? "planned" : "local") : "not-ready");

    for (const section of PRODUCT_PUBLIC_SECTIONS) {
      const href = productSectionRoute(product.route, section.id);
      assert.equal(contract.sections.find((entry) => entry.id === section.id)?.href, href);
      assert.deepEqual(getProductRouteMatch(href), { product, sectionId: section.id });
    }
    assert.deepEqual(getProductRouteMatch(product.route), { product, sectionId: "overview" });
  }
});

test("each product microsite section has a reachable route and non-empty contract payload", () => {
  const pageSource = fs.readFileSync("src/pages/ProductStatusPage.jsx", "utf8");
  for (const product of catalog) {
    const contract = getProductPublicContract(product);
    for (const section of PRODUCT_PUBLIC_SECTIONS) {
      assert.ok(getProductRouteMatch(productSectionRoute(product.route, section.id)));
      assert.ok(contract.sections.find((entry) => entry.id === section.id)?.description);
      assert.match(pageSource, new RegExp(`sectionId === "${escapeRegExp(section.id)}"`));
    }
    assert.ok(product.detail);
    assert.ok(product.metrics.length > 0);
    assert.ok(contract.publicEntry.href || contract.publicEntry.reason);
    assert.ok(contract.downloads.items.length > 0 || contract.downloads.reason);
    assert.ok(contract.docs.href || contract.docs.reason);
    assert.ok(contract.api.href || contract.api.fallbackHref || contract.api.reason);
    assert.ok(contract.releaseEvidence.href || contract.releaseEvidence.reason);
  }
  assert.doesNotMatch(pageSource, /\b(?:9102|0x238e|NYXT)\b/i);
});

test("unverified public and download actions stay disabled with an explicit reason", () => {
  for (const product of catalog) {
    const contract = getProductPublicContract(product);
    if (!contract.publicWebVerified) {
      assert.match(contract.publicEntry.reason, /current public release registry does not prove a public product URL/i);
      assert.equal(contract.publicEntry.href, undefined);
    }
    if (!contract.downloadHostedVerified) assert.match(contract.downloads.reason, /does not prove a hosted download|no matching immutable product package/i);
  }
});

test("every contract link is an absolute HTTPS URL or a same-origin route", () => {
  for (const product of catalog) {
    const contract = getProductPublicContract(product);
    const links = [contract.publicEntry.href, contract.docs.href, contract.api.href, contract.api.fallbackHref, contract.releaseEvidence.href, ...contract.sections.map((section) => section.href), ...contract.downloads.items.map((item) => item.href)].filter(Boolean);
    for (const href of links) assert.match(href, /^(?:https:\/\/|\/)/, `${product.key} has an invalid contract link: ${href}`);
  }
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
