import { For } from 'solid-js'
import { ToolOption } from '../helpers/ToolOption'
import { BRUSHES, type Brush } from '../helpers/Brush'

interface ToolbarProps {
    selectedTool: ToolOption
    setSelectedTool: (tool: ToolOption) => void
    showGrid: boolean
    onToggleGrid: () => void
    selectedBrush: Brush
    setSelectedBrush: (brush: Brush) => void
}

const ToolbarButton = (props: {
    icon: string
    title: string
    active?: boolean
    onClick?: () => void
}) => (
    <button
        class={`btn btn-ghost btn-sm btn-square${props.active ? ' btn-active' : ''}`}
        title={props.title}
        onClick={props.onClick}
    >
        <i class={`fa-solid ${props.icon} text-base`} />
    </button>
)

const Divider = () => <div class="w-px h-5 bg-base-300 mx-1" />

const Toolbar = (props: ToolbarProps) => {
    return (
        <div class="card bg-base-200 h-fit">
            <div class="flex items-center gap-1 px-3 py-2">
                <ToolbarButton
                    icon="fa-pencil"
                    title="Draw"
                    active={props.selectedTool === ToolOption.Draw}
                    onClick={() => props.setSelectedTool(ToolOption.Draw)}
                />
                <ToolbarButton
                    icon="fa-eraser"
                    title="Erase"
                    active={props.selectedTool === ToolOption.Erase}
                    onClick={() => props.setSelectedTool(ToolOption.Erase)}
                />
                <ToolbarButton
                    icon="fa-fill-drip"
                    title="Fill"
                    active={props.selectedTool === ToolOption.Fill}
                    onClick={() => props.setSelectedTool(ToolOption.Fill)}
                />
                <Divider />
                <ToolbarButton
                    icon="fa-table-cells"
                    title="Toggle Grid"
                    active={props.showGrid}
                    onClick={props.onToggleGrid}
                />
                <Divider />
                <select
                    class="select select-sm select-ghost"
                    value={props.selectedBrush.id}
                    disabled={props.selectedTool === ToolOption.Fill}
                    onChange={(e) =>
                        props.setSelectedBrush(
                            BRUSHES.find(
                                (b) => b.id === e.currentTarget.value,
                            )!,
                        )
                    }
                >
                    <For each={BRUSHES}>
                        {(b) => <option value={b.id}>{b.label}</option>}
                    </For>
                </select>
            </div>
        </div>
    )
}

export default Toolbar
