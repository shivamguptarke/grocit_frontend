const express = require("express");
const Category = require('../db_models/CategorySchema.js');
const SubCategory = require('../db_models/SubCategorySchema.js').SubCategoryModel;

const router = express.Router();

router.get("/category", (req, res) => {
    Category.find({}, function(err, itemsArray){
        if (err){
            console.log(err);
        }
        else{
            res.json(itemsArray);
            console.log(itemsArray);
        } 
    });
})

router.get("/subcategory", (req, res) => {
    SubCategory.find({}, function(err, itemsArray){
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