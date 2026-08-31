import React, { useMemo, useState } from "react";
import { ArrowRight, BookOpen, CheckCircle2, Download, Search, ShieldCheck, Sparkles } from "lucide-react";
import { apiConfig } from "../lib/api/ynxApi.js";
import { getCatalog } from "../lib/ecosystemCatalog.js";
import { guideFor } from "../content/ecosystemGuides.js";
import docsAuthority from "virtual:ynx-docs-authority";
import docsLocales from "virtual:ynx-docs-locales";
import { useLocale } from "../lib/i18n.jsx";
import { selectLocalizedDocs } from "../lib/docsLocale.js";

const START_STEPS_EN = [
  ["1", "Get a Wallet address", "Create or restore an address locally. YNX products never need your recovery phrase."],
  ["2", "Claim Testnet YNXT", "Use Faucet to receive test-only YNXT. It has no represented monetary value."],
  ["3", "Make a Testnet transfer", "Review recipient, amount and the current 1 YNXT native fee before Wallet approval."],
  ["4", "Verify it in Explorer", "Search the transaction hash and compare From, To, amount, fee, status and block."],
];

const CORE_FACTS_EN = [
  ["What YNX is", "A public Testnet chain plus a coordinated application ecosystem built around one user-controlled Wallet identity."],
  ["Why it is different", "Apps share verifiable chain evidence instead of asking users to trust unrelated status pages. Wallet approval remains separate from AI and product logic."],
  ["Ultimate goal", "A mature Web4 platform where people can communicate, pay, build, trade, create and manage data without giving every service unrestricted control."],
  ["Current boundary", "This is a Testnet candidate ecosystem, not Mainnet, a bank, an exchange listing, an issued card, or a promise of financial return."],
];

const OPERATING_TRUTHS_EN = [
  ["Transactions & blocks", "A block is a finalized transaction container, not one YNXT. One block can contain multiple transfers; an empty block issues no automatic reward."],
  ["Historical block mutation", "Impossible after finality: block 1 or any other finalized block cannot accept a new transaction later."],
  ["Node operations", "Join as a synchronized observer first; verify height, hash, peers, storage, monitoring, backup and restore before candidate review."],
  ["Validator candidate", "Testnet admission is reviewed and operator-controlled. Documentation is not approval, and signer uncertainty fails closed."],
  ["Mining truth", "YNX Testnet uses rotating validators/block producers, not GPU or ASIC proof-of-work mining."],
  ["Bridge evidence", "The current bridge can prove the YNX source transaction and local relayer lifecycle. External submission is disabled: Finalized locally; no external submission."],
];

