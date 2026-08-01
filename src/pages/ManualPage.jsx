import React from "react";
import {
  ArrowUpRight, Blocks, CheckCircle2, CircleAlert, ExternalLink, KeyRound, LifeBuoy,
  Network, Pickaxe, RefreshCw, Search, Server, ShieldCheck, WalletCards
} from "lucide-react";
import { apiConfig } from "../lib/api/ynxApi.js";

const steps = [
  { number: "01", title: "Verify the network", text: "Confirm YNX Testnet, native chain ID 6423, EVM chain ID 0x1917, and a current block before connecting a wallet.", href: "/status", label: "Check status", icon: Network },
  { number: "02", title: "Protect an account", text: "Use ynx1 as the first-party address. Keep the matching 0x form inside EVM-compatible tools, and never paste a mnemonic or private key into a website.", href: "/#address", label: "Convert an address", icon: WalletCards },
  { number: "03", title: "Get test YNXT", text: "Use the Faucet for Testnet only. YNXT on this network has no represented monetary value or guaranteed liquidity.", href: apiConfig.faucetUrl, label: "Open Faucet", icon: CheckCircle2 },
  { number: "04", title: "Verify every result", text: "After a write, preserve the transaction hash and confirm the receipt in Explorer. A timeout is not proof that a transaction failed.", href: apiConfig.explorerUrl, label: "Open Explorer", icon: Search },
];

