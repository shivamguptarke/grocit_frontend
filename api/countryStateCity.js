const express = require("express");
const Country  = require('../db_models/CountrySchema.js');
const State  = require('../db_models/StateSchema.js');
const City  = require('../db_models/CitySchema.js');

const router = express.Router();

router.get("/country", (req, res) => {
    Country.find({}, function(err, itemsArray){
        if (err){
            console.log(err);
        }
        else{
            res.json(itemsArray);
            console.log(itemsArray);
        } 
    });
})

router.get("/state", (req, res) => {
    State.find({}, function(err, itemsArray){
        if (err){
            console.log(err);
        }
        else{
            res.send(itemsArray);
            console.log(itemsArray);
        } 
    });
})

router.get("/city", (req, res) => {
    City.find({}, function(err, itemsArray){
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