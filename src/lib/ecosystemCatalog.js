import {
  AppWindow,
  CircleDollarSign,
  Headphones,
  Globe,
  MessageCircle,
  MonitorCog,
  Search,
  ShieldCheck,
  WalletCards,
  PlaySquare,
  Brush,
  Store,
  FileSpreadsheet,
  CalendarDays,
  Mail,
  ScanSearch,
  Brain,
  Database,
  SquarePen,
  Cloud,
  CreditCard,
  Repeat2,
  BarChart3
} from "lucide-react";
import { apiConfig } from "./api/ynxApi.js";

export const PRODUCT_STATUS = {
  LIVE: "live",
  PREVIEW: "preview",
  LOCAL: "local",
  PLANNED: "planned",
  NOT_READY: "not-ready"
};

const makeDownloads = (items = {}) => ({
  web: { label: "Web", status: PRODUCT_STATUS.NOT_READY },
  android: { label: "Android", status: PRODUCT_STATUS.NOT_READY },
  ios: { label: "iOS", status: PRODUCT_STATUS.NOT_READY },
  macos: { label: "macOS", status: PRODUCT_STATUS.NOT_READY },
  windows: { label: "Windows", status: PRODUCT_STATUS.NOT_READY },
  linux: { label: "Linux", status: PRODUCT_STATUS.NOT_READY },
  ...items
});

const WEBSITE_HOSTED_ARTIFACTS = new Set();

const artifactDownload = (status, artifactPath, note, href = null) => {
  const hosted = !!href || WEBSITE_HOSTED_ARTIFACTS.has(artifactPath);
  return {
    status,
    label: hosted && status === PRODUCT_STATUS.LIVE ? "Web" : undefined,
    href: hosted ? href : null,
    external: hosted && /^https?:\/\//.test(href || ""),
    downloadHosted: hosted,
    artifactPath,
    note: hosted ? note : `${note} (not hosted on this website)`
  };
};

export const STATUS_CONFIG = {
  [PRODUCT_STATUS.LIVE]: { label: "public web", tone: "live" },
  [PRODUCT_STATUS.LOCAL]: { label: "candidate", tone: "local" },
  [PRODUCT_STATUS.PLANNED]: { label: "candidate incomplete", tone: "planned" },
  [PRODUCT_STATUS.NOT_READY]: { label: "not ready", tone: "not-ready" }
};

export const DOWNLOAD_LABELS = {
  web: "Web",
  android: "Android",
  ios: "iOS",
  macos: "macOS",
  windows: "Windows",
  linux: "Linux"
};

export const PLATFORM_STATUS = {
  [PRODUCT_STATUS.LIVE]: { text: "Open public web", verb: "ready" },
  [PRODUCT_STATUS.PREVIEW]: { text: "Download Testnet Preview", verb: "preview" },
  [PRODUCT_STATUS.LOCAL]: { text: "Local build only", verb: "local" },
  [PRODUCT_STATUS.PLANNED]: { text: "Incomplete", verb: "future" },
  [PRODUCT_STATUS.NOT_READY]: { text: "Not ready", verb: "blocked" }
};

export const DAPP_BASE_ROUTE = "/dapp";

const LEGACY_PRODUCT_ROUTES = {
  wallet: "/wallet",
  social: "/social",
  pay: "/pay",
  merchantConsole: "/merchant",
  card: "/card",
  exchange: "/exchange",
  quant: "/quant",
  shop: "/shop",
  sellerConsole: "/seller",
  developer: "/developer",
  explorer: "/explorer",
  monitor: "/monitor",
  ai: "/ai",
  trust: "/trust",
  resource: "/resource",
  music: "/music",
  video: "/video",
  creatorStudio: "/creator",
  cloud: "/cloud",
  docs: "/docs-app",
  browser: "/browser",
  search: "/search",
  finance: "/finance",
  mail: "/mail",
  calendar: "/calendar",
  dex: "/dex"
};

const PRODUCT_ROUTES = Object.fromEntries(
  Object.entries(LEGACY_PRODUCT_ROUTES).map(([key, legacyRoute]) => [key, `${DAPP_BASE_ROUTE}/${legacyRoute.slice(1)}`])
);

