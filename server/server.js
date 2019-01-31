const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const {generateMessage, generateLocationMessage} = require('./utils/message')
const {isRealString} = require('./utils/validation')

const {Users} = require('./utils/users')

// Set up public path to display web app pages
const publicPath = path.join(__dirname, '../public')

const app = express()
const server = http.createServer(app)
const port = process.env.PORT || 3000
// socketio can't use app, must define in server
const io = socketIO(server)
const users = new Users()


// Configure middleware to use express as host
app.use(express.static(publicPath))

// Log something to the screen when a user is connected
io.on('connection', (socket) => {
   console.log('User connected')


    
   socket.on('join', (params, callback)=> {
    if(!isRealString(params.name) || !isRealString(params.room)) {
        return callback('Name and room name are required')
    }
        socket.join(params.room)
        users.removeUser(socket.id)
        users.addUser(socket.id, params.name, params.room)

        io.to(params.room).emit('updateUserList', users.getUserList(params.room))
        
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
        const user = users.getUser(socket.id)

        if(user && isRealString(message.text)) {
            // sends the message back out
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text))
        } else {
            
        }
        
        
        
        callback()
    })

    socket.on('createLocationMesssage', (coords) => {

        const user = users.getUser(socket.id)

        if(user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude))
        } else {
          
        }
        
    })

    // Log something to the console when a user disconnects
   socket.on('disconnect', () => {
       const user = users.removeUser(socket.id)

       if(user) {
           io.to(user.room).emit('updateUserList', users.getUserList(user.room))
           io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`))
       } else {
        console.log('You need an error handler')
       }
   })
})


// Tell the server to listen on the port set up
server.listen(port, () => {
    console.log(`Server started on port ${port}`)
})
