const mongoose = require('mongoose');
const Schema = mongoose.Schema

let collection = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },

    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    gameId: {
        type: mongoose.Types.ObjectId,
        ref: "games"
    },
    profilePic: {
        type: String,
    },
    title: {
        type: String,
    },
    type: {
        type: String
    },
    fullName: {
        type: String
    },
    isSeen:{
        type:Boolean,
        default:false
    },
    status: {
        type: String,
        default: 1
        // by default 1
        // accept 2
        // reject 3
    }

}, { timestamps: true })

module.exports = mongoose.model('notifications', collection)
