import { sdk } from './sdk'
import { storeJson } from './file-models/store.json'
import {
  rootDir,
  backendPort,
  adminPort,
  storePort,
  redisPort,
  databasePort,
  asString,
  asBoolString,
  normalizePath,
} from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  const store = (await storeJson.read().const(effects)) ?? {
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
  }

  const dataMounts = sdk.Mounts.of().mountVolume({
    volumeId: 'main',
    subpath: null,
    mountpoint: rootDir,
    readonly: false,
  })

  const bitcartDataMounts = dataMounts
    .mountVolume({
      volumeId: 'main',
      subpath: '/plugins/backend',
      mountpoint: '/plugins/backend',
      readonly: false,
    })
    .mountVolume({
      volumeId: 'main',
      subpath: '/plugins/admin',
      mountpoint: '/plugins/admin',
      readonly: false,
    })
    .mountVolume({
      volumeId: 'main',
      subpath: '/plugins/store',
      mountpoint: '/plugins/store',
      readonly: false,
    })
    .mountVolume({
      volumeId: 'main',
      subpath: '/plugins/docker',
      mountpoint: '/plugins/docker',
      readonly: false,
    })

  const backendSub = await sdk.SubContainer.of(
    effects,
    { imageId: 'bitcart' },
    bitcartDataMounts,
    'backend',
  )

  const workerSub = await sdk.SubContainer.of(
    effects,
    { imageId: 'bitcart' },
    bitcartDataMounts,
    'worker',
  )

  const adminSub = await sdk.SubContainer.of(
    effects,
    { imageId: 'admin' },
    dataMounts,
    'admin',
  )

  const storeSub = await sdk.SubContainer.of(
    effects,
    { imageId: 'store' },
    dataMounts,
    'store',
  )

  const redisSub = await sdk.SubContainer.of(
    effects,
    { imageId: 'redis' },
    sdk.Mounts.of(),
    'redis',
  )

  const databaseSub = await sdk.SubContainer.of(
    effects,
    { imageId: 'database' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'main',
      subpath: '/db',
      mountpoint: '/var/lib/postgresql/data',
      readonly: false,
    }),
    'database',
  )

  const bitcartHost = asString(store.bitcartHost)
  const adminHost = asString(store.bitcartAdminHost)
  const storeHost = asString(store.bitcartStoreHost)
  const adminRootPath = normalizePath(store.bitcartAdminRootPath, '/admin')
  const storeRootPath = normalizePath(store.bitcartStoreRootPath, '/')
  const adminApiUrl = asString(store.bitcartAdminApiUrl, `https://${bitcartHost}/api`)
  const storeApiUrl = asString(store.bitcartStoreApiUrl, `https://${bitcartHost}/api`)

  const commonBitcartEnv = {
    BITCART_ENV: 'production',
    LOG_FILE: 'bitcart.log',
    BITCART_DATADIR: '/datadir',
    BITCART_BACKUPS_DIR: '/backups',
    BITCART_VOLUMES: '/datadir /backups /plugins',
    BITCART_BACKEND_PLUGINS_DIR: '/plugins/backend',
    BITCART_ADMIN_PLUGINS_DIR: '/plugins/admin',
    BITCART_STORE_PLUGINS_DIR: '/plugins/store',
    BITCART_DOCKER_PLUGINS_DIR: '/plugins/docker',
    BITCART_HOST: bitcartHost,
    BITCART_ADMIN_HOST: adminHost,
    BITCART_ADMIN_ROOTPATH: adminRootPath,
    BITCART_STORE_ROOTPATH: storeRootPath,
    ONE_DOMAIN_MODE: asBoolString(store.oneDomainMode, true),
    BITCART_CRYPTOS: asString(store.bitcartCryptos, 'btc,bch,eth,bnb,matic,trx,xrg,ltc,grs,xmr'),
    BCH_NETWORK: 'mainnet',
    BCH_SERVER: asString(store.bchServer, 'https://seed-server.bitcart.ai'),
    BCH_ONESERVER: asBoolString(store.bchOneServer, true),
    BITCART_PROMETHEUS_METRICS_ENABLED: asBoolString(store.bitcartPrometheusMetricsEnabled, false),
  }

  const apiWorkers = asString(store.bitcartApiWorkers)

  return sdk.Daemons.of(effects)
    .addDaemon('database', {
      subcontainer: databaseSub,
      exec: {
        command: ['sh', '-lc', 'exec docker-entrypoint.sh postgres -c random_page_cost=1.0'],
        env: {
          POSTGRES_USER: 'postgres',
          POSTGRES_DB: 'bitcart',
          POSTGRES_HOST_AUTH_METHOD: 'trust',
        },
      },
      ready: {
        display: 'PostgreSQL',
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, databasePort, {
            successMessage: 'database is accepting connections',
            errorMessage: 'database is not reachable yet',
          }),
      },
      requires: [],
    })
    .addDaemon('redis', {
      subcontainer: redisSub,
      exec: {
        command: ['sh', '-lc', 'exec redis-server --save "" --appendonly no'],
      },
      ready: {
        display: 'Redis',
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, redisPort, {
            successMessage: 'redis is listening',
            errorMessage: 'redis is not reachable yet',
          }),
      },
      requires: [],
    })
    .addDaemon('backend', {
      subcontainer: backendSub,
      exec: {
        command: ['sh', '-lc', 'exec just prod-api-up'],
        env: {
          ...commonBitcartEnv,
          DB_HOST: 'database',
          DB_PORT: `${databasePort}`,
          REDIS_HOST: 'redis',
          REDIS_PORT: `${redisPort}`,
          BITCART_BACKEND_ROOTPATH: '/api',
          BITCART_REVERSEPROXY: 'nginx-https',
          BITCART_HTTPS_ENABLED: 'false',
          BITCART_ADMIN_API_URL: adminApiUrl,
          BITCART_STORE_API_URL: storeApiUrl,
          BITCART_API_WORKERS: apiWorkers,
        },
      },
      ready: {
        display: 'Bitcart Backend API',
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, backendPort, {
            successMessage: 'backend is listening',
            errorMessage: 'backend is not reachable yet',
          }),
      },
      requires: ['database', 'redis'],
    })
    .addDaemon('worker', {
      subcontainer: workerSub,
      exec: {
        command: ['sh', '-lc', 'exec just worker'],
        env: {
          ...commonBitcartEnv,
          DB_HOST: 'database',
          DB_PORT: `${databasePort}`,
          REDIS_HOST: 'redis',
          REDIS_PORT: `${redisPort}`,
        },
      },
      ready: {
        display: 'Bitcart Worker',
        fn: async () => ({
          result: 'success',
          message: 'background worker is running',
        }),
      },
      requires: ['backend'],
    })
    .addDaemon('admin', {
      subcontainer: adminSub,
      exec: {
        command: ['sh', '-lc', 'exec yarn start'],
        env: {
          BITCART_ADMIN_LOG_FILE: 'bitcart.log',
          BITCART_ADMIN_API_URL: adminApiUrl,
          BITCART_ADMIN_ROOTPATH: adminRootPath,
          BITCART_STORE_HOST: storeHost,
          BITCART_STORE_ROOTPATH: storeRootPath,
          ONE_DOMAIN_MODE: asBoolString(store.oneDomainMode, true),
          BITCART_ADMIN_SERVER_API_URL: 'http://backend:8000',
        },
      },
      ready: {
        display: 'Bitcart Admin UI',
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, adminPort, {
            successMessage: 'admin UI is listening',
            errorMessage: 'admin UI is not reachable yet',
          }),
      },
      requires: ['backend'],
    })
    .addDaemon('store', {
      subcontainer: storeSub,
      exec: {
        command: ['sh', '-lc', 'exec yarn start'],
        env: {
          BITCART_STORE_API_URL: storeApiUrl,
          BITCART_STORE_ROOTPATH: storeRootPath,
          BITCART_ADMIN_HOST: adminHost,
          BITCART_ADMIN_ROOTPATH: adminRootPath,
          ONE_DOMAIN_MODE: asBoolString(store.oneDomainMode, true),
          BITCART_STORE_SERVER_API_URL: 'http://backend:8000',
        },
      },
      ready: {
        display: 'Bitcart Store UI',
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, storePort, {
            successMessage: 'store UI is listening',
            errorMessage: 'store UI is not reachable yet',
          }),
      },
      requires: ['backend'],
    })
})
