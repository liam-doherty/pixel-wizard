//Breadth First Search (BFS) implementation
export function floodFill(
    cells: readonly string[],
    startIndex: number,
    fillColor: string,
    gridSize: number,
): string[] {
    //the original color of the clicked cell
    const targetColor = cells[startIndex]

    //dont do anything if the clicked cell is the same as our fill color
    if (targetColor === fillColor) return [...cells]

    let iterations = 0
    const next = [...cells] //copy the original
    const visited = new Set<number>() //keep track of cells we have checked
    const queue = [startIndex] //initialise the queue with our starting cell pos

    //BFS Loop
    while (queue.length > 0) {
        const idx = queue.shift()! //guaranteed to be a number

        //skip if we have already visited the cell, or the cells color
        //does not match the original color (hitting a wall)
        if (visited.has(idx) || next[idx] !== targetColor) continue

        visited.add(idx) //mark cell as visited
        next[idx] = fillColor //set cells color

        const row = Math.floor(idx / gridSize)
        const col = idx % gridSize

        //add the neighbour cells to the queue
        if (col > 0) queue.push(idx - 1) //left
        if (col < gridSize - 1) queue.push(idx + 1) //right
        if (row > 0) queue.push(idx - gridSize) //up
        if (row < gridSize - 1) queue.push(idx + gridSize) //down
    }

    return next
}