const DOCS_UI = {
  en: {
    eyebrow: "Start here · YNX documentation", title: "Understand YNX, then use it.", lead: "No download is required. The complete official manuals, network rules and product logic are readable directly on this page.", start: "Start in 10 minutes", read: "Read full manuals",
    introEyebrow: "YNX in plain language", introTitle: "What this project is—and what it is not", network: "Network", chainId: "Chain ID", asset: "Native asset", explorer: "Explorer", explorerLink: "Open live data",
    manualsEyebrow: "Complete official manuals", manualsTitle: "Read every manual here", manualsLead: "Select a manual on the left. Its complete authoritative content appears on the right; no ZIP or GitHub visit is required.", search: "Search YNX documentation", nav: "Official manuals", official: "Official manual", noMatch: "No matching manual", noMatchLead: "Try Wallet, validator, mining, transfer, Testnet, SDK, Pay or Explorer.",
    ecosystemEyebrow: "Every ecosystem product", ecosystemTitle: "Purpose, workflow and rules", ecosystemLead: "These explanations describe what each product does, how its loop works, and where it must fail closed.", how: "How it works", rules: "Rules and boundaries", open: "Open", details: "details",
    runtimeEyebrow: "Wallet/Auth runtime evidence · P0", runtimeTitle: "A public Wallet/Auth service record, with its limits shown", runtimeLead: "The Wallet/Auth service was read back from exact runtime source. Health, readiness and version routes returned HTTP 200. The public Product Session lifecycle exercised registered-origin CORS, restart persistence, replay rejection, session revoke and device revoke; an unregistered origin remained rejected. These are Gateway facts, not an installed Wallet or transaction claim.", runtimeRecord: "Open runtime record", evidence: "Open exact evidence",
    safetyTitle: "One rule across the ecosystem", safetyLead: "A health check, candidate build, paper result or local artifact is never presented as a public production capability. Unknown states remain unknown.", exportTitle: "Need an offline archive or integrity audit?", exportLead: "The same complete manuals can optionally be exported as a verified ZIP. Normal users do not need this file.", exportLink: "Download documentation source archive",
    startSteps: START_STEPS_EN, coreFacts: CORE_FACTS_EN, truths: OPERATING_TRUTHS_EN,
  },
  "zh-CN": {
    eyebrow: "从这里开始 · YNX 文档", title: "先理解 YNX，再开始使用。", lead: "无需下载。完整的官方手册、网络规则与产品逻辑可直接在本页阅读。", start: "10 分钟入门", read: "阅读完整手册",
    introEyebrow: "用直白语言介绍 YNX", introTitle: "这个项目是什么，又不是什么", network: "网络", chainId: "Chain ID", asset: "原生资产", explorer: "区块浏览器", explorerLink: "打开实时数据",
    manualsEyebrow: "完整官方手册", manualsTitle: "在这里阅读每一份手册", manualsLead: "在左侧选择手册，右侧会显示完整权威正文；无需下载 ZIP 或访问 GitHub。", search: "搜索 YNX 文档", nav: "官方手册", official: "官方手册", noMatch: "没有匹配的手册", noMatchLead: "可尝试 Wallet、验证者、转账、Testnet、SDK、Pay 或 Explorer。",
    ecosystemEyebrow: "每一个生态产品", ecosystemTitle: "用途、工作流与规则", ecosystemLead: "这些说明介绍每个产品做什么、流程如何闭环，以及必须在哪里 fail closed。", how: "工作方式", rules: "规则与边界", open: "打开", details: "详情",
    runtimeEyebrow: "Wallet/Auth 运行证据 · P0", runtimeTitle: "公开 Wallet/Auth 服务记录及其限制", runtimeLead: "Wallet/Auth 服务已从精确 runtime source 回读，health、readiness 和 version 路由返回 HTTP 200。公开 Product Session 生命周期覆盖已注册来源的 CORS、重启持久化、重放拒绝、session revoke 和 device revoke，未注册来源保持拒绝。这些是 Gateway 事实，不是已安装 Wallet 或交易能力声明。", runtimeRecord: "打开运行记录", evidence: "打开精确证据",
    safetyTitle: "全生态统一规则", safetyLead: "健康检查、候选构建、模拟结果或本地工件绝不会被表述为公网生产能力；未知状态保持未知。", exportTitle: "需要离线归档或完整性审计？", exportLead: "同一套完整手册可以选用经过校验的 ZIP 导出；普通用户无需下载此文件。", exportLink: "下载文档源码归档",
    startSteps: [
      ["1", "取得 Wallet 地址", "在本地创建或恢复地址；YNX 产品永远不需要你的 recovery phrase。"],
      ["2", "领取测试网 YNXT", "通过 Faucet 获取仅用于测试的 YNXT，它不代表货币价值。"],
      ["3", "发起测试网转账", "Wallet 批准前核对 recipient、amount 与当前 1 YNXT 原生手续费。"],
      ["4", "在 Explorer 核验", "搜索 transaction hash，并比对 From、To、amount、fee、status 与 block。"],
    ],
    coreFacts: [
      ["YNX 是什么", "一个公开测试网链，以及围绕用户控制的 Wallet 身份协同运行的应用生态。"],
      ["为什么不同", "应用共享可验证链证据，而不是让用户相信彼此割裂的状态页；Wallet 批准始终与 AI 和产品逻辑分离。"],
      ["最终目标", "形成成熟的 Web4 平台，让人们在不向每个服务交出无限控制权的前提下沟通、支付、开发、交易、创作和管理数据。"],
      ["当前边界", "这是测试网候选生态，不是 Mainnet、银行、交易所上币、已发行卡片或金融回报承诺。"],
    ],
    truths: [
      ["交易与区块", "区块是 finalized transaction 容器，不等于 1 个 YNXT；一个区块可包含多笔转账，空区块不会自动产生奖励。"],
      ["历史区块修改", "finality 后不可能修改：区块 1 或任何已 finalize 区块都不能在之后加入新交易。"],
      ["节点运维", "先以同步 observer 加入；通过 candidate review 前核验 height、hash、peer、storage、monitoring、backup 与 restore。"],
      ["验证者候选", "测试网准入需要评审并由 operator 控制；文档不等于批准，signer 不确定时必须 fail closed。"],
      ["出块事实", "YNX Testnet 使用轮换验证者与 block producer，不是 GPU 或 ASIC proof-of-work mining。"],
      ["Bridge 证据", "当前 Bridge 可证明 YNX 来源交易和本地 relayer 生命周期；外部提交已禁用：仅本地 finalized，不向外部提交。"],
    ],
  },
};

