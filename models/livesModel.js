const mongoose = require('mongoose')
const Schema = mongoose.Schema

const collection = new Schema({
    game_id: {
        type: String,
        trim: true
    },
    room_id: {
        type: String,
    },
    card: {
        type: Number
    },
    lives: {
        type: Number
    }
}, { timestamps: true })

module.exports = mongoose.model("liveCount", collection)

