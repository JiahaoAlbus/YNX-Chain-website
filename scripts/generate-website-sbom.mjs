import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const lock = JSON.parse(fs.readFileSync(path.join(root, "package-lock.json"), "utf8"));
const baseline = "5de72fcc7f472c98733146d0bbfd47ce39cc4bf0";

const packages = Object.entries(lock.packages || {})
  .filter(([location, metadata]) => location && metadata.version)
  .map(([location, metadata], index) => ({
    SPDXID: `SPDXRef-Package-${index + 1}`,
    name: location.replace(/^node_modules\//, ""),
    versionInfo: metadata.version,
    downloadLocation: "NOASSERTION",
    filesAnalyzed: false,
    licenseConcluded: "NOASSERTION",
    licenseDeclared: metadata.license || "NOASSERTION",
    copyrightText: "NOASSERTION",
    externalRefs: metadata.integrity
      ? [{ referenceCategory: "PACKAGE-MANAGER", referenceType: "purl", referenceLocator: `pkg:npm/${encodeURIComponent(location.replace(/^node_modules\//, ""))}@${metadata.version}` }]
      : [],
    annotations: [{ annotationType: "OTHER", annotator: "Tool: package-lock-to-spdx", annotationDate: "2026-09-01T00:00:00Z", comment: JSON.stringify({ location, integrity: metadata.integrity || null, optional: metadata.optional === true }) }]
  }));

const sbom = {
  spdxVersion: "SPDX-2.3",
  dataLicense: "CC0-1.0",
  SPDXID: "SPDXRef-DOCUMENT",
  name: "ynx-chain-website-lockfile-sbom",
  documentNamespace: `https://ynxweb4.com/sbom/website/${baseline}`,
  creationInfo: {
    created: "2026-09-01T00:00:00Z",
    creators: ["Tool: package-lock-to-spdx"],
    comment: "Generated only from package-lock.json. This is not a vulnerability scan, legal review, provenance attestation, or production-bundle inventory."
  },
  documentDescribes: packages.map((item) => item.SPDXID),
  packages,
  annotations: [{ annotationType: "OTHER", annotator: "Organization: YNX Website", annotationDate: "2026-09-01T00:00:00Z", comment: JSON.stringify({ sourceBaseline: baseline, lockfileVersion: lock.lockfileVersion, packageCount: packages.length, dependencyReviewAccepted: false, vulnerabilityScanPassed: false }) }]
};

fs.writeFileSync(path.join(root, "docs", "SBOM.spdx.json"), `${JSON.stringify(sbom, null, 2)}\n`);
console.log(`generated docs/SBOM.spdx.json with ${packages.length} packages`);
