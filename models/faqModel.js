const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let collection = new Schema({
    question:{
        type:String
    },
    answer: {
        type: String
    },
}, {timestamps:true})

module.exports = mongoose.model("faqs", collection)