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
    short: 'Bitcart payment processor for StartOS',
    long: 'Bitcart package with backend, worker, admin UI, store UI, PostgreSQL, and Redis daemons. Host/API settings and CashTokens category configuration are included, with MUSD enabled by default.',
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
    install: 'Initial multi-daemon Bitcart runtime is enabled. Review host/API settings after install for your domain paths and API URLs.',
    update: null,
    uninstall: 'Uninstalling Bitcart removes local package data.',
    restore: 'Restore reapplies package configuration from backup.',
    start: null,
    stop: null,
  },
  dependencies: {},
})
