import { WALLET_DESKTOP068 } from "../content/walletDesktop068.js";
import { WALLET_ANDROID22 } from "../content/walletAndroid22.js";
import { walletDownloadSafetyHold } from "./walletDownloadSafety.js";

// Website download eligibility is separate from Wallet feature completion.
// Keep this check shared by the chooser and the product download page.
export const WALLET_DOWNLOAD_PLATFORMS = ["windowsX64", "windowsArm64", "linuxX64Deb", "linuxX64AppImage", "linuxArm64Deb", "linuxArm64AppImage", "chromeEdge", "pwa", "android", "androidUniversal", "macos", "firefox", "ios"];
export const WALLET_LINUX_LABELS = {
  linuxX64Deb: "Linux x64 · DEB", linuxX64AppImage: "Linux x64 · AppImage",
  linuxArm64Deb: "Linux arm64 · DEB", linuxArm64AppImage: "Linux arm64 · AppImage"
};

export function walletDownloadLabel(platform, copy) {
  return (platform === "androidUniversal" ? copy.androidUniversalLabel : null) || (platform === "android" ? "Android" : null) || WALLET_LINUX_LABELS[platform] || copy.platformNames?.[platform] || platform;
}

function exactGithubFallback(item) {
  if (!item?.releaseTag || !item?.artifactPath || !item?.fallbackUrl) return null;
  let fallback;
  try { fallback = new URL(item.fallbackUrl); } catch { return null; }
  const expectedPath = `/JiahaoAlbus/YNX-Chain/releases/download/${encodeURIComponent(item.releaseTag)}/${encodeURIComponent(item.artifactPath)}`;
  return fallback.protocol === "https:" && fallback.hostname === "github.com" && !fallback.username && !fallback.password &&
    !fallback.search && !fallback.hash && fallback.pathname === expectedPath ? fallback.href : null;
}

