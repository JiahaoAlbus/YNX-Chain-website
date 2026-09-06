export function selectDocumentBody(source, locale) {
  const bodyLocale = source?.bodyUrls?.[locale] ? locale : source?.sourceLocale;
  const isTranslated = Boolean(source && bodyLocale !== source.sourceLocale);
  const translation = isTranslated ? source.translations?.[bodyLocale] : null;
  const digest = translation?.sha256 || source?.sha256;
  return {
    locale: bodyLocale, url: source?.bodyUrls?.[bodyLocale],
    isTranslated, isFallback: Boolean(source && locale !== bodyLocale),
    sha256: digest, bytes: translation?.bytes ?? source?.bytes,
    htmlSha256: translation?.htmlSha256,
    key: source ? `${source.id}:${bodyLocale}:${source.sha256}:${digest}:${translation?.htmlSha256 || ''}` : '',
  };
}

export async function validateDocumentBody(body, source, selection, subtle = globalThis.crypto?.subtle) {
  if (!body || body.documentId !== source.id || body.locale !== selection.locale || body.sourceSha256 !== source.sha256 || typeof body.markdown !== 'string' || typeof body.html !== 'string' || !Array.isArray(body.headings)) throw new Error('Document identity mismatch');
  const ids = new Set();
  for (const heading of body.headings) {
    if (typeof heading.title !== 'string' || !Number.isInteger(heading.level) || heading.level < 1 || heading.level > 6 || typeof heading.id !== 'string' || !heading.id.startsWith(`${source.id}-section-`) || ids.has(heading.id)) throw new Error('Document chapter mismatch');
    ids.add(heading.id);
  }
  if (selection.isTranslated && (body.sourceLocale !== source.sourceLocale || body.translationStatus !== 'translated-draft' || body.translationOfVersion !== source.version || body.translatedSha256 !== selection.sha256)) throw new Error('Translation identity mismatch');
  const bytes = new TextEncoder().encode(body.markdown);
  if (bytes.length !== selection.bytes) throw new Error('Document size mismatch');
  if (subtle) {
    const digest = [...new Uint8Array(await subtle.digest('SHA-256', bytes))].map(value => value.toString(16).padStart(2, '0')).join('');
    if (digest !== selection.sha256) throw new Error('Document integrity mismatch');
    if (selection.isTranslated) {
      const htmlDigest = [...new Uint8Array(await subtle.digest('SHA-256', new TextEncoder().encode(body.html)))].map(value => value.toString(16).padStart(2, '0')).join('');
      if (htmlDigest !== selection.htmlSha256) throw new Error('Document HTML integrity mismatch');
    }
  }
  return body;
}

export function documentLanguageName(bodyLocale, displayLocale) {
  try { return new Intl.DisplayNames([displayLocale], { type: 'language' }).of(bodyLocale); }
  catch { return bodyLocale; }
}
