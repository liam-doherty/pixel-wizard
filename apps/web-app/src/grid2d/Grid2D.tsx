import { type Component, createSignal, createMemo, Index } from 'solid-js'

const maxGridPixelWidth = 500

interface Grid2DProps {
    selectedColor: string
}

const Grid2D: Component<Grid2DProps> = (props) => {
    const [gridSideLength, setGridSideLength] = createSignal(10)
    const gridTemplateString = createMemo(
        () =>
            `repeat(${gridSideLength()}, ${maxGridPixelWidth / gridSideLength()}px)`,
    )

    return (
        <div
            style={{
                display: 'inline-grid',
                'grid-template-rows': gridTemplateString(),
                'grid-template-columns': gridTemplateString(),
                padding: '8px',
                'background-color': 'white',
            }}
        >
            <Index
                each={Array.from({ length: gridSideLength() ** 2 })}
                fallback={'Input a grid side length.'}
            >
                {(_item, i) => (
                    <div
                        id={'cell' + i}
                        class="cell"
                        style="outline: 1px solid black;"
                        onMouseEnter={(event) => {
                            const eventEl = event.currentTarget

                            eventEl.style.outlineColor = props.selectedColor

                            setTimeout(() => {
                                eventEl.style.outlineColor = 'black'
                            }, 500)
                        }}
                        onClick={(e) => {
                            const eventEl = e.currentTarget

                            eventEl.style.backgroundColor = props.selectedColor
                        }}
                    />
                )}
            </Index>
        </div>
    )
}

export default Grid2D
