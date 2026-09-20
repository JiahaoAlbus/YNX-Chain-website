#!/usr/bin/env bash
set -euo pipefail

export VITE_YNX_API_BASE_URL="${VITE_YNX_API_BASE_URL:-https://rpc.ynxweb4.com}"
export VITE_YNX_EVM_RPC_URL="${VITE_YNX_EVM_RPC_URL:-https://evm.ynxweb4.com}"
export VITE_YNX_EXPLORER_URL="${VITE_YNX_EXPLORER_URL:-https://explorer.ynxweb4.com}"
export VITE_YNX_MONITOR_URL="${VITE_YNX_MONITOR_URL:-https://monitor.ynxweb4.com}"
export VITE_YNX_FAUCET_URL="${VITE_YNX_FAUCET_URL:-https://faucet-testnet.ynxweb4.com}"
export VITE_YNX_DOCS_URL="${VITE_YNX_DOCS_URL:-/docs}"

source deploy/source-identity.sh
node deploy/vercel-env-check.mjs
npm test
npm run build

identity_args=(
  --build-env "YNX_WEBSITE_SOURCE_COMMIT=$YNX_WEBSITE_SOURCE_COMMIT"
  --build-env "YNX_WEBSITE_SOURCE_TREE=$YNX_WEBSITE_SOURCE_TREE"
  --build-env "YNX_WEBSITE_RELEASE=$YNX_WEBSITE_RELEASE"
  --env "YNX_WEBSITE_SOURCE_COMMIT=$YNX_WEBSITE_SOURCE_COMMIT"
  --env "YNX_WEBSITE_SOURCE_TREE=$YNX_WEBSITE_SOURCE_TREE"
  --env "YNX_WEBSITE_RELEASE=$YNX_WEBSITE_RELEASE"
)

if [[ "${DEPLOY_DRY_RUN:-0}" == "1" ]]; then
  printf 'DRY RUN npx vercel --prod --yes'
  printf ' %q' "${identity_args[@]}"
  printf '\n'
  exit 0
fi

npx vercel --prod --yes "${identity_args[@]}"
