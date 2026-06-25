import { createEffect, createSignal, type Component } from 'solid-js'

interface PickerProps {
    selectedColor: string
    setSelectedColor(val: string): void
}

export const DefaultPicker: Component<PickerProps> = (props) => {
    return (
        <input
            type="color"
            value={props.selectedColor}
            onInput={(e) => props.setSelectedColor(e.currentTarget.value)}
        ></input>
    )
}

function hexToRgb(hex: string) {
    // Remove the hash if it's there
    hex = hex.replace('#', '')

    // Extract channels and parse as base-16 integers
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)

    return { r, g, b }
}

const rgbToHex = (r: number, g: number, b: number) => {
    const toHex = (num: number) => num.toString(16).padStart(2, '0')
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export const RGBPicker: Component<PickerProps> = (props) => {
    const [red, setRed] = createSignal(hexToRgb(props.selectedColor).r)
    const [blue, setBlue] = createSignal(hexToRgb(props.selectedColor).g)
    const [green, setGreen] = createSignal(hexToRgb(props.selectedColor).b)

    createEffect(() => {
        props.setSelectedColor(rgbToHex(red(), green(), blue()))
    })

    //update sliders when changing from different picker
    createEffect(() => {
        setRed(hexToRgb(props.selectedColor).r)
        setGreen(hexToRgb(props.selectedColor).g)
        setBlue(hexToRgb(props.selectedColor).b)
    })

    return (
        <>
            <input
                type="range"
                min="0"
                max="255"
                value={red()}
                class={
                    'range range-xs [--range-bg:' + rgbToHex(red(), 0, 0) + ']' //not working
                }
                onInput={(e) => setRed(parseInt(e.currentTarget.value))}
            />
            <input
                type="range"
                min="0"
                max="255"
                value={green()}
                class="range range-xs"
                onInput={(e) => setGreen(parseInt(e.currentTarget.value))}
            />
            <input
                type="range"
                min="0"
                max="255"
                value={blue()}
                class="range range-xs"
                onInput={(e) => setBlue(parseInt(e.currentTarget.value))}
            />
        </>
    )
}

export default DefaultPicker
