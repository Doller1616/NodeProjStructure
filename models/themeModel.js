const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let collection = new Schema({
    theme: {
        type: String
    },
}, { timestamps: true })

module.exports = mongoose.model("themes", collection);