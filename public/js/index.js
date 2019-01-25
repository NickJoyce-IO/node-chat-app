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
    const formattedTime = moment(message.createdAt).format('h:mm a')
    const  template = jQuery('#message-template').html()
    const html = Mustache.render(template,  {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    })

    jQuery('#messages').append(html)
    
})

socket.on('newLocationMessage', function(message) {
    const formattedTime = moment(message.createdAt).format('h:mm a')
    const template = jQuery('#location-message-template').html()
    const html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formattedTime
    })

    jQuery('#messages').append(html)
})

// When the submit button is pressed send out the 'createMessage' event to socketio server with 
// the value from the text box. 
jQuery('#message-form').on('submit', (e) => {
    e.preventDefault()

    const messageTextBox = jQuery('[name=message]')

    socket.emit('createMessage', {
        from: 'User',
        text: messageTextBox.val()
    }, () => {
        messageTextBox.val('')
    })
})

const locationButton = jQuery('#send-location')
locationButton.on('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser')
    }

    locationButton.attr('disabled', 'disabled').text('Sending location.....')

    navigator.geolocation.getCurrentPosition((position) => {
        locationButton.removeAttr('disabled').text('Send location')
        socket.emit('createLocationMesssage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, () => {
        locationButton.removeAttr('disabled').text('Send location')
        alert('Unable to fetch location')
    })
})