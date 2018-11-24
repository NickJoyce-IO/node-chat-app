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
    const li = jQuery('<li></li>')
    li.text(`${message.from}: ${message.text}`)

    jQuery('#messages').append(li)
})

jQuery('#message-form').on('submit', (e) => {
    e.preventDefault()

    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, () => {

    })
})