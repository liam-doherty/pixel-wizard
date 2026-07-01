import { type Component, createMemo, createSignal, Index } from 'solid-js'
import { CANVAS_SIZE } from '../helpers/Consts'
import { type Tool } from '../helpers/ToolOption'
import { type Brush, getBrushIndices } from '../helpers/Brush'

interface Grid2DProps {
    tool: Tool
    showGrid: boolean
    brush: Brush
    cells: string[]
    gridSize: number
    onColorPick: (color: string) => void
    onSizeChange: (size: number) => void
    onClear: () => void
}

const Grid2D: Component<Grid2DProps> = (props) => {
    const cellSize = createMemo(() => Math.floor(CANVAS_SIZE / props.gridSize))
    const [hoveredIndex, setHoveredIndex] = createSignal<number | null>(null)

    const highlightedSet = createMemo(() => {
        const h = hoveredIndex()
        if (h === null) return new Set<number>()
        return new Set(getBrushIndices(h, props.brush, props.gridSize))
    })

    return (
        <div class="flex flex-col items-center gap-4">
            <div class="flex items-center gap-3">
                <span class="text-sm font-medium w-24">
                    Grid {props.gridSize}×{props.gridSize}
                </span>
                <input
                    type="range"
                    min="4"
                    max="32"
                    value={props.gridSize}
                    class="range range-xs w-36"
                    onInput={(e) =>
                        props.onSizeChange(parseInt(e.currentTarget.value))
                    }
                />
                <button class="btn btn-xs btn-ghost" onClick={props.onClear}>
                    Clear
                </button>
            </div>
            <div
                class="bg-base-200"
                style={{
                    display: 'grid',
                    'grid-template-columns': `repeat(${props.gridSize}, ${cellSize()}px)`,
                    'grid-template-rows': `repeat(${props.gridSize}, ${cellSize()}px)`,
                    cursor: props.tool.cursor,
                    gap: props.showGrid ? '2px' : '0',
                    padding: '8px',
                    'border-radius': '8px',
                }}
                onMouseLeave={() => setHoveredIndex(null)}
            >
                <Index each={props.cells}>
                    {(color, i) => (
                        <div
                            style={{
                                'background-color': color(),
                                width: `${cellSize()}px`,
                                height: `${cellSize()}px`,
                                'border-radius': props.showGrid ? '3px' : '0',
                                'box-shadow': highlightedSet().has(i)
                                    ? 'inset 0 0 0 2px white, inset 0 0 0 3px black'
                                    : undefined,
                            }}
                            onClick={() => {
                                const indices = props.tool.supportsBrush
                                    ? getBrushIndices(i, props.brush, props.gridSize)
                                    : [i]
                                indices.forEach((idx) =>
                                    props.tool.onCellClick(idx),
                                )
                            }}
                            onContextMenu={(e) => {
                                e.preventDefault()
                                props.onColorPick(color())
                            }}
                            onMouseEnter={(e) => {
                                setHoveredIndex(i)
                                if (e.buttons === 1) {
                                    const indices = props.tool.supportsBrush
                                        ? getBrushIndices(i, props.brush, props.gridSize)
                                        : [i]
                                    indices.forEach((idx) =>
                                        props.tool.onCellDrag(idx),
                                    )
                                }
                            }}
                        />
                    )}
                </Index>
            </div>
        </div>
    )
}

export default Grid2D
