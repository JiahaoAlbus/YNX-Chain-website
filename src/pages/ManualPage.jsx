import React, { useEffect, useState } from "react";
import { ArrowRight, BookOpen, Check, Code2, Cpu, Layers3, Wallet } from "lucide-react";
import { useLocale } from "../lib/i18n.jsx";
import { LEARNING_PATHS, LEARNING_COMMANDS, LEARNING_WINDOWS_COMMANDS, LEARNING_SOURCE, LEARNING_SOURCE_DOWNLOAD, LEARNING_HASH_COMMANDS, learningCommandFor, guideUi } from "../content/learningContent.js";
import { useLearningCopy } from "../lib/useLearningCopy.js";
import { getDocumentLibraryCopy } from "../content/documentLibraryCopy.js";
import { GuideCode } from "../components/GuideCode.jsx";
import "./learning-guides.css";
const icons = [Wallet, Cpu, Layers3, Code2];
const validPath = () => Math.max(0, LEARNING_PATHS.findIndex(path => path.id === new URLSearchParams(window.location.search).get("path")));
const progressKey = `ynx-learning-progress-${LEARNING_SOURCE.slice(0, 12)}`;
function readProgress() { try { const value = JSON.parse(localStorage.getItem(progressKey) || "[]"); return Array.isArray(value) ? value.filter(item => typeof item === "string") : []; } catch { return []; } }
export function ManualPage() {
  const { locale, t } = useLocale();
  const copy = useLearningCopy(locale);
  const [selected, setSelected] = useState(validPath);
  const [platform, setPlatform] = useState("macos");
  const [progress, setProgress] = useState(readProgress);
  useEffect(() => { const sync = () => setSelected(validPath()); window.addEventListener("popstate", sync); return () => window.removeEventListener("popstate", sync); }, []);
  useEffect(() => { try { localStorage.setItem(progressKey, JSON.stringify(progress)); } catch { /* The guide remains usable without browser storage. */ } }, [progress]);
  useEffect(() => { if (copy && window.location.hash) window.requestAnimationFrame(() => document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ block: "start" })); }, [copy]);
  if (!copy) return <main className="learningPage" aria-busy="true"><p role="status">{t("checking")}</p></main>;
  if (copy.loadFailed) { const errorCopy=getDocumentLibraryCopy(locale); return <main className="learningPage" lang={locale}><p role="alert">{errorCopy.loadError}</p><button type="button" onClick={()=>window.location.reload()}>{errorCopy.retry}</button></main>; }
  const ui = guideUi(copy), path = LEARNING_PATHS[selected], content = copy.paths[selected];
  const completed = path.steps.filter(step => progress.includes(`${path.id}-${step.id}`)).length;
  function choose(index) { const url = new URL(window.location.href); url.searchParams.set("path", LEARNING_PATHS[index].id); url.hash = "learning-route"; window.history.pushState({}, "", url); setSelected(index); window.requestAnimationFrame(() => document.getElementById("learning-route")?.scrollIntoView({ block: "start" })); }
  function toggle(id) { setProgress(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]); }
  const command = key => learningCommandFor(platform, key);
  return <main className="learningPage" lang={copy.bodyLocale || locale} dir={(copy.bodyLocale || locale) === "ar" ? "rtl" : "ltr"}>
    {copy.bodyLocale !== locale && <aside className="learningNetworkNote" lang={locale}><strong>{getDocumentLibraryCopy(locale).translationPending}</strong><p>{getDocumentLibraryCopy(locale).originalBodyNotice}</p></aside>}
    <header className="learningHero"><p className="sectionEyebrow">{ui.eyebrow}</p><h1>{copy.title}</h1><p>{copy.lead}</p><div className="learningLinks"><a href="/docs"><BookOpen size={17} />{ui.docs}</a><a href="/api">{ui.api}</a><a href="/whitepaper">{ui.whitepapers}</a></div></header>
    <nav className="learningChoices" aria-label={ui.choose}>{copy.paths.map((item, index) => { const Icon = icons[index]; return <button type="button" key={LEARNING_PATHS[index].id} onClick={() => choose(index)} aria-current={selected === index ? "step" : undefined}><Icon aria-hidden="true" /><span><strong>{item[0]}</strong><small>{ui.about} {LEARNING_PATHS[index].minutes} {ui.minutes}</small></span><ArrowRight size={18} aria-hidden="true" /></button>; })}</nav>
    <section className="learningRoute" id="learning-route" aria-labelledby="learning-route-title">
      <header className="learningRouteHeader"><div><p className="sectionEyebrow">{selected === 1 ? ui.localOnly : ui.publicNetwork}</p><h2 id="learning-route-title">{content[0]}</h2><p>{content[1]}</p></div><label className="learningPlatform">{ui.platform}<select value={platform} onChange={event => setPlatform(event.target.value)}><option value="macos">macOS</option><option value="windows">Windows / WSL</option><option value="linux">Linux</option></select></label></header>
      <div className="learningProgress"><span>{completed} / {path.steps.length} · {ui.complete}</span><progress value={completed} max={path.steps.length} aria-label={ui.complete} /><button type="button" onClick={() => setProgress(current => current.filter(id => !id.startsWith(`${path.id}-`)))}>{ui.reset}</button><small>{ui.progressNote}</small></div>
      <div className="learningColumns"><nav className="learningStepNav" aria-label={content[0]}>{path.steps.map((step, index) => <a key={step.id} href={`#step-${path.id}-${step.id}`}><span>{progress.includes(`${path.id}-${step.id}`) ? <Check size={14} /> : String(index + 1).padStart(2, "0")}</span>{content[2][index][0]}</a>)}</nav>
        <div className="learningSteps">{path.steps.map((step, index) => { const text = content[2][index], id = `${path.id}-${step.id}`; return <article className="learningStep" id={`step-${id}`} key={id}>
          <div className="learningStepTitle"><span>{String(index + 1).padStart(2, "0")}</span><h3>{text[0]}</h3></div><p>{text[1]}</p>
          {step.network && <NetworkSettings ui={ui} />}
          {step.command && <GuideCode ui={ui} code={command(step.command)} title={selected === 1 ? ui.localOnly : step.command === "consensus" ? "make · dry-run" : ui.readOnly} />}
          {path.id === "node" && step.id === "source" && <details className="learningHelp learningSourcePackage"><summary>{ui.sourceZip} · 107.2 MB</summary><p>{ui.zipHelp}</p><a className="learningTextLink" href={LEARNING_SOURCE_DOWNLOAD.url} download>{ui.sourceZip}<ArrowRight size={16}/></a><GuideCode ui={ui} code={LEARNING_HASH_COMMANDS[platform]} title={ui.verifyPackage}/><p><strong>SHA-256</strong><br/><code dir="ltr">{LEARNING_SOURCE_DOWNLOAD.sha256}</code></p></details>}
          <div className="learningExpected"><strong>{ui.expected}</strong><p>{text[2]}</p></div><details className="learningHelp"><summary>{ui.help}</summary><p>{text[3]}</p></details>
          <div className="learningStepActions">{step.href && <a href={step.href} target={step.href.startsWith("https:") ? "_blank" : undefined} rel={step.href.startsWith("https:") ? "noopener noreferrer" : undefined}>{ui.open}<ArrowRight size={16} aria-hidden="true" /></a>}<label><input type="checkbox" checked={progress.includes(id)} onChange={() => toggle(id)} />{ui.mark}</label></div>
          <nav className="learningNext" aria-label={text[0]}>{index > 0 && <a href={`#step-${path.id}-${path.steps[index - 1].id}`}>{ui.previous}</a>}{index < path.steps.length - 1 && <a href={`#step-${path.id}-${path.steps[index + 1].id}`}>{ui.next}<ArrowRight size={15} aria-hidden="true" /></a>}</nav>
        </article>; })}</div>
      </div>
    </section><aside className="learningNetworkNote"><strong>{ui.current}</strong><p>{ui.networkNotice}</p><p>{ui.sourceNotice}</p><small>{ui.source}: <code dir="ltr">{LEARNING_SOURCE}</code></small></aside>
  </main>;
}
export function NetworkSettings({ ui }) { return <dl className="learningNetworkSettings">{[[ui.networkName,"YNX Testnet"],[ui.networkId,"6423 / 0x1917"],[ui.rpc,"https://evm.ynxweb4.com"],[ui.symbol,"YNXT"],[ui.decimals,"18"],[ui.explorer,"https://explorer.ynxweb4.com"]].map(([label,value]) => <div key={label}><dt>{label}</dt><dd><code dir="ltr">{value}</code></dd></div>)}</dl>; }
