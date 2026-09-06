import React, { useEffect, useState } from 'react';
import { ArrowDownToLine, BookOpen, ChevronDown, FileText } from 'lucide-react';
import { useLocale } from '../lib/i18n.jsx';
import { getDocumentLibraryCopy } from '../content/documentLibraryCopy.js';
import '../pages/document-library.css';

const bodyCache = new Map();

export function DocumentReader({ document: source, locale: requestedLocale, showTitle = true }) {
  const context = useLocale();
  const locale = requestedLocale || context.locale;
  const copy = getDocumentLibraryCopy(locale);
  const detail = source ? copy.documents[source.id] : null;
  const bodyLocale = source?.bodyUrls?.[locale] ? locale : source?.sourceLocale;
  const bodyUrl = source?.bodyUrls?.[bodyLocale];
  const bodyKey = source ? `${source.id}:${bodyLocale}:${source.sha256}` : '';
  const [bodyState, setBodyState] = useState({key:'', status:'loading', body:null});
  const [attempt, setAttempt] = useState(0);
  const currentBody = bodyState.key === bodyKey ? bodyState : {key:bodyKey, status:'loading', body:null};

  useEffect(() => {
    if (!source || !bodyUrl) return;
    const cached = bodyCache.get(bodyKey);
    if (cached) { setBodyState({key:bodyKey,status:'ready',body:cached}); return; }
    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      controller.abort();
      setBodyState({key:bodyKey,status:'error',body:null});
    },15000);
    setBodyState({key:bodyKey,status:'loading',body:null});
    fetch(bodyUrl,{signal:controller.signal}).then(async response => {
      if (!response.ok) throw new Error('Document unavailable');
      const body = await response.json();
      if (body.documentId !== source.id || body.locale !== bodyLocale || body.sourceSha256 !== source.sha256 || typeof body.markdown !== 'string' || typeof body.html !== 'string' || !Array.isArray(body.headings)) throw new Error('Document identity mismatch');
      if (bodyLocale === source.sourceLocale && window.crypto?.subtle) {
        const bytes = new TextEncoder().encode(body.markdown);
        const digest = [...new Uint8Array(await window.crypto.subtle.digest('SHA-256',bytes))].map(value=>value.toString(16).padStart(2,'0')).join('');
        if (digest !== source.sha256 || bytes.length !== source.bytes) throw new Error('Document integrity mismatch');
      }
      if (controller.signal.aborted) return;
      window.clearTimeout(timeout);
      bodyCache.set(bodyKey,body);
      setBodyState({key:bodyKey,status:'ready',body});
    }).catch(() => {
      window.clearTimeout(timeout);
      if (!controller.signal.aborted) setBodyState({key:bodyKey,status:'error',body:null});
    });
    return () => { window.clearTimeout(timeout); controller.abort(); };
  }, [bodyKey,bodyUrl,attempt,source,bodyLocale]);

  useEffect(() => {
    if (!source || currentBody.status !== 'ready' || !window.location.hash) return;
    let anchor;
    try { anchor = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
    const frame = window.requestAnimationFrame(() => window.document.getElementById(anchor)?.scrollIntoView({block:'start'}));
    return () => window.cancelAnimationFrame(frame);
  }, [source?.id,currentBody.status]);

  if (!source || !detail) return <p className="documentEmpty">{copy.noResults}</p>;
  const headings = currentBody.body?.headings.filter(heading => heading.level === 2 || heading.level === 3) || [];

  return (
    <section className="documentReader" aria-label={detail.title} lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <header className="documentReaderHeader">
        <div className="documentBadges">
          <span><FileText size={14} aria-hidden="true" />{source.status === 'draft' ? copy.draft : copy.archive}</span>
          <span>{copy.original} · {copy.english}</span>
        </div>
        {showTitle ? <h2>{detail.title}</h2> : null}
        <p>{detail.description}</p>
        <div className="documentDateRow">
          <span>{copy.version}: <bdi>{source.version || copy.notRecorded}</bdi></span>
          <span>{copy.updated}: <bdi>{source.updatedAt || copy.notRecorded}</bdi></span>
        </div>
      </header>

      <aside className="documentReadingNote" aria-labelledby={`reading-note-${source.id}`}>
        <h3 id={`reading-note-${source.id}`}><BookOpen size={18} aria-hidden="true" />{copy.readingNote}</h3>
        {detail.readingNotes.map((note, index) => <p key={index}>{note}</p>)}
        {locale !== source.sourceLocale ? <p className="documentTranslationState"><strong>{copy.translationPending}.</strong> {copy.originalBodyNotice}</p> : null}
      </aside>

      <details className="documentIntegrity">
        <summary>{copy.metadata}<ChevronDown size={16} aria-hidden="true" /></summary>
        <dl>
          <div><dt>{copy.originalTitle}</dt><dd lang="en" dir="ltr">{source.title}</dd></div>
          <div><dt>{copy.source}</dt><dd><code dir="ltr">{source.sourcePath}</code><code dir="ltr">{source.sourceCommit}</code></dd></div>
          <div><dt>{copy.checksum}</dt><dd><code dir="ltr">{source.sha256}</code></dd></div>
          <div><dt>{copy.bytes}</dt><dd><bdi>{source.bytes.toLocaleString(locale)}</bdi></dd></div>
          <div><dt>{copy.sourceLanguage}</dt><dd>{copy.english}</dd></div>
        </dl>
        <a className="documentDownload" href={source.downloadUrl} download><ArrowDownToLine size={16} aria-hidden="true" />{copy.download}</a>
      </details>

      {currentBody.status === 'loading' ? <p className="documentLoadState" role="status">{copy.loading}</p> : currentBody.status === 'error' ? <div className="documentLoadState" role="status"><p>{copy.loadError}</p><button type="button" onClick={() => setAttempt(value=>value+1)}>{copy.retry}</button></div> : <div className="documentReadLayout">
        {headings.length ? <details className="documentContents" open>
          <summary>{copy.contents}<ChevronDown size={16} aria-hidden="true" /></summary>
          <nav aria-label={copy.contents} lang={bodyLocale} dir={bodyLocale === 'ar' ? 'rtl' : 'ltr'}>
            {headings.map(heading => <a className={heading.level === 3 ? 'documentSubheading' : undefined} key={heading.id} href={`#${heading.id}`}>{heading.title}</a>)}
          </nav>
        </details> : null}
        <article className="documentBody" lang={bodyLocale} dir={bodyLocale === 'ar' ? 'rtl' : 'ltr'} dangerouslySetInnerHTML={{__html: currentBody.body.html}} />
      </div>}
    </section>
  );
}
