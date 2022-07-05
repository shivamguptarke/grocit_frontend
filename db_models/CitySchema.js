const mongoose = require("mongoose");

const CitySchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    stateid : {
        type: String,
        required: true
    },
    pincode : {
        type: String,
        required: true
    },
    status : {
        type: Boolean,
        required: false
    },
})

module.exports = mongoose.model('City', CitySchema);