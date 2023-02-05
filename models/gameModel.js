const mongoose = require('mongoose');
const Schema = mongoose.Schema
const mongoosePaginate = require('mongoose-paginate');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
let GameModel = new Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    morePrecisely: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'explanations',
    },
    objective: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'converses',
    },
    mode: {
        type: String,   //Time 1 &&  Lives  2
    },
    languageCode: {
        type: String,
    },
    status: {
        type: Number,
        enum: ['1', '0'],    //'Active' 1,'Inactive'0
        default: '0'
    },
    NotificationStatus: {
        type: Number,
        enum: ['1', '0'],    //'Active' 1,'Inactive'0
        default: '1'
    },
    customInstructions: {
        type: String,
    },
    images: {
        type: Array,
        default: []
    },
    gameType: {
        type: String,                // fb create 1
        default: '0'                 // random create 2 
    },
    card_pass_user_id:{
        type: mongoose.Types.ObjectId,
        ref: "users",
    },
    card_pass_message:{
        type:String
    }
}, { timestamps: true })
GameModel.plugin(mongoosePaginate)
GameModel.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("games", GameModel);
