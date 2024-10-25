const mongoose = require('mongoose');

const ProductClothes = new mongoose.Schema({
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
    size: {
        type: String,
        default: "Small",
        enum: ["Small", "Medium", "Large", "X-Large"],
    },
    color: {
        type: String,
    },
});

module.exports = mongoose.model('Clothes', ProductClothes);