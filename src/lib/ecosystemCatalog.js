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
  Repeat2
} from "lucide-react";
import { apiConfig } from "./api/ynxApi.js";

export const PRODUCT_STATUS = {
  LIVE: "live",
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
  ...items
});

const WEBSITE_HOSTED_ARTIFACTS = new Set();

const artifactDownload = (status, artifactPath, note, href = null) => {
  const hosted = !!href || WEBSITE_HOSTED_ARTIFACTS.has(artifactPath);
  return {
    status,
    label: hosted && status === PRODUCT_STATUS.LIVE ? "Web" : undefined,
    href: hosted ? href : null,
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
  windows: "Windows"
};

export const PLATFORM_STATUS = {
  [PRODUCT_STATUS.LIVE]: { text: "Open public web", verb: "ready" },
  [PRODUCT_STATUS.LOCAL]: { text: "Local build only", verb: "local" },
  [PRODUCT_STATUS.PLANNED]: { text: "Incomplete", verb: "future" },
  [PRODUCT_STATUS.NOT_READY]: { text: "Not ready", verb: "blocked" }
};

const PRODUCT_ROUTES = {
  wallet: "/wallet",
  social: "/social",
  pay: "/pay",
  merchantConsole: "/merchant",
  card: "/card",
  exchange: "/exchange",
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
  quant: "/quant",
  bridge: "/bridge",
  mail: "/mail",
  calendar: "/calendar",
  dex: "/dex"
};

const evidence = {
  wallet: {
    commit: "efe827f46710",
    statusNote: "The local candidate has Android APK and web session tests; iOS/desktop not published.",
    downloads: {
      android: artifactDownload(PRODUCT_STATUS.LOCAL, "apps/wallet/android/app/build/outputs/apk/release/app-release.apk", "Android app release (debug-signed, testnet preview)"),
      ios: { status: PRODUCT_STATUS.PLANNED, note: "iOS project exists; simulator/launch evidence not completed on this host." },
      macos: { status: PRODUCT_STATUS.NOT_READY, note: "No macOS package is published for Wallet in this candidate." },
      windows: { status: PRODUCT_STATUS.NOT_READY, note: "No Windows package is published for Wallet in this candidate." }
    }
  },
  social: {
    commit: "8c08bc3fff53",
    statusNote: "Android release exists locally, web companion is available through Square feed route.",
    downloads: {
      android: artifactDownload(PRODUCT_STATUS.LOCAL, "apps/social/android/app/build/outputs/apk/release/app-release.apk", "Android app release (debug-signed, testnet preview)"),
      ios: { status: PRODUCT_STATUS.PLANNED, note: "iOS project exists; simulator/app-store evidence pending." },
      macos: { status: PRODUCT_STATUS.NOT_READY, note: "No published macOS package for this candidate." },
      windows: { status: PRODUCT_STATUS.NOT_READY, note: "No published Windows package for this candidate." }
    }
  },
  pay: {
    commit: "53eb677c0e41",
    statusNote: "The public Testnet Pay companion is deployed with twelve locales. Central payment actions remain fail-closed until the Pay product route is accepted by App Gateway.",
    downloads: {
      web: { status: PRODUCT_STATUS.LIVE, href: "https://pay-app.ynxweb4.com", external: true, note: "Public Testnet invoice, Split Payment, and service-bill companion." },
      android: artifactDownload(PRODUCT_STATUS.LOCAL, "apps/pay/android/app/build/outputs/apk/release/app-release.apk", "Android app release (debug-signed, testnet preview)"),
      ios: { status: PRODUCT_STATUS.PLANNED, note: "iOS project exists; simulator/signed App Store evidence pending." },
      macos: { status: PRODUCT_STATUS.NOT_READY, note: "No published macOS package for this candidate." },
      windows: { status: PRODUCT_STATUS.NOT_READY, note: "No published Windows package for this candidate." }
    }
  },
  merchantConsole: {
    commit: "e5c6cc0774be",
    statusNote: "The public Merchant Console preview is deployed. Wallet sign-in and mutation routes remain fail-closed until the central merchant registry is deployed.",
    downloads: {
      web: { status: PRODUCT_STATUS.LIVE, href: "https://merchant.ynxweb4.com", external: true, note: "Public Testnet merchant operations preview." }
    }
  },
  card: {
    commit: "358fb555",
    statusNote: "The public Card Testnet preview is deployed. It is a deterministic sandbox with no BIN, issuer partnership, fiat balance, or real-world spendability.",
    downloads: {
      web: { status: PRODUCT_STATUS.LIVE, href: "https://card.ynxweb4.com", external: true, note: "Public fail-closed sandbox Card preview." }
    }
  },
  exchange: {
    commit: "fc2276e1ce4c",
    centralAccepted: true,
    productRelease: {
      href: "/releases/exchange/fc2276e1ce4c/product-release.json",
      release: "1.0.0-testnet-candidate"
    },
    statusNote: "The deterministic Testnet exchange-integration package is centrally accepted and source-commit bound. Production custody, signing, listing, partnership, and mainnet remain unapproved.",
    downloads: {
      android: artifactDownload(PRODUCT_STATUS.LOCAL, "apps/exchange/mobile/android/app/build/outputs/apk/release/app-release.apk", "Android app release (debug-signed, testnet preview)"),
      ios: { status: PRODUCT_STATUS.PLANNED, note: "iOS project exists; simulator proof/ signing evidence pending." },
      macos: { status: PRODUCT_STATUS.NOT_READY, note: "No published Exchange macOS package in this candidate." },
      windows: { status: PRODUCT_STATUS.NOT_READY, note: "No published Exchange Windows package in this candidate." }
    }
  },
  shop: {
    commit: "ef0456a6111e",
    statusNote: "Buyer Android debug package exists; seller console is web/desktop pending separate package work.",
    downloads: {
      android: artifactDownload(PRODUCT_STATUS.LOCAL, "apps/shop/native/android/app/build/outputs/apk/debug/app-debug.apk", "Android debug APK (local-only test verification).") ,
      ios: { status: PRODUCT_STATUS.PLANNED, note: "iOS project exists; simulator evidence pending." },
      macos: { status: PRODUCT_STATUS.NOT_READY, note: "No published Shop macOS package in this candidate." },
      windows: { status: PRODUCT_STATUS.NOT_READY, note: "No published Shop Windows package in this candidate." }
    }
  },
  sellerConsole: {
    commit: "ef0456a6111e",
    statusNote: "Seller console remains web/product API driven. Native app package not provided yet.",
    downloads: {
      web: { status: PRODUCT_STATUS.LOCAL, href: "/docs#shop", note: "Seller controls are exposed via dedicated companion docs and product routes." }
    }
  },
  developer: {
    commit: "7c4d83f77d07",
    statusNote: "Web IDE and local macOS Testnet Preview bundle are available. Windows local compile exists without packaged artifact.",
    downloads: {
      web: { status: PRODUCT_STATUS.LOCAL, href: "/docs#ide", note: "Web IDE candidate documentation; no public IDE deployment is registered." },
      android: { status: PRODUCT_STATUS.NOT_READY, note: "No native Android package published for Developer in this candidate." },
      ios: { status: PRODUCT_STATUS.NOT_READY, note: "No iOS package published for Developer in this candidate." },
      macos: artifactDownload(PRODUCT_STATUS.LOCAL, "apps/developer/.ynx-developer-local/ynx-developer-testnet-preview-macos-unsigned.zip", "Unsigned Testnet Preview macOS zip; no production signature."),
      windows: { status: PRODUCT_STATUS.PLANNED, note: "Windows WPF/WebView2 project exists; compiled package evidence pending." }
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
    commit: "d4b4a3e5d7d6",
    statusNote: "Monitor is web/operator-focused with protected deployment proof only; no native package published.",
    downloads: {
      web: { status: PRODUCT_STATUS.LOCAL, href: "/docs#monitor", note: "Monitor web companion with operator auth and audit views." }
    }
  },
  ai: {
    commit: "fb4afc0025e6",
    statusNote: "Android release is generated. iOS/desktop package is under construction.",
    downloads: {
      android: artifactDownload(PRODUCT_STATUS.LOCAL, "apps/ai/mobile/android/app/build/outputs/apk/release/app-release.apk", "Android app release (debug-signed, testnet preview)"),
      ios: { status: PRODUCT_STATUS.PLANNED, note: "iOS project generated; simulator evidence pending." },
      macos: { status: PRODUCT_STATUS.NOT_READY, note: "No published AI macOS package in this candidate." },
      windows: { status: PRODUCT_STATUS.NOT_READY, note: "No published AI Windows package in this candidate." }
    }
  },
  trust: {
    commit: "c7e4445598a7",
    statusNote: "Trust-center Android debug package is generated for this candidate.",
    downloads: {
      android: artifactDownload(PRODUCT_STATUS.LOCAL, "apps/trust-center/mobile/android/app/build/outputs/apk/debug/app-debug.apk", "Trust Center Android debug APK."),
      ios: { status: PRODUCT_STATUS.PLANNED, note: "iOS project exists; simulator signing evidence pending." },
      web: { status: PRODUCT_STATUS.LOCAL, href: "https://trust.ynxweb4.com/health", external: true, note: "API/health route used as trust companion reference." }
    }
  },
  resource: {
    commit: "c7e4445598a7",
    statusNote: "Resource market Android debug package is generated for this candidate.",
    downloads: {
      android: artifactDownload(PRODUCT_STATUS.LOCAL, "apps/resource-market/mobile/android/app/build/outputs/apk/debug/app-debug.apk", "Resource Market Android debug APK."),
      ios: { status: PRODUCT_STATUS.PLANNED, note: "iOS project exists; simulator/signing evidence pending." },
      web: { status: PRODUCT_STATUS.LOCAL, href: "/docs#resource", note: "Resource market companion docs and API surfaces are available." }
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
    commit: "7dc93a216e59",
    statusNote: "The public Finance companion is deployed as a source-bound read-only budget, category, portfolio, report, and AI-draft surface.",
    downloads: {
      android: artifactDownload(PRODUCT_STATUS.LOCAL, "apps/finance/mobile/android/app/build/outputs/apk/release/app-release.apk", "Finance Android release APK (debug-signed, testnet preview)"),
      ios: { status: PRODUCT_STATUS.PLANNED, note: "Xcode simulator/signed evidence is not currently available." },
      web: { status: PRODUCT_STATUS.LIVE, href: "https://finance.ynxweb4.com", external: true, note: "Public Testnet Finance companion." }
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
    statusNote: "The public DEX preview and concentrated-liquidity accounting core are deployed. Swap and liquidity mutations remain disabled because the current YNX runtime is not a general Solidity EVM.",
    downloads: {
      web: { status: PRODUCT_STATUS.LIVE, href: "https://dex.ynxweb4.com", external: true, note: "Public read-only DEX preview; execution fails closed." }
    }
  },
  quant: {
    commit: "37d8bb9d9446",
    statusNote: "The public Quant lab is deployed with deterministic strategy evidence, high-water-mark billing, and a review-only execution boundary.",
    downloads: {
      web: { status: PRODUCT_STATUS.LIVE, href: "https://quant.ynxweb4.com", external: true, note: "Public Testnet Quant lab." }
    }
  },
  bridge: {
    commit: "fc82c236",
    statusNote: "The public Bridge monitor reads live coordinator, provider, route, contract, and safety evidence. External transfer submission remains disabled.",
    downloads: {
      web: { status: PRODUCT_STATUS.LIVE, href: "https://bridge-app.ynxweb4.com", external: true, note: "Public live-evidence Bridge route monitor." }
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
    entry: { label: "Social entry", href: "/square" },
    docs: { ...docsAnchor("chat"), label: "Social docs" },
    downloads: web(PRODUCT_STATUS.LOCAL, "/square", "Social web read/write flow"),
    metrics: [["Closure", "Encrypted thread + profile path"], ["Risk", "No public cross-app address discovery yet"], ["Readiness", "Standalone social install is not shipped"]]
  },
  {
    key: "pay",
    name: "YNX Pay",
    icon: CircleDollarSign,
    status: PRODUCT_STATUS.LIVE,
    detail: "Open signed invoices, Split Payments, and Quant service bills in a twelve-language public companion. Payment mutations stay disabled until central product routing is accepted.",
    entry: { label: "Open YNX Pay", href: "https://pay-app.ynxweb4.com", external: true },
    docs: { ...docsAnchor("pay"), label: "Pay docs" },
    downloads: web(PRODUCT_STATUS.LOCAL, "/docs#pay", "Pay workflow documentation + API path"),
    metrics: [["Closure", "Invoice + split + service-bill review"], ["Risk", "Central mutation route pending"], ["Readiness", "Public companion live; payment fails closed"]]
  },
  {
    key: "merchantConsole",
    name: "Merchant Console",
    icon: Store,
    status: PRODUCT_STATUS.LIVE,
    detail: "Public merchant operations console for invoices, orders, refunds, disputes, reconciliation, and evidence. Authenticated changes remain centrally gated.",
    entry: { label: "Open Merchant Console", href: "https://merchant.ynxweb4.com", external: true },
    docs: { ...docsAnchor("pay"), label: "Merchant docs" },
    downloads: web(PRODUCT_STATUS.LOCAL, "/docs#pay", "Console-in-product entry path"),
    metrics: [["Closure", "Webhook, order and reconciliation surface"], ["Risk", "No public merchant onboarding approval"], ["Readiness", "No production merchant installer"]]
  },
  {
    key: "card",
    name: "YNX Card",
    icon: CreditCard,
    status: PRODUCT_STATUS.LIVE,
    detail: "A public, fail-closed card sandbox for lifecycle, spend controls, activity, disputes, and review-only AI. It is not a real-world payment card.",
    entry: { label: "Open Card preview", href: "https://card.ynxweb4.com", external: true },
    docs: { ...docsAnchor("card"), label: "Card docs" },
    downloads: makeDownloads(),
    metrics: [["Closure", "Sandbox lifecycle + controls"], ["Risk", "Issuer and regulatory approval absent"], ["Readiness", "Public sandbox preview live"]]
  },
  {
    key: "exchange",
    name: "YNX Exchange",
    icon: AppWindow,
    status: PRODUCT_STATUS.LIVE,
    detail: "The public Testnet exchange-integration candidate verifies signed transfers, replay safety, nonce, blocks, receipts, logs, restart persistence, and a fail-closed confirmation policy. No listing is claimed.",
    entry: { ...exchangeLink(), label: "Exchange entry" },
    docs: { ...docsAnchor("exchange"), label: "Exchange docs" },
    downloads: web(PRODUCT_STATUS.LIVE, "/trading", "Public Testnet exchange integration route"),
    metrics: [["Closure", "Signed tx + receipts + evidence package"], ["Risk", "No exchange listing is claimed"], ["Readiness", "Production custody and independent review remain pending"]]
  },
  {
    key: "shop",
    name: "YNX Shop",
    icon: Store,
    status: PRODUCT_STATUS.PLANNED,
    detail: "Marketplace buyer flow has partial product scaffolding. Payment and settlement coupling remains partial in candidate scope.",
    entry: { label: "Shop entry", href: "/docs#shop" },
    docs: { ...docsAnchor("shop"), label: "Shop docs" },
    downloads: makeDownloads(),
    metrics: [["Closure", "Catalog + cart flow"], ["Risk", "Delivery and refund lifecycle incomplete"], ["Readiness", "No storefront app released"]]
  },
  {
    key: "sellerConsole",
    name: "Seller Console",
    icon: FileSpreadsheet,
    status: PRODUCT_STATUS.PLANNED,
    detail: "Seller-side workflow has candidate controls only and needs fulfillment/audit hardening.",
    entry: { label: "Seller entry", href: "/docs#shop" },
    docs: { ...docsAnchor("shop"), label: "Seller docs" },
    downloads: makeDownloads(),
    metrics: [["Closure", "Orders + payout path"], ["Risk", "No production seller identity flow"], ["Readiness", "No seller console package"]]
  },
  {
    key: "developer",
    name: "YNX Developer",
    icon: SquarePen,
    status: PRODUCT_STATUS.LOCAL,
    detail: "Web IDE with bounded compiler/deploy checks is in candidate integration and needs central verifier completion for release.",
    entry: { label: "Developer entry", href: "/apps#developer" },
    docs: { ...docsAnchor("ide"), label: "Developer docs" },
    downloads: web(PRODUCT_STATUS.LOCAL, "/docs#ide", "Web IDE candidate path"),
    metrics: [["Closure", "Parser, compile and deploy traces"], ["Risk", "Central verifier + native installer pending"], ["Readiness", "No production native package"]]
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
    status: PRODUCT_STATUS.LOCAL,
    detail: "Monitor provides alert, incident, and audit workflow candidates with operator authentication.",
    entry: { label: "Monitor entry", href: "/docs#monitor" },
    docs: { ...docsAnchor("monitor"), label: "Monitor docs" },
    downloads: web(PRODUCT_STATUS.LOCAL, "/docs#monitor", "Candidate monitor web entry"),
    metrics: [["Closure", "Alerting + operator audit"], ["Risk", "Protected deployment proof pending"], ["Readiness", "No public operator service package"]]
  },
  {
    key: "ai",
    name: "YNX AI",
    icon: Brain,
    status: PRODUCT_STATUS.LOCAL,
    detail: "Policy-bounded intent proposal, action review, and replay-tolerant AI gateway path are in candidate service.",
    entry: { label: "AI entry", href: "https://ai.ynxweb4.com/health", external: true },
    docs: { ...docsAnchor("ai"), label: "AI docs" },
    downloads: web(PRODUCT_STATUS.LOCAL, "/ai", "AI gateway web companion"),
    metrics: [["Closure", "Tool proposal and approval"], ["Risk", "Provider dependency and fallback"], ["Readiness", "No production AI client package"]]
  },
  {
    key: "trust",
    name: "YNX Trust Center",
    icon: ShieldCheck,
    status: PRODUCT_STATUS.LOCAL,
    detail: "Trust signals, review, appeal and transparency records are implemented as governance-oriented candidate routes.",
    entry: { label: "Trust entry", href: "https://trust.ynxweb4.com/health", external: true },
    docs: { ...docsAnchor("trust"), label: "Trust docs" },
    downloads: web(PRODUCT_STATUS.LOCAL, "/docs#trust", "Trust docs path + visibility"),
    metrics: [["Closure", "Request validity and appeal"], ["Risk", "No external governance override"], ["Readiness", "No public full governance package"]]
  },
  {
    key: "resource",
    name: "YNX Resource Market",
    icon: Database,
    status: PRODUCT_STATUS.PLANNED,
    detail: "Resource quote, intent and settlement path is in candidate design, but deployment evidence remains pending.",
    entry: { label: "Resource entry", href: "/docs#resource" },
    docs: { ...docsAnchor("resource"), label: "Resource docs" },
    downloads: makeDownloads(),
    metrics: [["Closure", "Quote and settlement logic"], ["Risk", "No production settlement proof"], ["Readiness", "No released resource marketplace package"]]
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
    detail: "A public read-only financial center for portfolio totals, category budgets, cash-flow reports, source evidence, and review-only AI drafts.",
    entry: { label: "Open Finance", href: "https://finance.ynxweb4.com", external: true },
    docs: { ...docsAnchor("finance"), label: "Finance docs" },
    downloads: web(PRODUCT_STATUS.LOCAL, "/docs#finance", "Finance web companion"),
    metrics: [["Closure", "Budget + reports + source evidence"], ["Risk", "Authenticated write registry pending"], ["Readiness", "Public read-only companion live"]]
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
    detail: "A public DEX interface and concentrated-liquidity accounting preview. Current YNX runtime limits keep swaps and liquidity mutations disabled.",
    entry: { label: "Open DEX preview", href: "https://dex.ynxweb4.com", external: true },
    docs: { ...docsAnchor("dex"), label: "DEX docs" },
    downloads: makeDownloads(),
    metrics: [["Closure", "Public UI + accounting core"], ["Risk", "No general EVM contract execution"], ["Readiness", "Read-only preview live"]]
  },
  {
    key: "quant",
    name: "YNX Quant",
    icon: MonitorCog,
    status: PRODUCT_STATUS.LIVE,
    detail: "Deterministic strategy research, signed run evidence, risk limits, performance reporting, and high-water-mark service billing without fabricated live-profit claims.",
    entry: { label: "Open Quant", href: "https://quant.ynxweb4.com", external: true },
    docs: { ...docsAnchor("quant"), label: "Quant docs" },
    downloads: web(PRODUCT_STATUS.LIVE, "https://quant.ynxweb4.com", "Public Testnet Quant lab"),
    metrics: [["Closure", "Strategy + risk + signed evidence"], ["Risk", "Review-only execution boundary"], ["Readiness", "Public Quant lab live"]]
  },
  {
    key: "bridge",
    name: "YNX Bridge",
    icon: Repeat2,
    status: PRODUCT_STATUS.LIVE,
    detail: "Live route, provider, asset, contract, reconciliation, and coordinator evidence. The interface disables transfer submission when no executable route exists.",
    entry: { label: "Open Bridge monitor", href: "https://bridge-app.ynxweb4.com", external: true },
    docs: { ...docsAnchor("bridge"), label: "Bridge docs" },
    downloads: web(PRODUCT_STATUS.LIVE, "https://bridge-app.ynxweb4.com", "Public live-evidence Bridge monitor"),
    metrics: [["Closure", "Live provider + route monitoring"], ["Risk", "No verified executable route"], ["Readiness", "Monitor live; transfer disabled"]]
  }
].map(attachEvidence);

export const getProductByRoute = (route) => getCatalog().find((product) => product.route === route) || null;
