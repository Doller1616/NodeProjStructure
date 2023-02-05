const mongoose = require('mongoose')
const Schema = mongoose.Schema

const collection = new Schema({
    game_id: {
        type: String,
        trim: true
    },
    card: {
        type: Number,
    },
    count: {
        type: Number

    }
}, { timestamps: true })

module.exports = mongoose.model("cardCounts", collection)

