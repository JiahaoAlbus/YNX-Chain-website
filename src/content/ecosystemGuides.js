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
    rules: ["No synthetic prices, arbitrary user code, Wallet keys or withdrawal authority.", "Paper results are not live PnL and backtest return never selects a strategy alone.", "Kill switch, revoke, stale data, sequence gaps, risk-limit breach or unknown outcome fail closed.", "No real-money execution adapter or public Quant deployment is currently claimed."],
  },
  shop: {
    purpose: "A buyer marketplace whose checkout pays in YNXT while familiar catalog, cart, order and support flows stay conventional.",
    workflow: ["Search and compare products.", "Add items and delivery information.", "Review total, fees and merchant before Wallet approval.", "Track fulfillment, receipt, refund and dispute as separate states."],
    rules: ["Shop cannot sign for the user.", "Payment confirmation does not prove delivery.", "Refunds require a separate authoritative Pay/chain result."],
  },
  sellerConsole: {
    purpose: "Operate listings, inventory, orders, fulfillment and YNXT payout reconciliation.",
    workflow: ["Verify seller identity.", "Publish products and inventory.", "Accept and fulfill orders.", "Reconcile Pay receipts, refunds and disputes."],
    rules: ["Seller identity does not grant buyer Wallet authority.", "Inventory and fulfillment changes are audited.", "Payout state follows Pay and chain evidence."],
  },
  developer: {
    purpose: "Build, test and inspect YNX applications with RPC, SDK and bounded deployment tools.",
    workflow: ["Connect to chain ID 6423 / 0x1917.", "Compile or test locally.", "Review exact deployment parameters and Wallet request.", "Verify the resulting transaction and contract in Explorer."],
    rules: ["Unsigned desktop packages are Testnet previews.", "The IDE cannot take Wallet keys.", "Compiler success is not deployment or verification proof."],
  },
  explorer: {
    purpose: "Find and prove blocks, transactions, addresses, transfers, validators and balances.",
    workflow: ["Search a hash, address or block height.", "Open the exact record.", "Compare From, To, amount, fee, status and containing block.", "Use the public URL as evidence."],
    rules: ["Old finalized blocks cannot be edited.", "A block is a container, not one YNXT.", "Empty blocks are condensed because they contain no transfers."],
  },
  monitor: {
    purpose: "Detect stale nodes, service failures, reconciliation problems and incidents.",
    workflow: ["Collect health and metrics.", "Evaluate alert rules and SLO windows.", "Open an incident with trace evidence.", "Verify recovery before closing."],
    rules: ["Healthy HTTP alone does not prove chain convergence.", "Operator views require authorization.", "Alerts must link to measured evidence, not invented uptime."],
  },
  ai: {
    purpose: "Help users explain, draft and propose actions without silently controlling assets.",
    workflow: ["User selects the exact context.", "AI returns a bounded explanation or proposal.", "Policy validates tools, permissions and risk.", "User reviews and separately approves any side effect."],
    rules: ["AI never receives recovery keys.", "AI cannot approve its own action or widen limits.", "Provider failure, uncertainty and refusal stay visible."],
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
