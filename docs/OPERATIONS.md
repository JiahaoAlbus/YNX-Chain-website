# Website Operations Runbook

Evidence baseline: `5de72fcc7f472c98733146d0bbfd47ce39cc4bf0`
Status: safe runbook only; no production action or restore drill was performed for this documentation slice.

## Release preflight

1. Confirm a single active Website owner and path lock.
2. Record exact source commit/tree, clean checkout, lockfile hash, build command, and build identity.
3. Verify no retired network identifier, placeholder, secret, local path, internal host, or unsupported release `true` is present.
4. Run tests, clean build, prerender/SEO verifier, dependency/license checks, secret scan, SAST, and focused operations-evidence verifier.
5. Freeze candidate deployment, current official deployment, and one exact rollback target before any mutation.
6. Require an unexpired single-use release authority. Never infer deploy authority from a successful login.

## Preview verification

Verify exact-source identity; 6423 / `0x1917` / `YNXT`; core pages with first-response body; canonical, title, description, H1, hreflang and JSON-LD; robots/sitemaps; security and cache headers; 404/redirects; desktop, 390px, keyboard, reduced motion, dark mode and true Arabic RTL; service-worker cold/upgrade/recovery; product state and download admission. Store raw headers, bodies, screenshots, console/network logs, request IDs, bytes and SHA-256.

## Promotion and rollback

Promotion and rollback commands must be frozen in a lease-specific execution record and are intentionally not embedded here. Execute at most the authorized count. After promotion, read back official-domain source identity and critical routes from an independent network. On any failure, run the exact rollback once, verify the previous source and service state, release the lock, and open an incident. Never retry a consumed one-shot authority.

## Incident classes

- Wrong source or network identity: remove promotion immediately; do not serve another network as fallback.
- Blank/error page or service-worker integrity failure: roll back and preserve browser profile evidence.
- Product/release-state inflation: disable the affected CTA/download and correct the accepted owner record.
- Upstream outage: degrade that capability only; show source/as-of/failure truth.
- Artifact mismatch: stop download admission and preserve both expected and observed hashes.
- Security issue: freeze promotion, rotate through protected operator channels, and publish a bounded advisory when approved.

## Backup and restore checklist

Back up source/ref, lockfile, deployment metadata, alias/DNS readback, environment variable names, accepted product/release registry, search configuration, and immutable evidence. A restore passes only when a clean environment reproduces the exact build, routes, headers, source identity, registry, and rollback behavior. No restore drill is bound to this baseline.

## Support and shutdown

Support responses must provide a public error/request ID rather than internal stack data. A shutdown requires advance notice, read-only archive, download/asset exit paths, data export/delete instructions where applicable, canonical redirects, and preserved security/status information. Exact support SLA, escalation roster, refund/dispute procedure, and shutdown rehearsal remain pending.
