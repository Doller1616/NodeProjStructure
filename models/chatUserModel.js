const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collection = new Schema({
    property_id: {
        type: String
    },
    sender_id: {
        type: String
    },
    room_id: {
        type: String
    },
    receiver_id: {
        type: schema.Types.ObjectId,
        ref: "user",
    }
}, {timestamps: true})

module.exports = mongoose.model("chatusers", collection);