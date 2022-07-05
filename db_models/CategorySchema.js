const mongoose = require("mongoose");
const SubCategorySchema = require('../db_models/SubCategorySchema.js').SubCategorySchema;

const CategorySchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    image : {
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    subcategory : {
        type: [SubCategorySchema],
        required: false
    },
    status : {
        type: Boolean,
        required: false
    },
})

module.exports = mongoose.model('Category', CategorySchema);