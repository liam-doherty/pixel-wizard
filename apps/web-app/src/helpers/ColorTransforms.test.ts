import { describe, it, expect } from 'vitest'
import { hexToRgb, rgbToHex } from './ColorTransforms.js'

describe('Color transform helpers', () => {
    it('should convert to hex', () => {
        expect(rgbToHex(18, 196, 54)).toBe('#12c436')
    })

    it('should convert to rgb', () => {
        expect(hexToRgb('#12c436')).toEqual({ r: 18, g: 196, b: 54, a: 255 })
    })
})
