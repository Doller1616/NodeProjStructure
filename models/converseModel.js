
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
var Schema = mongoose.Schema;
let ConverseModel = mongoose.Schema({
    converse: {
        type: String
    },
    explanation_id: {
        type: Schema.Types.ObjectId,
        ref: "explanations"
    },
}, {
    timestamps: true
})
ConverseModel.plugin(mongoosePaginate)
ConverseModel.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('converses', ConverseModel);