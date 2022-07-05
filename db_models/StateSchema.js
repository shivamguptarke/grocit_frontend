const mongoose = require("mongoose");

const StateSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    countryid : {
        type: String,
        required: true
    },
    status : {
        type: Boolean,
        required: false
    },
})

module.exports = mongoose.model('State', StateSchema);