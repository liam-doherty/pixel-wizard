import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { zValidator } from '@hono/zod-validator'
import { Player } from 'common'

export function makeApi() {
    const app = new Hono()
    app.use(cors())

    app.get('/', (c) => {
        return c.text('Hello Hono!')
    })

    app.post('/posts', zValidator('json', Player), (c) => {
        const validated = c.req.valid('json')

        return c.json({
            message: 'valid!',
        })
    })

    return app
}
