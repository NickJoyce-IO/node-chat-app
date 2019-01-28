const expect = require('expect')

const {isRealString} = require('./validation')

describe('isRealString', () => {
    it('should reject non-string values', () => {
        const res = isRealString(99)
        expect(res).toBe(false)
    })
    it('should rehect string with only spaces', () => {
        const res = isRealString('    ')
        expect(res).toBe(false)
    })
    it('should allow string with non-space characters', () => {
        const res = isRealString('  Nick  ')
        expect(res).toBe(true)
    })
})