#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
source deploy/source-identity.sh

npx vite build
node scripts/write-build-identity.mjs
node scripts/verify-bundle-split.mjs
node scripts/verify-production-wallet-boundary.mjs
node scripts/prerender.mjs
node scripts/route-resource-hints.mjs
node scripts/indexnow.mjs --dry-run
