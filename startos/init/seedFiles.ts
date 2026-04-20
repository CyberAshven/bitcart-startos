import { sdk } from '../sdk'
import { storeJson } from '../file-models/store.json'

export const seedFiles = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return

  await storeJson.merge(effects, {
    bitcartCryptos: 'btc,bch,eth,bnb,matic,trx,xrg,ltc,grs,xmr',
  })
})
