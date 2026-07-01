#!/usr/bin/env bash
set -euo pipefail

node deploy/vercel-env-check.mjs
npm test
npm run build

if [[ "${DEPLOY_DRY_RUN:-0}" == "1" ]]; then
  echo "DRY RUN npx vercel --prod --yes"
  exit 0
fi

npx vercel --prod --yes
