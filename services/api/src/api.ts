import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { zValidator } from '@hono/zod-validator'
import { Player, PixelImage } from 'common'
import sharp from 'sharp'
import * as z from 'zod'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

export function makeApi() {
    const app = new Hono()
    app.use(cors())

    app.get('/', (c) => {
        return c.text('Hello Hono!')
    })

    app.post('/posts', zValidator('json', Player), (c) => {
        const validated = c.req.valid('json')
        return c.json({ message: 'valid!', color: validated.color })
    })

    app.post('/images', zValidator('json', PixelImage), (c) => {
        const image = c.req.valid('json')
        return c.json(image)
    })

    app.post(
        '/images/upload',
        zValidator(
            'query',
            z.object({ size: z.coerce.number().int().min(4).max(32) }),
        ),
        async (c) => {
            const { size } = c.req.valid('query')

            const body = await c.req.parseBody()
            const file = body['file']

            if (!(file instanceof File)) {
                return c.json({ error: 'No file uploaded' }, 400)
            }

            if (file.size > MAX_FILE_SIZE) {
                return c.json({ error: 'File exceeds 5 MB limit' }, 413)
            }

            const buffer = Buffer.from(await file.arrayBuffer())

            const { data } = await sharp(buffer)
                .resize(size, size, { fit: 'cover' })
                .raw()
                .toBuffer({ resolveWithObject: true })

            const cells: string[] = []
            for (let i = 0; i < size * size; i++) {
                const r = data[i * 3]
                const g = data[i * 3 + 1]
                const b = data[i * 3 + 2]
                cells.push(
                    '#' +
                        r.toString(16).padStart(2, '0') +
                        g.toString(16).padStart(2, '0') +
                        b.toString(16).padStart(2, '0'),
                )
            }

            const image: z.infer<typeof PixelImage> = {
                width: size,
                height: size,
                cells,
            }
            return c.json(image)
        },
    )

    return app
}
