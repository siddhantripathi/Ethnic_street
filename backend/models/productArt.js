const mongoose = require('mongoose');

const ProductArt = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    // image: {

    // }
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    dimension: {
        type: String,
        required: true,
    },

});

module.exports = mongoose.model('Art', ProductArt);