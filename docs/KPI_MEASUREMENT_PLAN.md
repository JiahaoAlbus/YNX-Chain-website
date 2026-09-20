# Website KPI Measurement Plan

Evidence baseline: `5de72fcc7f472c98733146d0bbfd47ce39cc4bf0`
Status: definitions only; all live KPI values are pending.

| KPI | Definition | Required exclusions | Decision use |
| --- | --- | --- | --- |
| Activation | first successful evidence-backed task in a consented session | bots, internal tests, failed/abandoned actions | onboarding quality |
| 7/30-day retention | activated users returning for a successful task in the window | internal QA and automated probes | repeat value |
| Task completion | successful task / eligible started task by route | page views without intent | usability |
| Crash-free session | sessions without unhandled client failure | synthetic probes reported separately | reliability |
| Support load | valid cases per 1,000 activated users and median resolution time | spam/duplicates separated | operational cost |
| Abuse rate | confirmed abuse events / eligible actions | unconfirmed reports | safety gate |
| Provider cost | attributable provider cost / successful task | centrally owned product costs unless allocated | cost control |
| Gross margin candidate | accepted attributable revenue minus variable cost | test assets, internal transfers, unrealized value | sustainability |
| Public Testnet usage | successful externally initiated 6423 tasks | team tests and scripted health probes | adoption |
| Conversion | users reaching an explicitly defined next-value event / eligible users | dark patterns or auto-triggered events | funnel quality |
| Kill/scale decision | approved decision from KPI, SLO, safety and cost evidence | vanity traffic | resource allocation |

## Collection rules

Use pseudonymous, consented, minimal events with schema version, source identity, event time, route, task class, outcome, and bounded error class. Never collect private keys, seed phrases, signatures, wallet payloads, full account addresses, provider tokens, free-form DOM text, or sensitive query strings. Publish retention, deletion, opt-out, bot filtering, internal-traffic exclusion, sampling, and data-quality rules before enabling measurement.

## Evidence and governance

Every report must include the query/version, numerator, denominator, exclusions, coverage, source, as-of time, confidence or data-quality caveat, and raw aggregate export hash. There is no current accepted analytics schema, consent receipt, production event stream, 7/30-day cohort, conversion baseline, cost allocation, or kill/scale decision for this source.
