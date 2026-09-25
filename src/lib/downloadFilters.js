import { ECOSYSTEM_CATEGORY_BY_PRODUCT } from "./ecosystemCategories.js";

export const DOWNLOAD_PLATFORM_GROUPS = Object.freeze({
  web: ["web"],
  desktop: ["windows", "windowsX64", "windowsArm64", "macos", "linux", "linuxX64Deb", "linuxX64AppImage", "linuxArm64Deb", "linuxArm64AppImage"],
  mobile: ["android", "androidUniversal", "ios"],
  browser: ["chromeEdge", "firefox", "pwa"],
});

const available = (product, platform) => Boolean(product.downloads?.[platform]?.href);

export function filterDownloadProducts(products, { query = "", category = "all", method = "all", platform = "all" } = {}) {
  const needle = query.trim().toLocaleLowerCase();
  return products.filter((product) => {
    if (category !== "all" && ECOSYSTEM_CATEGORY_BY_PRODUCT.get(product.key) !== category) return false;
    if (needle && !`${product.name} ${product.detail} ${(product.metrics || []).flat().join(" ")}`.toLocaleLowerCase().includes(needle)) return false;
    const web = available(product, "web");
    const installer = product.hasDownload === true;
    if (method === "web" && !web) return false;
    if (method === "packages" && !installer) return false;
    if (method === "none" && (web || installer)) return false;
    if (platform !== "all" && !(DOWNLOAD_PLATFORM_GROUPS[platform] || []).some((key) => available(product, key))) return false;
    return true;
  });
}
