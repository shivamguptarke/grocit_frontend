const mongoose = require("mongoose");

const CountrySchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    code : {
        type: String,
        required: true
    },
    status : {
        type: Boolean,
        required: false
    },
})

module.exports = mongoose.model('Country', CountrySchema);