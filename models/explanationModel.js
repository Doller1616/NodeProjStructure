const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const Schema = mongoose.Schema;

let Explantion = new Schema({
    explanation: {
        type: String
    },
    picture: {
        type: Array
    },
}, {timestamps:true})

Explantion.plugin(mongoosePaginate)
Explantion.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("explanations", Explantion)