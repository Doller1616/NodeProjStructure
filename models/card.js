const mongoose = require('mongoose')
const Schema = mongoose.Schema

const collection = new Schema({

    room_id: {
        type: String
    },
    card: {
        type: Number,
    },
    Lives: {
        type: Number
    }

}, { timestamps: true })

module.exports = mongoose.model("card", collection)

