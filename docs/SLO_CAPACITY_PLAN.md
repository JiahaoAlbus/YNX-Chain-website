# Website SLO and Capacity Plan

Evidence baseline: `5de72fcc7f472c98733146d0bbfd47ce39cc4bf0`
Status: planning baseline only; no production SLO or capacity result is claimed.

## Scope and evidence rule

This plan covers the YNX public website, prerendered pages, same-origin API functions, static release files, and the website's calls to official YNX 6423 services. A successful build, a single HTTP 200, or a small local sample is not capacity evidence. Measurements become accepted only when a durable run record binds the source commit, target, tool version, start/end time, request count, concurrency, raw percentile output, errors, and operator-approved traffic budget.

## Proposed service objectives

These are targets, not achieved results.

| Indicator | Proposed target | Measurement window | Current measured result |
| --- | --- | --- | --- |
| Public page availability | 99.9% | rolling 30 days | pending |
| Static page TTFB p95 | <= 500 ms | rolling 24 hours, three regions | pending |
| Same-origin API latency p95 / p99 | <= 2 s / <= 5 s | rolling 24 hours | pending |
| Core page LCP p75 | <= 2.5 s | rolling 28 days, field data | pending |
| Core page INP p75 | <= 200 ms | rolling 28 days, field data | pending |
| Core page CLS p75 | <= 0.1 | rolling 28 days, field data | pending |
| API error rate | < 1% excluding explicit upstream degradation | rolling 1 hour | pending |
| Recovery time objective | <= 60 minutes | controlled restore drill | pending |
| Recovery point objective | <= 24 hours for content/release metadata | controlled restore drill | pending |

## Capacity dimensions to measure

| Dimension | Required evidence | Current state |
| --- | --- | --- |
| p50/p95/p99 | raw latency distribution by route and region | pending |
| Throughput | requests/second at each stable concurrency level | pending |
| Concurrent users | scenario, think time, session duration, failure threshold | pending |
| Function queue/concurrency | platform limit, observed saturation and throttling | pending |
| Static storage growth | bytes per release, retention window, monthly projection | pending |
| Provider latency | per official upstream, timeout and failure class | pending |
| Rate limits | documented platform/provider ceilings and 429 behavior | pending |
| Cold start | function and browser cold/warm distributions | pending |
| Error rate | transport, application, upstream and user-input classes | pending |

## Test method

1. Freeze an immutable candidate and exact build identity.
2. Obtain a safe staging target and explicit load-test traffic budget.
3. Run low-rate smoke first; stop on wrong source, wrong network identity, unexpected writes, or elevated errors.
4. Increase concurrency in bounded stages. Never load-test production without explicit authority.
5. Store raw tool output, request IDs, region, headers, configuration, and SHA-256 of every evidence file.
6. Compare results to proposed targets; do not rewrite failed observations into success.

## Capacity and degradation design

- Static and prerendered content remains readable when JavaScript or upstream services fail.
- Live network values are fetched with `no-store`; stale values must not be represented as current.
- Each upstream is degraded independently. One failed product service must not imply chain failure.
- Same-origin API functions use bounded timeouts and redact internal errors.
- Download admission requires immutable URL, bytes, SHA-256, signing class, platform, and direct install evidence.

## Missing direct evidence

Production percentile measurements, field Core Web Vitals, throughput, concurrency, queue behavior, storage-growth samples, provider ceilings, cold-start distributions, error budget, availability history, and RTO/RPO drills are all unverified.
