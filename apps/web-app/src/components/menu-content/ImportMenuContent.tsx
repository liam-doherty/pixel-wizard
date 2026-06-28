import { type Component } from 'solid-js'
import { type PixelImage } from 'common'
import { useMutation } from '@tanstack/solid-query'
import { API_BASE_URL } from '../../helpers/Consts'
import MenuContentParent from './MenuContentParent'

interface ImportMenuContentProps {
    gridSize: number
    onLoad: (image: PixelImage) => void
}

const ImportMenuContent: Component<ImportMenuContentProps> = (props) => {
    const uploadMutation = useMutation(() => ({
        mutationFn: (file: File) => {
            const form = new FormData()
            form.append('file', file)
            return fetch(
                `${API_BASE_URL}/images/upload?size=${props.gridSize}`,
                { method: 'POST', body: form },
            ).then((res) => res.json() as Promise<PixelImage>)
        },
        onSuccess: (image: PixelImage) => props.onLoad(image),
    }))

    const onFileChange = (e: Event) => {
        const file = (e.currentTarget as HTMLInputElement).files?.[0]
        if (file) uploadMutation.mutate(file)
    }

    return (
        <MenuContentParent>
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
                    {uploadMutation.error?.message ?? 'Upload failed'}
                </p>
            )}
        </MenuContentParent>
    )
}

export default ImportMenuContent
