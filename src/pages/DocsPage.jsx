import React, { useMemo, useState } from "react";
import { ArrowRight, BookOpen, CheckCircle2, Download, Search, ShieldCheck, Sparkles } from "lucide-react";
import { apiConfig } from "../lib/api/ynxApi.js";
import { getCatalog } from "../lib/ecosystemCatalog.js";
import { guideFor } from "../content/ecosystemGuides.js";
import docsAuthority from "virtual:ynx-docs-authority";

const START_STEPS = [
  ["1", "Get a Wallet address", "Create or restore an address locally. YNX products never need your recovery phrase."],
  ["2", "Claim Testnet YNXT", "Use Faucet to receive test-only YNXT. It has no represented monetary value."],
  ["3", "Make a Testnet transfer", "Review recipient, amount and the current 1 YNXT native fee before Wallet approval."],
  ["4", "Verify it in Explorer", "Search the transaction hash and compare From, To, amount, fee, status and block."],
];

const CORE_FACTS = [
  ["What YNX is", "A public Testnet chain plus a coordinated application ecosystem built around one user-controlled Wallet identity."],
  ["Why it is different", "Apps share verifiable chain evidence instead of asking users to trust unrelated status pages. Wallet approval remains separate from AI and product logic."],
  ["Ultimate goal", "A mature Web4 platform where people can communicate, pay, build, trade, create and manage data without giving every service unrestricted control."],
  ["Current boundary", "This is a Testnet candidate ecosystem, not Mainnet, a bank, an exchange listing, an issued card, or a promise of financial return."],
];

const OPERATING_TRUTHS = [
  ["Transactions & blocks", "A block is a finalized transaction container, not one YNXT. One block can contain multiple transfers; an empty block issues no automatic reward."],
  ["Historical block mutation", "Impossible after finality: block 1 or any other finalized block cannot accept a new transaction later."],
  ["Node operations", "Join as a synchronized observer first; verify height, hash, peers, storage, monitoring, backup and restore before candidate review."],
  ["Validator candidate", "Testnet admission is reviewed and operator-controlled. Documentation is not approval, and signer uncertainty fails closed."],
  ["Mining truth", "YNX Testnet uses rotating validators/block producers, not GPU or ASIC proof-of-work mining."],
  ["Bridge evidence", "The current bridge can prove the YNX source transaction and local relayer lifecycle. External submission is disabled: Finalized locally; no external submission."],
];

const textFromHtml = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

