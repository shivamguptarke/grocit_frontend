const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

const AdminSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    username : {
        type: String,
        required: true
    },
    password : {
        type: String,
    },
    phone : {
        type: String,
        required: false
    },
})

AdminSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Admin', AdminSchema);