const chapters = [
  {
    id: "network-facts", eyebrow: "Network facts / 网络事实", title: "Know what the Testnet actually guarantees", icon: Network,
    intro: "Use these values as the pre-flight checklist. Stop if a wallet, RPC, guide, or support message gives different network identity.",
    facts: [["Network", "YNX Testnet"], ["Native chain ID", "6423"], ["EVM chain ID", "0x1917"], ["Native asset", "YNXT"], ["Native transfer fee", "Current Testnet rule: 1 integer YNXT per transaction"], ["Finality", "A finalized block is immutable; block 1 or any historical block cannot receive a new transaction"]],
    checklist: ["Open Status and confirm the RPC and indexer are current.", "Check the destination character by character and confirm ynx1/0x equivalence when needed.", "Treat Mainnet, listing, liquidity, custody, and third-party support as unavailable unless separately evidenced."],
    code: `curl -fsS https://rpc.ynxweb4.com/status\n\ncurl -fsS -X POST https://evm.ynxweb4.com \\\n  -H 'content-type: application/json' \\\n  --data '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'`,
  },
  {
    id: "wallet-security", eyebrow: "Wallet manual / 钱包手册", title: "Create, back up, and use an account safely", icon: KeyRound,
    intro: "The address is public; signing material is not. A screenshot, chat message, support ticket, web form, or log is never an acceptable place for a mnemonic or private key.",
    checklist: ["Create or import the account only in the intended wallet or local signer.", "Record the recovery phrase offline, verify the backup, and keep it separate from the device.", "Unlock only for the intended action; inspect network, recipient, amount, fee, and nonce before signing.", "For shared operations, give each person a separate account and permission boundary; never circulate one private key.", "After use, lock the wallet and verify the resulting hash independently in Explorer."],
    warning: "YNX support never needs your mnemonic, private key, wallet password, one-time code, or signer-vault contents.",
  },
  {
    id: "transfer", eyebrow: "Transfer manual / 转账手册", title: "Send YNXT and prove the receipt", icon: WalletCards,
    intro: "A transfer is accepted into a future block, never inserted into an old block. One block can contain zero, one, or multiple transactions, and one transfer may send any valid balance amount—not one YNXT per block.",
    checklist: ["Confirm the sender balance covers amount plus the current 1 YNXT native fee.", "Read the account nonce immediately before signing; repeated nonces are rejected.", "Sign once and preserve the returned transaction hash.", "If the client times out, search the hash and sender before resubmitting.", "Verify From, To, amount, fee, status, block height, and confirmations in Explorer."],
    facts: [["Block", "An immutable ordered container of transactions"], ["YNXT", "The native Testnet asset used for value and current native fees"], ["Empty block", "Contains no transaction and creates no 1 YNXT reward"], ["Multiple payments", "Supported when valid transactions enter the same future block"]],
  },
  {
    id: "explorer", eyebrow: "Explorer manual / 浏览器手册", title: "Find a transaction, address, or block quickly", icon: Search,
    intro: "Use the global search for an exact transaction hash, ynx1 address, compatible 0x address, or block height. Use Quick find to narrow the live transaction list by hash, address, type, amount, or block.",
    checklist: ["Transaction view: confirm From → To, amount, fee, status, and containing block.", "Address view: review balance, nonce, and inbound/outbound history; Rich list is a balance ranking, not ownership identity.", "Block view: prioritize transaction-bearing blocks; compact empty blocks carry no transfer content.", "If Explorer is catching up, compare indexed height with chain height and wait for alignment before concluding data is absent.", "Switch English/中文 in the Explorer header; the preference is retained locally."],
  },
  {
    id: "node", eyebrow: "Node join manual / 节点加入手册", title: "Prepare a node without exposing validator keys", icon: Server,
    intro: "Public source and an operator-reviewed configuration are prerequisites. A node should run as a dedicated unprivileged service account with persistent storage, bounded ports, monitoring, and backups.",
    checklist: ["Provision a supported 64-bit Linux host with stable time synchronization, SSD persistence, memory headroom, and a fixed public endpoint if peer connectivity is required.", "Verify the source/build identity and configuration before starting; never copy another operator's data directory or signing key.", "Bind administrative and metrics interfaces to localhost or an authenticated private network. Publish only explicitly required peer/RPC routes.", "Start as a non-validator observer, allow initial synchronization, then compare local height/hash with the public RPC.", "Back up configuration and key metadata separately from chain data; rehearse restore on an isolated host.", "Add health, disk, memory, peer, block-lag, and restart-loop alerts before requesting candidate admission."],
    code: `# Public read-only checks; these do not enroll a validator\ncurl -fsS https://rpc.ynxweb4.com/status\ncurl -fsS https://explorer.ynxweb4.com/api/health\n\n# Expected before candidate review\n# - dedicated service identity\n# - persistent data volume\n# - time synchronization\n# - least-privilege firewall\n# - monitored backup and restore rehearsal`,
    warning: "There is currently no one-command permissionless public validator enrollment. Do not send a validator private key to a website or operator.",
  },
  {
    id: "validator", eyebrow: "Validator manual / 验证者手册", title: "Apply, stage, and operate a validator candidate", icon: ShieldCheck,
    intro: "Current public Testnet validators are operator-controlled. Candidate admission requires capacity, identity/contact, key-custody, monitoring, recovery, and governance review; documentation is not automatic approval.",
    checklist: ["Run a healthy observer node first and provide a stable candidate endpoint plus operator contact and incident path.", "Generate the validator key on the target secure host or approved signing boundary; retain offline recovery material and document who can authorize rotation.", "Demonstrate sustained synchronization, peer health, clock accuracy, disk headroom, restart recovery, and alert delivery.", "Stage admission in a maintenance window. Verify the expected validator identity before enabling signing.", "Monitor missed blocks, double-sign risk, lag, peer loss, disk, memory, and service restarts. Fail closed when signer state is uncertain.", "For exit or rotation, coordinate the validator-set change first, stop signing, preserve audit evidence, then archive or destroy old key material under policy."],
    facts: [["Admission", "Reviewed Testnet candidate process; not permissionless today"], ["Key custody", "Operator responsibility; never submitted through the website"], ["Availability", "Multiple users may read public services concurrently; validator signing remains single-authority and serialized"], ["Recovery", "Restore configuration/data first and verify signer state before resuming"]],
  },
  {
    id: "mining", eyebrow: "Mining manual / 挖矿手册", title: "Do not use GPU or ASIC mining on YNX Testnet", icon: Pickaxe,
    intro: "YNX Testnet uses rotating validators/block producers, not proof-of-work mining. There is no supported GPU/ASIC miner and no active automatic one-YNXT-per-block issuance.",
    checklist: ["To participate in block production, follow the validator candidate process—not mining-pool software.", "A block is not one YNXT. It is a container that can be empty or contain multiple transfers.", "An empty block earns no current issuance reward. Under the present rule, a native transaction pays a 1 YNXT fee credited to the validator.", "Do not buy hardware, pay a pool, or install binaries that claim guaranteed YNX mining income."],
    warning: "Any future issuance or incentive change needs an explicit network upgrade and public documentation; this manual does not promise rewards.",
  },
  {
    id: "bridge", eyebrow: "Bridge manual / 跨链桥手册", title: "Separate source-chain proof from external execution", icon: Blocks,
    intro: "The current bridge path can record and co-sign a local coordinator lifecycle from YNX Testnet, but external mint/submission is disabled. Finalized-local is not the same as bridged on an external chain.",
    checklist: ["Verify the YNX source transaction and required confirmations.", "Record the route, asset, source hash, destination, amount, and coordinator transfer ID.", "Verify independent relayer signatures and the local finalization audit trail.", "Check provider and contract capability before claiming external completion.", "When external submission is disabled, report finalized locally / no external submission and do not represent wrapped assets as minted."],
    facts: [["Live route", "YNX Testnet YNXT → external-testnet-unavailable wrapped-YNXT"], ["Confirmations", "Current coordinator route requires 12 source confirmations"], ["External submission", "Disabled"], ["Truthful result", "Local coordinator finality only"]],
  },
];

