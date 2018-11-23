const socket = io()

// log to console when connection with server established
socket.on('connect', () => {
    console.log('Connected to server')

    socket.emit('newUser')

})

// When disconnected from the server log to the console
socket.on('disconnect', () => {
    console.log('Connection lost')
})

// Listen for a message from the server, an object will be retrieved
socket.on('newMessage', (message) => {
    console.log('newMessage', message)
})