import React from "react";
import {
  ArrowUpRight, CheckCircle2, CircleDashed, Download, FileText, GitBranch, Globe,
  Link2, LockKeyhole, Network, ShieldCheck, TriangleAlert
} from "lucide-react";
import { DOWNLOAD_LABELS, PLATFORM_STATUS, PRODUCT_STATUS, STATUS_CONFIG } from "../lib/ecosystemCatalog.js";
import {
  PRODUCT_PUBLIC_SECTIONS, assertProductPublicContract, getProductPublicContract, getProductPublicDisplayStatus
} from "../lib/productPublicContract.js";
import { ECOSYSTEM_GUIDES } from "../content/ecosystemGuides.js";
import docsAuthority from "virtual:ynx-docs-authority";
import { useLocale } from "../lib/i18n.jsx";
import { useLocalizedDocs } from "../lib/useLocalizedDocs.js";
import { PRODUCT_UI_COPY, PRODUCT_SECTION_LABEL_KEYS } from "../content/productUiCopy.js";
import { ProductDownloads } from "../components/ProductDownloads.jsx";
import { WALLET_DOWNLOAD_PLATFORMS, walletDownloadLabel, walletDownloadState } from "../lib/walletDownloads.js";
import { WALLET_DOWNLOAD_COPY } from "../content/walletDownloadCopy.js";

const platformOrder = ["web", "pwa", "chromeEdge", "firefox", "android", "ios", "macos", "windows", "windowsX64", "windowsArm64", "linux"];

function EvidenceState({ label, value, detail }) {
  return <li className={value ? "confirmed" : "pending"}>{value ? <CheckCircle2 size={17} /> : <CircleDashed size={17} />}<span><strong>{label}</strong><small>{detail}</small></span></li>;
}

function Surface({ platform, item, registryAllowsDownloads, productKey }) {
  const { locale } = useLocale();
  const copy = { ...(PRODUCT_UI_COPY[locale] || PRODUCT_UI_COPY.en), ...(WALLET_DOWNLOAD_COPY[locale] || WALLET_DOWNLOAD_COPY.en) };
  const state = PLATFORM_STATUS[item?.status] || PLATFORM_STATUS[PRODUCT_STATUS.NOT_READY];
  const walletFile = productKey === "wallet" && platform !== "web" ? walletDownloadState(platform, item, registryAllowsDownloads) : null;
  const canOpen = registryAllowsDownloads && item?.downloadHosted === true && item?.href && (!walletFile || walletFile.available);
  return <li className={`productSurface ${item?.status || PRODUCT_STATUS.NOT_READY}`}><span><strong>{productKey === "wallet" ? walletDownloadLabel(platform, copy) : DOWNLOAD_LABELS[platform]}</strong><small>{walletFile ? copy[walletFile.limitationKey] : item?.note || "No verified release evidence."}</small>{walletFile?.signingKey && <small>{copy[walletFile.signingKey]}</small>}{walletFile?.installProofKey && <small>{copy[walletFile.installProofKey]}</small>}</span>{canOpen ? <a href={item.href} download={walletFile?.filename} rel={item.external ? "noopener" : undefined}>{walletFile ? copy.download : "Download"} <ArrowUpRight size={14} /></a> : <em>{walletFile ? copy.unavailableYet : item?.href ? "Registry verification required" : state.text}</em>}</li>;
}

function SectionNavigation({ contract, activeSection, copy }) {
  return <nav className="productMicrositeNav" aria-label={`${contract.name} · ${copy.productSections}`}>{contract.sections.map((section) => <a key={section.id} href={section.href} aria-current={section.id === activeSection ? "page" : undefined}><span>{copy[PRODUCT_SECTION_LABEL_KEYS[section.id]]}</span></a>)}</nav>;
}

function UnavailableAction({ title, reason }) {
  return <article className="productAction unavailable" aria-disabled="true"><CircleDashed aria-hidden="true" /><div><strong>{title}</strong><p>{reason}</p></div><span>Unavailable</span></article>;
}

