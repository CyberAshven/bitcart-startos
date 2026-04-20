import { sdk } from '../sdk'
import { storeJson } from '../file-models/store.json'

const { InputSpec, Value } = sdk

const spec = InputSpec.of({
  bitcartCryptos: Value.text({
    name: 'BITCART_CRYPTOS',
    description:
      'Comma-separated list of cryptocurrencies to enable in the backend and worker daemons. Includes coins and their tokens (e.g. eth enables ERC-20 tokens in admin panel). Supported: btc, bch, eth, bnb, matic, trx, xrg, ltc, grs, xmr.',
    required: true,
    default: 'btc,bch,eth,bnb,matic,trx,xrg,ltc,grs,xmr',
    masked: false,
    placeholder: 'btc,bch,eth,bnb,matic,trx,xrg,ltc,grs,xmr',
  }),
  bitcartAdminRootPath: Value.text({
    name: 'Admin Root Path',
    description: 'URL path prefix for the admin UI.',
    required: true,
    default: '/admin',
    masked: false,
    placeholder: '/admin',
  }),
  bitcartStoreRootPath: Value.text({
    name: 'Store Root Path',
    description: 'URL path prefix for the merchant store UI.',
    required: true,
    default: '/',
    masked: false,
    placeholder: '/',
  }),
  oneDomainMode: Value.toggle({
    name: 'ONE_DOMAIN_MODE',
    description:
      'Serve admin and store under a single domain using root path prefixes.',
    default: true,
  }),
  bchServer: Value.text({
    name: 'BCH Electrum Server',
    description:
      'Custom BCH electrum server endpoint. Leave blank to use the Bitcart default seed server.',
    required: false,
    default: '',
    masked: false,
    placeholder: 'https://seed-server.bitcart.ai',
  }),
  bchOneServer: Value.toggle({
    name: 'BCH Single Server Mode',
    description: 'Force the BCH daemon to use only one electrum server.',
    default: true,
  }),
  bitcartApiWorkers: Value.text({
    name: 'API Worker Count',
    description:
      'Number of uvicorn worker processes for the backend API. Leave blank to use the default.',
    required: false,
    default: '',
    masked: false,
    placeholder: '4',
  }),
  bitcartPrometheusMetricsEnabled: Value.toggle({
    name: 'Prometheus Metrics',
    description: 'Expose Prometheus metrics endpoint on the backend.',
    default: false,
  }),
})

export const deploymentSettings = sdk.Action.withInput(
  'deployment-settings',
  async () => ({
    name: 'Deployment Settings',
    description:
      'Configure which cryptocurrencies are enabled and optional server daemon settings. Host/API URLs are auto-detected from StartOS — configure store details in the Bitcart admin panel.',
    warning: null,
    allowedStatuses: 'any',
    group: 'Configuration',
    visibility: 'enabled',
  }),
  spec,
  async () => {
    const store = await storeJson.read().once()
    return {
      bitcartCryptos: store?.bitcartCryptos ?? 'btc,bch,eth,bnb,matic,trx,xrg,ltc,grs,xmr',
      bitcartAdminRootPath: store?.bitcartAdminRootPath ?? '/admin',
      bitcartStoreRootPath: store?.bitcartStoreRootPath ?? '/',
      oneDomainMode: store?.oneDomainMode ?? true,
      bchServer: store?.bchServer ?? '',
      bchOneServer: store?.bchOneServer ?? true,
      bitcartApiWorkers: store?.bitcartApiWorkers ?? '',
      bitcartPrometheusMetricsEnabled: store?.bitcartPrometheusMetricsEnabled ?? false,
    }
  },
  async ({ effects, input }) => {
    await storeJson.merge(effects, {
      bitcartCryptos: input.bitcartCryptos ?? 'btc,bch,eth,bnb,matic,trx,xrg,ltc,grs,xmr',
      bitcartAdminRootPath: input.bitcartAdminRootPath ?? '/admin',
      bitcartStoreRootPath: input.bitcartStoreRootPath ?? '/',
      oneDomainMode: input.oneDomainMode ?? true,
      bchServer: input.bchServer ?? '',
      bchOneServer: input.bchOneServer ?? true,
      bitcartApiWorkers: input.bitcartApiWorkers ?? '',
      bitcartPrometheusMetricsEnabled: input.bitcartPrometheusMetricsEnabled ?? false,
    })
    return null
  },
)
