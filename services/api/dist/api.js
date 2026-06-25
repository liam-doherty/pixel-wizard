import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
//import type { Player} from 'common'
export function makeApi() {
    const app = new Hono();
    app.get('/', (c) => {
        return c.text('Hello Hono!');
    });
    // app.post(
    //     '/posts',
    //     zValidator(
    //         'form',
    //         z.object({
    //             body: z.string(),
    //         }),
    //     ),
    //     (c) => {
    //         const validated = c.req.valid('form')
    //         // ... use your validated data
    //     },
    // )
    return app;
}
