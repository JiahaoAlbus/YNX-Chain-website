import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowUpRight, BookOpen } from 'lucide-react';
import { useLocale } from '../lib/i18n.jsx';
import { DOCUMENT_LIBRARY, WHITEPAPERS, getDocumentById } from '../content/documentLibrary.js';
import { getDocumentLibraryCopy } from '../content/documentLibraryCopy.js';
import { DocumentReader } from '../components/DocumentReader.jsx';
import './document-library.css';

const defaultDocument = WHITEPAPERS.find(document => document.id === 'whitepaper-ynx-chain-whitepaper') || WHITEPAPERS[0];
const selectedFromLocation = () => getDocumentById(new URLSearchParams(window.location.search).get('doc')) || defaultDocument;

export function WhitepaperPage() {
  const { locale } = useLocale();
  const copy = getDocumentLibraryCopy(locale);
  const [selected, setSelected] = useState(selectedFromLocation);

  useEffect(() => {
    const restore = () => setSelected(selectedFromLocation());
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, []);

  const select = (id) => {
    const next = getDocumentById(id);
    if (!next) return;
    const url = new URL(window.location.href);
    url.searchParams.set('doc', id);
    url.searchParams.set('lang', locale);
    url.hash = '';
    window.history.pushState({}, '', url);
    setSelected(next);
  };
  const hrefFor = (id) => `/whitepaper?${new URLSearchParams({doc:id, lang:locale})}`;

  return (
    <main className="documentLibraryPage" lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <header className="documentLibraryHero">
        <a className="documentBack" href={`/docs?lang=${encodeURIComponent(locale)}`}><ArrowLeft size={16} aria-hidden="true" />{copy.back}</a>
        <p className="documentEyebrow">YNX · {copy.title}</p>
        <h1>{selected.category === 'whitepaper' ? copy.whitepapers : copy.title}</h1>
        <p>{selected.category === 'whitepaper' ? copy.whitepaperLead : copy.lead}</p>
        <div className="documentWhitepaperGrid">
          {WHITEPAPERS.map(document => <a key={document.id} className={selected.id === document.id ? 'selected' : undefined} href={hrefFor(document.id)} onClick={event => {
            if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault(); select(document.id);
          }}>
            <BookOpen size={19} aria-hidden="true" />
            <span><strong>{copy.documents[document.id].title}</strong><small>{copy.draft} · <bdi>{document.version}</bdi></small></span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>)}
        </div>
        <label className="documentSelect"><span>{copy.selectDocument}</span><select value={selected.id} onChange={event => select(event.target.value)}>
          {DOCUMENT_LIBRARY.map(document => <option key={document.id} value={document.id}>{copy.documents[document.id].title}</option>)}
        </select></label>
      </header>
      <DocumentReader document={selected} locale={locale} />
    </main>
  );
}
