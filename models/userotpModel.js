const mongoose = require('mongoose');
const Schema = mongoose.Schema

let collection = new Schema({
    
    email: {
        type: String
    },
    otp: {
        type: String,
    }
},{timestamps: true})

module.exports = mongoose.model('userotp', collection);