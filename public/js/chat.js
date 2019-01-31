const socket = io()

// function to scroll

const scrollToBottom = () => {
// Selectors
const messages = jQuery('#messages')
const newMessage = messages.children('li:last-child')
// Heights
let clientHeight = messages.prop('clientHeight')
let scrollTop = messages.prop('scrollTop')
let scrollHeight = messages.prop('scrollHeight')
let newMessageHeight = newMessage.innerHeight()
let lastMessageHeight = newMessage.prev().innerHeight()

if( clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight)
}

}

// log to console when connection with server established
socket.on('connect', () => {
    console.log('Connected to server')
    const params = jQuery.deparam(window.location.search)

    socket.emit('join', params, (err) => {
        if (err) {
            alert(err)
            window.location.href ='/'
        } else {
            console.log('No error')
        }
    })
})

// When disconnected from the server log to the console
socket.on('disconnect', () => {
    console.log('Connection lost')
})

socket.on('updateUserList', (users) => {
    const ol = jQuery('<ol></ol>')

    users.forEach((user) => {
        ol.append(jQuery('<li></li>').text(user))
    })

    jQuery('#users').html(ol)
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
    scrollToBottom()
    
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
    scrollToBottom()
})

// When the submit button is pressed send out the 'createMessage' event to socketio server with 
// the value from the text box. 
jQuery('#message-form').on('submit', (e) => {
    e.preventDefault()

    const messageTextBox = jQuery('[name=message]')

    socket.emit('createMessage', {
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