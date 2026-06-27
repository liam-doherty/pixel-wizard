import { type Component, createMemo, Index } from 'solid-js'
import { CANVAS_SIZE } from '../helpers/Consts'

interface Grid2DProps {
    selectedColor: string
    cells: string[]
    gridSize: number
    onPaint: (index: number, color: string) => void
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
                style={{
                    display: 'grid',
                    'grid-template-columns': `repeat(${props.gridSize}, ${cellSize()}px)`,
                    'grid-template-rows': `repeat(${props.gridSize}, ${cellSize()}px)`,
                    cursor: 'crosshair',
                    border: '1px solid oklch(var(--bc) / 0.3)',
                    'background-image':
                        'repeating-conic-gradient(#cbd5e1 0% 25%, #f8fafc 0% 50%)',
                    'background-size': '16px 16px',
                }}
            >
                <Index each={props.cells}>
                    {(color, i) => (
                        <div
                            style={{
                                'background-color': color(),
                                width: `${cellSize()}px`,
                                height: `${cellSize()}px`,
                                'border-right': '1px solid black',
                                'border-bottom': '1px solid black',
                            }}
                            onClick={() =>
                                props.onPaint(i, props.selectedColor)
                            }
                            onMouseEnter={(e) => {
                                if (e.buttons === 1)
                                    props.onPaint(i, props.selectedColor)
                            }}
                        />
                    )}
                </Index>
            </div>
        </div>
    )
}

export default Grid2D
