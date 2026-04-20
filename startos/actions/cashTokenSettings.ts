import { sdk } from '../sdk'
import { storeJson } from '../file-models/store.json'

const { InputSpec, Value, List } = sdk

export const MUSD_CATEGORY_ID = 'b38a33f750f84c5c169a6f23cb873e6e79605021585d4f3408789689ed87f366'

const spec = InputSpec.of({
  cashTokenCategoryIds: Value.list(
    List.text(
      {
        name: 'Additional CashToken Category IDs',
        description:
          `BCMR-standard BCH CashToken category IDs to add to merchant catalog. MUSD (${MUSD_CATEGORY_ID}) is always enabled by default. Add any other token category IDs here.`,
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
    description: `Configure BCH CashToken category IDs for the merchant store. MUSD is always enabled by default (category ID: ${MUSD_CATEGORY_ID}). Additional tokens must be configured in the Bitcart admin panel using their BCMR category IDs.`,
    warning: null,
    allowedStatuses: 'any',
    group: 'Configuration',
    visibility: 'enabled',
  }),
  spec,
  async () => {
    const store = await storeJson.read().once()
    const existing = (store?.cashTokenCategoryIds ?? []).filter(
      (id) => id !== MUSD_CATEGORY_ID,
    )
    return { cashTokenCategoryIds: existing }
  },
  async ({ effects, input }) => {
    const extra = (input.cashTokenCategoryIds ?? []).filter(Boolean)
    await storeJson.merge(effects, {
      cashTokenDefaults: ['MUSD'],
      cashTokenCategoryIds: [MUSD_CATEGORY_ID, ...extra],
    })
    return null
  },
)
