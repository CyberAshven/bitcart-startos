import { sdk } from '../../sdk'
import { storeJson, shape } from '../../file-models/store.json'

const { InputSpec, Value } = sdk

const autoSpec = InputSpec.of({
  raw: Value.hidden(shape.partial()),
})

export const autoconfig = sdk.Action.withInput(
  'autoconfig',
  async () => ({
    name: 'Auto-Configure',
    description: 'Hidden action used by tasks to apply partial Bitcart settings.',
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'hidden',
  }),
  autoSpec,
  async () => ({ raw: {} }),
  async ({ effects, input }) => {
    if (input.raw) {
      await storeJson.merge(effects, input.raw)
    }
    return null
  },
)
