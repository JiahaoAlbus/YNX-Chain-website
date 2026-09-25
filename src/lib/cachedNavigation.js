export const CACHED_NAVIGATION_MARKER = 'meta[name="ynx-cached-navigation"][content="true"]';

export function isCachedNavigation(documentRoot = document) {
  return documentRoot.querySelector(CACHED_NAVIGATION_MARKER) !== null;
}
