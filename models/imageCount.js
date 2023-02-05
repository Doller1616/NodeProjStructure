const mongoose = require('mongoose')
const Schema = mongoose.Schema

const collection = new Schema({
    Image: {
        type: String
    }

}, { timestamps: true })

module.exports = mongoose.model("ImageCount", collection)

