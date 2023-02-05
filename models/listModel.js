const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let collection = new Schema({
    list: {
        type: String
    },
}, { timestamps: true })

module.exports = mongoose.model("lists", collection);