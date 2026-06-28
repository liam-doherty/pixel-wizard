import { createSignal, Show } from 'solid-js'
import { createStore } from 'solid-js/store'

import './App.css'
import { type PixelImage } from 'common'

import Layout from './Layout'
import Grid2D from './grid2d/Grid2D'
import SideMenu from './components/SideMenu'
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

    const paint = (index: number, color: string) => {
        setCells((prev) => {
            const next = [...prev]
            next[index] = color
            return next
        })
    }

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

                <div class="flex flex-1 items-center justify-center">
                    <Grid2D
                        selectedColor={selectedColor()}
                        cells={cells()}
                        gridSize={gridSize()}
                        onPaint={paint}
                        onColorPick={setSelectedColor}
                        onSizeChange={changeSize}
                        onClear={() =>
                            setCells(Array(gridSize() ** 2).fill('#ffffff'))
                        }
                    />
                </div>
            </div>
        </Layout>
    )
}

export default App
