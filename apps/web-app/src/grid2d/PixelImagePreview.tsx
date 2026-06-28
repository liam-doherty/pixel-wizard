import { type Component, createMemo, Index } from 'solid-js'
import { type PixelImage } from 'common'

const PREVIEW_SIZE = 180

interface PixelImagePreviewProps {
    image: PixelImage
    onClick: () => void
}

const PixelImagePreview: Component<PixelImagePreviewProps> = (props) => {
    const cellSize = createMemo(() =>
        Math.floor(PREVIEW_SIZE / props.image.width),
    )

    return (
        <div
            style={{
                display: 'grid',
                'grid-template-columns': `repeat(${props.image.width}, ${cellSize()}px)`,
                'grid-template-rows': `repeat(${props.image.height}, ${cellSize()}px)`,
                cursor: 'pointer',
                'background-image':
                    'repeating-conic-gradient(#cbd5e1 0% 25%, #f8fafc 0% 50%)',
                'background-size': '8px 8px',
            }}
            onClick={props.onClick}
        >
            <Index each={props.image.cells}>
                {(color) => (
                    <div
                        style={{
                            'background-color': color(),
                            width: `${cellSize()}px`,
                            height: `${cellSize()}px`,
                        }}
                    />
                )}
            </Index>
        </div>
    )
}

export default PixelImagePreview
