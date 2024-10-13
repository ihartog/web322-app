const express = require('express');
const path = require('path');
const app = express();
const storeService = require('./store-service');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Redirect the root URL to /about
app.get('/', (req, res) => {
    res.redirect('/about');
});

// Serve the about.html file
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

// /shop route
app.get('/shop', (req, res) => {
    storeService.getPublishedItems()
        .then(publishedItems => res.json(publishedItems))
        .catch(err => res.status(500).json({ message: err }));
});

// /items route
app.get('/items', (req, res) => {
    storeService.getAllItems()
        .then(items => res.json(items))
        .catch(err => res.status(500).json({ message: err }));
});

// /categories route
app.get('/categories', (req, res) => {
    storeService.getCategories()
        .then(categories => res.json(categories))
        .catch(err => res.status(500).json({ message: err }));
});

// Initialize the data and start the server
storeService.initialize()
    .then(() => {
        const PORT = process.env.PORT || 8080;
        app.listen(PORT, () => {
            console.log(`Express http server listening on ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to initialize data:', err);
    });
