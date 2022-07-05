const mongoose = require("mongoose");

const VariantSchema = new mongoose.Schema({
    packagingSize : {
        type: String,
        required: true
    },
    productid : {
        type: String,
        required: true
    },
    mrp : {
        type: Number,
        required: true
    },
    dprice : {
        type: Number,
        required: false
    },
    quantity : {
        type: Number,
        required: true
    },
    description : {
        type: String,
        required: false
    },
    imageUrl : {
        type: String,
        required: false
    },
    imageName : {
        type: [String],
        required: false
    },
    status : {
        type: Boolean,
        required: false
    },
})

const VariantModel = mongoose.model('Variant', VariantSchema); 

module.exports = {VariantModel, VariantSchema};