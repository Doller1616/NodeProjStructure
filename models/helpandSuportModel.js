const mongoose = require('mongoose')
const Schema = mongoose.Schema

const collection = new Schema({
    value: {
        type: String,
        default:''
    },
    type: {
        type: String,
        default:''

    }

}, { timestamps: true })

module.exports = mongoose.model("helpandSuport", collection)

