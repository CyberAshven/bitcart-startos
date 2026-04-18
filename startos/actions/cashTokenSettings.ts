import { sdk } from '../sdk'
import { storeJson } from '../file-models/store.json'

const { InputSpec, Value, List } = sdk

const spec = InputSpec.of({
  cashTokenDefaults: Value.list(
    List.text(
      {
        name: 'Default CashTokens',
        description: 'Default token tickers enabled in the store.',
        default: ['MUSD'],
        minLength: 1,
        maxLength: null,
      },
      {
        masked: false,
        placeholder: 'MUSD',
      },
    ),
  ),
  cashTokenCategoryIds: Value.list(
    List.text(
      {
        name: 'Merchant CashToken Category IDs',
        description: 'Additional CashTokens category IDs to add to catalog/search.',
        default: [],
        minLength: null,
        maxLength: null,
      },
      {
        masked: false,
        placeholder: 'category-id-hex',
      },
    ),
  ),
})

export const cashTokenSettings = sdk.Action.withInput(
  'cashtoken-settings',
  async () => ({
    name: 'CashTokens Settings',
    description: 'Set default CashTokens and add merchant category IDs (MUSD enabled by default).',
    warning: null,
    allowedStatuses: 'any',
    group: 'Configuration',
    visibility: 'enabled',
  }),
  spec,
  async () => {
    const store = await storeJson.read().once()
    return {
      cashTokenDefaults: (store?.cashTokenDefaults ?? ['MUSD']).filter(Boolean),
      cashTokenCategoryIds: (store?.cashTokenCategoryIds ?? []).filter(Boolean),
    }
  },
  async ({ effects, input }) => {
    await storeJson.merge(effects, {
      cashTokenDefaults: (input.cashTokenDefaults ?? ['MUSD']).filter(Boolean),
      cashTokenCategoryIds: (input.cashTokenCategoryIds ?? []).filter(Boolean),
    })
    return null
  },
)
