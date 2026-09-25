export const ECOSYSTEM_CATEGORIES = Object.freeze([
  { id: "commerce", label: "Money & commerce", description: "Payments, markets, merchant operations, finance, and exchange workflows.", keys: ["pay", "merchantConsole", "card", "exchange", "quant", "shop", "sellerConsole", "finance", "dex"] },
  { id: "community", label: "Identity & community", description: "Account custody, communication, identity-aware collaboration, and scheduling.", keys: ["wallet", "social", "mail", "calendar"] },
  { id: "builders", label: "Build & operate", description: "Developer, observability, chain-data, documentation, browser, and discovery tools.", keys: ["developer", "explorer", "monitor", "docs", "browser", "search"] },
  { id: "media", label: "AI, media & data", description: "AI-assisted workflows, content, storage, playback, and creator surfaces.", keys: ["ai", "music", "video", "creatorStudio", "cloud"] },
  { id: "trust", label: "Trust & infrastructure", description: "Evidence, governance, appeals, resource quotes, and settlement boundaries.", keys: ["trust", "resource"] },
]);

export const ECOSYSTEM_CATEGORY_BY_PRODUCT = new Map(ECOSYSTEM_CATEGORIES.flatMap((group) => group.keys.map((key) => [key, group.id])));
