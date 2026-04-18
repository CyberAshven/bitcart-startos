export const rootDir = '/data'

export const backendPort = 8000
export const adminPort = 4000
export const storePort = 3000
export const redisPort = 6379
export const databasePort = 5432

export const backendInterfaceId = 'backend-api'
export const adminInterfaceId = 'admin-ui'
export const storeInterfaceId = 'store-ui'

export const asString = (value: unknown, fallback = ''): string => {
	const str = typeof value === 'string' ? value.trim() : ''
	return str || fallback
}

export const asBoolString = (value: unknown, fallback = false): string => {
	if (typeof value === 'boolean') return value ? 'true' : 'false'
	return fallback ? 'true' : 'false'
}

export const normalizePath = (value: unknown, fallback: string): string => {
	const raw = asString(value, fallback)
	return raw.startsWith('/') ? raw : `/${raw}`
}
