const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
let collection = new Schema({
    game: {
        game: Array,
    },
    score: {
        type: Array
    },
    username: {
        type: String
    }
}, { timestamps: true })


collection.plugin(mongoosePaginate)
collection.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("scores", collection)



