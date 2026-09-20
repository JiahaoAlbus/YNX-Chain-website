# Website Threat Model

Evidence baseline: `5de72fcc7f472c98733146d0bbfd47ce39cc4bf0`
Review status: source review only; penetration testing, DAST, production secret scan, and independent security acceptance are pending.

## Assets and trust boundaries

- **Public content:** HTML, CSS, JavaScript, images, documentation, metadata, sitemap, and release records.
- **Release truth:** source identity, product state, artifact URL, SHA-256, bytes, signing class, and install evidence.
- **Network truth:** YNX 6423 identity and bounded observations from official RPC, EVM, Explorer, Faucet, Monitor, and Gateway services.
- **User boundary:** wallet discovery and explicit user-approved provider requests. The website must never receive a seed phrase or private key.
- **Deployment boundary:** source repository, build runner, hosting control plane, artifact storage, DNS, and rollback target.
- **Third-party boundary:** hosting, search providers, monitoring, community links, and independently owned product services.

## Threats and required controls

| Threat | Impact | Required control | Direct acceptance evidence |
| --- | --- | --- | --- |
| Stale or wrong-chain deployment | users act on false network data | source-bound build identity, 6423 assertions, fail-closed live status | pending for final integrated source |
| Release-state inflation | unsafe download or false product claim | accepted owner records; all release booleans evidence gated | pending central acceptance |
| Artifact substitution | malicious installer delivery | immutable URL, bytes, SHA-256, provenance, signing and install receipts | pending per artifact |
| XSS/content injection | account phishing or data theft | React escaping, restrictive CSP, no unsafe inline script, dependency review | source controls present; runtime DAST pending |
| Clickjacking | deceptive wallet actions | `frame-ancestors 'none'` and `X-Frame-Options: DENY` | config present; public header receipt pending |
| Open redirect/deep-link abuse | phishing or blank-tab launch | allowlisted routes, same-origin navigation, no automatic custom schemes | focused source tests only |
| SSRF through health adapters | access to internal services | fixed service directory, no user-supplied target, timeouts | source review only |
| Cache poisoning/stale service worker | old UI or network facts | no-store for mutable identity/status; versioned cache; recovery path | integrated browser evidence pending |
| Wallet identity collision | wrong provider selected | EIP-6963 identity separation; explicit chooser and confirmation | real installed-provider evidence pending |
| Secret exposure | control-plane compromise | no browser secrets, redacted errors, protected runtime secret paths | production scan pending |
| Dependency compromise | build/runtime compromise | lockfile, SBOM, license review, dependency review, SAST and provenance | SBOM generated; scans pending |
| Denial of service | public outage/cost spike | rate limits, caching of immutable assets, bounded timeouts, alerts | capacity evidence pending |
| Privacy leakage | user tracking or sensitive logs | minimal telemetry, consent, retention, field allowlist | production telemetry audit pending |

## Security invariants

1. No private key, seed phrase, validator key, signing secret, or provider secret may enter browser storage, logs, source, evidence, or support tickets.
2. Wallet requests require direct user action; signing and transaction sending require immediate confirmation.
3. Live chain/product data identifies its source and observation time or displays an unavailable state.
4. Failed upstreams do not fall back to fabricated values or another network.
5. Preview deployments are not public releases; public state requires exact-source readback.
6. A local build or hosted file does not prove signed, installed, or store-released status.

## Outstanding security evidence

Dependency review, lockfile review receipt, secret scan, SAST, DAST, CSP/header public readback, artifact/container scan, reproducible-build comparison, provenance attestation, penetration test, incident exercise, and independent Security/SRE acceptance remain false or pending.
