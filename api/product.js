const express = require("express");
const Variant = require('../db_models/VariantSchema.js').VariantModel;
const Product = require('../db_models/ProductSchema.js');

const router = express.Router();

router.get("/product", (req, res) => {
    Product.find({}, function(err, itemsArray){
        if (err){
            console.log(err);
        }
        else{
            res.json(itemsArray);
            console.log(itemsArray);
        } 
    });
})

router.get("/variant", (req, res) => {
    Variant.find({}, function(err, itemsArray){
        if (err){
            console.log(err);
        }
        else{
            res.send(itemsArray);
            console.log(itemsArray);
        } 
    });
})

module.exports = router;