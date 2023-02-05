const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let collection = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    video: {
        type: String
    },
    views: {
        type: Array, default: []
    },

}, { timestamps: true })

module.exports = mongoose.model('videos', collection);