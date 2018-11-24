const expect = require('expect')

const {generateMessage} = require('./message')

// Test the generateMessage function, to ensure it returns an object with correct parameters
describe('generateMessage', () => {
    it('should generate the correct message object', () => {
        const from = 'Nick'
        const text = 'Welcome to Gotham!'
        const message = generateMessage(from, text)
        expect(typeof message).toBe('object')
        expect(message.from).toBe(from)
        expect(message.text).toBe(text)
        expect(typeof message.createdAt).toBe('number')
        
    })
})