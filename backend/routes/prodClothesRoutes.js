const express = require("express");

const {
    createProduct,
    getAllProduct,
} = require("../controller/prodClothCtrl");

const router = express.Router();

router.post("/", createProduct);
router.get("/:id", getAllProduct);

module.exports = router;