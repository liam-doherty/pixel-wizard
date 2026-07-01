export function floodFill(
    cells: readonly string[],
    startIndex: number,
    fillColor: string,
    gridSize: number,
): string[] {
    const targetColor = cells[startIndex]
    if (targetColor === fillColor) return [...cells]

    const next = [...cells]
    const visited = new Set<number>()
    const queue = [startIndex]

    while (queue.length > 0) {
        const idx = queue.shift()!
        if (visited.has(idx) || next[idx] !== targetColor) continue

        visited.add(idx)
        next[idx] = fillColor

        const row = Math.floor(idx / gridSize)
        const col = idx % gridSize

        if (col > 0) queue.push(idx - 1)
        if (col < gridSize - 1) queue.push(idx + 1)
        if (row > 0) queue.push(idx - gridSize)
        if (row < gridSize - 1) queue.push(idx + gridSize)
    }

    return next
}
