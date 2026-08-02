# Website Acceptance and Release Boundaries

Last audited: 2026-08-01

## User acceptance routes

- `/dapp` lists all 25 ecosystem software products under one canonical DApp hierarchy.
- `/dapp/download` is the only installation and public-web release directory.
- `/dapp/square` is the canonical Square web application route.
- `/docs` is the in-site documentation center; it does not hard-redirect to GitHub.
- `/manual` provides the evidence-first user journey and explicit failure recovery.
- `/api` documents the bounded public REST, EVM JSON-RPC, Explorer, and Faucet surfaces.
- `/faq`, `/security`, and `/support` remain first-class public authority routes.
- `/status` explains the current network and release evidence boundaries.
- Each product has its own status route below `/dapp`, including `/dapp/wallet`, `/dapp/social`, `/dapp/pay`, `/dapp/merchant`, `/dapp/card`, `/dapp/exchange`, `/dapp/shop`, `/dapp/seller`, `/dapp/developer`, `/dapp/explorer`, `/dapp/monitor`, `/dapp/ai`, `/dapp/trust`, `/dapp/resource`, `/dapp/music`, `/dapp/video`, `/dapp/creator`, `/dapp/cloud`, `/dapp/docs-app`, `/dapp/browser`, `/dapp/search`, `/dapp/finance`, `/dapp/mail`, `/dapp/calendar`, and `/dapp/dex`.
- Legacy `/apps`, `/download`, `/square`, and root-level product routes permanently redirect to their `/dapp` equivalents so existing links remain usable without creating duplicate canonical software routes.

## Current release evidence

- Product records: 25.
- Public web product URLs: 1 (`YNX Explorer`).
- Publicly hosted installers: 0.
- Centrally accepted product candidates represented by the current registry: 1 (`YNX Exchange`).
- Local artifacts are recorded for engineering review but are not exposed as download links.

The authoritative machine-readable snapshot is `/releases/ecosystem-release-registry.json`.
Canonical product identity and evidence-bound release truth are generated at
`/public-product-metadata.json` and `/product-release.json`.

## Experience acceptance

- Global search and command navigation open with `Command-K` or `Control-K`.
- Command results support arrow-key navigation, Enter, Escape, and an explicit empty state.
- Light and dark modes persist as a device-local preference.
- LTR and RTL layout modes persist as a device-local preference.
- Keyboard focus is visible and a skip link reaches the primary content.
- The 390px layout keeps navigation, manual steps, API endpoints, and recovery actions usable.
- Reduced Motion disables non-essential animation.
- Live features expose loading, empty, unavailable, error, and retry states without fake data.

## Download admission rule

A package can become a public download only after its release record contains all of the following:

1. An immutable public URL.
2. SHA-256 digest.
3. File size in bytes.
4. Signing class, such as debug, ad hoc, Developer ID, TestFlight, or store-signed.
5. Installation or cold-start proof on the named platform.

A local APK, simulator build, unsigned zip, project directory, health endpoint, or successful source build does not satisfy this rule by itself.

## Honest external boundaries

The website must not claim mainnet launch, exchange listing, stablecoin issuer support, wallet default support, third-party partnerships, production signing, or app-store release without independent public evidence. Public service health proves endpoint reachability only; it does not prove the corresponding product UI is deployed or that validators are converged.

## Verification

Run from the website repository:

```bash
npm test
npm run build
npm run deploy:dry-run
```

After deployment, verify `/dapp`, `/dapp/download`, `/dapp/square`, `/manual`, `/docs`, `/api`, `/faq`,
`/security`, `/status`, `/support`, every `/dapp/<product>` route, legacy redirects, both public metadata JSON
files, and `/releases/ecosystem-release-registry.json` on the production domain.
Confirm that only entries with `downloadHosted: true` expose installer links.
