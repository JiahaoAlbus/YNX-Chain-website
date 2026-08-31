import { apiConfig, YNX_6423 } from "./api/ynxApi.js";

export const ECONOMIC_EVIDENCE_VERSION = "ynx-economic-evidence/v1";

const unavailable = (topic, error) => Object.freeze({
  topic,
  source: null,
  asOf: null,
  version: ECONOMIC_EVIDENCE_VERSION,
  coverage: "none",
  state: "unavailable",
  value: null,
  error
});

export const economicEvidence = Object.freeze({
  source: Object.freeze({
    networkStatus: `${apiConfig.apiBase}/status`,
    explorer: apiConfig.explorerUrl,
    documentation: "/docs"
  }),
  asOf: null,
  version: ECONOMIC_EVIDENCE_VERSION,
  coverage: "network-identity-only",
  state: "partial",
  error: "No authoritative public economic-index endpoint is currently published for YNX Testnet.",
  identity: Object.freeze({
    source: "canonical-network-configuration",
    asOf: null,
    version: ECONOMIC_EVIDENCE_VERSION,
    coverage: "network-and-native-asset-identity",
    state: "verified",
    error: null,
    network: YNX_6423.networkName,
    cosmosChainId: YNX_6423.cosmosChainId,
    chainId: YNX_6423.chainId,
    evmChainId: YNX_6423.evmChainId,
    nativeAsset: YNX_6423.nativeCurrency.symbol,
    decimals: YNX_6423.nativeCurrency.decimals,
    mainnet: YNX_6423.mainnet
  }),
  indicators: Object.freeze({
    supply: unavailable("supply", "Current, circulating, maximum, and historical YNXT supply are not available from a public authoritative endpoint."),
    burn: unavailable("burn", "No authoritative public burn ledger or cumulative burned-YNXT endpoint is published."),
    staking: unavailable("staking", "No authoritative public staking, bonded stake, reward, validator-yield, or APR endpoint is published."),
    stablecoin: unavailable("stablecoin", "No issuer-backed stablecoin integration, reserve, supply, or redemption authority is published for YNX Testnet."),
    treasury: unavailable("treasury", "No authoritative public treasury-account inventory, inflow, outflow, or policy ledger is published."),
    solvency: unavailable("solvency", "No independently verified assets, liabilities, reserves, attestations, or solvency ratio is published."),
    liquidity: unavailable("liquidity", "No authoritative public liquidity, TVL, market depth, market price, or volume source is published."),
    fees: unavailable("fees", "No authoritative aggregate fee history, fee schedule, or revenue endpoint is published; transaction fees remain record-specific Explorer data.")
  })
});

