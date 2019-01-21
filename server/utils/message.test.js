const expect = require('expect')

const {generateMessage, generateLocationMessage} = require('./message')

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

describe('generateLocationMessage', () => {
    it('should generate correct location object', () => {
        const from = 'TestUser'
        const latitude = 15
        const longitude = 19
        url = 'https://www.google.com/maps?q=15,19'
        const message = generateLocationMessage(from, latitude, longitude)

        expect(message).toHaveProperty('from','TestUser')
        expect(message).toHaveProperty('url', url)
        expect(typeof message.createdAt).toBe('number')
    })
})