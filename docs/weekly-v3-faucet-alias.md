# Weekly v3 Faucet alias compatibility

Scope: the existing website only; no redesign, wallet release change, new chain,
claim, signature, securities trade or IndexNow publication.

## Preserved baseline

The named original checkout is clean at `89db27bb82bcb0d740d3ffb42b427704aaff247e`
but is older than production. This isolated branch starts from the exact public
identity `275df1e8d637e001cb0f29076d284134d370675a`, tree
`bd312a985fe5fd88f1786641f371c18797142edc`.
Existing download contracts and historical Faucet release receipts are unchanged.

## Change and local acceptance

- Canonical Faucet UI/API/status/env links use `https://faucet-testnet.ynxweb4.com`.
  CSP permits this and the old exact `https://faucet.ynxweb4.com` origin.
- Existing form reuses byte-identical durable Faucet client from source
  `37adf89a2a2c5227335f77690d859a6d4dcb7459`. Client SHA-256:
  `be26e0bc3a91732b72fc49bd6500dba406dff08a3b19478774dbdb4abcf01627`.
- The website adapter checks exact current runtime identity, chain 6423/YNXT,
  readiness and durable status capability. It projects out private topology
  diagnostics. It binds both receipt hash fields, ID, recipient, amount and status.
- Browser storage saves intent before POST. Reload performs only status GET;
  retry keeps the same ID/body, including across the legacy alias. Unresolved
  requests cannot change recipient/reset. Storage failure, identity drift,
  contradictory receipt, 409/429 and unknown outcomes do not become success.
- Twelve locales explain uncertainty; the page no longer labels lost ACK as
  "nothing sent". Actual health rate limits replace the obsolete IP/hour label.
- Focused tests: 18/18 (runtime 3, session 11, quickstart 4). Production build,
  chunk split, retired-signer boundary, 289 prerender definitions, 547 route hints
  and docs hosting verification pass. IndexNow is dry-run only.
- Full Node suite: **199/206 pass, 7 fail**. Exact unmodified production base
  independently reproduces **188/195 pass, the same 7 fail**. Failures are the
  existing DownloadPage binary-language check, two download-artifact tests, two
  stale current-download-metadata tests, and two old Windows download-control
  expectations. `scripts/verify.mjs` also stops at the existing Android metadata
  mismatch (`android-114-0fabe5b2` versus old `android-107-08d8f67d`). Neither
  tests nor download safety rules were relaxed. This is not a full-suite PASS.

## Deployment gate and rollback

Use the existing Vercel project `prj_tPB0KDTFohQ9FXZAzq25mYFWkbNa`, scope
`jiahaoalbus-projects`, not another project. Inject exact committed source/tree
and `YNX_WEBSITE_RELEASE=website-weekly-v3-faucet-alias-20260919`; build with the
canonical `VITE_YNX_FAUCET_URL`. First create a production deployment with
`--skip-domain`. Check immutable deployment identity and output before promotion.

Preserved production rollback deployment:
`dpl_GNjA5SY2KDHMiDU7jwX1Km4cnjn5`, URL
`https://ynx-web4-website-76h5jtco2-jiahaoalbus-projects.vercel.app`.
An authorized rollback must move the existing project domains back to this
deployment and reread `/api/build-identity` for the preserved source/tree above.
Do not rebuild an older checkout or restore/delete browser intents or chain DBs.

Source acceptance alone claims no new public deployment. A later immutable
deployment receipt must record promotion, exact source/tree, canonical link/CSP
readback, form readonly health/version and old/new CORS. Do not POST a public
claim during this deployment verification. Current accepted Faucet source is
37adf89a2; publishing a future backend build requires explicit identity review.
