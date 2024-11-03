/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Ian Hartog Student ID: 163592199 Date: Nov 2, 2024
*
*  Vercel Web App URL: ________________________________________________________
* 
*  GitHub Repository URL: https://github.com/ihartog/web322-app
*
********************************************************************************/ 


const express = require('express');
const path = require('path');
const app = express();
const storeService = require('./store-service');
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Set cloudinary config
cloudinary.config({
    cloud_name: 'dwzjmpmit',
    api_key: '135525373523153',
    api_secret: 'pd50g2csQoF3O2nl2sZBZGGNsDU',
    secure: true
});

// Multer Variable
const upload = multer();

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
    const { category, minDate } = req.query;

    if (category) {
        // If category filter is provided, get items by category
        storeService.getItemsByCategory(category)
            .then(items => res.json(items))
            .catch(err => res.status(500).json({ message: err }));
    } else if (minDate) {
        // If minDate filter is provided, get items by minimum date
        storeService.getItemsByMinDate(minDate)
            .then(items => res.json(items))
            .catch(err => res.status(500).json({ message: err }));
    } else {
        // If no filters, return all items
        storeService.getAllItems()
            .then(items => res.json(items))
            .catch(err => res.status(500).json({ message: err }));
    }
});

// /categories route
app.get('/categories', (req, res) => {
    storeService.getCategories()
        .then(categories => res.json(categories))
        .catch(err => res.status(500).json({ message: err }));
});

// /items/add route
app.get('/items/add', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'addItem.html'));
});

// item by id route
app.get('/item/:id', (req, res) => {
    const { id } = req.params;
    
    storeService.getItemById(id)
        .then(item => res.json(item))
        .catch(err => res.status(404).json({ message: err }));
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


// POST /items/add
app.post('/items/add', upload.single("featureImage"), (req, res) => {
    if (req.file) {
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
    
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };
    
        async function upload(req) {
            let result = await streamUpload(req);
            console.log(result);
            return result;
        }
    
        upload(req).then((uploaded) => {
            processItem(uploaded.url);
        }).catch((error) => {
            console.error("Error uploading to Cloudinary:", error);
            res.status(500).send("Error uploading file.");
        });
    } else {
        processItem("");
    }
     
    function processItem(imageUrl) {
        req.body.featureImage = imageUrl;

        // TODO: Process the req.body and add it as a new Item before redirecting to /items
        // Example of adding item and redirecting
        storeService.addItem(req.body)
            .then(() => {
                res.redirect('/items');
            })
            .catch(err => {
                console.error("Error adding item:", err);
                res.status(500).send("Error adding item.");
            });
    } 
});
