//import mongoose from mongoose;
const mongoose = require('mongoose');


const useSchema = mongoose.Schema({
    name: {"type": String, "default": ''}, //here unique donot work like mysql here it works like adding better performance in searching
    address: {"type": String, "default": ''},
    phone : {"type": String, "default": ''},
    salary: {"type": Number, "default": ''},
});


module.exports = mongoose.model('User', useSchema);