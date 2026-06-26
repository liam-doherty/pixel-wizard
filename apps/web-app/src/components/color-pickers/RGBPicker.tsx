import { createEffect, createSignal, type Component } from 'solid-js'
import { hexToRgb, rgbToHex } from '../../helpers/ColorTransforms'
import type { PickerProps } from './IPickerProps'

export const RGBPicker: Component<PickerProps> = (props) => {
    const [red, setRed] = createSignal(hexToRgb(props.selectedColor).r)
    const [green, setGreen] = createSignal(hexToRgb(props.selectedColor).g)
    const [blue, setBlue] = createSignal(hexToRgb(props.selectedColor).b)

    createEffect(() => {
        props.setSelectedColor(rgbToHex(red(), green(), blue()))
    })

    createEffect(() => {
        setRed(hexToRgb(props.selectedColor).r)
        setGreen(hexToRgb(props.selectedColor).g)
        setBlue(hexToRgb(props.selectedColor).b)
    })

    const channel = (
        label: string,
        value: () => number,
        set: (v: number) => void,
        color: string,
    ) => (
        <div class="flex flex-col gap-1">
            <div class="flex justify-between text-xs opacity-70">
                <span class="font-semibold">{label}</span>
                <span class="font-mono">{value()}</span>
            </div>
            <input
                type="range"
                min="0"
                max="255"
                value={value()}
                class="range range-xs"
                style={{ 'accent-color': color }}
                onInput={(e) => set(parseInt(e.currentTarget.value))}
            />
        </div>
    )

    return (
        <div class="flex flex-col gap-3">
            <label class="text-xs font-semibold uppercase tracking-wide opacity-60">
                RGB
            </label>
            {channel('R', red, setRed, '#ef4444')}
            {channel('G', green, setGreen, '#22c55e')}
            {channel('B', blue, setBlue, '#3b82f6')}
        </div>
    )
}
