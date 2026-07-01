import { createMemo, createSignal, Show } from 'solid-js'
import { createStore } from 'solid-js/store'

import './App.css'
import { type PixelImage } from 'common'

import Layout from './Layout'
import Grid2D from './grid2d/Grid2D'
import SideMenu from './components/SideMenu'
import Toolbar from './components/Toolbar'
import { type Tool, ToolOption } from './helpers/ToolOption'
import { floodFill } from './helpers/floodFill'
import ColorMenuContent from './components/menu-content/ColorMenuContent'
import ImportMenuContent from './components/menu-content/ImportMenuContent'
import AiMenuContent from './components/menu-content/AiMenuContent'
import SaveMenuContent from './components/menu-content/SaveMenuContent'
import SamplesMenuContent from './components/menu-content/SamplesMenuContent'

const DEFAULT_SIZE = 16

export enum MenuOption {
    Color,
    Image,
    Ai,
    Save,
    Samples,
}

function App() {
    const [selectedMenuItem, setSelectedMenuItem] = createSignal(
        MenuOption.Color,
    )
    const [selectedColor, setSelectedColor] = createSignal('#000000')
    const [gridSize, setGridSize] = createSignal(DEFAULT_SIZE)
    const [cells, setCells] = createSignal<string[]>(
        Array(DEFAULT_SIZE ** 2).fill('#ffffff'),
    )
    const [samplesStore, setSamplesStore] = createStore<PixelImage[]>([])
    const [selectedTool, setSelectedTool] = createSignal(ToolOption.Draw)
    const [showGrid, setShowGrid] = createSignal(true)

    const paint = (index: number, color: string) => {
        setCells((prev) => {
            const next = [...prev]
            next[index] = color
            return next
        })
    }

    const fill = (index: number, color: string) => {
        setCells((prev) => floodFill(prev, index, color, gridSize()))
    }

    const currentTool = createMemo((): Tool => {
        const color = selectedColor()
        switch (selectedTool()) {
            case ToolOption.Draw:
                return {
                    onCellClick: (i) => paint(i, color),
                    onCellDrag: (i) => paint(i, color),
                    cursor: 'crosshair',
                }
            case ToolOption.Erase:
                return {
                    onCellClick: (i) => paint(i, '#ffffff'),
                    onCellDrag: (i) => paint(i, '#ffffff'),
                    cursor: 'cell',
                }
            case ToolOption.Fill:
                return {
                    onCellClick: (i) => fill(i, color),
                    onCellDrag: () => {},
                    cursor: 'crosshair',
                }
        }
    })

    const changeSize = (size: number) => {
        setGridSize(size)
        setCells(Array(size ** 2).fill('#ffffff'))
    }

    const loadImage = (image: PixelImage) => {
        setGridSize(image.width)
        setCells(image.cells)
    }

    return (
        <Layout>
            <SideMenu
                selectedMenuOption={selectedMenuItem()}
                setSelectedMenuOption={setSelectedMenuItem}
            />
            <div class="flex flex-1 gap-4 p-4 min-h-0">
                <Show when={selectedMenuItem() === MenuOption.Color}>
                    <ColorMenuContent
                        selectedColor={selectedColor()}
                        setSelectedColor={setSelectedColor}
                    />
                </Show>

                <Show when={selectedMenuItem() === MenuOption.Image}>
                    <ImportMenuContent
                        gridSize={gridSize()}
                        onLoad={loadImage}
                    />
                </Show>

                <Show when={selectedMenuItem() === MenuOption.Ai}>
                    <AiMenuContent gridSize={gridSize()} onLoad={loadImage} />
                </Show>

                <Show when={selectedMenuItem() === MenuOption.Save}>
                    <SaveMenuContent cells={cells()} gridSize={gridSize()} />
                </Show>

                <Show when={selectedMenuItem() === MenuOption.Samples}>
                    <SamplesMenuContent
                        currentImage={{
                            width: gridSize(),
                            height: gridSize(),
                            cells: cells(),
                        }}
                        onLoad={loadImage}
                        store={samplesStore}
                        setStore={setSamplesStore}
                    />
                </Show>

                <div class="flex flex-col flex-1 items-center gap-4 min-h-0">
                    <Toolbar
                        selectedTool={selectedTool()}
                        setSelectedTool={setSelectedTool}
                        showGrid={showGrid()}
                        onToggleGrid={() => setShowGrid((v) => !v)}
                    />
                    <div class="flex flex-1 items-center justify-center w-full min-h-0">
                    <Grid2D
                        tool={currentTool()}
                        showGrid={showGrid()}
                        cells={cells()}
                        gridSize={gridSize()}
                        onColorPick={setSelectedColor}
                        onSizeChange={changeSize}
                        onClear={() =>
                            setCells(Array(gridSize() ** 2).fill('#ffffff'))
                        }
                    />
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default App
