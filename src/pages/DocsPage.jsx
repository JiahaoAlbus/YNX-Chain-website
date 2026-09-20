import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, Search } from "lucide-react";
import { useLocale } from "../lib/i18n.jsx";
import { DOCUMENT_LIBRARY, getDocumentById } from "../content/documentLibrary.js";
import { getDocumentLibraryCopy } from "../content/documentLibraryCopy.js";
import { guideUi, LEARNING_PATHS } from "../content/learningContent.js";
import { useLearningCopy } from "../lib/useLearningCopy.js";
import { DocsSourceRecords } from "../components/DocsSourceRecords.jsx";
import { DocumentReader } from "../components/DocumentReader.jsx";
import "./learning-guides.css";
import "./document-library.css";
function selectedFromUrl() { return new URLSearchParams(window.location.search).get("doc") || ""; }
export function DocsPage() {
  const { locale, t } = useLocale();
  const copy = getDocumentLibraryCopy(locale), learningState = useLearningCopy(locale);
  const learning = learningState?.loadFailed ? null : learningState;
  const [query,setQuery] = useState("");
  const [category,setCategory] = useState("all");
  const [selectedId,setSelectedId] = useState(selectedFromUrl);
  useEffect(() => { const sync=()=>setSelectedId(selectedFromUrl()); window.addEventListener("popstate",sync); return()=>window.removeEventListener("popstate",sync); },[]);
  const visible = useMemo(() => DOCUMENT_LIBRARY.filter(document => {
    const text=copy.documents[document.id];
    return (category === "all" || document.category === category) && `${text.title} ${text.description} ${document.sourcePath}`.toLocaleLowerCase(locale).includes(query.trim().toLocaleLowerCase(locale));
  }),[copy,query,category,locale]);
  const selected = getDocumentById(selectedId);
  function choose(id) { const url = new URL(window.location.href); id ? url.searchParams.set("doc",id) : url.searchParams.delete("doc"); url.hash=id?"document-reader":"document-index"; window.history.pushState({},"",url); setSelectedId(id); window.requestAnimationFrame(()=>document.getElementById(id?"document-reader":"document-index")?.scrollIntoView({block:"start"})); }
  const ui=learning?guideUi(learning):null;
  return <main className="learningPage docsLearningPage" lang={locale} dir={locale === "ar"?"rtl":"ltr"}>
    <header className="learningHero"><p className="sectionEyebrow">{copy.title}</p><h1>{learning?ui.docs:copy.title}</h1><p>{copy.lead}</p><div className="learningLinks"><a href="/manual"><BookOpen size={17}/>{learning?ui.eyebrow:t("manual")}</a><a href="/api">{learning?ui.api:"API"}</a><a href="/whitepaper">{copy.whitepapers}</a></div></header>
    {learning && <nav className="docsLearningPaths" aria-label={ui.choose}>{learning.paths.map((path,index)=><a href={`/manual?path=${LEARNING_PATHS[index].id}&lang=${locale}`} key={LEARNING_PATHS[index].id}><span>{String(index+1).padStart(2,"0")}</span><strong>{path[0]}</strong><ArrowRight size={18}/></a>)}</nav>}
    <section className="docsLibraryIndex" id="document-index" aria-labelledby="document-index-title"><div className="docsIndexHeader"><h2 id="document-index-title">{copy.title} <small>{DOCUMENT_LIBRARY.length}</small></h2><label className="docsLibrarySearch"><Search size={18}/><input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder={copy.search} aria-label={copy.search}/></label></div>
      <div className="docsCategoryFilters" role="group" aria-label={copy.title}>{[["all",copy.all],...Object.entries(copy.categories)].map(([id,label])=><button type="button" key={id} aria-pressed={category===id} onClick={()=>setCategory(id)}>{label}</button>)}</div>
      <div className="docsDocumentGrid">{visible.map(document=>{const text=copy.documents[document.id];return <button type="button" key={document.id} onClick={()=>choose(document.id)} aria-pressed={selectedId===document.id}><small>{copy.categories[document.category]} · {document.status==="draft"?copy.draft:copy.archive}</small><strong>{text.title}</strong><span>{text.description}</span><em>{copy.read}<ArrowRight size={16}/></em></button>;})}</div>
      {!visible.length&&<div className="docsEmpty"><p>{copy.noResults}</p><button type="button" onClick={()=>{setQuery("");setCategory("all");}}>{copy.reset}</button></div>}
    </section>
    {selected&&<section id="document-reader" className="docsSelectedReader"><button className="docsBackToIndex" type="button" onClick={()=>choose("")}>{copy.back}</button><DocumentReader document={selected} locale={locale}/></section>}
    <DocsSourceRecords locale={locale}/>
    <aside className="learningNetworkNote"><strong>{copy.currentNetwork}</strong><p>{copy.networkNotice}</p><p>{copy.archiveNotice}</p></aside>
  </main>;
}
