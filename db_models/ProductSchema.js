const mongoose = require("mongoose");
const VariantSchema = require('../db_models/VariantSchema.js').VariantSchema;

const ProductSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    subcategoryid : {
        type: String,
        required: true
    },
    description : {
        type: String,
        required: false
    },
    imageUrl : {
        type: String,
        required: true
    },
    imageName : {
        type: [String],
        required: true
    },
    variants : {
        type: [VariantSchema],
        required: true
    },
    status : {
        type: Boolean,
        required: false
    },
})

module.exports = mongoose.model('Product', ProductSchema);