const express = require('express')
const path = require('path')
const glob = require('glob');
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

//Read the contents of the 'assets' directory, including subdirectories
app.get('/read-assets', (req, res) => {
    const pattern = path.join(__dirname, 'public/assets/**/*.{png,jpg}');

    glob(pattern, (err, files) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading directory');
        }

        const fileDetails = files.map(file => ({
            name: path.basename(file),
            path: file.split('public/')[1]
        }));

        res.json(fileDetails);
    });
});


