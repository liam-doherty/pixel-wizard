export enum ToolOption {
    Draw,
    Erase,
    Fill,
}

export interface Tool {
    onCellClick: (index: number) => void
    onCellDrag: (index: number) => void
    cursor: string
    supportsBrush: boolean
}
