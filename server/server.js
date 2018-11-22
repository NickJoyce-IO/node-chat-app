const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')


// Set up public path to display web app pages
const publicPath = path.join(__dirname, '../public')

const app = express()
const server = http.createServer(app)
const port = process.env.PORT || 3000
const io = socketIO(server)


// Configure middleware to use express as host
app.use(express.static(publicPath))

io.on('connection', (socket) => {
   console.log('New user connected')

   socket.on('disconnect', () => {
       console.log('User is disconnected')
   })
})




// Tell the server to listen on the port set up
server.listen(port, () => {
    console.log(`Server started on port ${port}`)
})
