import * as z from 'zod';
declare const Player: z.ZodObject<{
    color: z.ZodString;
}, z.core.$strip>;
export type Player = z.infer<typeof Player>;
export {};