const recovery = [
  ["Loading takes too long", "Wait once, then refresh Status. Do not submit a state-changing request repeatedly."],
  ["The API is unavailable", "Preserve the request or hash, check Status and Explorer, then retry only when the outcome is known."],
  ["A transaction is not visible", "Search the hash plus both ynx1 and equivalent 0x forms. Confirm chain ID 6423 / 0x1917."],
  ["Nonce conflict", "Refresh account state, confirm whether the earlier hash finalized, then rebuild and sign once with the current nonce."],
  ["Node falls behind", "Keep RPC read-only, inspect peer/time/disk health, and do not enable validator signing until height and hash align."],
  ["A support message asks for secrets", "Stop. Preserve the message as evidence and report it without sharing custody material."],
];

export function ManualPage() {
  return <main className="guidePage">
    <header className="guideHero">
      <p className="sectionEyebrow">User & operator manual / 用户与运维手册</p>
      <h1>Operate YNX Testnet with evidence at every step.</h1>
      <p>A detailed path for users, node operators, validator candidates, Explorer, transfers, bridge evidence, recovery, and the exact boundary of “mining.”</p>
      <div className="guideActions"><a className="button primary" href="/status">Check network status <ArrowUpRight /></a><a className="button secondary" href="/docs">Developer docs</a></div>
      <nav className="manualToc" aria-label="Manual chapters">{chapters.map((chapter) => <a key={chapter.id} href={`#${chapter.id}`}>{chapter.title}</a>)}</nav>
    </header>

    <section className="guideSteps" aria-labelledby="manual-start">
      <div className="guideSectionHeader"><p className="sectionEyebrow">Safe start</p><h2 id="manual-start">From zero to a verified testnet action</h2></div>
      <ol>{steps.map((step) => { const Icon = step.icon; return <li key={step.number}><span className="guideNumber">{step.number}</span><Icon aria-hidden="true" /><div><h3>{step.title}</h3><p>{step.text}</p></div><a href={step.href}>{step.label} {step.href.startsWith("http") ? <ExternalLink /> : <ArrowUpRight />}</a></li>; })}</ol>
    </section>

    <div className="manualChapters">{chapters.map((chapter) => { const Icon = chapter.icon; return <section className="manualChapter" id={chapter.id} key={chapter.id}>
      <header><span className="manualChapterIcon"><Icon aria-hidden="true" /></span><div><p className="sectionEyebrow">{chapter.eyebrow}</p><h2>{chapter.title}</h2><p>{chapter.intro}</p></div></header>
      {chapter.facts ? <dl className="manualFacts">{chapter.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl> : null}
      <ol className="manualChecklist">{chapter.checklist.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></li>)}</ol>
      {chapter.code ? <pre className="manualCode"><code>{chapter.code}</code></pre> : null}
      {chapter.warning ? <aside className="manualWarning"><CircleAlert /><p>{chapter.warning}</p></aside> : null}
    </section>; })}</div>

    <section className="recoverySection" aria-labelledby="recovery-title"><div className="recoveryIntro"><RefreshCw aria-hidden="true" /><p className="sectionEyebrow">Recovery</p><h2 id="recovery-title">Uncertainty is a state, not a reason to guess.</h2><p>Preserve evidence and establish the last confirmed state before retrying.</p></div><div className="recoveryList">{recovery.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></section>

    <section className="supportCallout" aria-labelledby="manual-support"><ShieldCheck aria-hidden="true" /><div><p className="sectionEyebrow">Security boundary</p><h2 id="manual-support">Use public evidence before asking anyone to intervene.</h2><p>Never share a mnemonic, private key, password, one-time code, or custody material. Report security issues without posting exploitable details publicly.</p></div><div><a href="/security"><CircleAlert /> Security guidance</a><a href="/support"><LifeBuoy /> Support and recovery</a></div></section>
  </main>;
}
