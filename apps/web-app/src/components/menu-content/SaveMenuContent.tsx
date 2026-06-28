import { type Component } from 'solid-js'
import { type PixelImage } from 'common'
import { useMutation } from '@tanstack/solid-query'
import { CANVAS_SIZE } from '../../helpers/Consts'
import MenuContentParent from './MenuContentParent'

interface SaveMenuContentProps {
    cells: string[]
    gridSize: number
}

const SaveMenuContent: Component<SaveMenuContentProps> = (props) => {
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

    const save = () =>
        imageMutation.mutate({
            width: props.gridSize,
            height: props.gridSize,
            cells: props.cells,
        })

    return (
        <MenuContentParent>
            <label class="text-xs font-semibold uppercase tracking-wide opacity-60">
                Save as
            </label>
            {imageMutation.isError && (
                <p class="text-error text-xs">
                    {imageMutation.error?.message ?? 'Save failed'}
                </p>
            )}
            {imageMutation.isSuccess && (
                <p class="text-success text-xs">Saved!</p>
            )}
            <button
                class="btn btn-primary btn-sm"
                disabled={imageMutation.isPending}
                onClick={save}
            >
                {imageMutation.isPending ? 'Saving...' : 'PNG'}
            </button>
        </MenuContentParent>
    )
}

export default SaveMenuContent
