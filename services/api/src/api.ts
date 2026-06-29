import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { structuredLogger } from '@hono/structured-logger'
import { requestId } from 'hono/request-id'
import { zValidator } from '@hono/zod-validator'
import { Player, PixelImage } from 'common'
import sharp from 'sharp'
import * as z from 'zod'
import { GoogleGenAI } from '@google/genai'
import { SampleImages } from './SampleImages.js'
import { createLogger, type BaseLogger } from './logger.js'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

export function makeApi() {
    const rootLogger = createLogger()

    const app = new Hono<{ Variables: { logger: BaseLogger } }>()
    app.use(cors())

    app.use(requestId())
    app.use(
        structuredLogger({
            createLogger: (c) =>
                rootLogger.child({ requestId: c.var.requestId }),
            onRequest: (logger, c) => {
                logger.info(
                    {
                        method: c.req.method,
                        path: c.req.path,
                        userAgent: c.req.header('User-Agent'),
                    },
                    'incoming request',
                )
            },
            onResponse: (logger, c, elapsedMs) => {
                logger.info(
                    {
                        status: c.res.status,
                        elapsedMs,
                        contentLength: c.res.headers.get('content-length'),
                    },
                    'request completed',
                )
            },
            onError: (logger, err, c) => {
                logger.error(
                    {
                        err,
                        method: c.req.method,
                        path: c.req.path,
                    },
                    'request failed',
                )
            },
        }),
    )

    app.get('/', (c) => {
        c.var.logger.info({}, 'root endpoint hit')
        return c.text('Hello Hono!')
    })

    app.get('/images/samples', (c) => {
        return c.json(SampleImages)
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
        '/images/png',
        zValidator(
            'query',
            z.object({
                scale: z.coerce.number().int().min(1).max(64).default(1),
            }),
        ),
        zValidator('json', PixelImage),
        async (c) => {
            const { scale } = c.req.valid('query')
            const { width, height, cells } = c.req.valid('json')

            const raw = Buffer.alloc(width * height * 4)
            for (let i = 0; i < cells.length; i++) {
                const hex = cells[i].slice(1)
                raw[i * 4] = parseInt(hex.slice(0, 2), 16)
                raw[i * 4 + 1] = parseInt(hex.slice(2, 4), 16)
                raw[i * 4 + 2] = parseInt(hex.slice(4, 6), 16)
                raw[i * 4 + 3] =
                    hex.length === 8 ? parseInt(hex.slice(6, 8), 16) : 255
            }

            const png = await sharp(raw, {
                raw: { width, height, channels: 4 },
            })
                .resize(width * scale, height * scale, { kernel: 'nearest' })
                .png()
                .toBuffer()

            return new Response(new Uint8Array(png), {
                headers: {
                    'Content-Type': 'image/png',
                    'Content-Disposition':
                        'attachment; filename="pixel-image.png"',
                },
            })
        },
    )

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
                c.var.logger.error({}, 'No file uploaded')
                return c.json({ error: 'No file uploaded' }, 400)
            }

            if (file.size > MAX_FILE_SIZE) {
                c.var.logger.error({}, 'File exceeds 5 MB limit')
                return c.json({ error: 'File exceeds 5 MB limit' }, 413)
            }

            const buffer = Buffer.from(await file.arrayBuffer())

            const { data, info } = await sharp(buffer)
                .flatten({ background: '#ffffff' })
                .resize(size, size, { fit: 'cover' })
                .raw()
                .toBuffer({ resolveWithObject: true })

            const { channels } = info
            const cells: string[] = []
            for (let i = 0; i < size * size; i++) {
                const r = data[i * channels]
                const g = data[i * channels + 1]
                const b = data[i * channels + 2]
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

    app.post(
        '/images/generate',
        zValidator(
            'json',
            z.object({
                description: z.string().min(1).max(500),
                size: z.number().int().min(4).max(32),
            }),
        ),
        async (c) => {
            const { description, size } = c.req.valid('json')

            const apiKey = process.env.GEMINI_API_KEY
            const cloud = process.env.GOOGLE_CLOUD_PROJECT
            if (!apiKey) {
                return c.json({ error: 'GEMINI_API_KEY not configured' }, 500)
            }

            const genAi = new GoogleGenAI({
                apiKey: apiKey,
            })

            const prompt = `Generate a pixel art image of: ${description}.
The image must be exactly ${size} pixels wide and ${size} pixels tall (${size * size} cells total).
Return a JSON object with:
- width: ${size}
- height: ${size}
- cells: an array of exactly ${size * size} hex color strings (e.g. "#ff0000"), row by row from top-left to bottom-right`

            console.log(prompt)

            const response = await genAi.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseJsonSchema: z.toJSONSchema(PixelImage),
                },
            })

            const raw = JSON.parse(response.text ?? 'null')
            const expected = size * size
            if (raw && Array.isArray(raw.cells)) {
                if (raw.cells.length > expected) {
                    c.var.logger.info({}, 'genAi screwed up, to large')
                    raw.cells = raw.cells.slice(0, expected)
                } else
                    while (raw.cells.length < expected) {
                        raw.cells.push('#ffffff')
                    }
            }
            const parsed = PixelImage.safeParse(raw)

            if (!parsed.success) {
                return c.json(
                    {
                        error: 'Gemini returned an invalid image',
                        details: parsed.error.issues,
                    },
                    500,
                )
            }

            return c.json(parsed.data)
        },
    )

    return app
}