const evidence = {
  wallet: {
    commit: "ccaf878cdeeb",
    centralAccepted: true,
    productRelease: {
      href: "/releases/ecosystem-release-registry.json",
      release: "wallet-auth-v1.0.0-testnet-preview.5"
    },
    statusNote: "Release wallet-auth-v1.0.0-testnet-preview.5: the centrally accepted Android Testnet Preview is hosted for direct download. It locally reviews the exact approved Exchange, Finance, Quant and Shop bindings; long permission reviews remain scrollable to reject or approve. Canonical Wallet/Auth is publicly reachable through a proof-bound gateway with 64-request concurrency admission and 100/100 concurrent readiness evidence. This is test-signed software, not a production-signed or app-store release.",
    downloads: {
      web: { status: PRODUCT_STATUS.LIVE, href: "https://wallet-auth.ynxweb4.com/health", external: true, downloadHosted: false, note: "Public canonical Wallet/Auth gateway health; product use remains proof-bound." },
      android: artifactDownload(PRODUCT_STATUS.PREVIEW, "ynx-wallet-1.0.0-testnet-preview-ccaf878c-test-signed.apk", "Test-signed Android Testnet Preview · source ccaf878c · SHA-256 68d7cec9…b746 · 78,313,394 bytes · never import production keys.", "/downloads/ynx-wallet-1.0.0-testnet-preview-ccaf878c-test-signed.apk"),
      ios: { status: PRODUCT_STATUS.PLANNED, note: "iOS project exists; simulator/launch evidence not completed on this host." },
      macos: { status: PRODUCT_STATUS.NOT_READY, note: "No macOS package is published for Wallet in this candidate." },
      windows: { status: PRODUCT_STATUS.NOT_READY, note: "No Windows package is published for Wallet in this candidate." }
    }
  },
  social: {
    commit: "aa852496",
    centralAccepted: true,
    productRelease: {
      href: "/releases/ecosystem-release-registry.json",
      release: "social-v1.0.0-testnet-preview.1"
    },
    statusNote: "YNX Social 1.0.0 is publicly connected to the shared Testnet through its Wallet-bound Social API. The test-signed Android Preview opens the exact central Wallet review for ynx-social-v1 / com.ynx.social, passed a 1.328-second cold launch, and the public health route passed 100/100 requests at concurrency 10. Strong biometric approval remains mandatory; production signing, app-store release, iOS runtime proof and independently operated capacity evidence are not claimed.",
    downloads: {
      web: { status: PRODUCT_STATUS.LIVE, href: "https://api.ynxweb4.com/social/health", external: true, downloadHosted: false, note: "Public Social Testnet API health; user workflows run in the Android app after Wallet authorization." },
      android: artifactDownload(PRODUCT_STATUS.PREVIEW, "ynx-social-1.0.0-testnet-preview-aa852496-test-signed.apk", "Test-signed Android Testnet Preview · source aa852496 · SHA-256 ea596daf…dcba · 103,546,656 bytes · exact central Wallet binding and public Social API embedded.", "/downloads/ynx-social-1.0.0-testnet-preview-aa852496-test-signed.apk"),
      ios: { status: PRODUCT_STATUS.PLANNED, note: "iOS project exists; simulator/app-store evidence pending." },
      macos: { status: PRODUCT_STATUS.NOT_READY, note: "No published macOS package for this candidate." },
      windows: { status: PRODUCT_STATUS.NOT_READY, note: "No published Windows package for this candidate." }
    }
  },
  pay: {
    commit: "53eb677c0e41",
    statusNote: "The public YNX Pay Testnet client is live at pay-app.ynxweb4.com and the authoritative authenticated payment API is live at pay.ynxweb4.com. The client supports reviewable invoice, tip, split, refund and recurring-draft flows; stable settlement, sponsorship providers, production signatures and store release are not claimed.",
    downloads: {
      web: { status: PRODUCT_STATUS.LIVE, href: "https://pay-app.ynxweb4.com/", external: true, downloadHosted: false, note: "Public YNX Pay Testnet client; payment settlement uses the separate authenticated chain-backed Pay API." },
      android: artifactDownload(PRODUCT_STATUS.LOCAL, "apps/pay/android/app/build/outputs/apk/release/app-release.apk", "Android app release (debug-signed, testnet preview)"),
      ios: { status: PRODUCT_STATUS.PLANNED, note: "iOS project exists; simulator/signed App Store evidence pending." },
      macos: { status: PRODUCT_STATUS.NOT_READY, note: "No published macOS package for this candidate." },
      windows: { status: PRODUCT_STATUS.NOT_READY, note: "No published Windows package for this candidate." }
    }
  },
  merchantConsole: {
    commit: "e5c6cc07",
    statusNote: "The public multi-user Merchant Console Testnet preview is live with same-origin Gateway routing, tenant-scoped operations, exports and governed deletion requests. It is a web product; production acquiring, provider credentials, durable telemetry and independently reviewed compliance are not claimed.",
    downloads: {
      web: { status: PRODUCT_STATUS.LIVE, href: "https://merchant.ynxweb4.com/", external: true, downloadHosted: false, note: "Public web console for Testnet merchant workflows; requires the canonical Wallet/merchant session for private views." }
    }
  },
  card: {
    commit: "358fb555",
    statusNote: "The public YNX Card sandbox preview is live for Testnet UX review. It does not represent an issued card, banking relationship, card-network partnership, credit product or production payment instrument.",
    downloads: {
      web: { status: PRODUCT_STATUS.LIVE, href: "https://card.ynxweb4.com/", external: true, downloadHosted: false, note: "Public sandbox UI; no real card issuance or production card transaction is available." }
    }
  },
  exchange: {
    commit: "1e5f48d2",
    centralAccepted: true,
    productRelease: {
      href: "/releases/exchange/fc2276e1ce4c/product-release.json",
      release: "1.0.0-testnet-candidate"
    },
    statusNote: "Release exchange-v1.0.0-testnet-preview.3: the Android client and public venue now display the 30 actual persisted matching-engine trades, including source type and proof digest. The canonical public Exchange API and Wallet/Auth gateway remain embedded with bounded multi-user admission. Order, cancel and withdrawal actions remain fail-closed until canonical action verification is deployed. Production custody, listing, partnership and mainnet are not claimed.",
    downloads: {
      web: { status: PRODUCT_STATUS.LIVE, href: "https://exchange.ynxweb4.com", external: true, downloadHosted: false, note: "Public read-only Exchange Pro terminal with actual owned-engine matches." },
      android: artifactDownload(PRODUCT_STATUS.PREVIEW, "ynx-exchange-1.0.0-testnet-preview-1e5f48d2-test-signed.apk", "Test-signed Android Testnet Preview · source 1e5f48d2 · SHA-256 9ac502ce…ae3 · 77,360,214 bytes · canonical Testnet API, Wallet gateway, and actual venue trade tape embedded.", "/downloads/ynx-exchange-1.0.0-testnet-preview-1e5f48d2-test-signed.apk"),
      ios: { status: PRODUCT_STATUS.PLANNED, note: "iOS project exists; simulator proof/ signing evidence pending." },
      macos: { status: PRODUCT_STATUS.NOT_READY, note: "No published Exchange macOS package in this candidate." },
      windows: { status: PRODUCT_STATUS.NOT_READY, note: "No published Exchange Windows package in this candidate." }
    }
  },
  quant: {
    commit: "18a73981b043",
    centralAccepted: false,
    statusNote: "The public research workspace is source-bound and live with per-request state isolation and actual YNX matching-engine trade data. Quant's least-privilege Wallet scopes are centrally registered for future protected actions; the current public surface remains research-only, with paper trading, Testnet order submission, live funds and production signing disabled.",
    downloads: {
      web: { status: PRODUCT_STATUS.LIVE, href: "https://quant.ynxweb4.com/", external: true, downloadHosted: false, note: "Public isolated Quant research workspace." }
    }
  },
  shop: {
    commit: "6fa2d6c5",
    productRelease: {
      href: "/releases/ecosystem-release-registry.json",
      release: "shop-v0.3.0-testnet-preview.1"
    },
    statusNote: "The public Testnet storefront, persistent catalog, Wallet-bound cart/order flows, Pay/Trust/AI integrations, and a debug-signed Android Testnet Preview are available. Tax, carrier verification, production signing, and store release remain unavailable.",
    downloads: {
      web: { status: PRODUCT_STATUS.LIVE, href: "https://shop.ynxweb4.com/shop/", external: true, downloadHosted: false, note: "Public YNX Testnet storefront with three clearly labelled demo listings." },
      android: artifactDownload(PRODUCT_STATUS.PREVIEW, "ynx-shop-0.3.0-testnet-preview-6fa2d6c5-debug-signed.apk", "Debug-signed Android Testnet Preview · source 6fa2d6c5 · SHA-256 a7466e02…2c72d · 253,733 bytes · min Android API 26.", "/downloads/ynx-shop-0.3.0-testnet-preview-6fa2d6c5-debug-signed.apk"),
      ios: { status: PRODUCT_STATUS.PLANNED, note: "iOS source and simulator CI pass; no production-signed or hosted iOS package is claimed." },
      macos: { status: PRODUCT_STATUS.NOT_READY, note: "No published Shop macOS package in this candidate." },
      windows: { status: PRODUCT_STATUS.NOT_READY, note: "No published Shop Windows package in this candidate." }
    }
  },
  sellerConsole: {
    commit: "88c0f3a5",
    productRelease: {
      href: "/releases/ecosystem-release-registry.json",
      release: "seller-v0.4.0-testnet-preview.1"
    },
    statusNote: "The public Seller Testnet Console provides Wallet-bound store operations, catalog and inventory control, order/refund workflows, eight least-privilege roles, invitation/revocation evidence, provider governance, store data export, audit history, and integrity-protected recovery boundaries. Native desktop/mobile packages are not claimed because Seller is a public web product.",
    downloads: {
      web: { status: PRODUCT_STATUS.LIVE, href: "https://seller.ynxweb4.com/seller/", external: true, downloadHosted: false, note: "Public YNX Testnet Seller Console; Wallet session required for private store records." }
    }
  },
  developer: {
    commit: "70f7c3ca",
    productRelease: {
      href: "/releases/ecosystem-release-registry.json",
      release: "developer-v0.2.0-testnet-preview.1"
    },
    statusNote: "The public YNX Developer Web IDE is live against chain ID 6423, with bounded compiler, test, API Studio, checkpoint and Wallet-only deployment-review workflows. Official macOS arm64 and Windows x64 unsigned Testnet Preview packages are hosted for direct download. Provider-backed AI, central Wallet acceptance, production signing and store release are not claimed.",
    downloads: {
      web: { status: PRODUCT_STATUS.LIVE, href: "https://developer.ynxweb4.com/", external: true, downloadHosted: false, note: "Public Testnet Web IDE with live chain status and fail-closed signing/provider boundaries." },
      android: { status: PRODUCT_STATUS.NOT_READY, note: "No native Android package published for Developer in this candidate." },
      ios: { status: PRODUCT_STATUS.NOT_READY, note: "No iOS package published for Developer in this candidate." },
      macos: artifactDownload(PRODUCT_STATUS.PREVIEW, "ynx-developer-testnet-preview-macos-unsigned.zip", "Unsigned macOS arm64 Testnet Preview · SHA-256 ff9ae3d4…903f7 · 38,450,128 bytes.", "/downloads/ynx-developer-testnet-preview-macos-unsigned.zip"),
      windows: artifactDownload(PRODUCT_STATUS.PREVIEW, "ynx-developer-testnet-preview-windows-x64-unsigned.zip", "Unsigned Windows x64 Testnet Preview · SHA-256 1efaf486…07fb29 · 106,341,644 bytes.", "/downloads/ynx-developer-testnet-preview-windows-x64-unsigned.zip")
    }
  },
  explorer: {
    commit: "d4b4a3e5d7d6",
    statusNote: "Explorer is a public live web deployment through shared URL.",
    downloads: {
      web: { status: PRODUCT_STATUS.LIVE, href: apiConfig.explorerUrl, note: "Live public explorer deployment." }
    }
  },
  monitor: {
    commit: "5d42be02",
    statusNote: "The public YNX Testnet status window is live with a signed, redacted feed built from seven bounded real-service probes. Public status and private operations are deliberately separated: anyone can inspect current availability, while incidents, audit, backup, recovery and rollback proposals require scoped operator authorization. Password login is disabled on the public deployment until canonical Wallet roles are centrally accepted.",
    downloads: {
      web: { status: PRODUCT_STATUS.LIVE, href: "https://monitor.ynxweb4.com/", external: true, downloadHosted: false, note: "Live signed Testnet status; private operator controls remain authorization-gated." }
    }
  },
  ai: {
    commit: "16d6d71e2f93",
    statusNote: "The public YNX AI Testnet workspace is live with a strict POST-body SSE Gateway, explicit context and permission review, and a fail-closed Wallet boundary. Gateway health is not presented as generation success: the latest bounded provider request returned HTTP 429, so generationLive remains false and no substitute answer is shown. The Android preview is verified locally but is not yet hosted; iOS runtime evidence and production signing remain pending.",
    downloads: {
      web: { status: PRODUCT_STATUS.LIVE, href: "https://assistant.ynxweb4.com/", external: true, downloadHosted: false, note: "Public permission-bound YNX AI Testnet workspace with truthful provider status." },
      android: artifactDownload(PRODUCT_STATUS.LOCAL, "apps/ai/mobile/android/app/build/outputs/apk/release/app-release.apk", "Android app release (debug-signed, testnet preview)"),
      ios: { status: PRODUCT_STATUS.PLANNED, note: "iOS project generated; simulator evidence pending." },
      macos: { status: PRODUCT_STATUS.NOT_READY, note: "No published AI macOS package in this candidate." },
      windows: { status: PRODUCT_STATUS.NOT_READY, note: "No published AI Windows package in this candidate." }
    }
  },
  trust: {
    commit: "4d40557229b4",
    productRelease: {
      href: "/releases/ecosystem-release-registry.json",
      release: "trust-center-v0.1.0-testnet-preview.2"
    },
    statusNote: "The reproducible Linux amd64 Trust Center server and backup CLI bundle is hosted as an unsigned Testnet Preview. The Android debug build remains local-only.",
    downloads: {
      android: artifactDownload(PRODUCT_STATUS.LOCAL, "apps/trust-center/mobile/android/app/build/outputs/apk/debug/app-debug.apk", "Trust Center Android debug APK."),
      ios: { status: PRODUCT_STATUS.PLANNED, note: "iOS project exists; simulator signing evidence pending." },
      web: { status: PRODUCT_STATUS.LOCAL, href: "https://trust.ynxweb4.com/health", external: true, note: "API/health route used as trust companion reference." },
      linux: artifactDownload(PRODUCT_STATUS.PREVIEW, "ynx-trust-center-4d40557229b4-linux-amd64.tar.gz", "Unsigned Linux amd64 Testnet Preview · SHA-256 48c1ee8e…a6eb85 · 4,526,591 bytes.", "/downloads/ynx-trust-center-4d40557229b4-linux-amd64.tar.gz")
    }
  },
  resource: {
    commit: "11bd6b7c",
    productRelease: {
      href: "/releases/ecosystem-release-registry.json",
      release: "resource-market-v0.3.0-public-testnet-preview.1"
    },
    statusNote: "The public Resource Market Testnet Preview is live beside the chain-backed Resource gateway. It exposes provider, buyer, quote, auction, metering, dispute and receipt workspaces, but private state and mutations require an exact Wallet-bound Product Session. The public health path passed 100/100 requests at concurrency 10. Central Wallet acceptance and authoritative settlement proof remain pending, so those operations fail closed.",
    downloads: {
      android: artifactDownload(PRODUCT_STATUS.LOCAL, "apps/resource-market/mobile/android/app/build/outputs/apk/debug/app-debug.apk", "Resource Market Android debug APK."),
      ios: { status: PRODUCT_STATUS.PLANNED, note: "iOS project exists; simulator/signing evidence pending." },
      web: { status: PRODUCT_STATUS.LIVE, href: "https://resource.ynxweb4.com/app/", external: true, note: "Public Testnet Resource Market workspace; chain gateway remains available at the domain root." }
    }
  },
  music: {
    commit: "3cf997b16664",
    statusNote: "Music debug APK is generated locally; iOS and playback packages are pending.",
    downloads: {
      android: artifactDownload(PRODUCT_STATUS.LOCAL, "apps/music/android/app/build/outputs/apk/debug/app-debug.apk", "Music Android debug APK."),
      ios: { status: PRODUCT_STATUS.PLANNED, note: "iOS project exists; simulator evidence pending." },
      macos: { status: PRODUCT_STATUS.NOT_READY, note: "No published Music macOS package in this candidate." },
      windows: { status: PRODUCT_STATUS.NOT_READY, note: "No published Music Windows package in this candidate." }
    }
  },
  video: {
    commit: "0d13f8f86932",
    statusNote: "Video debug APK is generated for local tests; creator studio packaging is still separate work.",
    downloads: {
      android: artifactDownload(PRODUCT_STATUS.LOCAL, "apps/video/android/app/build/outputs/apk/debug/app-debug.apk", "Video Android debug APK."),
      ios: { status: PRODUCT_STATUS.PLANNED, note: "iOS project exists; simulator/signing evidence pending." },
      web: { status: PRODUCT_STATUS.LOCAL, href: "/docs#video", note: "Video web companion is testnet-facing." },
      macos: { status: PRODUCT_STATUS.NOT_READY, note: "No published Video macOS package in this candidate." },
      windows: { status: PRODUCT_STATUS.NOT_READY, note: "No published Video Windows package in this candidate." }
    }
  },
  creatorStudio: {
    commit: "0d13f8f86932",
    statusNote: "Creator Studio remains part of Video work; no dedicated production package has been published yet.",
    downloads: {
      web: { status: PRODUCT_STATUS.PLANNED, href: "/docs#video", note: "Creator controls are tested inside Video companion surfaces for now." }
    }
  },
  cloud: {
    commit: "7b3c5f427c17",
    statusNote: "Cloud Android release and docs app release packages are generated; iOS desktop/Windows are pending publication.",
    downloads: {
      android: artifactDownload(PRODUCT_STATUS.LOCAL, "apps/cloud/mobile/android/app/build/outputs/apk/release/app-release.apk", "Cloud Android release APK (debug-signed, testnet preview)"),
      ios: { status: PRODUCT_STATUS.PLANNED, note: "iOS project exists; simulator/signed evidence pending." },
      web: { status: PRODUCT_STATUS.LOCAL, href: "/docs#cloud", note: "Cloud web companion." }
    }
  },
  docs: {
    commit: "7b3c5f427c17",
    statusNote: "Docs Android release package is generated; web companion remains primary.",
    downloads: {
      android: artifactDownload(PRODUCT_STATUS.LOCAL, "apps/docs/mobile/android/app/build/outputs/apk/release/app-release.apk", "Docs Android release APK (debug-signed, testnet preview)"),
      ios: { status: PRODUCT_STATUS.PLANNED, note: "iOS project exists; simulator/signed evidence pending." },
      web: { status: PRODUCT_STATUS.LOCAL, href: "/docs", note: "Docs web companion and in-site documentation center." }
    }
  },
  browser: {
    commit: "db8651b68c6e",
    statusNote: "Browser Android build package is available for test; native macOS executable exists but not packaged.",
    downloads: {
      android: artifactDownload(PRODUCT_STATUS.LOCAL, "apps/browser/android/.manual-build/ynx-browser-debug.apk", "Browser Android debug APK (manual build)."),
      ios: { status: PRODUCT_STATUS.PLANNED, note: "iOS WKWebView project exists; simulator evidence pending." },
      macos: artifactDownload(PRODUCT_STATUS.LOCAL, "apps/browser/native/.build/arm64-apple-macosx/release/YNXBrowserNative", "macOS native binary is present in .build, not installer-packaged."),
      web: { status: PRODUCT_STATUS.LOCAL, href: "/docs#browser", note: "Browser web companion route." }
    }
  },
  search: {
    commit: "db8651b68c6e",
    statusNote: "Search is implemented as product logic and companion UI. No dedicated packaged search app is published yet.",
    downloads: {
      web: { status: PRODUCT_STATUS.LOCAL, href: "/docs#search", note: "Search web companion route." }
    }
  },
  finance: {
    commit: "307273b9",
    centralAccepted: true,
    productRelease: {
      href: "/releases/ecosystem-release-registry.json",
      release: "finance-v1.2.0-testnet-preview.2"
    },
    statusNote: "YNX Finance 1.2.0 is publicly deployed as a non-custodial, read-only Testnet workspace. It uses canonical proof-bound Wallet sessions, preserves account isolation, reads real Explorer and Pay evidence, and passed a 10-account / 100-request public concurrency test without cross-account leakage. The current test-signed Android Preview is hosted for direct download; production signing and store release are not claimed.",
    downloads: {
      android: artifactDownload(PRODUCT_STATUS.PREVIEW, "ynx-finance-1.2.0-testnet-preview-307273b9-test-signed.apk", "Test-signed Android Testnet Preview · source 307273b9 · SHA-256 c795f8b5…60dc1 · 77,516,038 bytes · public Finance and canonical Wallet gateways embedded.", "/downloads/ynx-finance-1.2.0-testnet-preview-307273b9-test-signed.apk"),
      ios: { status: PRODUCT_STATUS.PLANNED, note: "Xcode simulator/signed evidence is not currently available." },
      web: { status: PRODUCT_STATUS.LIVE, href: "https://finance.ynxweb4.com/", external: true, downloadHosted: false, note: "Public canonical-Wallet Finance Testnet workspace." }
    }
  },
  mail: {
    commit: "8126a2dae869",
    statusNote: "Mail Android debug APK is generated and cold-start test evidence exists.",
    downloads: {
      android: artifactDownload(PRODUCT_STATUS.LOCAL, "apps/mail/native/android/app/build/outputs/apk/debug/app-debug.apk", "Mail Android debug APK."),
      ios: { status: PRODUCT_STATUS.PLANNED, note: "iOS project exists; simulator evidence pending." },
      web: { status: PRODUCT_STATUS.LOCAL, href: "/docs#mail", note: "Mail web companion." }
    }
  },
  calendar: {
    commit: "8126a2dae869",
    statusNote: "Calendar Android debug APK is generated for testnet workflow.",
    downloads: {
      android: artifactDownload(PRODUCT_STATUS.LOCAL, "apps/calendar/native/android/app/build/outputs/apk/debug/app-debug.apk", "Calendar Android debug APK."),
      ios: { status: PRODUCT_STATUS.PLANNED, note: "iOS project exists; simulator evidence pending." },
      web: { status: PRODUCT_STATUS.LOCAL, href: "/docs#calendar", note: "Calendar web companion." }
    }
  },
  dex: {
    commit: "d0f767d7",
    statusNote: "The public DEX Testnet preview is live as an indexed, read-only market surface with real token, pool and transaction endpoints and bounded multi-user access. It currently shows no pools or swaps because Chain 6423 does not execute general EVM bytecode; order routing, liquidity actions and Wallet signing therefore fail closed rather than fabricating activity.",
    downloads: {
      web: { status: PRODUCT_STATUS.LIVE, href: "https://dex.ynxweb4.com/", external: true, downloadHosted: false, note: "Public read-only DEX Testnet preview backed by indexed YNX activity." }
    }
  }
};

