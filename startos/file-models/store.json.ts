import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const shape = z
  .object({
    bitcartAdminRootPath: z.string().catch('/admin'),
    bitcartStoreRootPath: z.string().catch('/'),
    oneDomainMode: z.boolean().catch(true),
    bchServer: z.string().catch(''),
    bchOneServer: z.boolean().catch(true),
    bitcartCryptos: z.string().catch('btc,bch,eth,bnb,matic,trx,xrg,ltc,grs,xmr'),
    bitcartApiWorkers: z.string().catch(''),
    bitcartPrometheusMetricsEnabled: z.boolean().catch(false),
    cashTokenDefaults: z.array(z.string()).catch(['MUSD']),
    cashTokenCategoryIds: z.array(z.string()).catch(['b38a33f750f84c5c169a6f23cb873e6e79605021585d4f3408789689ed87f366']),
  })
  .strip()

export const storeJson = FileHelper.json(
  {
    base: sdk.volumes.main,
    subpath: '/store.json',
  },
  shape,
)
