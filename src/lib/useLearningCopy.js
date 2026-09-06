import { useEffect, useState } from "react";
const loaders = import.meta.glob("../content/learning-locales/*.json");
const cache = new Map();
export function useLearningCopy(locale) {
  const actual = loaders[`../content/learning-locales/${locale}.json`] ? locale : "en";
  const [loaded, setLoaded] = useState(() => ({ locale:actual, copy:cache.get(actual) }));
  useEffect(() => {
    let active = true;
    if (cache.has(actual)) { setLoaded({locale:actual,copy:cache.get(actual)}); return undefined; }
    loaders[`../content/learning-locales/${actual}.json`]().then(module => { const copy={...module.default,bodyLocale:actual};cache.set(actual,copy);if(active)setLoaded({locale:actual,copy}); }).catch(() => { if(active)setLoaded({locale:actual,copy:{loadFailed:true,bodyLocale:actual}}); });
    return () => { active=false; };
  }, [actual]);
  return loaded.locale === actual ? loaded.copy : cache.get(actual);
}
