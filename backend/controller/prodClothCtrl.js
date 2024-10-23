const Product = require("../models/productClothes");
const User = require("../models/User");

// Create Product

const createProductClothes = async (req, res) => {
    try{
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    } catch(error){
        throw new Error(error)
    }
};

// Get product 

const getProduct = async (req, res) => {
    try{
        const getAllProduct = await Product.find()

        res.status(200).json(getAllProduct)
    }catch(error){
        throw new Error(error)
    }
};

// Update product



// Delete prodcut 