function AvailableAction({ title, detail, href, external = false, icon: Icon = ArrowUpRight }) {
  return <a className="productAction available" href={href} rel={external ? "noopener" : undefined}><Icon aria-hidden="true" /><div><strong>{title}</strong><p>{detail}</p></div><ArrowUpRight aria-hidden="true" /></a>;
}

function SectionPage({ product, contract, sectionId, guide, copy, locale }) {
  const definition = PRODUCT_PUBLIC_SECTIONS.find((section) => section.id === sectionId);
  const riskMetric = product.metrics?.find(([label]) => /risk|boundary/i.test(label));
  return <section className="productMicrositeSection" aria-labelledby="product-section-title">
    <header>{sectionId !== "open-download" && <p className="sectionEyebrow">{product.name}</p>}<h2 id="product-section-title">{copy[PRODUCT_SECTION_LABEL_KEYS[sectionId]] || definition.label}</h2>{sectionId !== "open-download" && <p>{definition.description}</p>}</header>

    {sectionId === "features" ? <div className="productFeatureGrid">{(product.metrics || []).map(([label, value]) => <article key={`${label}-${value}`}><strong>{label}</strong><p>{value}</p></article>)}{guide?.workflow?.map((step, index) => <article key={step}><strong>Workflow {String(index + 1).padStart(2, "0")}</strong><p>{step}</p></article>)}{!product.metrics?.length && !guide?.workflow?.length ? <article><strong>notApplicable</strong><p>The product owner has not supplied public feature detail in the current website evidence set.</p></article> : null}</div> : null}

    {sectionId === "open-download" ? <ProductDownloads product={product} contract={contract} copy={copy} locale={locale} /> : null}

    {sectionId === "docs-api" ? <div className="productActionList">
      {contract.docs.status === "available" ? <AvailableAction title={contract.docs.label} detail="Open the product documentation entry." href={contract.docs.href} external={contract.docs.external} icon={FileText} /> : <UnavailableAction title="Product documentation" reason={contract.docs.reason} />}
      {contract.api.status === "available" ? <AvailableAction title={contract.api.label} detail={contract.api.reason} href={contract.api.href} icon={Network} /> : <><UnavailableAction title="Product-specific API" reason={contract.api.reason} />{contract.api.fallbackHref ? <AvailableAction title="General YNX API reference" detail="Network-level REST and EVM interfaces; this does not imply a public product API." href={contract.api.fallbackHref} icon={Network} /> : null}</>}
    </div> : null}

    {sectionId === "security-privacy-status-support" ? <div className="productActionList">
      <AvailableAction title="Security" detail="Controls, limitations, and responsible vulnerability reporting." href="/security" icon={ShieldCheck} />
      <AvailableAction title="Privacy" detail="Data minimization, user controls, and deletion boundaries." href="/privacy" icon={LockKeyhole} />
      <AvailableAction title="Status" detail="Public network and service evidence without product overclaiming." href="/status" icon={Network} />
      <AvailableAction title="Support" detail="Safe self-service checks and official support destinations." href="/support" icon={Link2} />
    </div> : null}

    {sectionId === "integrations-web4" ? <div className="productPublicFacts">
      <article><strong>Network contract</strong><p>{contract.boundaries.chain}</p></article>
      <article><strong>Web4 boundary</strong><p>{contract.publicWebVerified ? "The release registry identifies a public product URL. This does not prove Wallet connection, signing, transaction execution, or production readiness." : "No registry-verified public product URL is available. Integration remains documentation- or owner-evidence-only."}</p></article>
      <article><strong>Truth source</strong><p>{contract.boundaries.publicTruth}</p></article>
      <article><strong>Not promoted</strong><p>{contract.boundaries.notPromoted}</p></article>
    </div> : null}

    {sectionId === "risks" ? <div className="productPublicFacts risk">
      <article><TriangleAlert /><strong>Known product risk</strong><p>{riskMetric?.[1] || "No product-specific risk statement is registered; absence of a statement is not evidence of low risk."}</p></article>
      <article><strong>Release boundary</strong><p>{product.release?.statusNote || "No product release status note is available."}</p></article>
      <article><strong>Public-evidence boundary</strong><p>{contract.boundaries.notPromoted}</p></article>
      <article><strong>Signing and store boundary</strong><p>No production signing, notarization, store acceptance, or custody authority is inferred by this website contract.</p></article>
    </div> : null}

    {sectionId === "releases" ? <div className="productActionList">
      {contract.runtimeEvidence && <AvailableAction title={copy.releaseDetails} detail={contract.publicEntry.href} href={contract.runtimeEvidence} icon={Globe} />}
      {contract.releaseEvidence.status === "available" ? <AvailableAction title={contract.releaseEvidence.label} detail={`Registry commit ${contract.registryCommit || "not recorded"}; state ${contract.registryState}.`} href={contract.releaseEvidence.href} icon={GitBranch} /> : <UnavailableAction title="Product release evidence" reason={contract.releaseEvidence.reason} />}
      <article className="productReleaseRecord"><GitBranch /><div><strong>Public release-registry record</strong><dl><div><dt>Linked</dt><dd>{String(contract.registryLinked)}</dd></div><div><dt>State</dt><dd>{contract.registryState}</dd></div><div><dt>Commit</dt><dd><code>{contract.registryCommit || "not registered"}</code></dd></div><div><dt>Central accepted</dt><dd>{String(contract.centralAccepted)}</dd></div><div><dt>Public web verified</dt><dd>{String(contract.publicWebVerified)}</dd></div><div><dt>Hosted download verified</dt><dd>{String(contract.downloadHostedVerified)}</dd></div></dl></div></article>
    </div> : null}
  </section>;
}

