import { sdk } from '../sdk'
import { storeJson } from '../file-models/store.json'

const { InputSpec, Value } = sdk

const spec = InputSpec.of({
  bitcartHost: Value.text({
    name: 'Host BITCART_HOST',
    description: 'Primary Bitcart host/domain.',
    required: true,
    default: '',
    masked: false,
    placeholder: 'yourdomain.com',
  }),
  bitcartAdminHost: Value.text({
    name: 'Admin Host BITCART_ADMIN_HOST',
    description: 'Admin host/domain (optional).',
    required: false,
    default: '',
    masked: false,
    placeholder: 'admin.yourdomain.com',
  }),
  bitcartStoreHost: Value.text({
    name: 'Store Host BITCART_STORE_HOST',
    description: 'Store host/domain (optional).',
    required: false,
    default: '',
    masked: false,
    placeholder: 'store.yourdomain.com',
  }),
  bitcartAdminApiUrl: Value.text({
    name: 'Admin API URL BITCART_ADMIN_API_URL',
    description: 'Admin frontend API base URL.',
    required: false,
    default: '',
    masked: false,
    placeholder: 'https://api.yourdomain.com/api',
  }),
  bitcartStoreApiUrl: Value.text({
    name: 'Store API URL BITCART_STORE_API_URL',
    description: 'Store frontend API base URL.',
    required: false,
    default: '',
    masked: false,
    placeholder: 'https://api.yourdomain.com/api',
  }),
  bitcartAdminRootPath: Value.text({
    name: 'Admin Root Path BITCART_ADMIN_ROOTPATH',
    description: 'Admin UI root path.',
    required: true,
    default: '/admin',
    masked: false,
    placeholder: '/admin',
  }),
  bitcartStoreRootPath: Value.text({
    name: 'Store Root Path BITCART_STORE_ROOTPATH',
    description: 'Store UI root path.',
    required: true,
    default: '/',
    masked: false,
    placeholder: '/',
  }),
  oneDomainMode: Value.toggle({
    name: 'ONE_DOMAIN_MODE',
    description: 'Serve admin/store under one domain with root paths.',
    default: true,
  }),
  bchServer: Value.text({
    name: 'BCH_SERVER',
    description: 'Custom BCH server endpoint (optional override).',
    required: false,
    default: 'https://seed-server.bitcart.ai',
    masked: false,
    placeholder: 'https://seed-server.bitcart.ai',
  }),
  bchOneServer: Value.toggle({
    name: 'BCH_ONESERVER',
    description: 'Force single BCH server behavior.',
    default: true,
  }),
  bitcartCryptos: Value.text({
    name: 'BITCART_CRYPTOS',
    description: 'Comma-separated coins enabled in backend/worker.',
    required: true,
    default: 'btc,bch,eth,bnb,matic,trx,xrg,ltc,grs,xmr',
    masked: false,
    placeholder: 'btc,bch,eth,bnb,matic,trx,xrg,ltc,grs,xmr',
  }),
  bitcartApiWorkers: Value.text({
    name: 'BITCART_API_WORKERS',
    description: 'Optional API worker process count override.',
    required: false,
    default: '',
    masked: false,
    placeholder: '4',
  }),
  bitcartPrometheusMetricsEnabled: Value.toggle({
    name: 'BITCART_PROMETHEUS_METRICS_ENABLED',
    description: 'Enable Bitcart Prometheus metrics in backend/worker.',
    default: false,
  }),
})

export const hostSettings = sdk.Action.withInput(
  'host-settings',
  async () => ({
    name: 'Host Settings',
    description: 'Configure host/domain and API URL settings for Bitcart admin/store/backend.',
    warning: null,
    allowedStatuses: 'any',
    group: 'Configuration',
    visibility: 'enabled',
  }),
  spec,
  async () => {
    const store = await storeJson.read().once()
    return {
      bitcartHost: store?.bitcartHost ?? '',
      bitcartAdminHost: store?.bitcartAdminHost ?? '',
      bitcartStoreHost: store?.bitcartStoreHost ?? '',
      bitcartAdminApiUrl: store?.bitcartAdminApiUrl ?? '',
      bitcartStoreApiUrl: store?.bitcartStoreApiUrl ?? '',
      bitcartAdminRootPath: store?.bitcartAdminRootPath ?? '/admin',
      bitcartStoreRootPath: store?.bitcartStoreRootPath ?? '/',
      oneDomainMode: store?.oneDomainMode ?? true,
      bchServer: store?.bchServer ?? '',
      bchOneServer: store?.bchOneServer ?? true,
      bitcartCryptos: store?.bitcartCryptos ?? 'btc,bch,eth,bnb,matic,trx,xrg,ltc,grs,xmr',
      bitcartApiWorkers: store?.bitcartApiWorkers ?? '',
      bitcartPrometheusMetricsEnabled: store?.bitcartPrometheusMetricsEnabled ?? false,
    }
  },
  async ({ effects, input }) => {
    await storeJson.merge(effects, {
      bitcartHost: input.bitcartHost ?? '',
      bitcartAdminHost: input.bitcartAdminHost ?? '',
      bitcartStoreHost: input.bitcartStoreHost ?? '',
      bitcartAdminApiUrl: input.bitcartAdminApiUrl ?? '',
      bitcartStoreApiUrl: input.bitcartStoreApiUrl ?? '',
      bitcartAdminRootPath: input.bitcartAdminRootPath ?? '/admin',
      bitcartStoreRootPath: input.bitcartStoreRootPath ?? '/',
      oneDomainMode: input.oneDomainMode ?? true,
      bchServer: input.bchServer ?? 'https://seed-server.bitcart.ai',
      bchOneServer: input.bchOneServer ?? true,
      bitcartCryptos: input.bitcartCryptos ?? 'btc,bch,eth,bnb,matic,trx,xrg,ltc,grs,xmr',
      bitcartApiWorkers: input.bitcartApiWorkers ?? '',
      bitcartPrometheusMetricsEnabled: input.bitcartPrometheusMetricsEnabled ?? false,
    })
    return null
  },
)
