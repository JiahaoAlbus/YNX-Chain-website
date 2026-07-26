import React from "react";
import { BookOpen, CalendarDays, GitCommitHorizontal } from "lucide-react";

export function AuthorityArticlePage({ article, artifact }) {
  return (
    <main className="authorityPage">
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
