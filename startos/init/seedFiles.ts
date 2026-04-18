import { sdk } from '../sdk'
import { storeJson } from '../file-models/store.json'

export const seedFiles = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return

  await storeJson.merge(effects, {
    bitcartHost: '',
    bitcartAdminHost: '',
    bitcartStoreHost: '',
    bitcartAdminApiUrl: '',
    bitcartStoreApiUrl: '',
    bitcartAdminRootPath: '/admin',
    bitcartStoreRootPath: '/',
    oneDomainMode: true,
    bchServer: 'https://seed-server.bitcart.ai',
    bchOneServer: true,
    bitcartCryptos: 'btc,bch,eth,bnb,matic,trx,xrg,ltc,grs,xmr',
    bitcartApiWorkers: '',
    bitcartPrometheusMetricsEnabled: false,
    cashTokenDefaults: ['MUSD'],
    cashTokenCategoryIds: [],
  })
})
