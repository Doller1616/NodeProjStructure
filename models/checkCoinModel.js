const mongoose = require('mongoose')
const Schema = mongoose.Schema

const collection = new Schema({
    room_id: {
        type: String
    },
    user_id: {
        type: String,
    },
}, { timestamps: true })

module.exports = mongoose.model("checkCoin", collection)

