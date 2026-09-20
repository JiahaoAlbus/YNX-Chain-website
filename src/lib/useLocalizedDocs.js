import { use } from "react";
import docsAuthority from "virtual:ynx-docs-authority";
import loaders from "virtual:ynx-docs-locales";
import { selectLocalizedDocs } from "./docsLocale.js";

const requests = new Map();

// Keep one stable promise per language so Suspense can reuse an in-flight load.
export function useLocalizedDocs(locale) {
  const requested = docsAuthority.requestedLocales.includes(locale) ? locale : docsAuthority.sourceLocale;
  if (!requests.has(requested)) {
    requests.set(requested, loaders[requested] ? loaders[requested]().then((module) => module.default) : Promise.resolve([]));
  }
  const articles = use(requests.get(requested));
  return selectLocalizedDocs({ ...docsAuthority, byLocale: { [requested]: articles } }, requested);
}
