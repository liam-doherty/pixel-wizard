import { type Component, createMemo, Index } from 'solid-js'
import { CANVAS_SIZE } from '../helpers/Consts'
import { type Tool } from '../helpers/ToolOption'

interface Grid2DProps {
    tool: Tool
    showGrid: boolean
    cells: string[]
    gridSize: number
    onColorPick: (color: string) => void
    onSizeChange: (size: number) => void
    onClear: () => void
}

const Grid2D: Component<Grid2DProps> = (props) => {
    const cellSize = createMemo(() => Math.floor(CANVAS_SIZE / props.gridSize))

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
            >
                <Index each={props.cells}>
                    {(color, i) => (
                        <div
                            class="transition duration-300 ease-in-out hover:translate-y-0 hover:scale-110"
                            style={{
                                'background-color': color(),
                                width: `${cellSize()}px`,
                                height: `${cellSize()}px`,
                                'border-radius': props.showGrid ? '3px' : '0',
                            }}
                            onClick={() => props.tool.onCellClick(i)}
                            onContextMenu={(e) => {
                                e.preventDefault()
                                props.onColorPick(color())
                            }}
                            onMouseEnter={(e) => {
                                if (e.buttons === 1) props.tool.onCellDrag(i)
                            }}
                        />
                    )}
                </Index>
            </div>
        </div>
    )
}

export default Grid2D
