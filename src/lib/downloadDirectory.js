import { getProductPublicContract, getProductPublicDisplayStatus } from "./productPublicContract.js";

// Directory actions must use the same release decision as product detail pages.
// A catalog URL or an old allow-listed filename alone is not a release decision.
export function getDownloadDirectoryProduct(product) {
  const contract = getProductPublicContract(product);
  const approved = new Map(contract.downloads.items.map(item => [item.platform, item]));
  const downloads = Object.fromEntries(Object.entries(product.downloads || {}).map(([platform, item]) => {
    if (platform === "web") return [platform, {
      ...item,
      href: contract.publicEntry.status === "available" ? contract.publicEntry.href : null,
      downloadHosted: false,
      status: contract.publicEntry.status === "available" ? "live" : "not-ready",
    }];
    return [platform, approved.has(platform) ? approved.get(platform) : { ...item, href: null, downloadHosted: false, status: "not-ready" }];
  }));
  return { ...product, status: getProductPublicDisplayStatus(contract), downloads, hasDownload: approved.size > 0 };
}
