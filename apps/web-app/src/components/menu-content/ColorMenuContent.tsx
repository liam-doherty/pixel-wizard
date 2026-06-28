import { type Component } from 'solid-js'
import { PickerProps } from '../color-pickers/IPickerProps'
import DefaultPicker from '../color-pickers/DefaultPicker'
import { RGBPicker } from '../color-pickers/RGBPicker'
import { FavouritePicker } from '../color-pickers/FavouritePicker'
import MenuContentParent from './MenuContentParent'

export const ColorMenuContent: Component<PickerProps> = (props) => {
    return (
        <MenuContentParent>
            <DefaultPicker
                selectedColor={props.selectedColor}
                setSelectedColor={props.setSelectedColor}
            />
            <div class="divider my-0" />
            <RGBPicker
                selectedColor={props.selectedColor}
                setSelectedColor={props.setSelectedColor}
            />
            <div class="divider my-0" />
            <FavouritePicker
                selectedColor={props.selectedColor}
                setSelectedColor={props.setSelectedColor}
            />
            <div class="divider my-0" />
            <div class="flex items-center gap-2">
                <div
                    class="w-6 h-6 rounded border border-base-300 shrink-0"
                    style={{
                        'background-color': props.selectedColor,
                    }}
                />
                <span class="text-xs font-mono">{props.selectedColor}</span>
            </div>
        </MenuContentParent>
    )
}

export default ColorMenuContent
