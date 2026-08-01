# YNX Chain Website

Official website workspace for YNX Chain.

The first screen renders live status from the YNX Chain API. It must not hardcode fake block height, TPS, validator count, TVL, user count, partners, wallet default support, exchange listings, or mainnet status.

Required commands:

```bash
npm install
npm test
npm run build
npm run deploy:dry-run
```

Key acceptance routes:

- `/dapp` — canonical software catalog and evidence state
- `/dapp/<product>` — independent product status routes
- `/dapp/download` — public web and verified installer directory
- `/dapp/square` — Square web application
- `/manual` — user journey, safety boundaries, and recovery guidance
- `/docs` — documentation rendered inside the official site
- `/api` — public REST, EVM JSON-RPC, Explorer, and Faucet reference
- `/faq`, `/security`, `/support` — public authority and safe support routes
- `/status` — network and release-boundary status
- `/public-product-metadata.json` — canonical machine-readable product identity
- `/product-release.json` — evidence-bound release state
- `/releases/ecosystem-release-registry.json` — machine-readable release snapshot

Global navigation includes a keyboard command palette (`⌘K` / `Ctrl+K`), light and
dark appearance, RTL layout, mobile navigation, visible keyboard focus, and a skip
link. Loading, empty, unavailable, error, and recovery guidance must remain explicit
instead of being replaced by sample values.

Local build artifacts are not public downloads. See
`docs/WEBSITE_ACCEPTANCE.md` for the release-admission rule and route checklist.

The deployment script supplies the audited public-testnet defaults used by the
site. Environment variables may override those values, but private credentials
must never be committed.

Production deployment requires:

- `VITE_YNX_API_BASE_URL`
- `VITE_YNX_EVM_RPC_URL`
- `VITE_YNX_EXPLORER_URL`
- `VITE_YNX_FAUCET_URL`
- `VITE_YNX_DOCS_URL`
- optional review links: `VITE_YNX_GRANT_URL`, `VITE_YNX_ECOSYSTEM_URL`, `VITE_YNX_EXCHANGE_URL`
