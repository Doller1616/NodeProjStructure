const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
let collection = new Schema({

    themeName: {
        type: Array,
    },
    images: {
        type: Array
    },
}, { timestamps: true })


collection.plugin(mongoosePaginate)
collection.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("images", collection)



