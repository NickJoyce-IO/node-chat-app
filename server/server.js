const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')


// Set up public path to display web app pages
const publicPath = path.join(__dirname, '../public')

const app = express()
const server = http.createServer(app)
const port = process.env.PORT || 3000
// socketio can't use app, must define in server
const io = socketIO(server)


// Configure middleware to use express as host
app.use(express.static(publicPath))

// Log something to the screen when a user is connected
io.on('connection', (socket) => {
   console.log('User connected')

    // Listen for a message from a client, you will receive from, text and createdAt
    socket.on('createMessage', (message) => {
        console.log('createMessage:', message)
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        })
    })

    // Log something to the console when a user disconnects
   socket.on('disconnect', () => {
       console.log('User is disconnected')
   })
})


// Tell the server to listen on the port set up
server.listen(port, () => {
    console.log(`Server started on port ${port}`)
})
