#!/usr/bin/env bash
set -euo pipefail

export VITE_YNX_API_BASE_URL="${VITE_YNX_API_BASE_URL:-https://rpc.ynxweb4.com}"
export VITE_YNX_EVM_RPC_URL="${VITE_YNX_EVM_RPC_URL:-https://evm.ynxweb4.com}"
export VITE_YNX_EXPLORER_URL="${VITE_YNX_EXPLORER_URL:-https://explorer.ynxweb4.com}"
export VITE_YNX_MONITOR_URL="${VITE_YNX_MONITOR_URL:-https://monitor.ynxweb4.com}"
export VITE_YNX_FAUCET_URL="${VITE_YNX_FAUCET_URL:-https://faucet.ynxweb4.com}"
export VITE_YNX_DOCS_URL="${VITE_YNX_DOCS_URL:-/docs}"

node deploy/vercel-env-check.mjs
npm test
npm run build

if [[ "${DEPLOY_DRY_RUN:-0}" == "1" ]]; then
  echo "DRY RUN npx vercel --prod --yes"
  exit 0
fi

npx vercel --prod --yes
