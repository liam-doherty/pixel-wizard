import { createSignal, type Component } from 'solid-js'
import { type PixelImage } from 'common'
import { useMutation } from '@tanstack/solid-query'
import MenuContentParent from './MenuContentParent'

interface AiMenuContentProps {
    gridSize: number
    onLoad: (image: PixelImage) => void
}

const AiMenuContent: Component<AiMenuContentProps> = (props) => {
    const [description, setDescription] = createSignal('')

    const generateMutation = useMutation(() => ({
        mutationFn: () =>
            fetch('http://localhost:3000/images/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    description: description().trim(),
                    size: props.gridSize,
                }),
            }).then((res) => {
                if (!res.ok) throw new Error('Generation failed')
                return res.json() as Promise<PixelImage>
            }),
        onSuccess: (image: PixelImage) => props.onLoad(image),
    }))

    return (
        <MenuContentParent>
            <label class="text-xs font-semibold uppercase tracking-wide opacity-60">
                Generate
            </label>
            <textarea
                class="textarea textarea-sm w-full resize-none"
                rows={4}
                placeholder="Describe your pixel art..."
                maxLength={500}
                disabled={generateMutation.isPending}
                value={description()}
                onInput={(e) => setDescription(e.currentTarget.value)}
            />
            {generateMutation.isError && (
                <p class="text-error text-xs">
                    {generateMutation.error?.message ?? 'Generation failed'}
                </p>
            )}
            <button
                class="btn btn-primary btn-sm"
                disabled={generateMutation.isPending || !description().trim()}
                onClick={() => generateMutation.mutate()}
            >
                {generateMutation.isPending ? 'Generating...' : 'Generate'}
            </button>
        </MenuContentParent>
    )
}

export default AiMenuContent
