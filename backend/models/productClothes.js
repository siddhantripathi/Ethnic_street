// backend/models/productClothes.js
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
    imageUrl: {
        type: String,
    },
    stock: {
        type: Number,
        default: 0,
    },
    createdBy: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    averageRating: {
        type: Number,
        default: 0
    },
    numberOfRatings: {
        type: Number,
        default: 0
    }
}, {
    collection: 'clothes'
});

module.exports = mongoose.model('Clothes', ProductClothes, 'clothes');