const textFromHtml = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

export function DocsPage() {
  const { locale } = useLocale();
  const localizedDocs = selectLocalizedDocs({ ...docsAuthority, ...docsLocales }, locale);
  const ui = DOCS_UI[locale] || DOCS_UI.en;
  const articles = localizedDocs.articles;
  const catalog = useMemo(() => getCatalog(), []);
  const [query, setQuery] = useState("");
  const [selectedRoute, setSelectedRoute] = useState(articles[0]?.route || "");

  const visibleArticles = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return articles;
    return articles.filter((article) =>
      `${article.h1} ${article.description} ${textFromHtml(article.html)}`.toLowerCase().includes(needle),
    );
  }, [articles, query]);

  if (!localizedDocs.available) {
    return (
      <main className="docsPage" lang={localizedDocs.locale} dir={localizedDocs.direction}>
        <header className="docsHeader docsReadableHeader">
          <p className="sectionEyebrow">Translation status</p>
          <h1>Documentation translation unavailable</h1>
          <p>The {localizedDocs.locale} manuals are incomplete. English content is not shown as if it were translated.</p>
          <a className="button primary" href="/docs?lang=en">Read the verified English manuals</a>
        </header>
      </main>
    );
  }

  const selectedArticle =
    visibleArticles.find((article) => article.route === selectedRoute)
    || visibleArticles[0]
    || null;

  const selectArticle = (route) => {
    setSelectedRoute(route);
    window.requestAnimationFrame(() => document.getElementById("full-manual")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <main className="docsPage" lang={localizedDocs.locale} dir={localizedDocs.direction}>
      <header className="docsHeader docsReadableHeader">
        <p className="sectionEyebrow">{ui.eyebrow}</p>
        <h1>{ui.title}</h1>
        <p>{ui.lead}</p>
        <div className="docsHeaderActions">
          <a className="button primary" href="#start-here">{ui.start} <ArrowRight size={16} /></a>
          <a className="button secondary" href="#full-manual">{ui.read} <BookOpen size={16} /></a>
        </div>
      </header>

      <section className="docsIntro" id="start-here" aria-labelledby="docs-intro-title">
        <div className="sectionHeader compact">
          <div><p className="sectionEyebrow">{ui.introEyebrow}</p><h2 id="docs-intro-title">{ui.introTitle}</h2></div>
        </div>
        <dl className="docsCoreFacts">
          {ui.coreFacts.map(([term, description]) => <div key={term}><dt>{term}</dt><dd>{description}</dd></div>)}
        </dl>
        <div className="docsStartSteps">
          {ui.startSteps.map(([number, title, description]) => (
            <article key={number}>
              <span>{number}</span>
              <div><h3>{title}</h3><p>{description}</p></div>
            </article>
          ))}
        </div>
        <div className="docsNetworkStrip" aria-label="YNX Testnet essentials">
          <span><small>{ui.network}</small><strong>YNX Testnet</strong></span>
          <span><small>{ui.chainId}</small><strong>6423 / 0x1917</strong></span>
          <span><small>{ui.asset}</small><strong>YNXT</strong></span>
          <span><small>{ui.explorer}</small><a href={apiConfig.explorerUrl}>{ui.explorerLink} <ArrowRight size={14} /></a></span>
        </div>
        <div className="docsTruthGrid" aria-label="Network operating truths">
          {ui.truths.map(([title, description]) => <article key={title}><h3>{title}</h3><p>{description}</p></article>)}
        </div>
      </section>

      <section className="docsManualBrowser" id="full-manual" aria-labelledby="manual-browser-title">
        <header className="docsManualHeader">
          <div><p className="sectionEyebrow">{ui.manualsEyebrow}</p><h2 id="manual-browser-title">{ui.manualsTitle}</h2><p>{ui.manualsLead}</p></div>
          <label className="docsSearch">
            <Search />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={ui.search} aria-label={ui.search} />
          </label>
        </header>

        <div className="docsLayout docsManualLayout">
          <nav className="docsNav" aria-label={ui.nav}>
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
                  <div><p className="sectionEyebrow">{ui.official} · Version {selectedArticle.version}</p><h2>{selectedArticle.h1}</h2><p>{selectedArticle.description}</p></div>
                </header>
                <div className="authorityArticle" dangerouslySetInnerHTML={{ __html: selectedArticle.html }} />
              </article>
            ) : (
              <div className="docsNoResults"><Search /><h2>{ui.noMatch}</h2><p>{ui.noMatchLead}</p></div>
            )}
          </div>
        </div>
      </section>

      <section className="docsEcosystemLogic" id="ecosystem-rules" aria-labelledby="ecosystem-rules-title">
        <div className="sectionHeader compact">
          <div><p className="sectionEyebrow">{ui.ecosystemEyebrow}</p><h2 id="ecosystem-rules-title">{ui.ecosystemTitle}</h2><p>{ui.ecosystemLead}</p></div>
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
                  <section><h3>{ui.how}</h3><ol>{guide.workflow.map((step) => <li key={step}>{step}</li>)}</ol></section>
                  <section><h3>{ui.rules}</h3><ul>{guide.rules.map((rule) => <li key={rule}><CheckCircle2 size={15} />{rule}</li>)}</ul></section>
                  <a className="textLink" href={product.route}>{ui.open} {product.name} {ui.details} <ArrowRight size={15} /></a>
                </div>
              </details>
            );
          })}
        </div>
      </section>

      <section className="docsSessionRelease" id="wallet-session-release" aria-labelledby="wallet-session-release-title">
        <div>
          <p className="sectionEyebrow">{ui.runtimeEyebrow}</p>
          <h2 id="wallet-session-release-title">{ui.runtimeTitle}</h2>
          <p>{ui.runtimeLead} <code>wallet-auth.ynxweb4.com</code> · <code>6cf3ef845202bd879ed94515a71b323dd2fc9e14</code></p>
          <div className="docsSessionReleaseActions">
            <a className="button primary" href="/releases/wallet-auth-runtime/6cf3ef845202bd879ed94515a71b323dd2fc9e14/runtime-publication.json"><Download size={16} /> {ui.runtimeRecord}</a>
            <a className="button secondary" href="https://github.com/JiahaoAlbus/YNX-Chain/blob/83a0a4f09a61d84a667d88a49708ffbe7643adc8/release/integration/wallet-product-session-v2-public-deployment-evidence.json" target="_blank" rel="noreferrer">{ui.evidence} <ArrowRight size={16} /></a>
          </div>
        </div>
        <dl>
          <div><dt>Runtime source</dt><dd>6cf3ef845202bd879ed94515a71b323dd2fc9e14</dd></div>
          <div><dt>Installed Wallet/client verified</dt><dd>False</dd></div>
          <div><dt>Account, sign, send, transaction, chain disconnect or public expiry verified</dt><dd>False</dd></div>
          <div><dt>Product migrations</dt><dd>0 / 12</dd></div>
          <div><dt>Central integration / aggregate public readiness</dt><dd>False / False</dd></div>
          <div><dt>Production signing / store release</dt><dd>False / False</dd></div>
        </dl>
      </section>

      <aside className="docsSafetyNote">
        <ShieldCheck />
        <div><strong>{ui.safetyTitle}</strong><p>{ui.safetyLead}</p></div>
      </aside>

      {docsAuthority.artifact.downloadHosted && docsAuthority.artifact.downloadPath ? (
        <details className="docsBundleExport">
          <summary><Download size={16} /> {ui.exportTitle}</summary>
          <div>
            <p>{ui.exportLead}</p>
            <a href={docsAuthority.artifact.downloadPath} download>{ui.exportLink}</a>
            <small>SHA-256 {docsAuthority.artifact.sha256} · {docsAuthority.artifact.bytes.toLocaleString("en-US")} bytes · source {docsAuthority.artifact.sourceCommit.slice(0, 12)}</small>
          </div>
        </details>
      ) : null}
    </main>
  );
}
