export type BrushOffset = { dr: number; dc: number }

export interface Brush {
    id: string
    label: string
    offsets: BrushOffset[]
}

export function getBrushIndices(
    centerIndex: number,
    brush: Brush,
    gridSize: number,
): number[] {
    const row = Math.floor(centerIndex / gridSize)
    const col = centerIndex % gridSize
    const indices: number[] = []
    for (const { dr, dc } of brush.offsets) {
        const tr = row + dr
        const tc = col + dc
        if (tr >= 0 && tr < gridSize && tc >= 0 && tc < gridSize) {
            indices.push(tr * gridSize + tc)
        }
    }
    return indices
}

const box = (r: number): BrushOffset[] => {
    const offsets: BrushOffset[] = []
    for (let dr = -r; dr <= r; dr++)
        for (let dc = -r; dc <= r; dc++) offsets.push({ dr, dc })
    return offsets
}

export const BRUSHES: Brush[] = [
    { id: 'single', label: 'Single', offsets: [{ dr: 0, dc: 0 }] },
    { id: 'box3', label: '3×3 Box', offsets: box(1) },
    {
        id: 'cross',
        label: 'Cross',
        offsets: [
            { dr: 0, dc: 0 },
            { dr: -1, dc: 0 },
            { dr: 1, dc: 0 },
            { dr: 0, dc: -1 },
            { dr: 0, dc: 1 },
        ],
    },
    {
        id: 'x-shape',
        label: 'X Shape',
        offsets: [
            { dr: 0, dc: 0 },
            { dr: -1, dc: -1 },
            { dr: -1, dc: 1 },
            { dr: 1, dc: -1 },
            { dr: 1, dc: 1 },
        ],
    },
    { id: 'box5', label: '5×5 Box', offsets: box(2) },
]
