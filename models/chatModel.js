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
    Image: {
        type: String,
        default: 'https://res.cloudinary.com/dlopkjzfr/image/upload/v1580813623/qtjpwprowb6mouuqmyjp.png'
    },
    room_id: {
        type: String
    },
    message: {
        type: String,
        default: ''
    },
    check_status: {
        type: String
    },
    delete_by: {
        type: String,
        default: ''
    },
    card: {
        type: Number,
    },
    delete_both: {
        type: Boolean,
        default: false
    },
    isMatched: {
        type: Boolean,
    },
    all_matched: {
        type: Number,
    },
    point: {
        type: Number,
    },
    bonus: {
        type: Number,
    },
    streaks: {
        type: Number,
    },
    score: {
        type: Number,
    },
    pointId: {
        type: Number
    },
    languageCode: {
        type: String
    },
    messageWordCount: {
        type: Number,
        default: 0
    },
    isStreak: {
        type: Boolean,
        default: false
    },
    type: {
        type: Number
    },
    isSeenBy:[{
        userId: {
            type: mongoose.Types.ObjectId,
            ref: "users",
        },
    }],
    
}, { timestamps: true })

module.exports = mongoose.model("chats", collection)

