// Search loads translated descriptions, never the complete document bodies.
export function documentSearchEntries(documents, copy, locale) {
  return documents.map(document => ({
    title: copy.documents[document.id].title,
    description: copy.documents[document.id].description,
    href: `/docs?${new URLSearchParams({doc:document.id,lang:locale})}#document-reader`,
    keywords: `${document.sourcePath} ${copy.categories[document.category]}`,
  }));
}
export async function loadDocumentSearch(locale) {
  const [{DOCUMENT_LIBRARY},{getDocumentLibraryCopy}] = await Promise.all([
    import("../content/documentLibrary.js"), import("../content/documentLibraryCopy.js"),
  ]);
  const documents = documentSearchEntries(DOCUMENT_LIBRARY,getDocumentLibraryCopy(locale),locale);
  try {
    const response = await fetch(`/learning-search/${encodeURIComponent(locale)}.json`);
    if (response.ok) { const guides = await response.json(); if (Array.isArray(guides)) return [...guides,...documents]; }
  } catch { /* The document catalog remains searchable if the guide index fails. */ }
  return documents;
}
