import { ECOSYSTEM_CATEGORY_BY_PRODUCT } from "./ecosystemCategories.js";
import { getEligiblePackageEntries, hasEligibleWebEntry } from "./downloadActions.js";

export const DOWNLOAD_PLATFORM_GROUPS = Object.freeze({
  web: ["web"],
  desktop: ["windows", "windowsX64", "windowsArm64", "macos", "linux", "linuxX64Deb", "linuxX64AppImage", "linuxArm64Deb", "linuxArm64AppImage"],
  mobile: ["android", "androidUniversal", "ios"],
  browser: ["chromeEdge", "firefox", "pwa"],
});

export function filterDownloadProducts(products, { query = "", category = "all", method = "all", platform = "all" } = {}) {
  const needle = query.trim().toLocaleLowerCase();
  return products.filter((product) => {
    if (category !== "all" && ECOSYSTEM_CATEGORY_BY_PRODUCT.get(product.key) !== category) return false;
    if (needle && !`${product.name} ${product.detail} ${(product.metrics || []).flat().join(" ")}`.toLocaleLowerCase().includes(needle)) return false;
    const web = hasEligibleWebEntry(product);
    const packages = getEligiblePackageEntries(product);
    const installer = packages.length > 0;
    if (method === "web" && !web) return false;
    if (method === "packages" && !installer) return false;
    if (method === "none" && (web || installer)) return false;
    if (platform !== "all" && !(DOWNLOAD_PLATFORM_GROUPS[platform] || []).some((key) => key === "web" ? web : packages.some(([approvedPlatform]) => approvedPlatform === key))) return false;
    return true;
  });
}
