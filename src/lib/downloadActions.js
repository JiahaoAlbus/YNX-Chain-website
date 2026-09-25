import { getProductPublicContract } from "./productPublicContract.js";
import { walletDownloadState } from "./walletDownloads.js";

function publicContract(product) {
  return product.publicContract || getProductPublicContract(product);
}

export function hasEligibleWebEntry(product) {
  const contract = publicContract(product);
  return contract.publicEntry.status === "available" &&
    product.downloads?.web?.href === contract.publicEntry.href;
}

export function getEligiblePackageEntries(product) {
  const contract = publicContract(product);
  const approved = new Map(contract.downloads.items.map(item => [item.platform, item]));
  return Object.entries(product.downloads || {}).filter(([platform, item]) => {
    if (platform === "web" || !item?.href || item.downloadHosted !== true || item.downloadApproved === false) return false;
    const released = approved.get(platform);
    if (!released || released.href !== item.href || released.sha256 !== item.sha256 || released.sourceCommit !== item.sourceCommit) return false;
    return product.key !== "wallet" || walletDownloadState(platform, item, contract.downloadHostedVerified).available;
  });
}
