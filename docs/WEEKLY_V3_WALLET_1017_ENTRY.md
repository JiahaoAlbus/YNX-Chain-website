# Wallet 1.0.17 Testnet Preview download entry

Website baseline: `882dbccf91d3cefb1db04627b001a2115368e941`.
Worktree: `/Users/huangjiahao/Desktop/YNX Audit Worktrees/20260920-wallet-1017-site`.
Branch: `codex/wallet-android-1017-site-20260920`.

The current Android and Android Universal entries select versionCode 23 from
Wallet source `875f6c5b744b4b641eb5c2c9b2cb41e928676c90` (source PR #162).
Release: `wallet-android-testnet-preview-1.0.17-875f6c5b7`.
The machine-readable website manifest is
`/releases/wallet-downloads/20260920-android23.json`; it records the APK and AAB
URLs, sizes, SHA-256 digests and GitHub asset identities. It binds
`publicationMergeCommit=c75cd8690b0bc43941db522ac502aa989addd713`. The verifier
compares the complete public manifest with independently pinned owner, AAB and
limited-installation facts, rejecting changed, missing or added fields. Negative
tests cover every nested fact and coordinated false acceptance claims. Only the universal APK
is an install action. The AAB is retained as publication metadata.
The prior 1.0.16 manifest and source record remain unchanged, and the new
manifest's `previousRelease` links `/releases/wallet-downloads/20260920-android22.json`.

Publication evidence source: Wallet PR
[YNX-Chain#164](https://github.com/JiahaoAlbus/YNX-Chain/pull/164), exact evidence
commit `6e8e25015ad702728045e409153748d5b9fcdfcf`:
- `apps/wallet/artifact-publication-1.0.17.json`
- `apps/wallet/proof/wallet-android-1.0.17-publication-20260920.json`

The Wallet publication owner fully downloaded and verified both release assets.
This website task independently matched their sizes and digests against GitHub
asset metadata. The API reports `immutable=false`: `releaseImmutable=false`.
The publisher may replace files. The website does not recalculate SHA-256 at
download time (`downloadTimeSha256Verified=false` in this website contract);
users should compare their downloads with the published expected digest.
This differs from the owner's point-in-time full-download verification.

Owner evidence covers an API 36 emulator upgrade from versionCode 22 to 23,
preserved firstInstallTime, 220ms cold launch, deep links without crashes and an
empty crash buffer. The 56/56 deterministic recovery tests are distinct from
live-chain transaction acceptance. Local Android Debug test signing only:
`productionSigned=false`, `storeReleased=false`, `walletConnectRelayE2E=false`,
`liveChainTransferExecuted=false`, `installedFinanceE2E=false`.
No real-device or complete financial acceptance is implied.

## Validation and release gate

Run `npm ci --no-audit --no-fund`, then `npm test`. The production build requires
a clean committed checkout: run `npm run build` on the eventual exact commit.
Validation completed: `npm test` passes all 255 tests plus docs authority and
website verification. The preliminary Vite build passes the bundle gate at
449187 bytes (63 chunks). The existing 450000-byte entry limit remains unchanged.
Run the clean production build after commit; record its result against the
exact website HEAD in the PR.

Wallet publication PR #164 merged on 2026-09-20 at
`c75cd8690b0bc43941db522ac502aa989addd713`; the coordinator confirmed this gate
before website commit and PR publication. Website merge and production deployment
require a separate coordinator instruction; this task performs neither.

## Deployment and rollback

After authorization, use the existing `npm run deploy:dry-run` and
`npm run deploy:prod` entrypoints (`deploy/vercel-deploy.sh`). They validate
public Testnet environment configuration, run tests and a production build, and
pass the exact source commit/tree/release to Vercel. Capture the prior production
deployment URL and alias before promotion. Validate `/build-identity.json`,
`/download`, the Wallet product/download chooser, and the new Android23 manifest
against the deployed exact source and APK URL. A build or GitHub PR is not public
website acceptance.

Before deployment, rollback through a scoped revert on a fresh branch based on
the current website main. After authorized deployment, restore the captured
previous immutable Vercel deployment alias. Preserve both releases, both
manifests and all owner worktrees; do not reset a checkout or overwrite newer
concurrent changes.

Current handoff boundary: publicDeployed=false; publicVerified=false;
productionApproved=false. Desktop and Web release selections are unchanged.
