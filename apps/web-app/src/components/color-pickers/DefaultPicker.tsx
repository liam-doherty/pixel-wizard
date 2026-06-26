import { type Component } from 'solid-js'
import type { PickerProps } from './IPickerProps'

export const DefaultPicker: Component<PickerProps> = (props) => {
    return (
        <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold uppercase tracking-wide opacity-60">
                Color
            </label>
            <input
                type="color"
                value={props.selectedColor}
                class="w-full h-10 rounded cursor-pointer border border-base-300"
                onInput={(e) => props.setSelectedColor(e.currentTarget.value)}
            />
        </div>
    )
}

export default DefaultPicker
