const express = require('express')
const path = require('path')
const fs = require('fs');
const app = express()
const port = 3000

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Set up a route to handle requests to the root URL
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

//Start the servernpm 
app.listen(port, () => { console.log(`Server is running at http://localhost:${port}`) })

//Read the contents of the 'assets' directory
app.get('/read-assets', (req, res) => {
    const directoryPath = path.join(__dirname, 'public/assets');

    fs.readdir(directoryPath, { withFileTypes: true }, (err, items) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading directory');
        }

        const files = items.map(item => ({
            name: item.name,
            isDirectory: item.isDirectory(),
        }));

        res.json(files);
    });
});

