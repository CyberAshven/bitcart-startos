import { setupManifest } from '@start9labs/start-sdk'

export const manifest = setupManifest({
  id: 'bitcart',
  title: 'Bitcart',
  license: 'MIT',
  packageRepo: 'https://github.com/CyberAshven/bitcart-startos',
  upstreamRepo: 'https://github.com/bitcart/bitcart',
  marketingUrl: 'https://bitcart.ai',
  donationUrl: null,
  docsUrls: [
    'https://github.com/bitcart/bitcart',
    'https://generator.bitcart.ai/',
  ],
  description: {
    short: 'Self-hosted BCH & multi-coin payment processor',
    long: 'Bitcart is a free, open-source payment processor supporting BCH (with CashTokens/MUSD), BTC, ETH (ERC-20: USDT/USDC/DAI), BNB, MATIC, TRX, XRG, LTC, GRS, XMR and more. Host/API URLs are auto-detected from StartOS — no manual configuration needed. Merchants configure wallets, stores, and token settings in the Bitcart admin panel.',
  },
  volumes: ['main'],
  images: {
    bitcart: {
      source: { dockerTag: 'bitcart/bitcart:stable' },
      arch: ['x86_64', 'aarch64'],
      emulateMissingAs: 'x86_64',
    },
    admin: {
      source: { dockerTag: 'bitcart/bitcart-admin:stable' },
      arch: ['x86_64', 'aarch64'],
      emulateMissingAs: 'x86_64',
    },
    store: {
      source: { dockerTag: 'bitcart/bitcart-store:stable' },
      arch: ['x86_64', 'aarch64'],
      emulateMissingAs: 'x86_64',
    },
    database: {
      source: { dockerTag: 'pgautoupgrade/pgautoupgrade:17-alpine' },
      arch: ['x86_64', 'aarch64'],
      emulateMissingAs: 'x86_64',
    },
    redis: {
      source: { dockerTag: 'redis:alpine' },
      arch: ['x86_64', 'aarch64'],
      emulateMissingAs: 'x86_64',
    },
  },
  alerts: {
    install:
      'Bitcart is ready. Host and API URLs are auto-configured from StartOS. Open the admin panel to add wallets, configure your store, and enable tokens (ERC-20, CashTokens, etc.).',
    update: null,
    uninstall: 'Uninstalling Bitcart removes all local payment data permanently.',
    restore: 'Restore reapplies deployment configuration from backup.',
    start: null,
    stop: null,
  },
  dependencies: {},
})
