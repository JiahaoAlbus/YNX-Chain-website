# Website Observability

Evidence baseline: `5de72fcc7f472c98733146d0bbfd47ce39cc4bf0`
Status: observability contract and gap inventory; no production monitoring acceptance is claimed.

## Required telemetry contract

| Signal | Minimum fields | Sensitive-data rule | Current direct evidence |
| --- | --- | --- | --- |
| Structured request log | timestamp, route template, method, status, duration, region, request ID, source identity | no query secrets, wallet payloads, tokens or stack paths | pending |
| Metric | name, unit, source identity, environment, route/service | no account labels or unbounded cardinality | pending |
| Trace | trace/span ID, operation, duration, status, bounded upstream name | no request bodies or credentials | pending |
| Audit event | audit ID, action class, actor class, approval reference, outcome | no private key/seed/signature material | pending |
| Client error | error ID, release identity, route, browser family, sanitized class | no DOM text, address, provider payload or internal stack | pending |

## Public and operator surfaces

- `/api/network/status` is a bounded public observation of canonical official services.
- `/api/services/health` reports services independently and must not turn one failure into fabricated global health.
- `/status` is a public explanation surface, not a replacement for private operations telemetry.
- Every mutable health/status response must be `no-store`, carry an observation time, and expose safe errors only.
- Private dashboards, alerts, traces, and incident channels must require operator authorization and are not exposed in the public UI.

## Alert plan

| Alert | Proposed trigger | Runbook action | Verified production alert |
| --- | --- | --- | --- |
| Wrong build/network identity | any occurrence | halt promotion or roll back | false |
| Public route unavailable | two regions, three consecutive probes | inspect hosting/DNS, roll back if release-related | false |
| API elevated errors | error budget burn threshold | isolate upstream and degrade honestly | false |
| Stale chain observation | observation exceeds approved freshness | hide live claim, inspect upstream | false |
| Download mismatch | bytes or SHA differs | remove admission and investigate provenance | false |
| Security header regression | required header missing | block promotion or roll back | false |
| Search indexing regression | sustained coverage drop | inspect canonical/sitemap/robots; do not promise rank | false |

## Retention and support linkage

Retention durations, data residency, access roles, deletion procedure, on-call rotation, incident severity, support handoff, refund/dispute routing, and Monitor integration require Security/SRE and support-owner acceptance. They remain pending.
