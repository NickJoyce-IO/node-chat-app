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
    
    // create the message to be displayed in a ol item
    // create the HTML element
    const li = jQuery('<li></li>')
    // append the text to the list tiem element
    li.text(`${message.from}: ${message.text}`)
    // append the list item to the messages ol element
    jQuery('#messages').append(li)
})

socket.on('newLocationMessage', function(message) {
    const li = jQuery('<li></li>')
    const a = jQuery('<a target="_blank">My current location</a>')

    li.text(`${message.from}: `)
    a.attr('href', message.url)
    li.append(a)
    jQuery('#messages').append(li)

})

// When the submit button is pressed send out the 'createMessage' event to socketio server with 
// the value from the text box. 
jQuery('#message-form').on('submit', (e) => {
    e.preventDefault()

    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, () => {

    })
})

const locationButton = jQuery('#send-location')
locationButton.on('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('createLocationMesssage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, () => {
        alert('Unable to fetch location')
    })
})