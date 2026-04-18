import { sdk } from './sdk'
import { storeJson } from './file-models/store.json'
import {
  backendInterfaceId,
  adminInterfaceId,
  storeInterfaceId,
  backendPort,
  adminPort,
  storePort,
} from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const receipts = []
  const store = await storeJson.read().const(effects)
  const adminPath = store?.bitcartAdminRootPath?.startsWith('/')
    ? store.bitcartAdminRootPath
    : '/admin'
  const storePath = store?.bitcartStoreRootPath?.startsWith('/')
    ? store.bitcartStoreRootPath
    : '/'

  const backendMulti = sdk.MultiHost.of(effects, 'backend')
  const backendOrigin = await backendMulti.bindPort(backendPort, {
    protocol: 'http',
    preferredExternalPort: backendPort,
  })
  const backendApi = sdk.createInterface(effects, {
    name: 'Bitcart Backend API',
    id: backendInterfaceId,
    description: 'Bitcart backend API endpoint',
    type: 'api',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '/api',
    query: {},
  })
  receipts.push(await backendOrigin.export([backendApi]))

  const adminMulti = sdk.MultiHost.of(effects, 'admin')
  const adminOrigin = await adminMulti.bindPort(adminPort, {
    protocol: 'http',
    preferredExternalPort: adminPort,
  })
  const adminUi = sdk.createInterface(effects, {
    name: 'Bitcart Admin UI',
    id: adminInterfaceId,
    description: 'Bitcart admin interface',
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: adminPath,
    query: {},
  })
  receipts.push(await adminOrigin.export([adminUi]))

  const storeMulti = sdk.MultiHost.of(effects, 'store')
  const storeOrigin = await storeMulti.bindPort(storePort, {
    protocol: 'http',
    preferredExternalPort: storePort,
  })
  const storeUi = sdk.createInterface(effects, {
    name: 'Bitcart Store UI',
    id: storeInterfaceId,
    description: 'Bitcart merchant store interface',
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: storePath,
    query: {},
  })
  receipts.push(await storeOrigin.export([storeUi]))

  return receipts
})
