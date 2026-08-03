export const ECOSYSTEM_GUIDES = {
  faucet: {
    purpose: "Give a new user test YNXT so they can try the network without buying anything.",
    workflow: ["Enter a YNX or EVM-compatible address.", "The Faucet validates the address and applies the public hourly limit.", "The service submits a real Testnet transfer.", "Open the returned transaction hash in Explorer and wait for finality."],
    rules: ["Testnet only; YNXT has no represented monetary value.", "Maximum 100 YNXT per request and one request per hour per IP/address.", "The Faucet never asks for a seed phrase or private key."],
  },
  wallet: {
    purpose: "Create and protect the identity that approves actions across YNX products.",
    workflow: ["Create or restore an account locally.", "Review the exact product, device, scopes, expiry and callback.", "Approve with the Wallet-held key.", "The product receives a revocable scoped session, never the recovery secret."],
    rules: ["ynx1 is the first-party address; 0x is an EVM compatibility representation.", "Recovery material never leaves Wallet.", "Wrong product, device, scope, expiry, replay or revocation fails closed."],
  },
  social: {
    purpose: "Private identity-aware messaging, profiles, groups and moments.",
    workflow: ["Sign in through Wallet.", "Create device-bound encrypted sessions.", "Send ciphertext and signed social events.", "Rotate devices or delete/export Social, Chat and Square data together."],
    rules: ["Servers store ciphertext, not chat plaintext.", "Social cannot sign payments or expose Wallet recovery material.", "Public discovery and moderation require deployed central services."],
  },
  pay: {
    purpose: "Turn a merchant request into an auditable YNXT payment intent and receipt.",
    workflow: ["Merchant creates an amount- and order-bound intent.", "User reviews amount, fee and recipient.", "Wallet signs the exact transfer.", "Pay reconciles the chain result, receipt, webhook and refund state."],
    rules: ["Idempotency prevents duplicate payment creation.", "A timeout is unknown, not failure; reconcile by transaction hash.", "Pay never invents settlement before chain finality."],
  },
  merchantConsole: {
    purpose: "Let merchants create invoices, monitor orders and reconcile YNXT receipts.",
    workflow: ["Register merchant identity and webhook.", "Create invoice or checkout intent.", "Track pending, confirmed, failed and refunded states.", "Export reconciliation and dispute evidence."],
    rules: ["Merchant identity and order ownership are mandatory.", "Webhook delivery is signed and retry-safe.", "Console status cannot override chain settlement evidence."],
  },
  card: {
    purpose: "Model a Pay-linked card authorization sandbox without claiming a real issued card.",
    workflow: ["Create a sandbox card profile.", "Review a bounded authorization request.", "Approve or decline under explicit limits.", "Record the sandbox result for Pay reconciliation."],
    rules: ["No issuer, banking network or production card is currently claimed.", "No authorization may widen Wallet or Pay permissions.", "Sandbox activity never represents external settlement."],
  },
  exchange: {
    purpose: "Provide a verifiable Testnet exchange-integration surface for deposits, withdrawals and trading evidence.",
    workflow: ["Bind an account through Wallet.", "Submit a signed Testnet transaction or bounded order.", "Reject nonce/replay/tamper errors.", "Reconcile blocks, receipts, logs and account history."],
    rules: ["This is not an exchange listing.", "Production custody and withdrawal need independent approval.", "Only terminal, source-bound evidence becomes confirmed."],
  },
  quant: {
    purpose: "Research strategies with real source-labelled data, deterministic backtests, paper fills and zero-submit shadow observation.",
    workflow: ["Ingest actual YNX-owned matched trades; fewer than 20 makes backtest unavailable.", "Build versioned features and run the signed deterministic built-in strategy worker.", "Evaluate fees, slippage, drawdown, leakage, capacity and walk-forward evidence.", "Run paper simulation, then shadow mode that observes but submits no order.", "Only a later Wallet mandate plus independent Risk approval can enable bounded Testnet execution."],
    rules: ["No synthetic prices, arbitrary user code, Wallet keys or withdrawal authority.", "Paper results are not live PnL and backtest return never selects a strategy alone.", "Kill switch, revoke, stale data, sequence gaps, risk-limit breach or unknown outcome fail closed.", "The public service is research-only and per-request isolated; paper, Testnet order submission and live funds are disabled."],
  },
  shop: {
    purpose: "A buyer marketplace whose checkout pays in YNXT while familiar catalog, cart, order and support flows stay conventional.",
    workflow: ["Search and compare products.", "Add items and delivery information.", "Review total, fees and merchant before Wallet approval.", "Track fulfillment, receipt, refund and dispute as separate states."],
    rules: ["Shop cannot sign for the user.", "Payment confirmation does not prove delivery.", "Refunds require a separate authoritative Pay/chain result."],
  },
  sellerConsole: {
    purpose: "Give an authorized store team one public Testnet workspace for catalog, inventory, orders, fulfillment, refunds, YNXT settlement evidence, integrations, recovery and audit.",
    workflow: ["Sign in through the Seller-specific Wallet product binding; the browser keeps only an in-memory bearer session.", "Create the store and policy, then draft products before an explicit publish action and maintain inventory above reserved units.", "Process only authorized order transitions: paid → shipped → delivered, or return/refund request → explicit decision → authoritative Pay evidence.", "Invite a canonical Wallet account into one of eight least-privilege roles; authority begins only after one-time acceptance and can be revoked with separate local and central-session evidence.", "Configure shipping, tax, address, storage, email, webhook, Pay or Trust providers using secret references rather than secret values, then run bounded health tests.", "Download a store-scoped JSON export and use operator-controlled, integrity-protected backup/rollback procedures for recovery."],
    rules: ["Roles are owner, admin, catalog, inventory, fulfillment, finance, support and viewer; unknown or wider roles fail closed.", "Seller authority never grants buyer Wallet signing, recovery-secret, withdrawal or unrelated-store access.", "Published, paid, refunded, shipped and provider-healthy are separate evidenced states; one cannot silently imply another.", "Tax and carrier APIs remain unavailable until a configured provider passes its own evidence boundary; manual shipping remains unverified.", "Provider secret values never enter Seller Console; only env, vault, KMS or secret-manager references are stored.", "Store authority, orders, settlement/refund evidence and audit history are retained; transient terminal AI jobs and old rate samples alone may be pruned after the minimum retention period."],
  },
  developer: {
    purpose: "Give builders one evidence-first workspace for YNX projects, source editing, Solidity diagnostics, tests, read-only RPC inspection, OpenAPI connector review, reproducible artifacts, permissioned AI proposals and Wallet-only deployment review.",
    workflow: ["Open the public Web IDE or an unsigned desktop Testnet Preview; create or import a local project whose files remain in the browser or selected workspace.", "Connect read-only tooling to YNX Testnet chain ID 6423 / 0x1917 and inspect current network health before relying on a result.", "Edit an allowlisted file, review diagnostics, run bounded tests/tasks and create a named checkpoint before applying a wider change.", "Import OpenAPI 3 JSON into API Studio, reject external references or inline credentials, preview the exact request and approve only an allowlisted sandbox origin.", "For AI Build, choose the exact context and permissions, inspect plan/diff/test output, then explicitly approve, reject or revert; provider and quota failure remain visible.", "Compile with the pinned supported toolchain and retain source, compiler, optimizer, artifact hash and test evidence.", "Review network, contract method, constructor data, gas/fee and artifact hash in YNX Wallet; Developer never receives the deploy private key.", "Open the authoritative receipt in Explorer and separately verify status, contract address and source match before calling the deployment complete."],
    rules: ["The browser workspace is local to each user; public service availability does not expose another user's project.", "Unsigned macOS and Windows packages are Testnet previews, not notarized, Authenticode-signed or store releases.", "Developer, AI Build and the build server cannot hold a Wallet seed, private key, arbitrary withdrawal authority or silently widen a mandate.", "Compile, simulation, Wallet approval, broadcast, final receipt and Explorer/source verification are separate states; no earlier state implies a later one.", "AI output is a proposal with explicit context, permission, cost/provider status, diff and audit; it cannot sign, deploy, pay or approve itself.", "API Studio stores only credential references. A reviewed host broker is required for secret resolution, and unknown origins or undeclared headers fail closed.", "The public Testnet may reset or change; export projects and preserve checkpoints before relying on it for important work.", "The current Developer product calls canonical chain, Wallet, AI and Quant owners; it does not implement a second chain, Wallet or Quant engine."],
  },
  explorer: {
    purpose: "Find and prove blocks, transactions, addresses, transfers, validators and balances.",
    workflow: ["Search a hash, address or block height.", "Open the exact record.", "Compare From, To, amount, fee, status and containing block.", "Use the public URL as evidence."],
    rules: ["Old finalized blocks cannot be edited.", "A block is a container, not one YNXT.", "Empty blocks are condensed because they contain no transfers."],
  },
  monitor: {
    purpose: "Give every user a truthful public view of Testnet availability while keeping incident, audit and recovery authority inside a separately authenticated operator workspace.",
    workflow: ["Open the public status window without signing in and confirm the snapshot time, signature-backed publisher state and each service row.", "The 30-second publisher probes Chain, Explorer, Indexer, Wallet, AI, Seller and Developer with bounded timeouts; a failed probe is reported as failure rather than replaced with sample data.", "Operators authenticate through an accepted Wallet product session and receive only their explicit capabilities.", "A permitted operator acknowledges an alert, opens an incident, assigns ownership and advances the ordered lifecycle with evidence.", "Backup/Recovery independently verifies recovery evidence; the Incident Commander cannot self-verify recovery.", "Security review verifies backup or rollback evidence before a postmortem can close the incident."],
    rules: ["Public status reads only a dedicated signed and redacted projection; it cannot expose private incidents, actors, topology, paths, stack traces, backup records or secrets.", "Healthy HTTP proves only that endpoint's bounded request succeeded; it does not prove chain convergence, solvency, finality or every ecosystem dependency.", "Unsigned, stale, replayed, tampered, wrong-publisher, fake-healthy or oversized status input fails closed with an unavailable state.", "Viewer, Incident Commander, Backup/Recovery and Security Reviewer permissions are separate; recovery and rollback evidence require an independent reviewer.", "Rollback is a reviewed proposal record only. Monitor does not execute infrastructure commands, move assets, change Wallet authority or resume a paused Quant strategy.", "The public deployment deliberately disables password login. Private operations are unavailable until canonical Wallet registration and scoped roles are accepted.", "No native Monitor installer is claimed; Monitor is a hosted web control surface."],
  },
  ai: {
    purpose: "Give users a permission-bound assistant for explanation, drafting, research and proposals while preserving Wallet, product-owner and human authority.",
    workflow: ["Open the public workspace and first inspect Gateway, provider and model status; healthy transport does not mean generation succeeded.", "Sign in only through the AI-specific Wallet product session. Until canonical Wallet acceptance is deployed, sign-in fails closed and creates no local production session.", "Create or search a conversation, choose the exact product context and attachments, and review output language, provider/model availability, quota and estimated-cost truth before sending.", "The client sends the prompt and selected content in a bounded POST body, streams SSE output, and supports cancel, retry, continue and conversation forks without placing prompt content in the URL.", "For a tool or product action, inspect scope, target, payload, risk and evidence; approve or reject the proposal. Approval is recorded as approved-not-executed and any chain action still requires a separate Wallet review and signature.", "Use retention, export, delete, audit and authenticated backup/restore controls to manage account data."],
    rules: ["AI never receives a seed phrase, private key, recovery material, provider secret, PAN or CVV.", "AI cannot sign, pay, refund, trade, swap, withdraw, publish, send, delete external data, change permissions, mint, burn, govern or roll back infrastructure.", "Unknown product context, undeclared tools, scope widening, stale context, prompt injection and restricted credentials fail closed before provider access.", "Gateway health, configured model reachability and successful provider generation are separate states. The latest bounded provider run returned HTTP 429 and no answer was substituted.", "Provider, model, quota, actual usage and money values remain unknown unless the authoritative provider reports them; estimates are labelled as estimates.", "Conversation and attachment content is encrypted at rest; selection is explicit, account-scoped and subject to retention/export/delete controls.", "AI output may be inaccurate and is advisory. Human review and the authoritative product or Wallet remain responsible for every external action.", "The public Web product is live; Android is a local debug-signed Testnet preview, while hosted native downloads, iOS runtime proof, production signing, store release and central integration are not claimed."],
  },
  trust: {
    purpose: "Record evidence, labels, reports, appeals, corrections and transparency history.",
    workflow: ["Submit source-bound evidence.", "Apply an advisory label with reasons.", "Allow appeal and independent review.", "Publish corrections and an audit trail."],
    rules: ["Trust advice is not asset custody or automatic punishment.", "AI may assist but cannot make the final decision.", "Corrections remain visible rather than rewriting history."],
  },
  resource: {
    purpose: "Match storage, compute, bandwidth and AI-resource demand with evidenced providers.",
    workflow: ["Provider registers capacity and an offer.", "Buyer obtains a bounded quote.", "Capacity is reserved for the exact accepted offer.", "Signed metering is reconciled before settlement evidence is accepted."],
    rules: ["A quote, HTTP success or meter is not payment settlement.", "One transaction hash cannot settle two receipts.", "Overflow, stale capacity and reconciliation mismatch fail closed."],
  },
  music: {
    purpose: "Discover and play music while keeping identity, rights and creator revenue traceable.",
    workflow: ["Browse the catalog.", "Check access rights.", "Stream with resumable playback.", "Record creator/revenue events only when authoritative services exist."],
    rules: ["Catalog presence is not proof of music rights.", "Playback and payment are separate states.", "No revenue is claimed without settlement evidence."],
  },
  video: {
    purpose: "Publish, discover and watch video with upload, metadata and moderation workflows.",
    workflow: ["Upload and validate media.", "Attach metadata and visibility.", "Process and publish versions.", "Handle reports, takedowns and creator evidence."],
    rules: ["Upload success is not public publication.", "Rights and moderation decisions require evidence.", "Creator earnings remain separate from view counts."],
  },
  creatorStudio: {
    purpose: "Give creators one workspace for uploads, metadata, audience and settlement evidence.",
    workflow: ["Prepare content.", "Review rights and metadata.", "Publish to the selected product.", "Inspect audience and verified revenue events."],
    rules: ["Analytics are not payout proof.", "Creator actions are account scoped.", "Cross-product publication requires explicit consent."],
  },
  cloud: {
    purpose: "Store, version and share encrypted user files across YNX products.",
    workflow: ["Create an account-scoped object.", "Upload encrypted content and metadata.", "Version or share with explicit recipients.", "Restore or revoke access with an audit trail."],
    rules: ["Cloud does not receive Wallet recovery keys.", "Share and ownership changes are explicit.", "Conflict, quota and restore failures stay visible."],
  },
  docs: {
    purpose: "Create, revise, export and audit collaborative documents.",
    workflow: ["Create a document.", "Edit with version history.", "Share scoped access.", "Export while preserving provenance."],
    rules: ["History is not silently overwritten.", "Offline conflicts require resolution.", "Exports must not imply signatures they do not have."],
  },
  browser: {
    purpose: "Navigate YNX and external web surfaces with explicit permission and phishing boundaries.",
    workflow: ["Open a reviewed destination.", "Display origin and permission state.", "Keep Wallet approval isolated.", "Warn or block unsafe navigation."],
    rules: ["Web content cannot request recovery keys.", "Origin changes must remain visible.", "Camera, files, clipboard and signing are separate permissions."],
  },
  search: {
    purpose: "Find public chain, ecosystem and content records without inventing unavailable results.",
    workflow: ["Enter a query.", "Search source-labelled indexes.", "Rank by explicit signals.", "Open the authoritative source."],
    rules: ["Private content is excluded without permission.", "Stale or unavailable sources are labelled.", "Ranking is not endorsement or financial advice."],
  },
  finance: {
    purpose: "A non-custodial, read-only personal-finance view for YNXT activity plus private budgets, notes and reminders.",
    workflow: ["Wallet issues a device-bound Finance session.", "Finance verifies Explorer health and reads the latest 100 indexed account records.", "Authenticated Pay receipts are reconciled with source time, coverage and sync state.", "Budgets, categories and notes stay account-scoped; AI may draft only from user-selected records.", "Reports separate YNXT facts, coverage and assumptions and are not bank or tax statements."],
    rules: ["Finance is not a bank, broker, adviser, lender, insurer or custodian.", "It cannot sign, trade, withdraw or move assets.", "Exchange, DEX, Quant and Economics data remain unavailable until owner contracts are accepted.", "A missing or stale source produces unavailable status, never a made-up balance or PnL."],
  },
  mail: {
    purpose: "Draft, send, receive and organize identity-bound messages and attachments.",
    workflow: ["Compose locally.", "Resolve authorized recipients.", "Submit through the configured provider.", "Track delivery, failure and recovery separately."],
    rules: ["Draft is not sent and accepted is not delivered.", "Attachments follow Cloud permission rules.", "Provider failures never become fake success."],
  },
  calendar: {
    purpose: "Create events, invitations, reminders and recurring schedules across time zones.",
    workflow: ["Create an event with explicit zone.", "Invite scoped identities.", "Track responses and reminders.", "Resolve updates, recurrence exceptions and cancellation."],
    rules: ["Time zone and recurrence are preserved explicitly.", "Invitation is not acceptance.", "Calendar cannot authorize payments or Wallet actions."],
  },
  dex: {
    purpose: "A future non-custodial swap and liquidity surface for audited YNX contracts.",
    workflow: ["Select assets and route.", "Quote price impact, fees and minimum received.", "Review Wallet approval and contract call.", "Verify the final transaction and position."],
    rules: ["No public liquidity or audited production DEX is currently claimed.", "A quote is not execution.", "Slippage, approval, LP loss and contract risk must be explicit."],
  },
};

export function guideFor(productKey) {
  return ECOSYSTEM_GUIDES[productKey] || null;
}
