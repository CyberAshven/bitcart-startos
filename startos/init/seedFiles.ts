import { sdk } from '../sdk'
import { storeJson } from '../file-models/store.json'

export const seedFiles = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return

  await storeJson.merge(effects, {
    bitcartAdminRootPath: '/admin',
    bitcartStoreRootPath: '/',
    oneDomainMode: true,
    bchServer: '',
    bchOneServer: true,
    bitcartCryptos: 'btc,bch,eth,bnb,matic,trx,xrg,ltc,grs,xmr',
    bitcartApiWorkers: '',
    bitcartPrometheusMetricsEnabled: false,
    cashTokenDefaults: ['MUSD'],
    cashTokenCategoryIds: ['b38a33f750f84c5c169a6f23cb873e6e79605021585d4f3408789689ed87f366'],
  })
})
