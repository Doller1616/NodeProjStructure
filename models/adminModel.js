const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const find = require('./../query/find')
const bcrypt = require('../utils/bcrypt');
let collection = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    jwtToken: {
        type: String,
        default: ''
    },
    profilePic: {
        type: String,
        default: 'https://res.cloudinary.com/dlopkjzfr/image/upload/v1580813623/qtjpwprowb6mouuqmyjp.png'
    },
    gameUserCount:{
        type:Number,
        default:2
    }
})
const AdminModel = mongoose.model("admins", collection)
module.exports = AdminModel
AdminModel.findOne({},async (error, success) => {
    if (error) {
        console.log(error)
    } else {
        if (!success) {
            let password =await bcrypt.bcryptGenerate("admin123");
            new AdminModel({
                email: "admin@gmail.com",
                password: password,
                username: "admin1234",
                name: "Admin",
                profilePic: "https://res.cloudinary.com/boss8055/image/upload/v1576224163/download.jpg"
            }).save((error, success) => {
                if (error) {
                    console.log("Error in creating admin",error);
                }
                else {
                    console.log("Admin created successfully");
                    console.log("Admin data is==========>", success);
                }
            })

        }
    }
})
