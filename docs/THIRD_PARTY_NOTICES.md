# Third-party notices

This inventory is generated from the exact `package-lock.json` resolved dependency graph at source baseline `5de72fcc7f472c98733146d0bbfd47ce39cc4bf0`.

The concise list below names direct application dependencies. The complete machine-readable package list, versions, declared license identifiers, optional-platform packages, and integrity strings is in [`SBOM.spdx.json`](./SBOM.spdx.json). Declared identifiers are copied from lockfile metadata; this is not a legal opinion and does not prove that license texts or attribution obligations have been independently reviewed.

| Package | Requested version | Resolved version | Declared license |
| --- | --- | --- | --- |
| `@noble/curves` | `2.2.0` | `2.2.0` | MIT |
| `@noble/hashes` | `2.2.0` | `2.2.0` | MIT |
| `@vitejs/plugin-react` | `^5.0.0` | `5.2.0` | MIT |
| `lucide-react` | `^0.468.0` | `0.468.0` | ISC |
| `react` | `^19.0.0` | `19.2.7` | MIT |
| `react-dom` | `^19.0.0` | `19.2.7` | MIT |
| `three` | `0.180.0` | `0.180.0` | MIT |
| `typescript` | `^5.8.0` | `5.9.3` | Apache-2.0 |
| `vite` | `^7.0.0` | `7.3.6` | MIT |

The website redesign adds pinned `three@0.180.0` after the historical baseline above. It renders the homepage's source-derived YNX logo as a dynamically loaded WebGL scene. Its npm integrity is recorded in the lockfile and SBOM. The unchanged upstream copyright and MIT permission text ships at [`/third-party/three/LICENSE.txt`](../public/third-party/three/LICENSE.txt); the source also retains this text because bundlers may remove source comments from individual chunks.

Before public release, the release owner must independently review license texts, notices, source-offer or attribution duties, dependency provenance, and the final production bundle. That broader review is pending.