export const ECONOMIC_PAGES = Object.freeze({
  "/ynxt": Object.freeze({
    topic: "identity",
    eyebrow: "Native Testnet asset",
    title: "YNXT is the native asset of YNX Testnet.",
    lead: "YNXT pays gas, fees, and network resource costs on chain 6423. Testnet YNXT has no promised monetary value, market price, yield, or mainnet redemption claim.",
    boundaries: [
      "Verified identity: YNX Testnet · 6423 · 0x1917 · YNXT.",
      "YNXT quantities belong to accounts and transactions in the canonical Explorer; this page does not manufacture balances.",
      "Supply, price, market cap, and reward figures remain unavailable until an authoritative public economic index exists."
    ],
    actions: [["View YNXT records in Explorer", `${apiConfig.explorerUrl}/token/YNXT`], ["Request Testnet YNXT", apiConfig.faucetUrl]]
  }),
  "/supply": Object.freeze({
    topic: "supply", eyebrow: "Issuance evidence", title: "Supply is unavailable without an authoritative ledger.",
    lead: "This website does not infer current, circulating, maximum, or historical YNXT supply from account balances, block height, test fixtures, or token labels.",
    boundaries: ["A current total needs a public chain-authoritative supply endpoint.", "Circulating supply also needs a published exclusion policy and covered account set.", "Historical charts require timestamped snapshots from the same authority."], actions: []
  }),
  "/burn": Object.freeze({
    topic: "burn", eyebrow: "Burn evidence", title: "No burned-YNXT total is claimed.",
    lead: "A burn claim requires a protocol-defined mechanism plus a public ledger that distinguishes irreversible burns from ordinary transfers or inaccessible accounts.",
    boundaries: ["No cumulative burn number is synthesized.", "Transfers to an address are not automatically described as burns.", "Burn policy, events, and historical totals remain pending authoritative publication."], actions: []
  }),
  "/staking": Object.freeze({
    topic: "staking", eyebrow: "Staking evidence", title: "Staking and rewards are not advertised as live economics.",
    lead: "The current public Testnet topology must not be converted into invented bonded stake, validator yield, reward rate, or APR figures.",
    boundaries: ["Validator availability is not evidence of stake or rewards.", "No APR, APY, reward, lock period, or expected return is promised.", "Any future staking metric needs protocol, ledger, time-window, and calculation-method evidence."], actions: [["Read validator boundary", "/validators"]]
  }),
  "/stablecoin": Object.freeze({
    topic: "stablecoin", eyebrow: "Stablecoin boundary", title: "No stablecoin issuer support is claimed.",
    lead: "YNX Testnet does not currently publish an issuer-backed stablecoin supply, reserve, redemption, bridge, or official integration authority.",
    boundaries: ["A token label is not issuer approval.", "No reserve value, peg, redemption promise, or supported stablecoin supply is displayed.", "Future claims require issuer provenance and independently verifiable reserve and contract evidence."], actions: [["Read project readiness", "/readiness"]]
  }),
  "/treasury": Object.freeze({
    topic: "treasury", eyebrow: "Treasury evidence", title: "Treasury balances and policy are not inferred.",
    lead: "A public treasury view needs named governed accounts, an inclusion policy, transaction provenance, and a timestamped authority. None is published here yet.",
    boundaries: ["No account is silently classified as treasury.", "No treasury value, allocation, income, or spending number is claimed.", "Governance documents alone do not prove current on-chain balances."], actions: [["Open governance boundary", "/governance"]]
  }),
  "/solvency": Object.freeze({
    topic: "solvency", eyebrow: "Solvency evidence", title: "No solvency ratio is published.",
    lead: "Solvency requires a scoped statement of assets and liabilities, timestamped reserves, covered entities, and independent verification. Chain balances alone are insufficient.",
    boundaries: ["No proof-of-reserves substitute is presented as solvency.", "No liabilities or off-chain obligations are guessed.", "No ratio, audit opinion, or assurance level is claimed."], actions: [["Read risk boundaries", "/risk"]]
  }),
  "/liquidity": Object.freeze({
    topic: "liquidity", eyebrow: "Liquidity evidence", title: "Price, TVL, depth, and volume remain unavailable.",
    lead: "No authoritative market or protocol index currently supports a YNXT price, TVL, pool depth, volume, or slippage claim on this website.",
    boundaries: ["No exchange listing or active market is inferred.", "No TVL is synthesized from balances or contracts.", "No price, volume, depth, or liquidity reward is promised."], actions: [["Read trading boundary", "/trading"]]
  }),
  "/fees": Object.freeze({
    topic: "fees", eyebrow: "Fee evidence", title: "Fees are verified per record, not summarized without an index.",
    lead: "Explorer transaction records can show record-specific fees. This website does not yet publish an authoritative aggregate fee history, fee revenue, burn share, or forecast.",
    boundaries: ["A single transaction does not prove a network-wide fee average.", "No fee revenue or burn allocation is claimed.", "Aggregates need a documented time window, coverage, units, and indexed source."], actions: [["Open YNX Explorer", apiConfig.explorerUrl]]
  }),
  "/whitepaper": Object.freeze({
    topic: "identity", eyebrow: "Evidence-linked documentation", title: "The whitepaper route points to maintained project evidence.",
    lead: "YNX does not publish a decorative or invented PDF as protocol authority. Use the maintained documentation and source repository, where claims can link to implementation and evidence.",
    boundaries: ["Documentation describes the public Testnet and separates current facts from targets.", "Source and runtime evidence remain distinct.", "No mainnet, return, listing, issuer, or partnership promise is made."],
    actions: [["Open maintained documentation", "/docs"], ["Open Chain documentation source", "https://github.com/JiahaoAlbus/YNX-Chain/tree/main/docs"]]
  })
});

export const ECONOMIC_ROUTES = new Set(Object.keys(ECONOMIC_PAGES));

export const ECONOMIC_COMMANDS = Object.entries(ECONOMIC_PAGES).map(([href, page]) => ({
  title: page.title,
  description: page.lead,
  href,
  keywords: `YNXT economics ${page.topic} evidence 6423 0x1917`
}));
