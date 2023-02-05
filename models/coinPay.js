const mongoose = require('mongoose')
const Schema = mongoose.Schema

const collection = new Schema({
    coin: {
        type: Number
    },
    dollar: {
        type: Number
    },
    
}, { timestamps: true })

module.exports = mongoose.model("coinPay", collection)

