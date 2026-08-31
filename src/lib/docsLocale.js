export function selectLocalizedDocs(docsAuthority, locale) {
  const requested = docsAuthority.requestedLocales?.includes(locale) ? locale : docsAuthority.sourceLocale;
  const articles = docsAuthority.byLocale?.[requested];
  return {
    locale: requested,
    direction: docsAuthority.direction?.[requested] || "ltr",
    available: Array.isArray(articles) && articles.length > 0 && (docsAuthority.missingMatrix?.[requested]?.length || 0) === 0,
    articles: Array.isArray(articles) ? articles : [],
    missingRoutes: docsAuthority.missingMatrix?.[requested] || [],
  };
}

export function docsLocaleUrl(route, locale, sourceLocale = "en") {
  if (locale === sourceLocale) return route;
  const query = new URLSearchParams({ lang: locale });
  return `${route}?${query}`;
}

export function docsHreflangLinks(route, requestedLocales, sourceLocale = "en") {
  return requestedLocales.map((locale) => ({ locale, href: docsLocaleUrl(route, locale, sourceLocale) }));
}
