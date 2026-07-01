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

Real public endpoint values belong in local `.env` or deployment environment variables and must not be committed.

Production deployment requires:

- `VITE_YNX_API_BASE_URL`
- `VITE_YNX_EVM_RPC_URL`
- `VITE_YNX_EXPLORER_URL`
- `VITE_YNX_FAUCET_URL`
- `VITE_YNX_DOCS_URL`
- optional review links: `VITE_YNX_GRANT_URL`, `VITE_YNX_ECOSYSTEM_URL`, `VITE_YNX_EXCHANGE_URL`