const attachEvidence = (entry) => {
  const matched = evidence[entry.key] || null;
  if (!matched) {
    return entry;
  }

  return {
    ...entry,
    route: PRODUCT_ROUTES[entry.key],
    legacyRoute: LEGACY_PRODUCT_ROUTES[entry.key],
    publicEntry: entry.entry,
    entry: { label: "Product status", href: PRODUCT_ROUTES[entry.key] },
    release: {
      commit: matched.commit,
      statusNote: matched.statusNote,
      centralAccepted: matched.centralAccepted === true,
      productRelease: matched.productRelease || null
    },
    downloads: {
      ...makeDownloads(),
      ...(entry.downloads || {}),
      ...(matched.downloads || {})
    }
  };
};

const docsAnchor = (section) => {
  const docsInternal = apiConfig.docsUrl.startsWith("/");
  return {
    href: `${docsInternal ? apiConfig.docsUrl : apiConfig.docsRepoUrl}#${section}`,
    external: !docsInternal
  };
};

const ecosystemLink = () => {
  const ecosystemInternal = apiConfig.ecosystemUrl.startsWith("/");
  return { href: ecosystemInternal ? apiConfig.ecosystemUrl : apiConfig.ecosystemRepoUrl, external: !ecosystemInternal };
};

const exchangeLink = () => {
  const exchangeInternal = apiConfig.exchangeUrl.startsWith("/");
  return { href: exchangeInternal ? apiConfig.exchangeUrl : apiConfig.exchangeRepoUrl, external: !exchangeInternal };
};

