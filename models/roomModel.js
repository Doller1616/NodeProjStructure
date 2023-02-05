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
    game_id: {
        type: mongoose.Types.ObjectId,
        ref: "Game",
    },
    room_id: {
        type: String
    },

    lastmessage: {
        type: String
    },
    room_status: {
        type: Boolean,
        default: true
    },
    propertyId: {
        type: String
    },
    title: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    startTime: {
        type: String
    },
    endTime: {
        type: String
    },
    requestDate: [{
        type: String
    }],
    delete_by: [{
        type: String
    }],
    type: {
        type: Number
    },
    languageCode: {
        type: String,
    },
    gameType: {
        type: String,                // fb create 1
        default: '1'                 // random create 2 
    },
    completeGame: {
        type: Boolean,
        default: true
    },
    timeUpdate: {
        type: Date,
        default: Date.now
    },
    status:{
        type:String
    }
}, { timestamps: true })

module.exports = mongoose.model("rooms", collection)