export function walletDownloadState(platform, item, registryAllowsDownloads = true) {
  const safetyHold = walletDownloadSafetyHold(item);
  const release068 = WALLET_DESKTOP068[platform];
  const desktop068 = Boolean(release068 && item?.sha256 === release068.sha256 && item?.href === release068.publicUrl && item?.sourceCommit === release068.sourceCommit && item?.sizeBytes === release068.sizeBytes);
  const androidCurrent = ["sha256", "sourceCommit", "sizeBytes", "versionCode", "releaseTag", "signingClass", "productionSigned", "storeReleased"].every(key => item?.[key] === WALLET_ANDROID22[key]) && item?.href === WALLET_ANDROID22.publicUrl;
  const legacyBlocked = platform === "macos" && item?.sourceCommit === "5a6b033897a1295d35fc325a92c6bb81c8b04a19";
  const currentFirefox = platform === "firefox" && item?.sha256 === "6ac256415c34b4b492dc6094be8be8c9f0acf6a40653e2e18fde64dd20f801e0" &&
    item?.sourceCommit === "c93e16be81beddc957ef5f27b7bbcdfa89c28db3" && item?.sizeBytes === 547577;
  const permissionHold = platform === "firefox" && !currentFirefox;
  const macosPreview = item?.releaseBatch === "wallet-static-20260906-r6-macos";
  const androidUniversal = item?.releaseBatch === "wallet-static-20260906-r7-android-universal";
  const androidPreview = item?.releaseBatch === "wallet-static-20260906-r5-android";
  const browserPreview = ["wallet-static-20260906-r4c-browser", "wallet-web-testnet-preview-0.1.1-c93e16be8"].includes(item?.releaseBatch);
  const desktopPreview = item?.releaseBatch === "wallet-static-20260906-r9-desktop-065";
  const requirements = desktop068 && platform === "macos" ? "macOS 13+ · Apple Silicon / Intel · DMG" : androidCurrent ? "Android · 4 ABI · standalone APK" : androidUniversal ? "Android · arm64-v8a / armeabi-v7a / x86 / x86_64 · APK" : macosPreview ? "macOS · Apple Silicon / Intel · DMG" : androidPreview ? "Android · ARM64 · APK" : browserPreview ? platform === "pwa" ? "ZIP" : "Chrome / Edge · Chromium" : {
    android: "Android 7.0+ (API 24)", macos: "macOS 13+ · Apple Silicon / Intel",
    windowsX64: "Windows · x64", windowsArm64: "Windows · ARM64",
    chromeEdge: "Chrome / Edge 120+", firefox: currentFirefox ? "Firefox 142+" : "Firefox 128+"
  }[platform];
  let fileUrl;
  try { fileUrl = new URL(item?.href, "https://ynxweb4.com"); } catch { /* No eligible file. */ }
  const trustedFile = fileUrl?.protocol === "https:" && !fileUrl.username && !fileUrl.password &&
    !fileUrl.search && !fileUrl.hash &&
    ["ynxweb4.com", "www.ynxweb4.com", "downloads.ynxweb4.com"].includes(fileUrl.hostname) &&
    /\.(?:zip|apk|dmg|exe|rpm|deb|AppImage)$/.test(fileUrl.pathname) &&
    fileUrl.pathname.includes(`/sha256-${item?.sha256}/`);
  const completeProvenance = /^[a-f0-9]{40}$/.test(item?.sourceCommit || "") &&
    /^[a-f0-9]{64}$/.test(item?.sha256 || "") &&
    Number.isSafeInteger(item?.sizeBytes) && item.sizeBytes > 0 &&
    typeof item?.publicationEvidence === "string" && item.publicationEvidence.startsWith("/releases/") &&
    typeof item?.signingClass === "string" && item.signingClass.length > 0;
  const nativeCurrent = Boolean(release068 || ["android", "androidUniversal"].includes(platform));
  const fallbackHref = exactGithubFallback(item);
  const exposesFallbackAction = Boolean(release068 || platform === "android");
  const exactCurrentFile = release068 ? desktop068 : ["android", "androidUniversal"].includes(platform) ? androidCurrent : trustedFile;
  const available = Boolean(registryAllowsDownloads && item?.downloadHosted === true &&
    item.canonicalDownload === true && item.historicalPreview !== true && item.downloadApproved !== false && !legacyBlocked && !permissionHold && !safetyHold && exactCurrentFile && completeProvenance &&
    (!nativeCurrent || fallbackHref));
  return {
    available, fallbackHref: available && exposesFallbackAction ? fallbackHref : null, legacyBlocked, permissionHold, safetyHold, requirements,
    filename: available ? decodeURIComponent(fileUrl.pathname.split("/").pop()) : null,
    limitationKey: desktop068 ? "desktop068Boundary" : androidCurrent ? "android22Boundary" : permissionHold ? "firefoxPermissionHold" : legacyBlocked ? "macLegacyBlocked" : available ? item.historicalPreview ? "historicalBoundary" : macosPreview ? "macosPreviewBoundary" : androidPreview || androidUniversal ? "androidPreviewBoundary" : desktopPreview ? "desktopPreviewBoundary" : browserPreview ? "browserPreviewBoundary" : "previewUnverified" : "releasePending",
    installProofKey: desktop068 ? "desktop068Proof" : androidCurrent ? "android22Proof" : androidUniversal ? "androidUniversalProof" : macosPreview ? "macosLimitedProof" : androidPreview ? "androidLimitedProof" : desktopPreview ? item.installation === "appimage" ? "appImageNotInstalled" : "limitedCiLaunch" : browserPreview ? platform === "pwa" ? "pwaArchiveOnly" : "manualExtension" : null,
    signingKey: desktop068 ? platform === "macos" ? "desktop068MacSignature" : "unsignedPreview" : androidCurrent ? "qaSignedPreview" : desktopPreview ? "unsignedPreview" : macosPreview ? "macosAdHocSignature" : androidPreview || androidUniversal ? "qaSignedPreview" : desktopPreview || browserPreview ? "unsignedPreview" : null
  };
}

export function walletDownloadOptions(product, registryAllowsDownloads = true) {
  return WALLET_DOWNLOAD_PLATFORMS.map(platform => {
    const item = product?.downloads?.[platform];
    return { platform, item, ...walletDownloadState(platform, item, registryAllowsDownloads) };
  });
}
