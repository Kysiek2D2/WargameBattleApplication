const express = require('express')
const path = require('path')
const app = express()
const port = 3000

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Set up a route to handle requests to the root URL
app.get('/', (req, res) => {
    res.sendFile(__dirname+'/index.html')
})

//Start the servernpm 
app.listen(port, () => {console.log(`Server is running at http://localhost:${port}`)})