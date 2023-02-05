const mongoose = require('mongoose');
const Schema = mongoose.Schema
const mongoosePaginate = require('mongoose-paginate');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
let collection = new Schema({
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
        type: Number,
    },
    mode: {
        type: Number,
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
    }
}, { timestamps: true })
collection.plugin(mongoosePaginate)
collection.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("points", collection);
