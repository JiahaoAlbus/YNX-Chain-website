import releaseRegistry from "../../public/releases/ecosystem-release-registry.json" with { type: "json" };

export const PRODUCT_PUBLIC_CONTRACT_SCHEMA = "ynx.product-public-contract.v1";

export const PRODUCT_PUBLIC_SECTIONS = Object.freeze([
  { id: "overview", label: "Overview", description: "Purpose, release identity, and the evidence boundary." },
  { id: "features", label: "Features", description: "Implemented workflows and product rules." },
  { id: "open-download", label: "Open / Download", description: "Verified public entries and hosted packages only." },
  { id: "docs-api", label: "Docs / API", description: "Product documentation and applicable API references." },
  { id: "security-privacy-status-support", label: "Security / Privacy / Status / Support", description: "Shared operational and user-protection entry points." },
  { id: "integrations-web4", label: "Integrations / Web4", description: "YNX 6423 and Web4 integration boundaries." },
  { id: "risks", label: "Risks", description: "Known limitations that must remain visible." },
  { id: "releases", label: "Releases", description: "Registry-bound release records and provenance." },
]);

const sectionIds = new Set(PRODUCT_PUBLIC_SECTIONS.map((section) => section.id));
const registryByKey = new Map(releaseRegistry.products.map((product) => [product.key, product]));

export function productSectionRoute(productRoute, sectionId = "overview") {
  if (!sectionIds.has(sectionId)) throw new Error(`Unknown product public section: ${sectionId}`);
  return `${productRoute}/${sectionId}`;
}

export function isProductPublicSection(sectionId) {
  return sectionIds.has(sectionId);
}

export function getReleaseRegistryProduct(productKey) {
  return registryByKey.get(productKey) || null;
}

export function getProductPublicContract(product) {
  const registry = getReleaseRegistryProduct(product.key);
  const registryPublicWeb = typeof registry?.publicWeb === "string" && /^https:\/\//.test(registry.publicWeb)
    ? registry.publicWeb
    : null;
  const registryDownloadHosted = registry?.downloadHosted === true;
  const hostedDownloads = Object.entries(product.downloads || {})
    .filter(([, item]) => registryDownloadHosted && item?.downloadHosted === true && item?.href)
    .map(([platform, item]) => ({ platform, ...item }));
  const docs = product.docs?.href
    ? { status: "available", href: product.docs.href, external: product.docs.external === true, label: product.docs.label || `${product.name} docs` }
    : { status: "notApplicable", reason: "No product-specific documentation route is registered for this product." };
  const releaseEvidence = registry?.productRelease
    ? { status: "available", href: registry.productRelease, label: "Product release evidence" }
    : { status: "notApplicable", reason: "No product-release evidence path is registered in the current public release registry." };
  const publicEntry = registryPublicWeb
    ? { status: "available", href: registryPublicWeb, label: `Open ${product.name}`, external: true }
    : { status: "unavailable", reason: "The current public release registry does not prove a public product URL. Candidate, local, CI, or health-only evidence is not promoted to a public entry." };
  const downloads = hostedDownloads.length
    ? { status: "available", items: hostedDownloads }
    : { status: "unavailable", items: [], reason: registryDownloadHosted
      ? "The registry records hosted downloads, but this website build has no matching immutable product package that passes its local hosted-artifact allow-list."
      : "The current public release registry does not prove a hosted download for this product." };
  const api = inferApiContract(product, registry);

  return Object.freeze({
    schema: PRODUCT_PUBLIC_CONTRACT_SCHEMA,
    key: product.key,
    name: product.name,
    route: product.route,
    registryLinked: Boolean(registry),
    registryState: registry?.state || "not-registered",
    registryCommit: registry?.commit || null,
    centralAccepted: registry?.centralAccepted === true,
    publicWebVerified: Boolean(registryPublicWeb),
    downloadHostedVerified: registryDownloadHosted && hostedDownloads.length > 0,
    publicEntry,
    downloads,
    docs,
    api,
    releaseEvidence,
    runtimeEvidence: registry?.publicWebRelease || null,
    sections: PRODUCT_PUBLIC_SECTIONS.map((section) => ({ ...section, href: productSectionRoute(product.route, section.id) })),
    boundaries: {
      chain: "YNX Testnet 6423 / EVM 0x1917 / native asset YNXT",
      publicTruth: "Only the current public release registry may prove public product URLs, hosted downloads, central acceptance, and release evidence.",
      notPromoted: "Candidate code, local builds, CI, artifacts, and health endpoints do not become public product completion.",
    },
  });
}

export function getProductPublicDisplayStatus(contract) {
  if (contract.publicWebVerified) return "live";
  if (!contract.registryLinked) return "not-ready";
  if (/incomplete/i.test(contract.registryState)) return "planned";
  return "local";
}

function inferApiContract(product, registry) {
  if (product.key === "developer") {
    return { status: "available", href: "/api", label: "YNX API reference", reason: "Developer is the canonical API and SDK entry point." };
  }
  if (["explorer", "monitor", "pay", "exchange", "social", "trust", "resource", "finance", "dex"].includes(product.key)) {
    return {
      status: "notApplicable",
      reason: `No product-specific public API documentation route for ${product.name} is registered in release state ${registry?.state || "not-registered"}. Use the general API reference for network interfaces; private product APIs remain product-owner scoped.`,
      fallbackHref: "/api",
    };
  }
  return {
    status: "notApplicable",
    reason: `${product.name} does not currently publish a product-specific API contract in the public release registry.`,
    fallbackHref: "/api",
  };
}

export function assertProductPublicContract(contract) {
  if (contract?.schema !== PRODUCT_PUBLIC_CONTRACT_SCHEMA) throw new Error("Invalid product public contract schema");
  if (!contract.key || !contract.route) throw new Error("Product public contract is missing identity");
  if (contract.sections.length !== PRODUCT_PUBLIC_SECTIONS.length) throw new Error("Product public contract is missing required sections");
  if (contract.publicEntry.status === "available" && !contract.publicWebVerified) throw new Error("Public entry is not registry verified");
  if (contract.downloads.status === "available" && !contract.downloadHostedVerified) throw new Error("Hosted download is not registry verified");
  return true;
}

export const RELEASE_REGISTRY_PRODUCT_COUNT = releaseRegistry.products.length;
