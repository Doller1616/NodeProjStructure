const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
let collection = new Schema({
    language: {
        type: String
    },
    code: {
        type: String
    },
    description: {
        type: String
    },
    picture: {
        type: String
    },
    greyImage:{
        type:String,
        default:''
    },
    status: {
        type: String,
        enum: ['1', '0'], //'Most popular' 1,'Normal'0
        default: '1'
    },
    languageType:{
        type:String
    }

}, { timestamps: true })
collection.plugin(mongoosePaginate);
collection.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("languages", collection);
