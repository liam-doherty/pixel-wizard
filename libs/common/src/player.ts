import * as z from 'zod'

export const Player = z.object({
    color: z.string(),
})
export type Player = z.infer<typeof Player>

const HexColor = z.string().regex(/^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/)

export const PixelImage = z
    .object({
        width: z.number().int().min(4).max(32),
        height: z.number().int().min(4).max(32),
        cells: z.array(HexColor),
    })
    .refine((d) => d.cells.length === d.width * d.height, {
        message: 'cells.length must equal width × height',
    })

export type PixelImage = z.infer<typeof PixelImage>