export function DocsPage() {
  const catalog = useMemo(() => getCatalog(), []);
  const [query, setQuery] = useState("");
  const [selectedRoute, setSelectedRoute] = useState(docsAuthority.articles[0]?.route || "");

  const visibleArticles = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return docsAuthority.articles;
    return docsAuthority.articles.filter((article) =>
      `${article.h1} ${article.description} ${textFromHtml(article.html)}`.toLowerCase().includes(needle),
    );
  }, [query]);

  const selectedArticle =
    visibleArticles.find((article) => article.route === selectedRoute)
    || visibleArticles[0]
    || null;

  const selectArticle = (route) => {
    setSelectedRoute(route);
    window.requestAnimationFrame(() => document.getElementById("full-manual")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <main className="docsPage">
      <header className="docsHeader docsReadableHeader">
        <p className="sectionEyebrow">Start here · YNX documentation</p>
        <h1>Understand YNX, then use it.</h1>
        <p>No download is required. The complete official manuals, network rules and product logic are readable directly on this page.</p>
        <div className="docsHeaderActions">
          <a className="button primary" href="#start-here">Start in 10 minutes <ArrowRight size={16} /></a>
          <a className="button secondary" href="#full-manual">Read full manuals <BookOpen size={16} /></a>
        </div>
      </header>

      <section className="docsIntro" id="start-here" aria-labelledby="docs-intro-title">
        <div className="sectionHeader compact">
          <div><p className="sectionEyebrow">YNX in plain language</p><h2 id="docs-intro-title">What this project is—and what it is not</h2></div>
        </div>
        <dl className="docsCoreFacts">
          {CORE_FACTS.map(([term, description]) => <div key={term}><dt>{term}</dt><dd>{description}</dd></div>)}
        </dl>
        <div className="docsStartSteps">
          {START_STEPS.map(([number, title, description]) => (
            <article key={number}>
              <span>{number}</span>
              <div><h3>{title}</h3><p>{description}</p></div>
            </article>
          ))}
        </div>
        <div className="docsNetworkStrip" aria-label="YNX Testnet essentials">
          <span><small>Network</small><strong>YNX Testnet</strong></span>
          <span><small>Chain ID</small><strong>6423 / 0x1917</strong></span>
          <span><small>Native asset</small><strong>YNXT</strong></span>
          <span><small>Explorer</small><a href={apiConfig.explorerUrl}>Open live data <ArrowRight size={14} /></a></span>
        </div>
        <div className="docsTruthGrid" aria-label="Network operating truths">
          {OPERATING_TRUTHS.map(([title, description]) => <article key={title}><h3>{title}</h3><p>{description}</p></article>)}
        </div>
      </section>

      <section className="docsManualBrowser" id="full-manual" aria-labelledby="manual-browser-title">
        <header className="docsManualHeader">
          <div><p className="sectionEyebrow">Complete official manuals</p><h2 id="manual-browser-title">Read every manual here</h2><p>Select a manual on the left. Its complete authoritative content appears on the right; no ZIP or GitHub visit is required.</p></div>
          <label className="docsSearch">
            <Search />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search YNX documentation" aria-label="Search all manual contents" />
          </label>
        </header>

        <div className="docsLayout docsManualLayout">
          <nav className="docsNav" aria-label="Official manuals">
            {visibleArticles.map((article) => (
              <button type="button" className={article.route === selectedArticle?.route ? "active" : ""} key={article.route} onClick={() => selectArticle(article.route)}>
                <span>{article.h1}</span><small>{article.description}</small>
              </button>
            ))}
          </nav>

          <div className="docsContent">
            {selectedArticle ? (
              <article className="docsFullArticle">
                <header>
                  <BookOpen />
                  <div><p className="sectionEyebrow">Official manual · Version {selectedArticle.version}</p><h2>{selectedArticle.h1}</h2><p>{selectedArticle.description}</p></div>
                </header>
                <div className="authorityArticle" dangerouslySetInnerHTML={{ __html: selectedArticle.html }} />
              </article>
            ) : (
              <div className="docsNoResults"><Search /><h2>No matching manual</h2><p>Try Wallet, validator, mining, transfer, Testnet, SDK, Pay or Explorer.</p></div>
            )}
          </div>
        </div>
      </section>

      <section className="docsEcosystemLogic" id="ecosystem-rules" aria-labelledby="ecosystem-rules-title">
        <div className="sectionHeader compact">
          <div><p className="sectionEyebrow">Every ecosystem product</p><h2 id="ecosystem-rules-title">Purpose, workflow and rules</h2><p>These explanations describe what each product does, how its loop works, and where it must fail closed.</p></div>
        </div>
        <div className="docsProductGuides">
          {catalog.map((product) => {
            const guide = guideFor(product.key);
            if (!guide) return null;
            const Icon = product.icon;
            return (
              <details key={product.key} id={`product-${product.key}`}>
                <summary><span><Icon size={20} /><strong>{product.name}</strong></span><small>{guide.purpose}</small></summary>
                <div>
                  <section><h3>How it works</h3><ol>{guide.workflow.map((step) => <li key={step}>{step}</li>)}</ol></section>
                  <section><h3>Rules and boundaries</h3><ul>{guide.rules.map((rule) => <li key={rule}><CheckCircle2 size={15} />{rule}</li>)}</ul></section>
                  <a className="textLink" href={product.route}>Open {product.name} details <ArrowRight size={15} /></a>
                </div>
              </details>
            );
          })}
        </div>
      </section>

      <section className="docsSessionRelease" id="wallet-session-release" aria-labelledby="wallet-session-release-title">
        <div>
          <p className="sectionEyebrow">Wallet connection release · 1.1.0</p>
          <h2 id="wallet-session-release-title">A shared, fail-closed Product Session source package</h2>
          <p>The public package defines registered callbacks, bound sessions, controlled recovery, provider discovery and actionable connection states. The independent Product Session v2 Gateway is now live at the public REST origin from exact source commit cc6c393608a1; its rollback drill, cryptographic lifecycle and restart-state checks passed.</p>
          <div className="docsSessionReleaseActions">
            <a className="button primary" href="/releases/wallet-session-router/d8863f6b2875/ynx-chain-wallet-auth-1.1.0.tgz" download><Download size={16} /> Download source package</a>
            <a className="button secondary" href="/releases/wallet-session-router/d8863f6b2875/release.json">Verify release record <ArrowRight size={16} /></a>
            <a className="textLink" href="/releases/wallet-session-router/cc6c393608a1/runtime.json">Verify public runtime evidence</a>
            <a className="textLink" href="/releases/wallet-session-router/d8863f6b2875/product-session-registry.json">View callback registry</a>
          </div>
        </div>
        <dl>
          <div><dt>Central integration</dt><dd>Pending protected review</dd></div>
          <div><dt>Product runtime migrations</dt><dd>0 verified</dd></div>
          <div><dt>Public Product Session v2 Gateway</dt><dd>Deployed · rollback and restart verified</dd></div>
          <div><dt>Legacy App / Wallet Gateways</dt><dd>Unchanged; independent v2 route</dd></div>
          <div><dt>Android evidence</dt><dd>Scheme resolved; intent delivered; approval not proven</dd></div>
        </dl>
      </section>

      <aside className="docsSafetyNote">
        <ShieldCheck />
        <div><strong>One rule across the ecosystem</strong><p>A health check, candidate build, paper result or local artifact is never presented as a public production capability. Unknown states remain unknown.</p></div>
      </aside>

      {docsAuthority.artifact.downloadHosted && docsAuthority.artifact.downloadPath ? (
        <details className="docsBundleExport">
          <summary><Download size={16} /> Need an offline archive or integrity audit?</summary>
          <div>
            <p>The same complete manuals can optionally be exported as a verified ZIP. Normal users do not need this file.</p>
            <a href={docsAuthority.artifact.downloadPath} download>Download documentation source archive</a>
            <small>SHA-256 {docsAuthority.artifact.sha256} · {docsAuthority.artifact.bytes.toLocaleString("en-US")} bytes · source {docsAuthority.artifact.sourceCommit.slice(0, 12)}</small>
          </div>
        </details>
      ) : null}
    </main>
  );
}
