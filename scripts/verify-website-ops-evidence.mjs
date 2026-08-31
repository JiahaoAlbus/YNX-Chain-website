import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const baseline = "5de72fcc7f472c98733146d0bbfd47ce39cc4bf0";
const required = [
  "docs/SLO_CAPACITY_PLAN.md",
  "docs/UNIT_ECONOMICS.md",
  "docs/THREAT_MODEL.md",
  "docs/SBOM.spdx.json",
  "docs/THIRD_PARTY_NOTICES.md",
  "docs/MIGRATION_COMPATIBILITY.md",
  "docs/OBSERVABILITY.md",
  "docs/OPERATIONS.md",
  "docs/RELEASE_NOTES.md",
  "docs/FEATURE_COMPLETION_EVIDENCE.md",
  "docs/EVIDENCE_INDEX.md",
  "docs/UI_DESIGN_AUDIT.md",
  "docs/KPI_MEASUREMENT_PLAN.md",
  "release/operator-inputs.request.json",
  "release/website/operations-evidence.json"
];

for (const relative of required) {
  assert.equal(fs.existsSync(path.join(root, relative)), true, `missing ${relative}`);
}

const evidence = JSON.parse(fs.readFileSync(path.join(root, "release/website/operations-evidence.json"), "utf8"));
assert.equal(evidence.schemaVersion, "ynx-website-operations-evidence/v1");
assert.equal(evidence.sourceBaseline, baseline);
assert.deepEqual(evidence.network, { chainId: 6423, evmChainId: "0x1917", nativeAsset: "YNXT", mainnet: false });
assert.deepEqual(evidence.handoffIntegration, { expectedCount: 5, integratedCount: 0, allIntegrated: false, integrationReceipt: null });
for (const [key, value] of Object.entries(evidence.releaseTruth)) assert.equal(value, false, `releaseTruth.${key} must remain false`);
assert.equal(evidence.directEvidence.focusedVerifierPassed, true, "focused verifier is directly proved by this gate");
for (const [key, value] of Object.entries(evidence.directEvidence)) {
  if (key !== "focusedVerifierPassed") assert.equal(value, false, `directEvidence.${key} must remain false`);
}
assert.equal(evidence.sbom.generated, true);
assert.equal(evidence.sbom.independentDependencyReviewAccepted, false);

const request = JSON.parse(fs.readFileSync(path.join(root, "release/operator-inputs.request.json"), "utf8"));
assert.equal(request.sourceBaseline, baseline);
assert.equal(request.secretValuesRequested, false);
assert.equal(request.status, "pending");
assert.ok(request.requests.length > 0);
for (const item of request.requests) {
  assert.equal(item.satisfied, false, `${item.id} cannot be satisfied without a receipt`);
  assert.equal(item.receipt, null, `${item.id} receipt must remain null`);
  assert.equal(item.valueMustNotAppearInChat, true, `${item.id} must protect credential values`);
}

const lock = JSON.parse(fs.readFileSync(path.join(root, "package-lock.json"), "utf8"));
const expectedPackages = Object.entries(lock.packages || {}).filter(([location, metadata]) => location && metadata.version);
const sbom = JSON.parse(fs.readFileSync(path.join(root, "docs/SBOM.spdx.json"), "utf8"));
assert.equal(sbom.spdxVersion, "SPDX-2.3");
assert.equal(sbom.packages.length, expectedPackages.length, "SBOM must cover every resolved lockfile package");
const lockPairs = new Set(expectedPackages.map(([location, metadata]) => `${location.replace(/^node_modules\//, "")}@${metadata.version}`));
for (const pkg of sbom.packages) assert.equal(lockPairs.has(`${pkg.name}@${pkg.versionInfo}`), true, `unexpected SBOM package ${pkg.name}@${pkg.versionInfo}`);

const banned = [
  new RegExp(`\\b${[9, 1, 0, 2].join("")}\\b`, "i"),
  new RegExp(`0x${[2, 3, 8, "e"].join("")}`, "i"),
  new RegExp(`${["N", "Y", "X", "T"].join("")}`, "i")
];
const scanned = required.concat(["scripts/generate-website-sbom.mjs", "scripts/verify-website-ops-evidence.mjs"]);
for (const relative of scanned) {
  const contents = fs.readFileSync(path.join(root, relative), "utf8");
  for (const pattern of banned) assert.equal(pattern.test(contents), false, `${relative} contains retired network identity`);
}

console.log(`website operations evidence gate passed (${required.length} required files; ${sbom.packages.length} lockfile packages)`);
