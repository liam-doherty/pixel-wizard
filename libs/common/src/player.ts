import * as z from 'zod'

const Player = z.object({
    color: z.string(),
})

export type Player = z.infer<typeof Player>
