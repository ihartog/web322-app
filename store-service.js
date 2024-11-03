const fs = require('fs').promises;
const path = require('path');

let items = [];
let categories = [];

function initialize() {
    return new Promise(async (resolve, reject) => {
        try {
            // Read items.json
            const itemsData = await fs.readFile(path.join(__dirname, 'data', 'items.json'), 'utf8');
            items = JSON.parse(itemsData);

            // Read categories.json
            const categoriesData = await fs.readFile(path.join(__dirname, 'data', 'categories.json'), 'utf8');
            categories = JSON.parse(categoriesData); 

            resolve('Data successfully initialized');
        } catch (error) {
            reject('Unable to read file: ' + error.message);
        }
    });
}

function getAllItems() {
    return new Promise((resolve, reject) => {
        if (items.length > 0) {
            resolve(items);
        } else {
            reject('No results returned');
        }
    });
}

function getPublishedItems() {
    return new Promise((resolve, reject) => {
        const publishedItems = items.filter(item => item.published);
        if (publishedItems.length > 0) {
            resolve(publishedItems);
        } else {
            reject('No results returned');
        }
    });
}

function getCategories() {
    return new Promise((resolve, reject) => {
        if (categories.length > 0) {
            resolve(categories);
        } else {
            reject('No results returned');
        }
    });
}

function addItem(itemData) {
    return new Promise((resolve) => {
        // Set published to false if undefined
        itemData.published = itemData.published !== undefined ? itemData.published : false;

        // Set the id to be the length of the items array plus one
        itemData.id = items.length + 1;

        // Add the new item to the items array
        items.push(itemData);

        // Resolve with the updated itemData
        resolve(itemData);
    });
}

function getItemsByCategory(category) {
    return new Promise((resolve, reject) => {
        const filteredItems = items.filter(item => item.category === category);
        
        if (filteredItems.length > 0) {
            resolve(filteredItems);
        } else {
            reject("no results returned");
        }
    });
}


function getItemsByMinDate(minDateStr) {
    return new Promise((resolve, reject) => {
        const minDate = new Date(minDateStr);
        const filteredItems = items.filter(item => new Date(item.postDate) >= minDate);
        
        if (filteredItems.length > 0) {
            resolve(filteredItems);
        } else {
            reject("no results returned");
        }
    });
}

function getItemById(id) {
    return new Promise((resolve, reject) => {
        const item = items.find(item => item.id == id);
        
        if (item) {
            resolve(item);
        } else {
            reject("no result returned");
        }
    });
}

module.exports = {
    initialize,
    getAllItems,
    getPublishedItems,
    getCategories,
    addItem,
    getItemsByCategory,
    getItemsByMinDate,
    getItemById
};
