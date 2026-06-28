import { createSignal, Show } from 'solid-js'

import './App.css'
import { type PixelImage } from 'common'

import Layout from './Layout'
import Grid2D from './grid2d/Grid2D'
import { DefaultPicker } from './components/color-pickers/DefaultPicker'
import { useMutation } from '@tanstack/solid-query'
import SideMenu from './components/SideMenu'
import { RGBPicker } from './components/color-pickers/RGBPicker'
import { FavouritePicker } from './components/color-pickers/FavouritePicker'
import { CANVAS_SIZE } from './helpers/Consts'

const DEFAULT_SIZE = 16

export enum MenuOption {
    Color,
    Image,
    Ai,
    Save,
}

function App() {
    const [selectedMenuItem, setSelectedMenuItem] = createSignal(
        MenuOption.Color,
    )
    const [selectedColor, setSelectedColor] = createSignal('#000000')
    const [aiDescription, setAiDescription] = createSignal('')
    const [gridSize, setGridSize] = createSignal(DEFAULT_SIZE)
    const [cells, setCells] = createSignal<string[]>(
        Array(DEFAULT_SIZE ** 2).fill('#ffffff'),
    )

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

    const imageMutation = useMutation(() => ({
        mutationFn: (image: PixelImage) => {
            const scale = Math.floor(CANVAS_SIZE / image.width)
            return fetch(`http://localhost:3000/images/png?scale=${scale}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(image),
            }).then((res) => res.blob())
        },
        onSuccess: (blob: Blob) => {
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'pixel-image.png'
            a.click()
            URL.revokeObjectURL(url)
        },
    }))

    const generateMutation = useMutation(() => ({
        mutationFn: ({
            description,
            size,
        }: {
            description: string
            size: number
        }) =>
            fetch('http://localhost:3000/images/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description, size }),
            }).then((res) => {
                if (!res.ok) throw new Error('Generation failed')
                return res.json() as Promise<PixelImage>
            }),
        onSuccess: (image: PixelImage) => loadImage(image),
    }))

    const uploadMutation = useMutation(() => ({
        mutationFn: (file: File) => {
            const form = new FormData()
            form.append('file', file)
            return fetch(
                `http://localhost:3000/images/upload?size=${gridSize()}`,
                { method: 'POST', body: form },
            ).then((res) => res.json() as Promise<PixelImage>)
        },
        onSuccess: (image: PixelImage) => loadImage(image),
    }))

    const saveImage = () => {
        imageMutation.mutate({
            width: gridSize(),
            height: gridSize(),
            cells: cells(),
        })
    }

    const onFileChange = (e: Event) => {
        const file = (e.currentTarget as HTMLInputElement).files?.[0]
        if (file) uploadMutation.mutate(file)
    }

    return (
        <Layout>
            <SideMenu
                selectedMenuOption={selectedMenuItem()}
                setSelectedMenuOption={setSelectedMenuItem}
            />
            <div class="flex flex-1 gap-4 p-4">
                <Show when={selectedMenuItem() === MenuOption.Color}>
                    <div class="card bg-base-200 w-56 shrink-0 h-fit">
                        <div class="card-body gap-5 p-4">
                            <DefaultPicker
                                selectedColor={selectedColor()}
                                setSelectedColor={setSelectedColor}
                            />
                            <div class="divider my-0" />
                            <RGBPicker
                                selectedColor={selectedColor()}
                                setSelectedColor={setSelectedColor}
                            />
                            <div class="divider my-0" />
                            <FavouritePicker
                                selectedColor={selectedColor()}
                                setSelectedColor={setSelectedColor}
                            />
                            <div class="divider my-0" />
                            <div class="flex items-center gap-2">
                                <div
                                    class="w-6 h-6 rounded border border-base-300 shrink-0"
                                    style={{
                                        'background-color': selectedColor(),
                                    }}
                                />
                                <span class="text-xs font-mono">
                                    {selectedColor()}
                                </span>
                            </div>
                        </div>
                    </div>
                </Show>

                <Show when={selectedMenuItem() === MenuOption.Image}>
                    <div class="card bg-base-200 w-56 shrink-0 h-fit">
                        <div class="card-body gap-5 p-4">
                            {imageMutation.isError && (
                                <p class="text-error text-xs">
                                    {imageMutation.error?.message ??
                                        'Save failed'}
                                </p>
                            )}
                            {imageMutation.isSuccess && (
                                <p class="text-success text-xs">Saved!</p>
                            )}
                            <label class="text-xs font-semibold uppercase tracking-wide opacity-60">
                                Import image
                            </label>
                            <input
                                type="file"
                                accept="image/png,image/jpeg"
                                class="file-input file-input-sm w-full"
                                disabled={uploadMutation.isPending}
                                onChange={onFileChange}
                            />
                            {uploadMutation.isError && (
                                <p class="text-error text-xs">
                                    {uploadMutation.error?.message ??
                                        'Upload failed'}
                                </p>
                            )}
                        </div>
                    </div>
                </Show>

                <Show when={selectedMenuItem() === MenuOption.Ai}>
                    <div class="card bg-base-200 w-56 shrink-0 h-fit">
                        <div class="card-body gap-5 p-4">
                            <label class="text-xs font-semibold uppercase tracking-wide opacity-60">
                                Generate
                            </label>
                            <textarea
                                class="textarea textarea-sm w-full resize-none"
                                rows={4}
                                placeholder="Describe your pixel art..."
                                maxLength={500}
                                disabled={generateMutation.isPending}
                                value={aiDescription()}
                                onInput={(e) =>
                                    setAiDescription(e.currentTarget.value)
                                }
                            />
                            {generateMutation.isError && (
                                <p class="text-error text-xs">
                                    {generateMutation.error?.message ??
                                        'Generation failed'}
                                </p>
                            )}
                            <button
                                class="btn btn-primary btn-sm"
                                disabled={
                                    generateMutation.isPending ||
                                    !aiDescription().trim()
                                }
                                onClick={() =>
                                    generateMutation.mutate({
                                        description: aiDescription().trim(),
                                        size: gridSize(),
                                    })
                                }
                            >
                                {generateMutation.isPending
                                    ? 'Generating...'
                                    : 'Generate'}
                            </button>
                        </div>
                    </div>
                </Show>

                <Show when={selectedMenuItem() === MenuOption.Save}>
                    <div class="card bg-base-200 w-56 shrink-0 h-fit">
                        <div class="card-body gap-5 p-4">
                            <label class="text-xs font-semibold uppercase tracking-wide opacity-60">
                                Save as
                            </label>
                            <button
                                class="btn btn-primary btn-sm"
                                disabled={imageMutation.isPending}
                                onClick={saveImage}
                            >
                                {imageMutation.isPending ? 'Saving...' : 'PNG'}
                            </button>
                        </div>
                    </div>
                </Show>

                <div class="flex flex-1 items-center justify-center">
                    <Grid2D
                        selectedColor={selectedColor()}
                        cells={cells()}
                        gridSize={gridSize()}
                        onPaint={paint}
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
