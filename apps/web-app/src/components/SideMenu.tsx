import { type Component } from 'solid-js'
import { MenuOption } from '../App'

interface SideMenuProps {
    selectedMenuOption: MenuOption
    setSelectedMenuOption(val: MenuOption): void
}

export const SideMenu: Component<SideMenuProps> = (props) => {
    return (
        <ul class="menu bg-base-200 gap-4">
            <li>
                <a
                    class="flex flex-col h-auto"
                    onClick={() =>
                        props.setSelectedMenuOption(MenuOption.Color)
                    }
                >
                    <i
                        class="fa-solid fa-palette fa-xl"
                        style="line-height: 20px;"
                    ></i>
                    <label class="text-xs font-semibold uppercase tracking-wide opacity-60">
                        Color
                    </label>
                </a>
            </li>
            <li>
                <a
                    class="flex flex-col h-auto"
                    onClick={() =>
                        props.setSelectedMenuOption(MenuOption.Image)
                    }
                >
                    <i
                        class="fa-solid fa-image fa-xl"
                        style="line-height: 20px;"
                    ></i>
                    <label class="text-xs font-semibold uppercase tracking-wide opacity-60">
                        Image
                    </label>
                </a>
            </li>
            <li>
                <a
                    class="flex flex-col h-auto"
                    onClick={() => props.setSelectedMenuOption(MenuOption.Ai)}
                >
                    <i
                        class="fa-solid fa-robot fa-xl"
                        style="line-height: 20px;"
                    ></i>
                    <label class="text-xs font-semibold uppercase tracking-wide opacity-60">
                        Generate
                    </label>
                </a>
            </li>
        </ul>
    )
}

export default SideMenu