export function ProductStatusPage({ product, sectionId = "overview", article, artifact }) {
  const { locale } = useLocale();
  const copy = PRODUCT_UI_COPY[locale] || PRODUCT_UI_COPY.en;
  const localeState = useLocalizedDocs(locale);
  const localizedArticle = article ? localeState.articles.find((candidate) => candidate.route === article.route) : null;
  const contract = getProductPublicContract(product);
  assertProductPublicContract(contract);
  const publicWeb = contract.publicWebVerified;
  const hasHostedDownload = contract.downloadHostedVerified;
  const publicStatus = getProductPublicDisplayStatus(contract);
  const status = STATUS_CONFIG[publicStatus] || STATUS_CONFIG[PRODUCT_STATUS.NOT_READY];
  const centralAccepted = contract.centralAccepted;
  const guide = ECOSYSTEM_GUIDES[product.key];
  const overview = sectionId === "overview";

  return <main className="productStatusPage" data-product={product.key} data-section={sectionId} data-public-contract={contract.schema}>
    <header className="productStatusHero"><span className="productStatusIcon"><product.icon size={28} /></span><div><p className="sectionEyebrow">YNX · {copy.testnetPreview}</p><h1>{product.name}</h1><p>{sectionId === "open-download" ? copy.choosePlatform : product.detail}</p></div><span className={`appState ${status.tone}`}>{sectionId === "open-download" ? copy.testnetPreview : status.label}</span></header>
    <SectionNavigation contract={contract} activeSection={sectionId} copy={copy} />

    {!overview ? <SectionPage product={product} contract={contract} sectionId={sectionId} guide={guide} copy={copy} locale={locale} /> : <>
      <section className="productStatusLayout">
        <div className="productStatusMain">
          <div className="productStatusSection"><div className="sectionHeader compact"><div><p className="sectionEyebrow">Current evidence</p><h2>What this status proves</h2></div></div><ul className="productEvidenceList">
            <EvidenceState label="Candidate code" value={Boolean(contract.registryCommit)} detail={`Public registry source commit: ${contract.registryCommit || "not registered"}`} />
            <EvidenceState label="Central acceptance" value={centralAccepted} detail={centralAccepted ? "The current public release registry marks this product accepted." : "No committed product-release.json acceptance is proved by the current public release registry."} />
            <EvidenceState label="Public product surface" value={publicWeb} detail={publicWeb ? "A public product URL is recorded in the current public release registry." : "A health endpoint, catalog link, local build, or CI result does not prove a public product UI."} />
            <EvidenceState label="Hosted installer" value={hasHostedDownload} detail={hasHostedDownload ? "A registry-authorized immutable hosted artifact is available in this website build." : "No registry-authorized immutable artifact URL is available from this website contract."} />
            <EvidenceState label="Production signing / store release" value={false} detail="No owner production signature or app-store acceptance is claimed." />
          </ul></div>
          <div className="productStatusSection"><div className="sectionHeader compact"><div><p className="sectionEyebrow">Platforms</p><h2>Install and access</h2></div></div><ul className="productSurfaceList">{(product.key === "wallet" ? ["web", ...WALLET_DOWNLOAD_PLATFORMS] : platformOrder).map((platform) => <Surface key={platform} platform={platform} item={product.downloads?.[platform]} registryAllowsDownloads={contract.downloadHostedVerified} productKey={product.key} />)}</ul></div>
        </div>
        <aside className="productStatusAside"><div><GitBranch size={18} /><span><small>Registry source commit</small><code>{contract.registryCommit || "No registry record"}</code></span></div><p>{product.release?.statusNote || "No product release record has been accepted."}</p><a className="button primary" href={contract.sections.find((item) => item.id === "docs-api").href}>Docs and API <ArrowUpRight size={16} /></a><a className="button secondary" href={contract.sections.find((item) => item.id === "open-download").href}>Open or download <ArrowUpRight size={16} /></a><a className="button secondary" href={contract.sections.find((item) => item.id === "releases").href}>Release evidence <ArrowUpRight size={16} /></a><a className="textLink" href="/dapp/download"><Download size={16} /> Download center</a></aside>
      </section>
      <aside className="evidenceBoundary"><ShieldCheck /><div><strong>Status is narrower than ambition.</strong><p>Candidate code, local packages, public APIs, hosted installers, production signing, and store acceptance are separate states.</p></div></aside>
      {guide && <section className="productLogic" aria-labelledby="product-logic-title"><header><p className="sectionEyebrow">How this product works</p><h2 id="product-logic-title">Purpose, workflow and hard rules</h2><p>{guide.purpose}</p></header><div className="productLogicGrid"><section><h3>User workflow</h3><ol>{guide.workflow.map((step) => <li key={step}>{step}</li>)}</ol></section><section><h3>Rules and boundaries</h3><ul>{guide.rules.map((rule) => <li key={rule}><CheckCircle2 size={16} /> <span>{rule}</span></li>)}</ul></section></div></section>}
      {localizedArticle && <section className="productAuthority" aria-labelledby="product-authority-title"><header><p className="sectionEyebrow">Evidence-linked public documentation</p><h2 id="product-authority-title">{localizedArticle.h1}</h2><p>{localizedArticle.description}</p><small>Version {localizedArticle.version} · reviewed {localizedArticle.lastReviewed || localizedArticle.effectiveDate || "in source"} · bundle <code>{artifact.sourceCommit.slice(0, 12)}</code></small></header><article className="authorityArticle" lang={localizedArticle.locale} dir={localizedArticle.direction} dangerouslySetInnerHTML={{ __html: localizedArticle.html }} /></section>}
      {article && !localizedArticle ? <aside className="evidenceBoundary"><ShieldCheck /><div><strong>Translation unavailable.</strong><p>The {localeState.locale} authority text is incomplete.</p></div></aside> : null}
    </>}
  </main>;
}
