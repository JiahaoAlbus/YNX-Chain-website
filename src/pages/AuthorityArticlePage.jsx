import React from "react";
import { BookOpen, CalendarDays, GitCommitHorizontal } from "lucide-react";
import docsAuthority from "virtual:ynx-docs-authority";
import docsLocales from "virtual:ynx-docs-locales";
import { useLocale } from "../lib/i18n.jsx";
import { selectLocalizedDocs } from "../lib/docsLocale.js";

export function AuthorityArticlePage({ artifact, sourceArticle }) {
  const { locale } = useLocale();
  const localeState = selectLocalizedDocs({ ...docsAuthority, ...docsLocales }, locale);
  const article = localeState.articles.find((candidate) => candidate.route === sourceArticle.route);
  if (!article) {
    return (
      <main className="authorityPage" lang={localeState.locale} dir={localeState.direction}>
        <a className="backLink" href="/docs">← Documentation</a>
        <header className="authorityHeader">
          <p className="sectionEyebrow">Translation status</p>
          <h1>{sourceArticle.h1}</h1>
          <p>This manual is not published in {localeState.locale}. The English body is intentionally not substituted for a missing translation.</p>
          <p><a href={`${sourceArticle.route}?lang=en`}>Read the verified English source</a></p>
        </header>
      </main>
    );
  }
  return (
    <main className="authorityPage" lang={article.locale || "en"} dir={article.direction || "ltr"}>
      <a className="backLink" href="/docs">← Documentation</a>
      <header className="authorityHeader">
        <p className="sectionEyebrow">YNX public authority</p>
        <h1>{article.h1}</h1>
        <p>{article.description}</p>
        <dl className="authorityProvenance">
          <div><dt><BookOpen />Version</dt><dd>{article.version}</dd></div>
          <div><dt><CalendarDays />Last reviewed</dt><dd>{article.lastReviewed || article.effectiveDate || "Recorded in source"}</dd></div>
          <div><dt><GitCommitHorizontal />Bundle source</dt><dd><code>{artifact.sourceCommit.slice(0, 12)}</code></dd></div>
        </dl>
      </header>
      <article className="authorityArticle" dangerouslySetInnerHTML={{ __html: article.html }} />
    </main>
  );
}
