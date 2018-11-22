const path = require('path')
const express = require('express')

// Set up public path to display web app pages
const publicPath = path.join(__dirname, '../public')

const app = express()
const port = process.env.PORT || 3000

// Configure middleware to use express as host
app.use(express.static(publicPath))


// Tell the server to listen on the port set up
app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})
