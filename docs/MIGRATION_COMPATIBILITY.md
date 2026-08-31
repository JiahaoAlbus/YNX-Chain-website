# Website Migration and Compatibility

Evidence baseline: `5de72fcc7f472c98733146d0bbfd47ce39cc4bf0`
Status: source-level compatibility plan; deployment rollback and restore drill are pending.

## Versioned surfaces

| Surface | Version source | Compatibility rule |
| --- | --- | --- |
| Website source | exact 40-character commit | public build identity must match |
| Product release | `ynx-product-release/v1` | reject unknown or incomplete release truth |
| Public metadata | `ynx-public-product-metadata/v1` | additive fields only within v1 |
| Website contract | `schemaVersion` | incompatible changes require a new version |
| Release registry | registry schema in file | accepted owner record required |
| Wallet session records | owner release schema | Website reads; it does not migrate Wallet state |
| Service worker cache | cache version in worker source | upgrade removes obsolete caches; recovery remains available |

## Canonical network compatibility

Public configuration is limited to YNX Testnet chain ID `6423`, EVM chain ID `0x1917`, Cosmos identity `ynx_6423-1`, and native asset `YNXT`. Retired network identifiers must fail the release verifier and must never be used as a runtime fallback.

## Route migration

Legacy entry routes use permanent redirects to canonical `/dapp` routes. Redirects must preserve path intent without creating loops, hash-only navigation, blank tabs, or automatic custom-scheme launches. Each redirect requires production HTTP evidence before acceptance.

## Rollout sequence

1. Freeze candidate source, build identity, release record, sitemap, and rendered-route manifest.
2. Build and test in an isolated clean checkout.
3. Deploy to a non-indexed preview and verify source identity, network identity, headers, redirects, mobile/desktop/RTL, service-worker recovery, and product-state truth.
4. Record the current production deployment as rollback target before promotion.
5. Promote once under a bounded release authority.
6. Read back all critical routes and machine files from the official domain.
7. Roll back immediately on identity, route, content, security-header, browser, or availability failure.

## Data, backup and exit

The website should be reproducible from source plus accepted release records. User wallet/account state belongs to the wallet/provider and must not be treated as Website backup data. Operator exports must cover DNS/aliases, environment variable names (not values), deployment metadata, accepted release records, search configuration, and immutable evidence. Retention, export/delete behavior, deprecation notices, service shutdown notice, and final static archive must be documented before retirement.

## Evidence gaps

Old-client/browser matrix, real redirect receipts, service-worker upgrade/recovery, preview-to-production promotion, rollback migration, backup restoration, data export/delete, retention enforcement, and shutdown drill are unverified. The five parallel Website handoff slices are not integrated into this baseline.
