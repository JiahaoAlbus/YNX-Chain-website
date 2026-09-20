# Wallet 1.0.16 Testnet Preview download entry

Baseline: website main `b9fe58c873a96a329d5178eed183aa9d52560344`.
Owner: NETWORK integration task; previous owner worktree is untouched.

This source selects the published versionCode 22 APK, not a new Wallet build.
GitHub release target: `15d968bd5e29479c2b78c5c23887e96a535e29ca`;
build source: `e9816a8277b3ddd6c5f379f90aadda969c0a069b`.
The public APK was downloaded completely on 2026-09-20 and independently
matched 116631255 bytes and SHA-256
`89a842dc8641206a9154a6e41fd1c9e3cbb4b6cca2cea455ed5b7fc674b558c0`.
GitHub asset metadata also matches that digest and size.

GitHub API observation at 2026-09-20T10:30:53Z reports `immutable=false`
for release ID 392389176: `releaseImmutable=false`. The publisher can replace
assets. URL/size/SHA checks are point-in-time evidence, not immutability.
The website does not recompute SHA-256 while downloading; users should verify
the displayed expected digest independently. No repository-wide release
immutability setting or CDN was enabled.

The exact GitHub URL is the primary entry. No new downloads-origin mirror
has been asserted or invented. Desktop and Web artifact selections are
unchanged. The prior Android21 manifest remains at its historical URL.
AAB is a release asset, not a directly installable APK selection.

The new UI discloses local-test signing and no store release. VersionCode 22
owner evidence covers emulator installation/cold launch only. Older package
upgrade, account migration and transfer acceptance is not inherited.
Real WalletConnect Relay and installed Finance E2E remain NOT_VERIFIED.

Validation: `npm test` (216 tests, docs authority and website verification).
The production build requires a clean committed checkpoint; run `npm run build`
after commit. Publishing this source is not production deployment.

Rollback: before deployment, revert only this scoped change in a fresh branch.
After a separately authorized deployment, retain the preceding immutable
deployment and restore its alias if necessary; do not delete either release
or reset an owner checkout. Do not overwrite a newer concurrent owner change.

Status: implemented=true; contractTested=true; officialSandboxVerified=false;
publicDeployed=false for this website change; publicVerified=false for its
current website rendering; productionApproved=false. Public APK byte
verification is independent of those website and financial acceptance gates.
