const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collection = new Schema({
    sender_id: {
        type: mongoose.Types.ObjectId,
        ref: "users",
    },
    receiver_id: {
        type: mongoose.Types.ObjectId,
        ref: "users",
    },
    room_id: {
        type: String,
        trim: true,
        required: true

    },
    likewisePersantegeValue: {
        type: Number,
        trim: true,
        required: true
    },
    PointTotalMatchPersantege: {
        type: Number,
        trim: true,
        required: true
    },
    WordCount: {
        type: Number,
        trim: true,
        default:0
    },
    score: {
        type: Number,
        trim: true,
        default: 0
    }

}, { timestamps: true })

module.exports = mongoose.model("gameOver", collection)
