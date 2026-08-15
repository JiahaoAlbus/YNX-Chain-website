# Explorer + Monitor website integration evidence — 2026-08-14

Scope: the official website entries for YNX Explorer and YNX Monitor only. This record does not promote or modify another product's implementation or release truth.

## Requirement evidence

| Requirement | Evidence | implementedLocal | testedLocal | integratedCentral | deployedStaging | deployedPublic | downloadHosted | productionSigned | publicVerified |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Homepage has direct Explorer and Network Status entries | `src/sections/Hero.jsx`, `src/components/LinkGrid.jsx` | true | true | false | false | false | false | false | false |
| `/dapp` includes searchable, categorized Explorer and Monitor cards | existing `src/pages/AppsPage.jsx` plus `src/lib/ecosystemCatalog.js` | true | true | false | false | false | false | false | false |
| Product pages explain sources, search/use, recovery, risks and historical read-only behavior | `src/content/ecosystemGuides.js`, rendered by `src/pages/ProductStatusPage.jsx` and `src/pages/DocsPage.jsx` | true | true | false | false | false | false | false | false |
| Manual covers full Explorer lookup/detail/account/coverage/reconnect flow and Monitor status interpretation | `src/pages/ManualPage.jsx` | true | true | false | false | false | false | false | false |
| Status, API and support routes link real Explorer/Monitor destinations | `src/components/RoutePage.jsx`, `src/pages/ApiPage.jsx` | true | true | false | false | false | false | false | false |
| SEO sitemap contains `/dapp/explorer`, `/dapp/monitor`, `/status`, `/manual`, `/api` and `/support` | generated `dist/sitemap.xml`; production build passed | true | true | false | false | false | false | false | false |
| Website release truth distinguishes observed public releases from newer candidate code | `src/lib/ecosystemCatalog.js`, `public/releases/ecosystem-release-registry.json` | true | true | false | false | false | false | false | false |

## Commands and results

- `npm test`: passed; docs authority artifact verified and website verification passed.
- `npm run build`: passed; 1,624 modules transformed, 15 authority routes prerendered, and a 48-URL IndexNow payload verified in dry-run mode.
- `git diff --check`: passed.
- Generated sitemap contains the Explorer, Monitor, status, manual, API and support routes.

The bundled FAQ and public product metadata remain source-bound to the separately accepted documentation authority artifact. This integration does not rewrite that artifact or claim that candidate Explorer/Monitor commits are public. Product-specific FAQ-equivalent answers are rendered from the Explorer/Monitor purpose, workflow and hard-rule guides on both product and documentation pages.

## Current release boundary

- Observed public Explorer and Indexer identity: central commit `8bf7716ee671a5a9b64517280743c5a281899712`, release `ynx-explorer-monitor-8bf7716ee671`; `/health` reported real Testnet height, four validators and explicit index lag on 2026-08-15.
- Observed public Monitor identity: central commit `8bf7716ee671a5a9b64517280743c5a281899712`, release `ynx-explorer-monitor-8bf7716ee671`; signed `/status` v2 returned an available operational projection on 2026-08-15.
- Central integration and public deployment are evidenced independently from final Computer Control acceptance. `publicVerified` remains false until the required desktop, narrow-screen, RTL and interaction pass is complete.
- Explorer and Monitor are hosted web services. No downloadable package or production signature is claimed.

Post-local columns must remain false until branch acceptance, deployment evidence and independent browser verification exist.
