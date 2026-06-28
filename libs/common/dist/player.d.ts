import * as z from 'zod';
export declare const Player: z.ZodObject<{
    color: z.ZodString;
}, z.core.$strip>;
export type Player = z.infer<typeof Player>;
export declare const PixelImage: z.ZodObject<{
    width: z.ZodNumber;
    height: z.ZodNumber;
    cells: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type PixelImage = z.infer<typeof PixelImage>;
