import { getCatalog } from "./ecosystemCatalog.js";
import { getProductPublicContract } from "./productPublicContract.js";

const productKeys = [null, null, "explorer", "ai", "pay", "trust", "resource", null, null, "exchange"];
const referenceRoutes = ["/testnet", "/testnet", null, null, null, null, null, "/docs", "/#address", null];
const catalogByKey = new Map(getCatalog().map((product) => [product.key, product]));

export function homeEcosystemPanelDecision(index, networkStatus, services = {}) {
  const key = productKeys[index];
  if (!key) return { status: index === 0 ? networkStatus : "reference", href: referenceRoutes[index], healthStatus: null };
  const product = catalogByKey.get(key);
  const contract = product && getProductPublicContract(product);
  if (!contract) return { status: "reference", href: `/dapp/${key}`, healthStatus: null };
  const health = services[key];
  return {
    status: contract.publicWebVerified ? "public-web" : /incomplete/i.test(contract.registryState) ? "candidate-incomplete" : "candidate",
    href: contract.publicWebVerified ? contract.publicEntry.href : contract.route,
    healthStatus: health?.ok === true ? "live" : health?.error ? "status unavailable" : "checking",
  };
}
