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
})

export const deploymentSettings = sdk.Action.withInput(
  'deployment-settings',
  async () => ({
    name: 'Deployment Settings',
    description:
      'Configure which cryptocurrencies are enabled. All other settings (store details, payment methods, notifications) are configured in the Bitcart admin panel.',
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
    }
  },
  async ({ effects, input }) => {
    await storeJson.merge(effects, {
      bitcartCryptos: input.bitcartCryptos ?? 'btc,bch,eth,bnb,matic,trx,xrg,ltc,grs,xmr',
    })
    return null
  },
)
