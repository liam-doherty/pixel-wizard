import { ToolOption } from '../helpers/ToolOption'

interface ToolbarProps {
    selectedTool: ToolOption
    setSelectedTool: (tool: ToolOption) => void
    showGrid: boolean
    onToggleGrid: () => void
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
                {/* <Divider />
                <ToolbarButton icon="fa-rotate-left" title="Undo" />
                <ToolbarButton icon="fa-rotate-right" title="Redo" />
                <Divider />
                <ToolbarButton
                    icon="fa-magnifying-glass-plus"
                    title="Zoom In"
                />
                <ToolbarButton
                    icon="fa-magnifying-glass-minus"
                    title="Zoom Out"
                /> */}
                <Divider />
                <ToolbarButton
                    icon="fa-table-cells"
                    title="Toggle Grid"
                    active={props.showGrid}
                    onClick={props.onToggleGrid}
                />
                {/* <ToolbarButton icon="fa-eye" title="Preview" /> */}
            </div>
        </div>
    )
}

export default Toolbar
