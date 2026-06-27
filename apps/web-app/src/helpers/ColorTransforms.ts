export function hexToRgb(hex: string) {
    hex = hex.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    const a = hex.length === 8 ? parseInt(hex.substring(6, 8), 16) : 255
    return { r, g, b, a }
}

export const rgbToHex = (r: number, g: number, b: number, a = 255) => {
    const toHex = (num: number) => num.toString(16).padStart(2, '0')
    const base = `#${toHex(r)}${toHex(g)}${toHex(b)}`
    return a < 255 ? `${base}${toHex(a)}` : base
}
