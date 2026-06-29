import pino from 'pino'
export type { BaseLogger } from '@hono/structured-logger'

export function createLogger() {
    return pino()
}
