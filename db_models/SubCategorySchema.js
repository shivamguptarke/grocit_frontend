const mongoose = require("mongoose");

const SubCategorySchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    categoryid : {
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
    status : {
        type: Boolean,
        required: false
    },
})

SubCategoryModel = mongoose.model('SubCategory', SubCategorySchema);

module.exports = {SubCategoryModel, SubCategorySchema};