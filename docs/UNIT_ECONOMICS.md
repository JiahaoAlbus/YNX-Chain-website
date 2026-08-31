# Website Unit Economics

Evidence baseline: `5de72fcc7f472c98733146d0bbfd47ce39cc4bf0`
Status: formula and collection plan only; no revenue, margin, or sustainability claim is made.

## Cost boundary

The website may incur hosting, function execution, bandwidth, storage, monitoring, search submission, support, and third-party provider costs. Costs belonging to Chain Core, Explorer, Wallet, or another product remain with that owner unless an accepted central allocation explicitly assigns them to Website.

## Required monthly inputs

| Input | Unit | Source required | Current value |
| --- | --- | --- | --- |
| Static delivery | GB and requests | hosting invoice/export | unknown |
| Function execution | invocations, GB-seconds, duration | hosting usage export | unknown |
| Artifact storage | GB-month | artifact registry invoice/export | unknown |
| Artifact egress | GB | artifact registry invoice/export | unknown |
| Monitoring/logs/traces | events and retained GB | monitoring invoice/export | unknown |
| Search tooling | subscription or usage | provider invoice/export | unknown |
| Support operations | staff hours | approved operations record | unknown |
| Abuse response | staff hours and provider charges | incident ledger | unknown |
| Free tier/credits | currency and expiry | provider billing record | unknown |
| Subsidy budget | currency and approval period | governance/treasury record | unknown |
| Website-attributable revenue | currency and receipt class | accepted billing ledger | unknown |

## Formulas

- `monthly_operating_cost = hosting + functions + storage + egress + monitoring + search + support + abuse_response`
- `cost_per_monthly_active_user = monthly_operating_cost / distinct_monthly_active_users`
- `cost_per_successful_task = monthly_operating_cost / successful_public_tasks`
- `gross_margin_candidate = (accepted_website_revenue - attributable_variable_cost) / accepted_website_revenue`
- `runway_months = approved_subsidy_balance / trailing_three_month_average_cost`

Division by zero produces `not measurable`, never zero cost or infinite margin. Revenue may be counted only from an accepted billing ledger; token price, internal transfers, test assets, and unrealized value are not revenue.

## Decision gates

| Decision | Evidence required | Current state |
| --- | --- | --- |
| Keep free public access | monthly cost, usage and abuse trend | pending |
| Add paid capability | explicit user value, consent, price, refund and billing evidence | pending |
| Scale | stable SLO plus sustainable unit cost | pending |
| Optimize | identified cost driver with before/after measurement | pending |
| Kill or retire | low verified usage, exit plan and preserved public records | pending |

No provider invoice, usage export, accepted Website revenue receipt, free-tier balance, subsidy approval, or support-cost ledger is bound to this source baseline.
