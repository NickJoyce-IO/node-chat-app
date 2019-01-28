const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const {generateMessage, generateLocationMessage} = require('./utils/message')
const {isRealString} = require('./utils/validation')

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


    
   socket.on('join', (params, callback)=> {
    if(!isRealString(params.name) || !isRealString(params.room)) {
        callback('Name and room name are required')
    }
        socket.join(params.room)
        
       // Admin welcome message to the newly conneted user
       socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'))

       // broadcast a message to everybody else to let them know a new user has joined
       socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`))
        

        callback()
   })
   
   // Listen for a message from a client, you will receive from and text
    // then rebroadcast that message to everybody using io.emit a call back is configured
    // to allow a message to be sent back from the server
    socket.on('createMessage', (message, callback) => {
        console.log('createMessage:', message)
        
        // sends the message back out
        io.emit('newMessage', generateMessage(message.from, message.text))
        callback()
    })

    socket.on('createLocationMesssage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
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
