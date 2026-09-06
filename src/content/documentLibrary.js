import { DOCUMENT_TRANSLATIONS } from './documentTranslations.js';

// Restored source snapshots; draft/archive text does not establish live capability.
const SOURCE_DOCUMENTS = [
  {
    "id": "whitepaper-execution-and-local-fee-markets",
    "title": "YNX Execution and Local Fee Markets",
    "category": "whitepaper",
    "sourcePath": "docs/whitepaper/EXECUTION_AND_LOCAL_FEE_MARKETS.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": "719e1018267ed5a53e6fae5211c5fd8a1503c35c",
    "sha256": "e1e5f03e5ea67a242a9fbe7f09658a5f38bebc10c64060463b6bfba704e85dc4",
    "bytes": 14916,
    "downloadUrl": "/document-library/docs/whitepaper/EXECUTION_AND_LOCAL_FEE_MARKETS.md",
    "bodyUrls": {
      "en": "/document-library/rendered/whitepaper-execution-and-local-fee-markets.en.json"
    },
    "version": "0.1.1-candidate",
    "updatedAt": "2026-07-22",
    "sourceLocale": "en",
    "status": "draft",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [
      "package-release-check-required",
      "public-evm-execution-unavailable"
    ],
    "translatedBodyLocales": []
  },
  {
    "id": "whitepaper-streambft-specification",
    "title": "YNX StreamBFT Specification",
    "category": "whitepaper",
    "sourcePath": "docs/whitepaper/STREAMBFT_SPECIFICATION.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": "719e1018267ed5a53e6fae5211c5fd8a1503c35c",
    "sha256": "68e08662dc2e57bf6ca0499a40d88cf8497d8c60ecb41ff69ae52c68b3c4de78",
    "bytes": 21409,
    "downloadUrl": "/document-library/docs/whitepaper/STREAMBFT_SPECIFICATION.md",
    "bodyUrls": {
      "en": "/document-library/rendered/whitepaper-streambft-specification.en.json"
    },
    "version": "0.1.1-candidate",
    "updatedAt": "2026-07-22",
    "sourceLocale": "en",
    "status": "draft",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [
      "historical-network-or-economics",
      "public-evm-execution-unavailable"
    ],
    "translatedBodyLocales": []
  },
  {
    "id": "whitepaper-trading-core-ultraliquidity-fairflow",
    "title": "Trading Core, UltraLiquidity, and FairFlow",
    "category": "whitepaper",
    "sourcePath": "docs/whitepaper/TRADING_CORE_ULTRALIQUIDITY_FAIRFLOW.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": "719e1018267ed5a53e6fae5211c5fd8a1503c35c",
    "sha256": "550f812c58f1c2214332a624af0e226ec3bf6e87e9904d856b3e3b4034a0ef04",
    "bytes": 5207,
    "downloadUrl": "/document-library/docs/whitepaper/TRADING_CORE_ULTRALIQUIDITY_FAIRFLOW.md",
    "bodyUrls": {
      "en": "/document-library/rendered/whitepaper-trading-core-ultraliquidity-fairflow.en.json"
    },
    "version": "0.1.0-candidate",
    "updatedAt": "2026-07-22",
    "sourceLocale": "en",
    "status": "draft",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [
      "public-evm-execution-unavailable"
    ],
    "translatedBodyLocales": []
  },
  {
    "id": "whitepaper-ynx-chain-whitepaper",
    "title": "YNX Chain Technical Whitepaper",
    "category": "whitepaper",
    "sourcePath": "docs/whitepaper/YNX_CHAIN_WHITEPAPER.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": "719e1018267ed5a53e6fae5211c5fd8a1503c35c",
    "sha256": "4d0bfbdb7d760c4e11a8fbeb37a81dd2ec95d69abe1ada2c1fec4e3baeaa0f42",
    "bytes": 21078,
    "downloadUrl": "/document-library/docs/whitepaper/YNX_CHAIN_WHITEPAPER.md",
    "bodyUrls": {
      "en": "/document-library/rendered/whitepaper-ynx-chain-whitepaper.en.json"
    },
    "version": "0.2.0-candidate",
    "updatedAt": "2026-07-22",
    "sourceLocale": "en",
    "status": "draft",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [
      "historical-network-or-economics",
      "package-release-check-required",
      "public-evm-execution-unavailable"
    ],
    "translatedBodyLocales": []
  },
  {
    "id": "developers-contract-verification",
    "title": "Contract Verification",
    "category": "developers",
    "sourcePath": "docs/developers/CONTRACT_VERIFICATION.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": null,
    "sha256": "705fe03bdee2bceff60314c72fe04b9eb026882cfe19e4af5d7f8ad15526fb13",
    "bytes": 5244,
    "downloadUrl": "/document-library/docs/developers/CONTRACT_VERIFICATION.md",
    "bodyUrls": {
      "en": "/document-library/rendered/developers-contract-verification.en.json"
    },
    "version": null,
    "updatedAt": null,
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [
      "package-release-check-required",
      "public-evm-execution-unavailable"
    ],
    "translatedBodyLocales": []
  },
  {
    "id": "developers-faucet-guide",
    "title": "Faucet Guide",
    "category": "developers",
    "sourcePath": "docs/developers/FAUCET_GUIDE.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": null,
    "sha256": "1ec0a10928b42409d8262e10403873841743f8943316a50ee1e408e14c89462b",
    "bytes": 1056,
    "downloadUrl": "/document-library/docs/developers/FAUCET_GUIDE.md",
    "bodyUrls": {
      "en": "/document-library/rendered/developers-faucet-guide.en.json"
    },
    "version": null,
    "updatedAt": null,
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [],
    "translatedBodyLocales": []
  },
  {
    "id": "developers-getting-started",
    "title": "Getting Started",
    "category": "developers",
    "sourcePath": "docs/developers/GETTING_STARTED.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": null,
    "sha256": "b7c7248db7f6638d5735b1169ba4bb115c357cee2db0f42b3d19d382cd1ad7e1",
    "bytes": 480,
    "downloadUrl": "/document-library/docs/developers/GETTING_STARTED.md",
    "bodyUrls": {
      "en": "/document-library/rendered/developers-getting-started.en.json"
    },
    "version": null,
    "updatedAt": null,
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [
      "package-release-check-required",
      "public-evm-execution-unavailable"
    ],
    "translatedBodyLocales": []
  },
  {
    "id": "developers-quickstart-foundry",
    "title": "Foundry Quickstart",
    "category": "developers",
    "sourcePath": "docs/developers/QUICKSTART_FOUNDRY.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": null,
    "sha256": "6dd2c89653c25d80e3074d038d678df7d1da0819508d96defc0bd5ecae803cc0",
    "bytes": 1174,
    "downloadUrl": "/document-library/docs/developers/QUICKSTART_FOUNDRY.md",
    "bodyUrls": {
      "en": "/document-library/rendered/developers-quickstart-foundry.en.json"
    },
    "version": null,
    "updatedAt": null,
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [
      "public-evm-execution-unavailable"
    ],
    "translatedBodyLocales": []
  },
  {
    "id": "developers-quickstart-hardhat",
    "title": "Hardhat Quickstart",
    "category": "developers",
    "sourcePath": "docs/developers/QUICKSTART_HARDHAT.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": null,
    "sha256": "034a280c03f63d425fe7a240e7ba7bad7731ce5180ff32483759d475cd6acdcd",
    "bytes": 1465,
    "downloadUrl": "/document-library/docs/developers/QUICKSTART_HARDHAT.md",
    "bodyUrls": {
      "en": "/document-library/rendered/developers-quickstart-hardhat.en.json"
    },
    "version": null,
    "updatedAt": null,
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [
      "package-release-check-required",
      "public-evm-execution-unavailable"
    ],
    "translatedBodyLocales": []
  },
  {
    "id": "developers-quickstart-remix",
    "title": "Remix Quickstart",
    "category": "developers",
    "sourcePath": "docs/developers/QUICKSTART_REMIX.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": null,
    "sha256": "f968c228f975464d3c1e63b151ee7e4bbfb1f8c2fc2c3095a02542d70c0617ca",
    "bytes": 93,
    "downloadUrl": "/document-library/docs/developers/QUICKSTART_REMIX.md",
    "bodyUrls": {
      "en": "/document-library/rendered/developers-quickstart-remix.en.json"
    },
    "version": null,
    "updatedAt": null,
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [
      "public-evm-execution-unavailable"
    ],
    "translatedBodyLocales": []
  },
  {
    "id": "developers-rpc-reference",
    "title": "RPC Reference",
    "category": "developers",
    "sourcePath": "docs/developers/RPC_REFERENCE.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": null,
    "sha256": "d703fd247f49a7c8db6c0ecc4ae6f5844e40df35af0e49fe8cdf513ca14501a0",
    "bytes": 91,
    "downloadUrl": "/document-library/docs/developers/RPC_REFERENCE.md",
    "bodyUrls": {
      "en": "/document-library/rendered/developers-rpc-reference.en.json"
    },
    "version": null,
    "updatedAt": null,
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [],
    "translatedBodyLocales": []
  },
  {
    "id": "developers-sdk-js",
    "title": "JavaScript SDK",
    "category": "developers",
    "sourcePath": "docs/developers/SDK_JS.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": null,
    "sha256": "c7cee4f778a564fc22ca6835addf65598da677447c3b6820326ca1f48495335d",
    "bytes": 1128,
    "downloadUrl": "/document-library/docs/developers/SDK_JS.md",
    "bodyUrls": {
      "en": "/document-library/rendered/developers-sdk-js.en.json"
    },
    "version": null,
    "updatedAt": null,
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [
      "package-release-check-required"
    ],
    "translatedBodyLocales": []
  },
  {
    "id": "developers-sdk-python",
    "title": "Python SDK",
    "category": "developers",
    "sourcePath": "docs/developers/SDK_PYTHON.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": null,
    "sha256": "1703156d929a9af400ceaf42f704a414db218e56968f0be8617356a3362c80e5",
    "bytes": 912,
    "downloadUrl": "/document-library/docs/developers/SDK_PYTHON.md",
    "bodyUrls": {
      "en": "/document-library/rendered/developers-sdk-python.en.json"
    },
    "version": null,
    "updatedAt": null,
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [
      "package-release-check-required"
    ],
    "translatedBodyLocales": []
  },
  {
    "id": "developers-sdk-release-integrity",
    "title": "SDK Release Integrity",
    "category": "developers",
    "sourcePath": "docs/developers/SDK_RELEASE_INTEGRITY.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": null,
    "sha256": "e23aea1990d49975a4153cc61553ef55ab43b59379b5dd4c13b08ccc99fc56dd",
    "bytes": 2209,
    "downloadUrl": "/document-library/docs/developers/SDK_RELEASE_INTEGRITY.md",
    "bodyUrls": {
      "en": "/document-library/rendered/developers-sdk-release-integrity.en.json"
    },
    "version": null,
    "updatedAt": null,
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [
      "package-release-check-required"
    ],
    "translatedBodyLocales": []
  },
  {
    "id": "developers-ynx-shop",
    "title": "YNX Shop developer guide",
    "category": "developers",
    "sourcePath": "docs/developers/YNX_SHOP.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": null,
    "sha256": "b67a6e75da0ca3c3ca034de36227cd1a57fb21150d820d89754b3c16d2cdd236",
    "bytes": 2684,
    "downloadUrl": "/document-library/docs/developers/YNX_SHOP.md",
    "bodyUrls": {
      "en": "/document-library/rendered/developers-ynx-shop.en.json"
    },
    "version": null,
    "updatedAt": null,
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [
      "package-release-check-required",
      "public-evm-execution-unavailable"
    ],
    "translatedBodyLocales": []
  },
  {
    "id": "guides-card-guide",
    "title": "YNX Card Guide",
    "category": "guides",
    "sourcePath": "docs/guides/CARD_GUIDE.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": null,
    "sha256": "eb44c5c90a891a85098f4b9c3670f1c46cb6909d063688bb3891df011f912e18",
    "bytes": 811,
    "downloadUrl": "/document-library/docs/guides/CARD_GUIDE.md",
    "bodyUrls": {
      "en": "/document-library/rendered/guides-card-guide.en.json"
    },
    "version": null,
    "updatedAt": null,
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [],
    "translatedBodyLocales": []
  },
  {
    "id": "guides-cloud-guide",
    "title": "YNX Cloud Guide",
    "category": "guides",
    "sourcePath": "docs/guides/CLOUD_GUIDE.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": null,
    "sha256": "925cc543c4ee4f640bb63b73149d9445b19e381f4827b65aa13f97cb61310f9c",
    "bytes": 708,
    "downloadUrl": "/document-library/docs/guides/CLOUD_GUIDE.md",
    "bodyUrls": {
      "en": "/document-library/rendered/guides-cloud-guide.en.json"
    },
    "version": null,
    "updatedAt": null,
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [],
    "translatedBodyLocales": []
  },
  {
    "id": "guides-developer-guide",
    "title": "YNX Developer Guide",
    "category": "guides",
    "sourcePath": "docs/guides/DEVELOPER_GUIDE.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": "d0f16c2971f33e1e8b9bced947131423f841af2f",
    "sha256": "dfc05da9c2413507e905d78525ad435d0d1b221c3a240f034a3ab4e4a977ee53",
    "bytes": 8845,
    "downloadUrl": "/document-library/docs/guides/DEVELOPER_GUIDE.md",
    "bodyUrls": {
      "en": "/document-library/rendered/guides-developer-guide.en.json"
    },
    "version": "0.1.0-candidate",
    "updatedAt": "2026-07-23",
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [
      "package-release-check-required",
      "public-evm-execution-unavailable"
    ],
    "translatedBodyLocales": []
  },
  {
    "id": "guides-dex-guide",
    "title": "YNX DEX Guide",
    "category": "guides",
    "sourcePath": "docs/guides/DEX_GUIDE.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": null,
    "sha256": "837dc9ec381b408a000a343f92c5079a9c24e74a102afee08c7e4fb070698357",
    "bytes": 2209,
    "downloadUrl": "/document-library/docs/guides/DEX_GUIDE.md",
    "bodyUrls": {
      "en": "/document-library/rendered/guides-dex-guide.en.json"
    },
    "version": null,
    "updatedAt": null,
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [
      "historical-network-or-economics",
      "public-evm-execution-unavailable"
    ],
    "translatedBodyLocales": []
  },
  {
    "id": "guides-exchange-guide",
    "title": "YNX Exchange Integration Guide",
    "category": "guides",
    "sourcePath": "docs/guides/EXCHANGE_GUIDE.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": null,
    "sha256": "82c66da8fb280d90dfd1cb3a84de3c9309e4494e315a1706257997195e5c289b",
    "bytes": 7892,
    "downloadUrl": "/document-library/docs/guides/EXCHANGE_GUIDE.md",
    "bodyUrls": {
      "en": "/document-library/rendered/guides-exchange-guide.en.json"
    },
    "version": "1.0.0-testnet-candidate",
    "updatedAt": "2026-07-28",
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [
      "public-evm-execution-unavailable"
    ],
    "translatedBodyLocales": []
  },
  {
    "id": "guides-quant-guide",
    "title": "YNX Quant Guide",
    "category": "guides",
    "sourcePath": "docs/guides/QUANT_GUIDE.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": null,
    "sha256": "7ac7dbf9159fe9568c7be028fbd6c80c495e23b209799d3cb81172e16e0e0ae3",
    "bytes": 634,
    "downloadUrl": "/document-library/docs/guides/QUANT_GUIDE.md",
    "bodyUrls": {
      "en": "/document-library/rendered/guides-quant-guide.en.json"
    },
    "version": null,
    "updatedAt": null,
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [],
    "translatedBodyLocales": []
  },
  {
    "id": "guides-validator-guide",
    "title": "YNX Validator Guide",
    "category": "guides",
    "sourcePath": "docs/guides/VALIDATOR_GUIDE.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": "d0f16c2971f33e1e8b9bced947131423f841af2f",
    "sha256": "fc9c26695f9f63c98eaf57c8eec4d5767e08d53dfd67739aa4802a6bcec9ffed",
    "bytes": 5915,
    "downloadUrl": "/document-library/docs/guides/VALIDATOR_GUIDE.md",
    "bodyUrls": {
      "en": "/document-library/rendered/guides-validator-guide.en.json"
    },
    "version": "0.1.0-candidate",
    "updatedAt": "2026-07-23",
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [
      "historical-commands",
      "historical-network-or-economics"
    ],
    "translatedBodyLocales": []
  },
  {
    "id": "api-api-reference",
    "title": "API Reference",
    "category": "api",
    "sourcePath": "docs/api/API_REFERENCE.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": null,
    "sha256": "8577404fdfb5b058bc7d3f6ff26413462389908cc49a6e1471dcf3c0a0f6466f",
    "bytes": 71322,
    "downloadUrl": "/document-library/docs/api/API_REFERENCE.md",
    "bodyUrls": {
      "en": "/document-library/rendered/api-api-reference.en.json"
    },
    "version": null,
    "updatedAt": null,
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [
      "historical-network-or-economics",
      "public-evm-execution-unavailable"
    ],
    "translatedBodyLocales": []
  },
  {
    "id": "public-brand-guide",
    "title": "YNX Chain Brand Guide",
    "category": "public",
    "sourcePath": "docs/public/BRAND_GUIDE.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": "719e1018267ed5a53e6fae5211c5fd8a1503c35c",
    "sha256": "81e6ee645e10f463761077281eafe1ea0d72be3b3bd7f8f4e10d494b2dd8fa05",
    "bytes": 5392,
    "downloadUrl": "/document-library/docs/public/BRAND_GUIDE.md",
    "bodyUrls": {
      "en": "/document-library/rendered/public-brand-guide.en.json"
    },
    "version": "1.0.0-candidate",
    "updatedAt": "2026-07-22",
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [],
    "translatedBodyLocales": []
  },
  {
    "id": "public-faq",
    "title": "YNX Chain FAQ",
    "category": "public",
    "sourcePath": "docs/public/FAQ.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": "719e1018267ed5a53e6fae5211c5fd8a1503c35c",
    "sha256": "ab4e04f83dfa371689b7b2a8f8a9cccc1496c2950dc664a46a1b0f3bfd4fd0ee",
    "bytes": 3931,
    "downloadUrl": "/document-library/docs/public/FAQ.md",
    "bodyUrls": {
      "en": "/document-library/rendered/public-faq.en.json"
    },
    "version": "1.0.0-candidate",
    "updatedAt": "2026-07-22",
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [
      "historical-network-or-economics"
    ],
    "translatedBodyLocales": []
  },
  {
    "id": "public-glossary",
    "title": "YNX Public Glossary",
    "category": "public",
    "sourcePath": "docs/public/GLOSSARY.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": "719e1018267ed5a53e6fae5211c5fd8a1503c35c",
    "sha256": "4ee7df2e7b18d91b1cd2ad66227f7e915789074f42c9db403d5764b99fd15d29",
    "bytes": 4770,
    "downloadUrl": "/document-library/docs/public/GLOSSARY.md",
    "bodyUrls": {
      "en": "/document-library/rendered/public-glossary.en.json"
    },
    "version": "1.0.0-candidate",
    "updatedAt": "2026-07-22",
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [],
    "translatedBodyLocales": []
  },
  {
    "id": "public-incident-communication",
    "title": "Incident Communication Plan",
    "category": "public",
    "sourcePath": "docs/public/INCIDENT_COMMUNICATION.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": null,
    "sha256": "966198e3fd6c2ca3ba247e84a5f666c697e0d78c250b8e990b59d22a029db319",
    "bytes": 1453,
    "downloadUrl": "/document-library/docs/public/INCIDENT_COMMUNICATION.md",
    "bodyUrls": {
      "en": "/document-library/rendered/public-incident-communication.en.json"
    },
    "version": "1.0.0-candidate",
    "updatedAt": null,
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [],
    "translatedBodyLocales": []
  },
  {
    "id": "public-launch-plan",
    "title": "Public Documentation and Testnet Launch Plan",
    "category": "public",
    "sourcePath": "docs/public/LAUNCH_PLAN.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": null,
    "sha256": "99dce92ba40ee0fcbf3a4ce5fe70b845329a40119222fdaefd30f89137975ed1",
    "bytes": 1818,
    "downloadUrl": "/document-library/docs/public/LAUNCH_PLAN.md",
    "bodyUrls": {
      "en": "/document-library/rendered/public-launch-plan.en.json"
    },
    "version": "1.0.0-candidate",
    "updatedAt": null,
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [],
    "translatedBodyLocales": []
  },
  {
    "id": "public-localization-terminology",
    "title": "Localization Terminology Pack",
    "category": "public",
    "sourcePath": "docs/public/LOCALIZATION_TERMINOLOGY.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": null,
    "sha256": "0dbaab88b4c4ad7f709c81a7b70ef254546d89d03360bdbe669ef9608f43d2e8",
    "bytes": 2721,
    "downloadUrl": "/document-library/docs/public/LOCALIZATION_TERMINOLOGY.md",
    "bodyUrls": {
      "en": "/document-library/rendered/public-localization-terminology.en.json"
    },
    "version": "0.1.0-candidate",
    "updatedAt": null,
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [],
    "translatedBodyLocales": []
  },
  {
    "id": "public-marketing-claims-evidence-matrix",
    "title": "YNX Marketing Claims Evidence Matrix",
    "category": "public",
    "sourcePath": "docs/public/MARKETING_CLAIMS_EVIDENCE_MATRIX.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": "719e1018267ed5a53e6fae5211c5fd8a1503c35c",
    "sha256": "cec6c5f83a088999e6e6bc4ca90460459ea5ff1132d1f3037add1e9960935769",
    "bytes": 5760,
    "downloadUrl": "/document-library/docs/public/MARKETING_CLAIMS_EVIDENCE_MATRIX.md",
    "bodyUrls": {
      "en": "/document-library/rendered/public-marketing-claims-evidence-matrix.en.json"
    },
    "version": "1.0.0-candidate",
    "updatedAt": "2026-07-22",
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [
      "historical-network-or-economics",
      "package-release-check-required",
      "public-evm-execution-unavailable"
    ],
    "translatedBodyLocales": []
  },
  {
    "id": "public-press-kit",
    "title": "YNX Chain Press Kit",
    "category": "public",
    "sourcePath": "docs/public/PRESS_KIT.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": "719e1018267ed5a53e6fae5211c5fd8a1503c35c",
    "sha256": "32ad93b6ea9bb0721bbd9172df0fe6805cbbe1da0c4967fdd46fe3d253600c68",
    "bytes": 2065,
    "downloadUrl": "/document-library/docs/public/PRESS_KIT.md",
    "bodyUrls": {
      "en": "/document-library/rendered/public-press-kit.en.json"
    },
    "version": "1.0.0-candidate",
    "updatedAt": "2026-07-22",
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [],
    "translatedBodyLocales": []
  },
  {
    "id": "public-public-brand-facts",
    "title": "YNX Public Brand Facts",
    "category": "public",
    "sourcePath": "docs/public/PUBLIC_BRAND_FACTS.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": "c8c4ff7263e50afc4c731dac8157aa85e02232dc",
    "sha256": "9eee5a3e176cd42ea22afd35aaeafaae71ee0b2e6f52f6f856fbec813e7b2a9d",
    "bytes": 4545,
    "downloadUrl": "/document-library/docs/public/PUBLIC_BRAND_FACTS.md",
    "bodyUrls": {
      "en": "/document-library/rendered/public-public-brand-facts.en.json"
    },
    "version": "1.1.0-candidate",
    "updatedAt": "2026-07-25",
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [
      "historical-network-or-economics"
    ],
    "translatedBodyLocales": []
  },
  {
    "id": "public-support-and-disputes",
    "title": "Support, Security Reports, Disputes, and Refunds",
    "category": "public",
    "sourcePath": "docs/public/SUPPORT_AND_DISPUTES.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": null,
    "sha256": "8281e8f6bef4724e591a32e27fb9b94860cc531485e6245fcedabe0722a73987",
    "bytes": 1973,
    "downloadUrl": "/document-library/docs/public/SUPPORT_AND_DISPUTES.md",
    "bodyUrls": {
      "en": "/document-library/rendered/public-support-and-disputes.en.json"
    },
    "version": "1.0.0-candidate",
    "updatedAt": null,
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [],
    "translatedBodyLocales": []
  },
  {
    "id": "public-website-integration-handoff",
    "title": "YNX Chain Website Integration Handoff",
    "category": "public",
    "sourcePath": "docs/public/WEBSITE_INTEGRATION_HANDOFF.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": "ab209455dc1e0e537da2872505ed0bb2b2256609",
    "sha256": "0ba6f97867cfd8f7e88f69bbcaf4d6c98098e3ba4fbb723cd1844a2b73ed7303",
    "bytes": 4480,
    "downloadUrl": "/document-library/docs/public/WEBSITE_INTEGRATION_HANDOFF.md",
    "bodyUrls": {
      "en": "/document-library/rendered/public-website-integration-handoff.en.json"
    },
    "version": "1.1.0-candidate",
    "updatedAt": "2026-07-27",
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [],
    "translatedBodyLocales": []
  },
  {
    "id": "public-search-developer",
    "title": "YNX Developer",
    "category": "public",
    "sourcePath": "docs/public/search/DEVELOPER.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": "719e1018267ed5a53e6fae5211c5fd8a1503c35c",
    "sha256": "6aa8e2db9ec1b0d19b18e5ec6eb6c83126d4db61ffb26834f1bee5383f9c0fd3",
    "bytes": 2383,
    "downloadUrl": "/document-library/docs/public/search/DEVELOPER.md",
    "bodyUrls": {
      "en": "/document-library/rendered/public-search-developer.en.json"
    },
    "version": "1.0.0-candidate",
    "updatedAt": "2026-07-22",
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [
      "package-release-check-required",
      "public-evm-execution-unavailable"
    ],
    "translatedBodyLocales": []
  },
  {
    "id": "public-search-dex",
    "title": "YNX DEX",
    "category": "public",
    "sourcePath": "docs/public/search/DEX.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": "3553ae926e7f2144de7bd7f5a4d4919ebe6a25cf",
    "sha256": "72c7f3f447ec5573f851a9eda4249bd84a1e043d92858936661e35cb817fadf3",
    "bytes": 2682,
    "downloadUrl": "/document-library/docs/public/search/DEX.md",
    "bodyUrls": {
      "en": "/document-library/rendered/public-search-dex.en.json"
    },
    "version": "1.1.0-candidate",
    "updatedAt": "2026-07-22",
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [
      "public-evm-execution-unavailable"
    ],
    "translatedBodyLocales": []
  },
  {
    "id": "public-search-economics",
    "title": "YNX Economics",
    "category": "public",
    "sourcePath": "docs/public/search/ECONOMICS.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": "719e1018267ed5a53e6fae5211c5fd8a1503c35c",
    "sha256": "0484e61cb039ee4e2535c884083dd44d26af9189325df202825c2f9330640075",
    "bytes": 2363,
    "downloadUrl": "/document-library/docs/public/search/ECONOMICS.md",
    "bodyUrls": {
      "en": "/document-library/rendered/public-search-economics.en.json"
    },
    "version": "1.0.0-candidate",
    "updatedAt": "2026-07-22",
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [
      "historical-network-or-economics"
    ],
    "translatedBodyLocales": []
  },
  {
    "id": "public-search-exchange",
    "title": "YNX Exchange",
    "category": "public",
    "sourcePath": "docs/public/search/EXCHANGE.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": "719e1018267ed5a53e6fae5211c5fd8a1503c35c",
    "sha256": "f61b81e4d2a6226a3b650d23ac8a15a9209ae63b8b0332ea6d9f6d121a73352b",
    "bytes": 2260,
    "downloadUrl": "/document-library/docs/public/search/EXCHANGE.md",
    "bodyUrls": {
      "en": "/document-library/rendered/public-search-exchange.en.json"
    },
    "version": "1.0.0-candidate",
    "updatedAt": "2026-07-22",
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [
      "public-evm-execution-unavailable"
    ],
    "translatedBodyLocales": []
  },
  {
    "id": "public-search-products",
    "title": "YNX Products",
    "category": "public",
    "sourcePath": "docs/public/search/PRODUCTS.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": "719e1018267ed5a53e6fae5211c5fd8a1503c35c",
    "sha256": "d0025c0b52e31c11d2c56ac9d3cabeb7f9d71f733acf259e26434416c993ad87",
    "bytes": 3081,
    "downloadUrl": "/document-library/docs/public/search/PRODUCTS.md",
    "bodyUrls": {
      "en": "/document-library/rendered/public-search-products.en.json"
    },
    "version": "1.0.0-candidate",
    "updatedAt": "2026-07-22",
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [
      "public-evm-execution-unavailable"
    ],
    "translatedBodyLocales": []
  },
  {
    "id": "public-search-quant",
    "title": "YNX Quant",
    "category": "public",
    "sourcePath": "docs/public/search/QUANT.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": "719e1018267ed5a53e6fae5211c5fd8a1503c35c",
    "sha256": "0cd39843d1cb43df0da4bbb580ae09adb81a0b201bd5e3cc492b14170d17f481",
    "bytes": 2537,
    "downloadUrl": "/document-library/docs/public/search/QUANT.md",
    "bodyUrls": {
      "en": "/document-library/rendered/public-search-quant.en.json"
    },
    "version": "1.0.0-candidate",
    "updatedAt": "2026-07-22",
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [],
    "translatedBodyLocales": []
  },
  {
    "id": "public-search-security",
    "title": "YNX Security",
    "category": "public",
    "sourcePath": "docs/public/search/SECURITY.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": "719e1018267ed5a53e6fae5211c5fd8a1503c35c",
    "sha256": "06bd84664165a353d280b6b00dbae21bf7ca797f95c32b48d07ecf38595936b7",
    "bytes": 2667,
    "downloadUrl": "/document-library/docs/public/search/SECURITY.md",
    "bodyUrls": {
      "en": "/document-library/rendered/public-search-security.en.json"
    },
    "version": "1.0.0-candidate",
    "updatedAt": "2026-07-22",
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [
      "public-evm-execution-unavailable"
    ],
    "translatedBodyLocales": []
  },
  {
    "id": "public-search-trust",
    "title": "YNX Trust",
    "category": "public",
    "sourcePath": "docs/public/search/TRUST.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": "719e1018267ed5a53e6fae5211c5fd8a1503c35c",
    "sha256": "7da82493359bfb6e499ffec6474d1b3cf1137d3e1741a85a7a376ea171a52af8",
    "bytes": 2507,
    "downloadUrl": "/document-library/docs/public/search/TRUST.md",
    "bodyUrls": {
      "en": "/document-library/rendered/public-search-trust.en.json"
    },
    "version": "1.0.0-candidate",
    "updatedAt": "2026-07-22",
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [],
    "translatedBodyLocales": []
  },
  {
    "id": "public-search-wallet",
    "title": "YNX Wallet",
    "category": "public",
    "sourcePath": "docs/public/search/WALLET.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": "719e1018267ed5a53e6fae5211c5fd8a1503c35c",
    "sha256": "ed5828d15eed7448090639353a6c73b6a43e026c878f940f9e9dbe793cce28dc",
    "bytes": 2821,
    "downloadUrl": "/document-library/docs/public/search/WALLET.md",
    "bodyUrls": {
      "en": "/document-library/rendered/public-search-wallet.en.json"
    },
    "version": "1.0.0-candidate",
    "updatedAt": "2026-07-22",
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [],
    "translatedBodyLocales": []
  },
  {
    "id": "public-search-what-is-ynxt",
    "title": "What Is YNXT?",
    "category": "public",
    "sourcePath": "docs/public/search/WHAT_IS_YNXT.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": "719e1018267ed5a53e6fae5211c5fd8a1503c35c",
    "sha256": "806528039b9d4b477fb9d9dfec423d475cc8910852f042f2cb7d4287331d0a62",
    "bytes": 3323,
    "downloadUrl": "/document-library/docs/public/search/WHAT_IS_YNXT.md",
    "bodyUrls": {
      "en": "/document-library/rendered/public-search-what-is-ynxt.en.json"
    },
    "version": "1.0.0-candidate",
    "updatedAt": "2026-07-22",
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [
      "historical-network-or-economics"
    ],
    "translatedBodyLocales": []
  },
  {
    "id": "public-search-what-is-ynx-chain",
    "title": "What Is YNX Chain?",
    "category": "public",
    "sourcePath": "docs/public/search/WHAT_IS_YNX_CHAIN.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": "719e1018267ed5a53e6fae5211c5fd8a1503c35c",
    "sha256": "f72793d6094ac42c135241d340b37f50a9a2e71f3e35a4cbca22c9546c4b03ef",
    "bytes": 3645,
    "downloadUrl": "/document-library/docs/public/search/WHAT_IS_YNX_CHAIN.md",
    "bodyUrls": {
      "en": "/document-library/rendered/public-search-what-is-ynx-chain.en.json"
    },
    "version": "1.0.0-candidate",
    "updatedAt": "2026-07-22",
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [
      "historical-network-or-economics"
    ],
    "translatedBodyLocales": []
  },
  {
    "id": "public-search-what-is-ynx-web4",
    "title": "What Is YNX Web4?",
    "category": "public",
    "sourcePath": "docs/public/search/WHAT_IS_YNX_WEB4.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": "719e1018267ed5a53e6fae5211c5fd8a1503c35c",
    "sha256": "4c7f48e59a5561a9f4f0ef78ef3fa663a39a56ad8f2498b5c015179fad13e2c0",
    "bytes": 3624,
    "downloadUrl": "/document-library/docs/public/search/WHAT_IS_YNX_WEB4.md",
    "bodyUrls": {
      "en": "/document-library/rendered/public-search-what-is-ynx-web4.en.json"
    },
    "version": "1.0.0-candidate",
    "updatedAt": "2026-07-22",
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [],
    "translatedBodyLocales": []
  },
  {
    "id": "public-search-ynx-testnet-guide",
    "title": "YNX Testnet Guide",
    "category": "public",
    "sourcePath": "docs/public/search/YNX_TESTNET_GUIDE.md",
    "sourceCommit": "90643ffd38d970f526df99e96e818220330710f8",
    "declaredSourceCommit": "719e1018267ed5a53e6fae5211c5fd8a1503c35c",
    "sha256": "4883dd129f42b397f4739639882b3a78686949bc6998c60815a75280b014fb19",
    "bytes": 4307,
    "downloadUrl": "/document-library/docs/public/search/YNX_TESTNET_GUIDE.md",
    "bodyUrls": {
      "en": "/document-library/rendered/public-search-ynx-testnet-guide.en.json"
    },
    "version": "1.0.0-candidate",
    "updatedAt": "2026-07-22",
    "sourceLocale": "en",
    "status": "archive",
    "publicationReviewRequired": true,
    "originalSourcePreserved": true,
    "capabilityFlags": [
      "package-release-check-required",
      "public-evm-execution-unavailable"
    ],
    "translatedBodyLocales": []
  }
];

export const DOCUMENT_LIBRARY = SOURCE_DOCUMENTS.map(source => {
  const translations = DOCUMENT_TRANSLATIONS[source.id] || {};
  return { ...source, translations, bodyUrls: { ...source.bodyUrls, ...Object.fromEntries(Object.entries(translations).map(([locale, body]) => [locale, body.bodyUrl])) }, translatedBodyLocales: Object.keys(translations) };
});

export const WHITEPAPERS = DOCUMENT_LIBRARY.filter(document => document.category === 'whitepaper');
export function getDocumentById(id) { return DOCUMENT_LIBRARY.find(document => document.id === id) || null; }
