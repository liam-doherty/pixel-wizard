import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { zValidator } from '@hono/zod-validator';
import { Player, PixelImage } from 'common';
import sharp from 'sharp';
import * as z from 'zod';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export function makeApi() {
    const app = new Hono();
    app.use(cors());
    app.get('/', (c) => {
        return c.text('Hello Hono!');
    });
    app.post('/posts', zValidator('json', Player), (c) => {
        const validated = c.req.valid('json');
        return c.json({ message: 'valid!', color: validated.color });
    });
    app.post('/images', zValidator('json', PixelImage), (c) => {
        const image = c.req.valid('json');
        return c.json(image);
    });
    app.post('/images/png', zValidator('query', z.object({ scale: z.coerce.number().int().min(1).max(64).default(1) })), zValidator('json', PixelImage), async (c) => {
        const { scale } = c.req.valid('query');
        const { width, height, cells } = c.req.valid('json');
        const raw = Buffer.alloc(width * height * 4);
        for (let i = 0; i < cells.length; i++) {
            const hex = cells[i].slice(1);
            raw[i * 4] = parseInt(hex.slice(0, 2), 16);
            raw[i * 4 + 1] = parseInt(hex.slice(2, 4), 16);
            raw[i * 4 + 2] = parseInt(hex.slice(4, 6), 16);
            raw[i * 4 + 3] = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) : 255;
        }
        const png = await sharp(raw, { raw: { width, height, channels: 4 } })
            .resize(width * scale, height * scale, { kernel: 'nearest' })
            .png()
            .toBuffer();
        return new Response(new Uint8Array(png), {
            headers: {
                'Content-Type': 'image/png',
                'Content-Disposition': 'attachment; filename="pixel-image.png"',
            },
        });
    });
    app.post('/images/upload', zValidator('query', z.object({ size: z.coerce.number().int().min(4).max(32) })), async (c) => {
        const { size } = c.req.valid('query');
        const body = await c.req.parseBody();
        const file = body['file'];
        if (!(file instanceof File)) {
            return c.json({ error: 'No file uploaded' }, 400);
        }
        if (file.size > MAX_FILE_SIZE) {
            return c.json({ error: 'File exceeds 5 MB limit' }, 413);
        }
        const buffer = Buffer.from(await file.arrayBuffer());
        const { data } = await sharp(buffer)
            .resize(size, size, { fit: 'cover' })
            .raw()
            .toBuffer({ resolveWithObject: true });
        const cells = [];
        for (let i = 0; i < size * size; i++) {
            const r = data[i * 3];
            const g = data[i * 3 + 1];
            const b = data[i * 3 + 2];
            cells.push('#' +
                r.toString(16).padStart(2, '0') +
                g.toString(16).padStart(2, '0') +
                b.toString(16).padStart(2, '0'));
        }
        const image = {
            width: size,
            height: size,
            cells,
        };
        return c.json(image);
    });
    return app;
}
//# sourceMappingURL=api.js.map