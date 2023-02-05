const mongoose = require('mongoose')
const Schema = mongoose.Schema

const collection = new Schema({

    sender_id: {
        type: mongoose.Types.ObjectId,
        ref: "users",
    },
    receiver_id: {
        type: mongoose.Types.ObjectId,
        ref: "users",
    },
    game_id: {
        type: String
    },
    room_id: {
        type: String
    },
    card: {
        type: String,
        default: ''
    },
    status: {
        type: Boolean
    },
    sender_by: {
        type: Boolean,
        default: false
    },
    receiver_by: {
        type: Boolean,
        default: false
    },
    card: {
        type: Number,
    },
    SenderMessage: {
        type: String,
        default:''
    },
    ReceiverMessage: {
        type: String,
        default:''
    },
    message: {
        type: String,
        default:''
    },
}, { timestamps: true })

module.exports = mongoose.model("cardpass", collection)

