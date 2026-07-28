# Website Acceptance and Release Boundaries

Last audited: 2026-07-18

## User acceptance routes

- `/apps` lists all 25 ecosystem products as independent products.
- `/download` is the only installation and public-web release directory.
- `/docs` is the in-site documentation center; it does not hard-redirect to GitHub.
- `/manual` provides the evidence-first user journey and explicit failure recovery.
- `/api` documents the bounded public REST, EVM JSON-RPC, Explorer, and Faucet surfaces.
- `/faq`, `/security`, and `/support` remain first-class public authority routes.
- `/status` explains the current network and release evidence boundaries.
- Each product has its own status route, including `/wallet`, `/social`, `/pay`, `/merchant`, `/card`, `/exchange`, `/shop`, `/seller`, `/developer`, `/explorer`, `/monitor`, `/ai`, `/trust`, `/resource`, `/music`, `/video`, `/creator`, `/cloud`, `/docs-app`, `/browser`, `/search`, `/finance`, `/mail`, `/calendar`, and `/dex`.

## Current release evidence

- Product records: 25.
- Public web product URLs: 1 (`YNX Explorer`).
- Publicly hosted installers: 0.
- Centrally accepted product candidates: 0.
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

After deployment, verify `/apps`, `/download`, `/manual`, `/docs`, `/api`, `/faq`,
`/security`, `/status`, `/support`, every product route, both public metadata JSON
files, and `/releases/ecosystem-release-registry.json` on the production domain.
Confirm that only entries with `downloadHosted: true` expose installer links.
