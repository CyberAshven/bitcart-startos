import { VersionInfo } from '@start9labs/start-sdk'

export const v_0_1_0_0 = VersionInfo.of({
  version: '0.1.0:0',
  releaseNotes:
    'Initial Bitcart StartOS scaffold with host/API settings action, CashTokens defaults (MUSD), and merchant category ID configuration.',
  migrations: {
    up: async () => {},
    down: async () => {},
  },
})
