const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let collection = new Schema({
    message: {
        type: String
    },
    image: {
        type: String,
        default: ""
    },
}, { timestamps: true })

module.exports = mongoose.model("feedbacks", collection)