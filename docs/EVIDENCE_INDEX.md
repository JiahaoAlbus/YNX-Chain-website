# Website Evidence Index

Evidence baseline: `5de72fcc7f472c98733146d0bbfd47ce39cc4bf0`

| Evidence area | File | Authority level |
| --- | --- | --- |
| Machine release truth | `release/website/operations-evidence.json` | local handoff only |
| External input request | `release/operator-inputs.request.json` | pending operator response |
| SLO/capacity | `docs/SLO_CAPACITY_PLAN.md` | plan; measurements pending |
| Unit economics | `docs/UNIT_ECONOMICS.md` | formulas; financial inputs pending |
| Threat model | `docs/THREAT_MODEL.md` | source review; independent acceptance pending |
| SBOM | `docs/SBOM.spdx.json` | exact lockfile-derived package inventory |
| Notices | `docs/THIRD_PARTY_NOTICES.md` | declared license inventory; legal review pending |
| Migration | `docs/MIGRATION_COMPATIBILITY.md` | plan; drills pending |
| Observability | `docs/OBSERVABILITY.md` | contract; production telemetry pending |
| Operations | `docs/OPERATIONS.md` | runbook; execution pending |
| Release notes | `docs/RELEASE_NOTES.md` | this documentation handoff |
| Feature truth | `docs/FEATURE_COMPLETION_EVIDENCE.md` | fail-closed status table |
| UI design | `docs/UI_DESIGN_AUDIT.md` | source audit; integrated runtime audit pending |
| KPI | `docs/KPI_MEASUREMENT_PLAN.md` | definitions; live measurements pending |

The focused verifier is `scripts/verify-website-ops-evidence.mjs`. Its success proves only schema/file consistency, lockfile-to-SBOM coverage, banned-network scanning, and fail-closed machine booleans. It does not prove deployment, security scanning, performance, restore, accessibility, indexing, or public runtime.
