# Bitcart StartOS Package

This repository contains an in-progress StartOS package for Bitcart.

Implemented in this phase:
- Host/API configuration action fields for:
  - BITCART_HOST
  - BITCART_ADMIN_HOST
  - BITCART_STORE_HOST
  - BITCART_ADMIN_API_URL
  - BITCART_STORE_API_URL
  - BCH_SERVER
  - BCH_ONESERVER
  - BITCART_CRYPTOS
  - BITCART_API_WORKERS
  - BITCART_PROMETHEUS_METRICS_ENABLED
- CashTokens settings with MUSD default and merchant-provided category IDs.
- Runtime daemons wired in `startos/main.ts`:
  - backend (`bitcart/bitcart:stable`, `just prod-api-up`)
  - worker (`bitcart/bitcart:stable`, `just worker`)
  - admin UI (`bitcart/bitcart-admin:stable`, `yarn start`)
  - store UI (`bitcart/bitcart-store:stable`, `yarn start`)
  - PostgreSQL (`pgautoupgrade/pgautoupgrade:17-alpine`)
  - Redis (`redis:alpine`)

Next implementation phases:
- Add optional coin sidecar daemons for local chain backends where needed.
- Start9 UI parity for deeper store management/search workflows.
- End-to-end Start9 runtime validation and packaging loop.
