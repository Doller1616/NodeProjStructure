const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let collection = new Schema({
    message: {
        type: String
    },
}, {timestamps:true})

module.exports = mongoose.model("contentlists", collection)