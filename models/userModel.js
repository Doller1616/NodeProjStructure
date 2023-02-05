var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const Schema = mongoose.Schema
var User = mongoose.Schema({

    jwtToken: {
        type: String
    },
    profilePic: {
        type: String,
        default: 'https://res.cloudinary.com/dlopkjzfr/image/upload/v1580813623/qtjpwprowb6mouuqmyjp.png'
    },
    mobileNumber: {
        type: String
    },
    countryCode: {
        type: String
    },

    country: {
        type: String
    },

    password: {
        type: String
    },

    socialType: {
        type: String,
        trim: true,
        default:''
    },
    socialId: {
        type: String,
        trim: true,
        default:''

    },

    status: {
        type: String,
        enum: ['1', '0'],  //'Active' 1,'Inactive'0
        default: '1'
    },

    name: {
        type: String,
        trim: true,
    },

    dob: {
        type: String,
        trim: true,
        default: ''
    },

    email: {
        type: String,
        default: ''
    },

    gender: {
        type: String,
        default: ""
    },
    deviceType: {
        type: String
    },
    deviceToken: {
        type: String
    },
    totalPoints: {
        type: Number,
        default: 0
    },
    coins: {
        type: Number,
        default: 300
    },
    username: {
        type: String,
        default: ''
    },

    languageCode: {
        type: [String],
    },
    coinDate: {
        type: Date,
        default: new Date(+new Date() - 1 * 24 * 60 * 60 * 1000)
    },
    coinStatus: {             //'Active' 1,'Inactive'0
        type: Number,
        enum: ['0', '1'],
        default: '0'
    },
    type: {                  // 1 fb,2siginup ,3 device
        type: Number
    },
    notification: {
        type: Boolean,
        default: true
    },  
    nationalit: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    },
    state: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },

    interest: {
        type: String,
        default: ''
    },

    aboutus: {
        type: String,
        default: ""
    },

    defaultLangCode: {
        type: String,
        default: "EN"
    },
    All_LikeWise_Persantege: {
        type: Number,
        default: 0
    },
    All_LikeWise_Number: {
        type: Number,
        default: 0
    },
    userValue: {
        type: Number,
        default: 0
    },
    coinReceivedBy:[{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'users',
        },
    }],
    deleteAccountStatus:{
        type:Boolean,
        default:false
    },
    userType:{
        type:String,
        default:'Normal'
    },
    otp:{
        type:String
    }
},
    {
        timestamps: true
    })
User.plugin(mongoosePaginate)
User.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('users', User);