const web = (status = PRODUCT_STATUS.NOT_READY, href = null, note = "") => ({
  ...makeDownloads(),
  web: href ? { label: "Web", status, href, note } : makeDownloads().web
});

export const getCatalog = () => [
  {
    key: "wallet",
    name: "YNX Wallet",
    icon: WalletCards,
    status: PRODUCT_STATUS.LOCAL,
    detail: "Wallet-first login exists for testnet workflows. Canonical envelope and wallet-only session binding remain central-environment dependent.",
    entry: { label: "Wallet entry", href: "/docs#wallet" },
    docs: { ...docsAnchor("wallet"), label: "Wallet docs" },
    downloads: web(PRODUCT_STATUS.LOCAL, "/docs#wallet", "In-browser session entry + local testnet workflow"),
    metrics: [["Closure", "Wallet-bound identity and vault session"], ["Risk", "No production custody sign-off"], ["Readiness", "Native release not yet published"]]
  },
  {
    key: "social",
    name: "YNX Social",
    icon: MessageCircle,
    status: PRODUCT_STATUS.LOCAL,
    detail: "Social messaging and profile surfaces exist as candidate loop, but public address-book and full moderation loop are still incomplete.",
    entry: { label: "Social entry", href: "/dapp/square" },
    docs: { ...docsAnchor("chat"), label: "Social docs" },
    downloads: web(PRODUCT_STATUS.LOCAL, "/dapp/square", "Social web read/write flow"),
    metrics: [["Closure", "Encrypted thread + profile path"], ["Risk", "No public cross-app address discovery yet"], ["Readiness", "Standalone social install is not shipped"]]
  },
  {
    key: "pay",
    name: "YNX Pay",
    icon: CircleDollarSign,
    status: PRODUCT_STATUS.LOCAL,
    detail: "Invoice issuance, evidence, and refund records are implemented in candidate services.",
    entry: { label: "Pay entry", href: "https://pay.ynxweb4.com/health", external: true },
    docs: { ...docsAnchor("pay"), label: "Pay docs" },
    downloads: web(PRODUCT_STATUS.LOCAL, "/docs#pay", "Pay workflow documentation + API path"),
    metrics: [["Closure", "Intent and invoice traces"], ["Risk", "Provider/provider settlement proof pending"], ["Readiness", "No public checkout app package"]]
  },
  {
    key: "merchantConsole",
    name: "Merchant Console",
    icon: Store,
    status: PRODUCT_STATUS.LOCAL,
    detail: "Merchant dashboard and reconciliation APIs are in candidate state; settlement controls need central integration hardening.",
    entry: { ...exchangeLink(), label: "Merchant console entry" },
    docs: { ...docsAnchor("pay"), label: "Merchant docs" },
    downloads: web(PRODUCT_STATUS.LOCAL, "/docs#pay", "Console-in-product entry path"),
    metrics: [["Closure", "Webhook, order and reconciliation surface"], ["Risk", "No public merchant onboarding approval"], ["Readiness", "No production merchant installer"]]
  },
  {
    key: "card",
    name: "YNX Card",
    icon: CreditCard,
    status: PRODUCT_STATUS.PLANNED,
    detail: "Card is a sandbox product candidate for Pay-linked authorization and review. No issuing, network, banking, or production-card capability is claimed.",
    entry: { label: "Card status", href: "/card" },
    docs: { ...docsAnchor("card"), label: "Card docs" },
    downloads: makeDownloads(),
    metrics: [["Closure", "Sandbox authorization candidate"], ["Risk", "Issuer and regulatory approval absent"], ["Readiness", "No public Card product"]]
  },
  {
    key: "exchange",
    name: "YNX Exchange",
    icon: AppWindow,
    status: PRODUCT_STATUS.LIVE,
    detail: "The public Testnet exchange-integration candidate verifies signed transfers, replay safety, nonce, blocks, receipts, logs, restart persistence, and a fail-closed confirmation policy. No listing is claimed.",
    entry: { label: "Open Exchange", href: "https://exchange.ynxweb4.com/", external: true },
    docs: { ...docsAnchor("exchange"), label: "Exchange docs" },
    downloads: web(PRODUCT_STATUS.LIVE, "https://exchange.ynxweb4.com/", "Public Testnet exchange venue"),
    metrics: [["Closure", "Signed tx + receipts + evidence package"], ["Risk", "No exchange listing is claimed"], ["Readiness", "Production custody and independent review remain pending"]]
  },
  {
    key: "quant",
    name: "YNX Quant",
    icon: BarChart3,
    status: PRODUCT_STATUS.LIVE,
    detail: "A public, stateless Testnet research workspace runs reproducible out-of-sample studies on actual YNX Exchange matches. Every run is isolated; paper, Testnet execution and live funds remain disabled on the public service.",
    entry: { label: "Open Quant", href: "https://quant.ynxweb4.com/", external: true },
    docs: { ...docsAnchor("quant"), label: "Quant rules" },
    downloads: web(PRODUCT_STATUS.LIVE, "https://quant.ynxweb4.com/", "Public isolated Quant research workspace"),
    metrics: [["Closure", "Actual match tape → OOS engine → fees/slippage → result"], ["Concurrency", "100/100 public research runs and 100/100 status reads succeeded"], ["Boundary", "Per-request state; no shared user state, live funds or order submission"]]
  },
  {
    key: "shop",
    name: "YNX Shop",
    icon: Store,
    status: PRODUCT_STATUS.LIVE,
    detail: "A public Testnet marketplace with original demo products, persistent inventory, Wallet-bound profiles and orders, YNXT Pay handoff, Trust evidence, explicit AI permission, privacy export/delete, and twelve UI languages. It is test infrastructure, not a production retail claim.",
    entry: { label: "Open YNX Shop", href: "https://shop.ynxweb4.com/shop/", external: true },
    docs: { ...docsAnchor("shop"), label: "Shop docs" },
    downloads: web(PRODUCT_STATUS.LIVE, "https://shop.ynxweb4.com/shop/", "Public Testnet storefront"),
    metrics: [["Closure", "Catalog, cart, order, Pay, Trust, AI and privacy flows"], ["Risk", "Tax and carrier providers remain unavailable"], ["Readiness", "Public web + debug-signed Android Testnet Preview"]]
  },
  {
    key: "sellerConsole",
    name: "Seller Console",
    icon: FileSpreadsheet,
    status: PRODUCT_STATUS.LIVE,
    detail: "A public Testnet seller workspace for store policy, catalog, inventory, orders, fulfillment, refunds, settlement evidence, eight-role team authority, Wallet-bound invitations/revocations, external provider governance, data export and audit history. It does not claim tax/carrier availability or production commerce.",
    entry: { label: "Open Seller Console", href: "https://seller.ynxweb4.com/seller/", external: true },
    docs: { ...docsAnchor("shop"), label: "Seller docs" },
    downloads: web(PRODUCT_STATUS.LIVE, "https://seller.ynxweb4.com/seller/", "Public Testnet Seller Console"),
    metrics: [["Closure", "Store → catalog → order → settlement/refund → audit"], ["Risk", "Tax/carrier unavailable; Wallet session required"], ["Readiness", "Public web + 8 roles + governed integrations"]]
  },
  {
    key: "developer",
    name: "YNX Developer",
    icon: SquarePen,
    status: PRODUCT_STATUS.LIVE,
    detail: "A public Testnet Web IDE and native desktop preview for projects, Solidity diagnostics, tests, API Studio, checkpoints, permissioned AI proposals and Wallet-only deployment review. It never stores a deploy private key and does not convert compile output into a deployment claim.",
    entry: { label: "Open YNX Developer", href: "https://developer.ynxweb4.com/", external: true },
    docs: { ...docsAnchor("ide"), label: "Developer docs" },
    downloads: web(PRODUCT_STATUS.LIVE, "https://developer.ynxweb4.com/", "Public Testnet Web IDE"),
    metrics: [["Closure", "Project → edit → diagnose → test → build → Wallet review → Explorer proof"], ["Risk", "Unsigned desktop preview; AI/provider and central Wallet paths fail closed"], ["Readiness", "Public web + official macOS/Windows downloads"]]
  },
  {
    key: "explorer",
    name: "YNX Explorer",
    icon: Search,
    status: PRODUCT_STATUS.LIVE,
    detail: "Live block/tx/account search with SSE updates and stale/catching-up indicators.",
    entry: { label: "Open Explorer", href: apiConfig.explorerUrl, external: true },
    docs: { ...docsAnchor("explorer"), label: "Explorer docs" },
    downloads: web(PRODUCT_STATUS.LIVE, apiConfig.explorerUrl, "Live public explorer deployment"),
    metrics: [["Closure", "Chain data evidence"], ["Risk", "Read-only explorer boundary"], ["Readiness", "Public deployment is externalized" ]]
  },
  {
    key: "monitor",
    name: "YNX Monitor",
    icon: MonitorCog,
    status: PRODUCT_STATUS.LIVE,
    detail: "A public Testnet status window plus a separate private operations control plane. The public feed exposes only signed, fresh, redacted service availability; scoped operators handle alert acknowledgement, incident progression, evidence export, backup and restore verification, and non-executing rollback proposals.",
    entry: { label: "Open YNX Monitor", href: "https://monitor.ynxweb4.com/", external: true },
    docs: { ...docsAnchor("monitor"), label: "Monitor docs" },
    downloads: web(PRODUCT_STATUS.LIVE, "https://monitor.ynxweb4.com/", "Live signed Testnet status"),
    metrics: [["Closure", "Probe → signed status → incident → independent recovery evidence"], ["Risk", "Canonical Wallet role acceptance and hosted recovery drill remain open"], ["Readiness", "Public HTTPS status + 25-worker concurrency evidence"]]
  },
  {
    key: "ai",
    name: "YNX AI",
    icon: Brain,
    status: PRODUCT_STATUS.LIVE,
    detail: "A public, provider-neutral Testnet workspace for conversations, explicit product context, bounded attachments, streaming/cancel/retry, tool previews and privacy controls. AI may explain or propose, but it cannot sign, pay, trade, publish, delete external data or widen permissions. Gateway readiness and provider generation are separate: the latest real provider attempt was rate-limited, so the product shows unavailable instead of a fabricated answer.",
    entry: { label: "Open YNX AI", href: "https://assistant.ynxweb4.com/", external: true },
    docs: { ...docsAnchor("ai"), label: "AI docs" },
    downloads: web(PRODUCT_STATUS.LIVE, "https://assistant.ynxweb4.com/", "Public permission-bound YNX AI Testnet workspace"),
    metrics: [["Closure", "Context → stream → review → approved-not-executed audit"], ["Risk", "Provider generation is currently rate-limited; Wallet central acceptance is pending"], ["Readiness", "Public HTTPS Web + 25-worker concurrency evidence; native downloads not hosted"]]
  },
  {
    key: "trust",
    name: "YNX Trust Center",
    icon: ShieldCheck,
    status: PRODUCT_STATUS.LOCAL,
    detail: "Evidence review, appeals, corrections, transparency and verified backup/restore are available as a bounded Testnet Preview; AI cannot make final decisions or control YNXT.",
    entry: { label: "Trust entry", href: "https://trust.ynxweb4.com/health", external: true },
    docs: { ...docsAnchor("trust"), label: "Trust docs" },
    downloads: web(PRODUCT_STATUS.LOCAL, "/docs#trust", "Trust docs path + visibility"),
    metrics: [["Closure", "Request validity, appeal, export + restore"], ["Risk", "Unsigned preview; no asset-control authority"], ["Readiness", "Hosted Linux server + CLI Testnet Preview"]]
  },
  {
    key: "resource",
    name: "YNX Resource Market",
    icon: Database,
    status: PRODUCT_STATUS.LIVE,
    detail: "A public Testnet workspace for evidenced providers, capacity offers, matching, sealed procurement, exact quote intents, signed metering, disputes and reconciled receipts. It never treats a quote as reservation or settlement, and YNXT movement remains outside the product.",
    entry: { label: "Open Resource Market", href: "https://resource.ynxweb4.com/app/", external: true },
    docs: { ...docsAnchor("resource"), label: "Resource docs" },
    downloads: web(PRODUCT_STATUS.LIVE, "https://resource.ynxweb4.com/app/", "Public Wallet-gated Resource Market Testnet Preview"),
    metrics: [["Closure", "Provider → quote → intent → meter → dispute/receipt workspace"], ["Risk", "Central Wallet acceptance and public settlement proof remain pending"], ["Readiness", "Public HTTPS Web + 100/100 concurrency evidence"]]
  },
  {
    key: "music",
    name: "YNX Music",
    icon: Headphones,
    status: PRODUCT_STATUS.LOCAL,
    detail: "Music catalog, playback and identity-aware access loops are in candidate web scope.",
    entry: { label: "Music entry", href: "/docs#music" },
    docs: { ...docsAnchor("music"), label: "Music docs" },
    downloads: web(PRODUCT_STATUS.LOCAL, "/docs#music", "Candidate music web flow"),
    metrics: [["Closure", "Catalog + playback"], ["Risk", "Rights and revenue pipeline partial"], ["Readiness", "No production music app"]]
  },
  {
    key: "video",
    name: "YNX Video",
    icon: PlaySquare,
    status: PRODUCT_STATUS.LOCAL,
    detail: "Playback and upload candidates exist with metadata and moderation hooks.",
    entry: { label: "Video entry", href: "/docs#video" },
    docs: { ...docsAnchor("video"), label: "Video docs" },
    downloads: web(PRODUCT_STATUS.LOCAL, "/docs#video", "Candidate video web flow"),
    metrics: [["Closure", "Viewer + uploader path"], ["Risk", "Moderation and copyright pipeline"], ["Readiness", "No production media app package"]]
  },
  {
    key: "creatorStudio",
    name: "Creator Studio",
    icon: Brush,
    status: PRODUCT_STATUS.PLANNED,
    detail: "Creator workflow tooling is not yet separated as a closed-loop production app.",
    entry: { label: "Creator entry", href: "/docs#video" },
    docs: { ...docsAnchor("creator"), label: "Creator docs" },
    downloads: makeDownloads(),
    metrics: [["Closure", "Upload metadata + subtitle"], ["Risk", "Monetization and rights audit"], ["Readiness", "No production creator package"]]
  },
  {
    key: "cloud",
    name: "YNX Cloud",
    icon: Cloud,
    status: PRODUCT_STATUS.LOCAL,
    detail: "File store namespace, version markers and sharing loop are in candidate state with recovery work pending.",
    entry: { label: "Cloud entry", href: "/docs#cloud" },
    docs: { ...docsAnchor("cloud"), label: "Cloud docs" },
    downloads: web(PRODUCT_STATUS.LOCAL, "/docs#cloud", "Cloud web companion"),
    metrics: [["Closure", "Version + share semantics"], ["Risk", "Recovery and conflict handling"], ["Readiness", "No production package" ]]
  },
  {
    key: "docs",
    name: "YNX Docs",
    icon: AppWindow,
    status: PRODUCT_STATUS.LOCAL,
    detail: "Collaborative docs and revision surfaces are candidate ready with in-product editor path.",
    entry: { label: "Docs entry", href: "/docs#docs" },
    docs: { ...docsAnchor("docs"), label: "Docs docs" },
    downloads: web(PRODUCT_STATUS.LOCAL, "/docs#docs", "Docs web companion"),
    metrics: [["Closure", "Edit + history + export"], ["Risk", "Offline conflict and recovery"], ["Readiness", "No production docs package"]]
  },
  {
    key: "browser",
    name: "YNX Browser",
    icon: Globe,
    status: PRODUCT_STATUS.PLANNED,
    detail: "Browser permissions and safe navigation are in earlier candidate stage; privacy guardrail and provider contracts are not productionized.",
    entry: { label: "Browser entry", href: "/docs#browser" },
    docs: { ...docsAnchor("browser"), label: "Browser docs" },
    downloads: makeDownloads(),
    metrics: [["Closure", "Permissions + safe browsing"], ["Risk", "Provider privacy and phishing controls"], ["Readiness", "No browser installer"]]
  },
  {
    key: "search",
    name: "YNX Search",
    icon: ScanSearch,
    status: PRODUCT_STATUS.PLANNED,
    detail: "Search index and ranking candidate exists; provider contract and privacy handling remain incomplete.",
    entry: { label: "Search entry", href: "/docs#search" },
    docs: { ...docsAnchor("search"), label: "Search docs" },
    downloads: makeDownloads(),
    metrics: [["Closure", "Query + result pipeline"], ["Risk", "Unavailable error behavior"], ["Readiness", "No public package"]]
  },
  {
    key: "finance",
    name: "YNX Finance",
    icon: CircleDollarSign,
    status: PRODUCT_STATUS.LIVE,
    detail: "A public, non-custodial personal-finance workspace for real YNXT activity, evidence-linked Pay receipts, private budgets, notes, statements and reviewable AI drafts. Canonical Wallet proofs isolate every account and Finance cannot sign, trade, withdraw or move assets.",
    entry: { label: "Open Finance", href: "https://finance.ynxweb4.com/", external: true },
    docs: { ...docsAnchor("finance"), label: "Finance docs" },
    downloads: web(PRODUCT_STATUS.LIVE, "https://finance.ynxweb4.com/", "Public canonical-Wallet Finance Testnet workspace"),
    metrics: [["Closure", "Wallet → real sources → private planning → statements/export"], ["Concurrency", "10 accounts / 100 public reads; no cross-account leakage"], ["Boundary", "Read-only YNXT evidence; no custody, signing, trading or withdrawals"]]
  },
  {
    key: "mail",
    name: "YNX Mail",
    icon: Mail,
    status: PRODUCT_STATUS.LOCAL,
    detail: "Mail draft/send/retrieve candidate is in review with provider contract, delivery, and recovery loops incomplete.",
    entry: { label: "Mail entry", href: "/docs#mail" },
    docs: { ...docsAnchor("mail"), label: "Mail docs" },
    downloads: web(PRODUCT_STATUS.LOCAL, "/docs#mail", "Mail web companion"),
    metrics: [["Closure", "Draft + attachment logic"], ["Risk", "Provider delivery proof"], ["Readiness", "No production mail package"]]
  },
  {
    key: "calendar",
    name: "YNX Calendar",
    icon: CalendarDays,
    status: PRODUCT_STATUS.LOCAL,
    detail: "Calendar event lifecycle is in candidate scope with invite/repeat/time-zone edge cases flagged for final closure.",
    entry: { label: "Calendar entry", href: "/docs#calendar" },
    docs: { ...docsAnchor("calendar"), label: "Calendar docs" },
    downloads: web(PRODUCT_STATUS.LOCAL, "/docs#calendar", "Calendar web companion"),
    metrics: [["Closure", "Invite + reminder flow"], ["Risk", "Time-zone and repeat conflicts"], ["Readiness", "No production calendar package"]]
  },
  {
    key: "dex",
    name: "YNX DEX",
    icon: Repeat2,
    status: PRODUCT_STATUS.LIVE,
    detail: "A public read-only DEX Testnet preview for indexed tokens, pools and transfer activity. It currently has no executable swaps or liquidity because Chain 6423 does not yet execute general EVM bytecode; unavailable actions remain visibly disabled.",
    entry: { label: "Open DEX", href: "https://dex.ynxweb4.com/", external: true },
    docs: { ...docsAnchor("dex"), label: "DEX docs" },
    downloads: web(PRODUCT_STATUS.LIVE, "https://dex.ynxweb4.com/", "Public indexed DEX Testnet preview"),
    metrics: [["Closure", "Indexer → token/pool/transaction APIs → public UI"], ["Risk", "No EVM execution, audited liquidity or executable swap"], ["Readiness", "Public read-only surface; trading fails closed"]]
  }
].map(attachEvidence);

export const getProductByRoute = (route) => getCatalog().find((product) => product.route === route) || null;

export const getLegacyDAppRedirect = (route) => {
  const product = getCatalog().find((entry) => entry.legacyRoute === route);
  return product?.route || null;
};
