import { createEffect, For, Show, type Component } from 'solid-js'
import { type SetStoreFunction } from 'solid-js/store'
import { type PixelImage } from 'common'
import { useQuery } from '@tanstack/solid-query'
import PixelImagePreview from '../../grid2d/PixelImagePreview'

interface SamplesMenuContentProps {
    currentImage: PixelImage
    onLoad: (image: PixelImage) => void
    store: PixelImage[]
    setStore: SetStoreFunction<PixelImage[]>
}

const SamplesMenuContent: Component<SamplesMenuContentProps> = (props) => {
    const samplesQuery = useQuery(() => ({
        queryKey: ['samples'],
        queryFn: () =>
            fetch('http://localhost:3000/images/samples').then(
                (res) => res.json() as Promise<PixelImage[]>,
            ),
    }))

    createEffect(() => {
        if (samplesQuery.data) props.setStore(samplesQuery.data)
    })

    return (
        <div class="card bg-base-200 w-56 shrink-0 self-stretch">
            <div class="card-body gap-4 p-4 flex flex-col h-full min-h-0">
                <label class="text-xs font-semibold uppercase tracking-wide opacity-60 shrink-0">
                    Collection
                </label>
                <button
                    class="btn btn-sm btn-primary w-full shrink-0"
                    onClick={() =>
                        props.setStore(props.store.length, props.currentImage)
                    }
                >
                    Save current image
                </button>
                <Show when={samplesQuery.isLoading}>
                    <span class="loading loading-spinner loading-sm shrink-0" />
                </Show>
                <Show when={samplesQuery.isError}>
                    <p class="text-error text-xs shrink-0">
                        Failed to load samples
                    </p>
                </Show>
                <div class="flex flex-col gap-4 overflow-y-auto flex-1 min-h-0">
                    <For each={props.store}>
                        {(image, i) => (
                            <div class="relative group rounded hover:ring-2 hover:ring-primary transition-all">
                                <PixelImagePreview
                                    image={image}
                                    onClick={() => props.onLoad(image)}
                                />
                                <button
                                    class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity btn btn-xs btn-circle btn-error"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        props.setStore((s) =>
                                            s.filter((_, idx) => idx !== i()),
                                        )
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </For>
                </div>
            </div>
        </div>
    )
}

export default SamplesMenuContent
