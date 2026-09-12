import { WALLET_ANDROID14 } from "../content/walletAndroid14.js";
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

export function walletDownloadState(platform, item, registryAllowsDownloads = true) {
  const safetyHold = walletDownloadSafetyHold(item);
  const android14 = item?.sha256 === WALLET_ANDROID14.sha256 && item?.href === WALLET_ANDROID14.publicUrl && item?.sourceCommit === WALLET_ANDROID14.sourceCommit;
  const legacyBlocked = platform === "macos" && item?.sourceCommit === "5a6b033897a1295d35fc325a92c6bb81c8b04a19";
  const permissionHold = platform === "firefox";
  const macosPreview = item?.releaseBatch === "wallet-static-20260906-r6-macos";
  const androidUniversal = item?.releaseBatch === "wallet-static-20260906-r7-android-universal";
  const androidPreview = item?.releaseBatch === "wallet-static-20260906-r5-android";
  const browserPreview = item?.releaseBatch === "wallet-static-20260906-r4c-browser";
  const desktopPreview = item?.releaseBatch === "wallet-static-20260906-r9-desktop-065";
  const requirements = android14 ? "Android · 4 ABI · standalone APK" : androidUniversal ? "Android · arm64-v8a / armeabi-v7a / x86 / x86_64 · APK" : macosPreview ? "macOS · Apple Silicon / Intel · DMG" : androidPreview ? "Android · ARM64 · APK" : browserPreview ? platform === "pwa" ? "ZIP" : "Chrome / Edge · Chromium" : {
    android: "Android 7.0+ (API 24)", macos: "macOS 13+ · Apple Silicon / Intel",
    windowsX64: "Windows · x64", windowsArm64: "Windows · ARM64",
    chromeEdge: "Chrome / Edge 120+", firefox: "Firefox 128+"
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
  const available = Boolean(registryAllowsDownloads && item?.downloadHosted === true &&
    item.canonicalDownload === true && item.historicalPreview !== true && item.downloadApproved !== false && !legacyBlocked && !permissionHold && !safetyHold && (trustedFile || android14) && completeProvenance);
  return {
    available, legacyBlocked, permissionHold, safetyHold, requirements,
    filename: available ? decodeURIComponent(fileUrl.pathname.split("/").pop()) : null,
    limitationKey: android14 ? "android14Boundary" : permissionHold ? "firefoxPermissionHold" : legacyBlocked ? "macLegacyBlocked" : available ? item.historicalPreview ? "historicalBoundary" : macosPreview ? "macosPreviewBoundary" : androidPreview || androidUniversal ? "androidPreviewBoundary" : desktopPreview ? "desktopPreviewBoundary" : browserPreview ? "browserPreviewBoundary" : "previewUnverified" : "releasePending",
    installProofKey: android14 ? "android14Proof" : androidUniversal ? "androidUniversalProof" : macosPreview ? "macosLimitedProof" : androidPreview ? "androidLimitedProof" : desktopPreview ? item.installation === "appimage" ? "appImageNotInstalled" : "limitedCiLaunch" : browserPreview ? platform === "pwa" ? "pwaArchiveOnly" : "manualExtension" : null,
    signingKey: android14 ? "qaSignedPreview" : desktopPreview ? "unsignedPreview" : macosPreview ? "macosAdHocSignature" : androidPreview || androidUniversal ? "qaSignedPreview" : desktopPreview || browserPreview ? "unsignedPreview" : null
  };
}

export function walletDownloadOptions(product, registryAllowsDownloads = true) {
  return WALLET_DOWNLOAD_PLATFORMS.map(platform => {
    const item = product?.downloads?.[platform];
    return { platform, item, ...walletDownloadState(platform, item, registryAllowsDownloads) };
  });
}
