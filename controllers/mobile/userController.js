const find = require('../../query/find');
const create = require('../../query/create');
const response = require('../../utils/response');
const bcrypt = require('../../utils/bcrypt');
const jwt = require('jsonwebtoken');
const config = require('./../../config/config');
const { validationResult } = require('express-validator/check');
var func = require('../../utils/function');
const cloudinary = require('cloudinary');
const Room = require('../../models/roomModel');
const Image = require('../../models/imageCount');
const gameOver = require('../../models/gameOverModel');
const ChatModel = require('../../models/chatModel');
const User = require('../../models/userModel');
var ObjectId = require('mongodb').ObjectId;

cloudinary.config({
    cloud_name: "altsols-com",
    api_key: "432157412791339",
    api_secret: "iLBqwz_JwopOvIRkoNulrLajSxY"
});



module.exports = {


    //---------------signup-----------------//
    signup: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            let criteria = {}
            criteria.email = req.body.email;
            let userExist = await find.findOnePromise("userModel", criteria, {}, {})
            if (userExist) {
                if (userExist.deleteUserAcount == false) {
                    return response.sendErrorMessage(res, ("Email already exists"));
                }
            }
            let criteria1 = {}
            criteria1.username = req.body.username;
            let userNameExist = await find.findOnePromise("userModel", criteria1, {}, {})
            if (userNameExist) {
                return response.sendErrorMessage(res, ("username already exists"));
            }
            let dataToSave = req.body;
            dataToSave.defaultLangCode = req.body.languageCode[0]

            let password = await bcrypt.bcryptGenerate(req.body.password);
            dataToSave.password = password;

            let resultCoin = await find.findAllPromise("coinModel", {}, {}, {});
            dataToSave.coins = resultCoin[0].startCoin;
            let result = await create.create("userModel", dataToSave);
            let userCriteria = {
                _id: result._id
            }
            let dataToUpdate = {};
            dataToUpdate.deleteUserAcount = false
            dataToUpdate.jwtToken = jwt.sign({ _id: result._id }, config.jwtSecretKey, { expiresIn: '90d' })
            let result1 = await find.findAndUpdatePromise("userModel", userCriteria, dataToUpdate, {})
            let result3 = await find.findOnePromise("userModel", userCriteria, {}, {})
            response.sendsuccessData(res, ("User signed up sucessfully"), result3);
        } catch (error) {
            response.sendErrorCustomMessage(res, ("Internal Server Error"), "false");
        }
    },


    //-------------------checkEmail---------//
    checkEmail: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            console.log("Request is========>",req.body)
            let criteria = {}
            var email = req.body.email;
            var username = req.body.username;
            criteria = { username: username };
            let admin = await find.findOnePromise("userModel", criteria, {}, {})
            console.log(admin)
            if (admin) {
                return response.sendErrorMessage(res, "username already exits")
            }
            criteria1 = { email: email,deleteAccountStatus:false };
            let admin1 = await find.findOnePromise("userModel", criteria1, {}, {})
            if (admin1) {
                return response.sendErrorMessage(res, "Email already exits")
            }
            response.sendSuccessMessage(res, "User not exits");
        } catch (error) {
            console.log("error is========>",error)
            response.sendErrorCustomMessage(res, ("Internal Server Error"), "false");
        }
    },


    //---------------Login-----------------//
    Login: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
            }
            var email = req.body.email;
            let criteria = {
                $and: [
                    {
                        $or: [
                            { username: email },
                            { email: email }
                        ]
                    },
                    // { deleteAccountStatus: false }
                ]
            }
            let admin = await find.findOnePromise("userModel", criteria, {}, {})

            if (!admin) {
                return response.sendErrorMessage(res, "Invalid credentials")
            }
            let comparePassword = await bcrypt.bcryptCompare(req.body.password, admin.password);
            if (!comparePassword) {
                return response.sendErrorMessage(res, "Invalid password")
            }
            const options = {
                expiresIn: '60d'
            }
            let jwtToken = await jwt.sign({
                _id: admin._id,
            }, config.jwtSecretKey, options);
            let dataToUpdate = {}
            dataToUpdate.jwtToken = jwtToken;
            dataToUpdate.deviceType = req.body.deviceType;
            dataToUpdate.deviceToken = req.body.deviceToken;
            dataToUpdate.deleteAccountStatus = false;
            let result = await find.findAndUpdatePromise("userModel", criteria, dataToUpdate, {})
            let user2 = await find.findOnePromise("userModel", criteria, {}, {})
            return response.sendsuccessData(res, "Login succesfully", user2);
        } catch (error) {
            console.log('--------------------   adminLogin ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },


    //------------  --ForgotPassword--------//
    ForgotPassword: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
            }
            req.body.email = req.body.email
            let criteria = { deleteAccountStatus: false }
            criteria.email = req.body.email;
            let checkEmail = await find.findOnePromise("userModel", criteria, {}, {});
            if (!checkEmail) {
                return response.sendErrorMessage(res, "Invalid Email")
            }
            let adminId = checkEmail._id;
            let otp = Math.floor(10000000 + Math.random() * 90000000)
            let name = checkEmail.name;
            let criteria1 = {}
            criteria1._id = adminId;
            await User.findByIdAndUpdate({_id:checkEmail._id},{$set:{otp:otp}},{new:true})
            let link = `http://18.224.247.81/reset/#/reset/${otp}/${adminId}`;
            response.sendSuccessMessage(res, "New password has been sent on your registered email");
            func.sendHtmlEmail1(req.body.email, "Forgot Password", name, link, (error1, result1) => {
            })
        } catch (error) {
            console.log(error)
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    resetPassword: async (req, res) => {
        try {
            console.log("Request is===========>",req.body)
            let qReuest={
                $and:[{_id:req.body.userId},{otp:req.body.otp}]
            }
            let checkUser=await User.findOne(qReuest)
            if(!checkUser){
                console.log("Link expire")
                return res.send({status:500,message:'Link has been expired'});
            }
            let otp = Math.floor(10000000 + Math.random() * 90000000)
            let password = await bcrypt.bcryptGenerate(req.body.password);
            let updateUser=await User.findByIdAndUpdate({_id:checkUser._id},{$set:{password:password,otp:otp}},{new:true})
            console.log("Password updated successfully",updateUser);
            return res.send({status:200,message:'Password updated sucessfully'});
        } catch (error) {
            console.log(error)
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },

    socialLogin: async (req, res) => {
        try {
            console.log("Social login is===========>", req.body)
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
            }
            if (req.body.mode === '1') {
                if (!req.body.socialId || !req.body.socialType) {
                    return response.sendErrorMessage(res, "Something went wrong", "false");
                }

                let criteria = { $and: [{ "socialId": req.body.socialId }, { "socialType": req.body.socialType }] }
                var checkUser = await find.findOnePromise("userModel", criteria, {}, {});
                if (checkUser === null) {
                    let criteria2 = { _id: req.body.userId }
                    let jwtToken = jwt.sign({ "socialType": req.body.socialType, _id: req.body.userId, "socialId": req.body.socialId }, config.jwtSecretKey);
                    let project = {
                        $set: {
                            deviceType: req.body.deviceType, type:req.body.type, profilePic: req.body.profilePic,
                            deviceToken: req.body.deviceToken, socialType: req.body.socialType, socialId: req.body.socialId,
                            jwtToken: jwtToken, languageCode: req.body.languageCode, defaultLangCode: req.body.languageCode[0]
                        }
                    }

                    let opation = { new: true }
                    let result = await find.findByIdAndUpdatePromise("userModel", criteria2, project, opation);
                    console.log("result", result);
                    return response.sendsuccessData(res, "You have successfully logged in", result);
                }

                let criteria2 = { _id: checkUser._id }
                let jwtToken = jwt.sign({ "socialType": req.body.socialType, _id: checkUser._id, "socialId": req.body.socialId }, config.jwtSecretKey);
                let project = {
                    $set: {
                        jwtToken: jwtToken, languageCode: req.body.languageCode, defaultLangCode: req.body.languageCode[0], deleteAccountStatus: false
                    }
                }
                let opation = { new: true }
                let result = await find.findByIdAndUpdatePromise("userModel", criteria2, project, opation);
                return response.sendsuccessData(res, "You have successfully logged in", result);

            } 
            else {
                if (!req.body.socialId || !req.body.socialType) {
                    return response.sendErrorMessage(res, "Something went wrong", "false");
                }
                let criteria = { $and: [{ "socialId": req.body.socialId }, { "socialType": req.body.socialType }] }
                var checkUser = await find.findOnePromise("userModel", criteria, {}, {});
                if (!checkUser) {
                    if (req.body.email) {
                        req.body.email = req.body.email.toLowerCase();
                        let criteria1 = { "email": req.body.email }
                        let checkEmail = await find.findOnePromise("userModel", criteria1, {}, {});
                        if (!checkEmail) {
                            let resultCoin = await find.findAllPromise("coinModel", {}, {}, {});

                            let socialLoginObj = {}
                            socialLoginObj.coins = resultCoin[0].startCoin;
                            socialLoginObj.languageCode = req.body.languageCode;
                            socialLoginObj.type = req.body.type;
                            socialLoginObj.defaultLangCode = req.body.languageCode[0];
                            socialLoginObj.socialId = req.body.socialId;
                            socialLoginObj.socialType = req.body.socialType;
                            socialLoginObj.deviceToken = req.body.deviceToken;
                            socialLoginObj.deviceType = req.body.deviceType;
                            socialLoginObj.jwtToken = "";
                            socialLoginObj.name = req.body.name;
                            socialLoginObj.profilePic = req.body.profilePic;
                            socialLoginObj.email = req.body.email;
                            socialLoginObj.mobileNumber = req.body.mobileNumber;
                            let result = await create.create("userModel", socialLoginObj);
                            let jwtToken = jwt.sign({ "socialType": req.body.socialType, _id: result._id, socialId: req.body.socialId }, config.jwtSecretKey);
                            let criteria1 = {};
                            criteria1._id = result._id;
                            var test = await find.findByIdAndUpdatePromise("userModel", criteria1, { $set: { jwtToken: jwtToken } }, { new: true }, {})
                            return response.sendsuccessData(res, "You have successfully logged in", test);
                        }
                        if (checkEmail.socialId && checkEmail.socialType) {
                            let criteria2 = { _id: checkEmail._id }
                            let jwtToken = jwt.sign({ "socialType": req.body.socialType, _id: checkEmail._id, socialId: req.body.socialId }, config.jwtSecretKey);
                            let project = { $set: { jwtToken: jwtToken, socialId: req.body.socialId, socialType: req.body.socialType, name: req.body.name, profilePic: req.body.profilePic, deviceToken: req.body.deviceToken, deviceType: req.body.deviceType, languageCode: req.body.languageCode, defaultLangCode: req.body.languageCode[0], type: req.body.type } };
                            let opation = { new: true }
                            let result = await find.findByIdAndUpdatePromise("userModel", criteria2, project, opation);
                            return response.sendsuccessData(res, "You have successfully logged in", result);
                        }
                    }
                    let socialLoginObj = {};
                    let resultCoin = await find.findAllPromise("coinModel", {}, {}, {});
                    socialLoginObj.socialId = req.body.socialId,
                        socialLoginObj.coins = resultCoin[0].startCoin,
                        socialLoginObj.languageCode = req.body.languageCode,
                        socialLoginObj.defaultLangCode = req.body.languageCode[0],
                        socialLoginObj.socialType = req.body.socialType,
                        socialLoginObj.deviceToken = req.body.deviceToken,
                        socialLoginObj.deviceType = req.body.deviceType,
                        socialLoginObj.jwtToken = "",
                        socialLoginObj.name = req.body.name,
                        socialLoginObj.email = req.body.email,
                        socialLoginObj.profilePic = req.body.profilePic,
                        socialLoginObj.type = req.body.type,
                        socialLoginObj.mobileNumber = req.body.mobileNumber
                    let result = await create.create("userModel", socialLoginObj);
                    let jwtToken = jwt.sign({ "socialType": req.body.socialType, _id: result._id, "socialId": req.body.socialId }, config.jwtSecretKey);
                    let criteria6 = {};
                    criteria6._id = result._id;
                    var test = await find.findByIdAndUpdatePromise("userModel", criteria6, { $set: { jwtToken: jwtToken } }, { new: true }, {})
                    response.sendsuccessData(res, "You have successfully logged in", test);
                }
                let criteria2 = { _id: checkUser._id }
                let jwtToken = jwt.sign({ "socialType": req.body.socialType, _id: checkUser._id, "socialId": req.body.socialId }, config.jwtSecretKey);
                let project = {
                    $set: {
                        jwtToken: jwtToken, languageCode: req.body.languageCode, defaultLangCode: req.body.languageCode[0],deleteAccountStatus:false
                    }
                }
                let opation = { new: true }
                let result = await find.findByIdAndUpdatePromise("userModel", criteria2, project, opation);
                return response.sendsuccessData(res, "You have successfully logged in", result);
            }


        } catch (error) {
            console.log(error)
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },


    notificationUpdate: async (req, res) => {
        try {
            let criteria = {
                _id: req.user._id
            }
            let dataToUpdate = req.body;
            find.findAndUpdatePromise("userModel", criteria, dataToUpdate, { new: true })
            response.sendsuccessData(res, ("notification Setting updated"))
        } catch (error) {
            console.log('--------------------   notificationSetting ---------------- ', error);
            response.sendErrorCustomMessage(res, ("Internal Server Error"), "false");
        }
    },


    //---------------logout---------------//
    logout: async (req, res) => {
        try {
            let criteria = {
                _id: req.user._id
            }
            find.findByIdAndUpdatePromise("userModel", criteria, { $set: { jwtToken: '', deviceType: '', deviceToken: '' } }, { new: true }, {})
            response.sendSuccessMessage(res, ("Logout successfully"))
        } catch (error) {
            console.log('--------------------   logout ---------------- ', error);
            response.sendErrorCustomMessage(res, ("Internal Server Error"), "false");
        }
    },


    //---------------loginWithDevices---------//
    loginWithOutCredentials: async (req, res) => {
        try {
            if (req.body.deviceToken && req.body.deviceType) {
                let criteria = { $and: [{ "deviceToken": req.body.deviceToken }, { "deviceType": req.body.deviceType }] }
                var checkUser = await find.findOnePromise("userModel", criteria, {}, {});
                let dataToSave = {};
                if (!checkUser) {
                    dataToSave = req.body;
                    let result = await create.create("userModel", dataToSave);
                    let jwtToken = jwt.sign({ "deviceToken": req.body.deviceToken, "deviceType": req.body.deviceType, _id: result._id }, config.jwtSecretKey);
                    let criteria1 = {};
                    criteria1._id = result._id;
                    var test = await find.findByIdAndUpdatePromise("userModel", criteria1, { $set: { jwtToken: jwtToken } }, { new: true }, {})
                    return response.sendsuccessData(res, "You have successfully logged in", test);
                } else {
                    let criteria2 = { _id: checkUser._id }
                    let project = { $set: { deviceToken: req.body.deviceToken, deviceType: req.body.deviceType } };
                    let opation = { new: true }
                    let result = await find.findByIdAndUpdatePromise("userModel", criteria2, project, opation);
                    return response.sendsuccessData(res, "You have successfully logged in", result);
                }
            }
        } catch (error) {
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },


    //---------------getUserDetails---------// 
    getUserDetails: async (req, res) => {
        try {
            let criteria = {
                _id: req.user._id,
                // deleteAccountStatus: false
            }
            let option = { lean: true }
            let result = await find.findOnePromise("userModel", criteria, {}, option);
            console.log("User deatil is==========>",result)
            let result1 = await find.findAllPromise("languageModel", {}, {}, {})
            if (!result) {
                return response.sendErrorMessage(res, ("User does not exist"))
            }
            if (!result1) {
                return response.sendErrorMessage(res, ("User does not exist"))
            }

            let created = await Room.aggregate([
                {
                    $match: {
                        $or: [{
                            $and: [{
                                "sender_id": ObjectId(req.user._id)
                            }]
                        }],
                    },
                },
                {
                    $group:
                    {
                        _id: 1,
                        count: { $sum: 1 },
                    },
                },

            ])
            let wordCount = await gameOver.aggregate([
                {
                    $match: {
                        $or: [{
                            $and: [{
                                "sender_id": ObjectId(req.user._id)
                            }]
                        },
                        {
                            $and: [{
                                "receiver_id": ObjectId(req.user._id)
                            }]
                        }],
                    },
                },
                {
                    $group:
                    {
                        _id: 1,
                        WordCounts: { $sum: "$WordCount" },

                    },
                },
            ])
            let mode = await Room.aggregate([
                {
                    $match: {
                        $or: [{
                            $and: [{
                                "sender_id": ObjectId(req.user._id)
                            },

                            ]
                        },
                        {
                            $and: [{
                                "receiver_id": ObjectId(req.user._id)
                            },
                            ]
                        }],

                    },
                },
                {
                    $group: {
                        _id: { name: "$type" },
                        count: { $sum: 1 }

                    }
                }
            ])
            let played = await Room.aggregate([
                {
                    $match: {
                        $or: [{
                            $and: [{
                                "sender_id": ObjectId(req.user._id)
                            }]
                        },
                        {
                            $and: [{
                                "receiver_id": ObjectId(req.user._id)
                            }]
                        }],
                    },
                },
                {
                    $group:
                    {
                        _id: 1,
                        count: { $sum: 1 },
                    },
                },
            ])

            var option1 = {
                sort: { totalPoints: -1 }
            }
            let results = await find.findAllPromise("userModel", {}, {}, option1);
            var rankss = [];
            for (let i = 0; i <= results.length - 1; i++) {
                if (i >= 1 && i <= results.length - 1) {
                    if (results[i - 1].totalPoints == results[i].totalPoints) {
                        results[i].userValue = results[i - 1].userValue
                    } else {
                        results[i].userValue = (i + 1)
                    }
                }
                else {
                    results[i].userValue = (i + 1)
                }
            }
            for (let i = 0; i <= results.length - 1; i++) {
                if (results[i]._id == req.user._id.toString()) {
                    result = results[i]
                }
            }


            console.log(result, 'result')
            var patners = 2;
            var accuracy = 0;
            var rank = 3;
            var create = 0;
            if (created.length > 0) {
                create = created[0].count
            }
            var playe = 0;
            if (played.length > 0) {
                playe = played[0].count
            }
            var wordCountAlls = 0;
            if (wordCount.length > 0) {
                wordCountAlls = wordCount[0].WordCounts
            }
            var Modes = 0
            if (mode.length === 0) {
                Modes = 0;
            } else if (mode.length === 1) {
                Modes = mode[0]._id.name
            } else if (mode.length === 2) {
                if (mode[0].count > mode[1].count) {
                    Modes = mode[0]._id.name
                } else {
                    Modes = mode[1]._id.name
                }
            }

            response.sendsuccessDataMultiple(res, ("User details found"), result, result1, create, wordCountAlls, Modes, playe, patners, rank, accuracy)
        } catch (error) {
            console.log('--------------------   getuserDetails ---------------- ', error);
            response.sendErrorCustomMessage(res, ("Internal Server Error"), "false");
        }
    },


    //---------------deleteUserAcount---------// 
    deleteUserAcount: async (req, res) => {
        try {
            console.log(req.user._id)

            let criteria = {
                _id: req.user._id
            }
            find.findByIdAndUpdatePromise("userModel", criteria, { $set: { deleteAccountStatus: true,deviceToken:'',deviceType:'' } }, { new: true }, {})

            // let criteria = {
            //     _id: req.user._id
            // }
            // find.findAndRemovePromise("userModel", criteria, {})
            response.sendsuccessData(res, ('User profile deleted successfully'));
        } catch (error) {
            console.log('--------------------   deleteServiceProfile ---------------- ', error);
            response.sendErrorCustomMessage(res, ("Internal Server Error"), "false");
        }
    },


    //------------------------updateUserProfile---------// 
    updateUserProfile: async (req, res) => {
        try {
            let dataToUpdate = req.body
            let criteria = {
                _id: req.user._id
            }
            if (req.files.profilePic) {
                let uploadedImage = await imageUpload(req.files.profilePic);
                dataToUpdate.profilePic = uploadedImage.secure_url
            }
            let result = await find.findByIdAndUpdatePromise("userModel", criteria, dataToUpdate, { new: true }, {})
            response.sendsuccessData(res, ("User profile updated"), result)
        } catch (error) {
            console.log('--------------------   updateProfile ---------------- ', error);
            response.sendErrorCustomMessage(res, ("Internal Server Error"), "false");
        }
    },


    //------------------guest login-------------//
    guestLogin: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            let d = (new Date().getTime()).toString()
            let uniq = Number(d.substring(3, 8))
            let dataToSave = req.body;
            dataToSave.name=`Guest${uniq}`
            dataToSave.userType="Guest"
            dataToSave.defaultLangCode = req.body.languageCode[0]
            let resultCoin = await find.findAllPromise("coinModel", {}, {}, {});
            dataToSave.coins = resultCoin[0].startCoin;
            let result = await create.create("userModel", dataToSave);
            let userCriteria = {
                _id: result._id
            }
            let dataToUpdate = {};
            dataToUpdate.jwtToken = jwt.sign({ _id: result._id }, config.jwtSecretKey, { expiresIn: '90d' })
            let result1 = await find.findAndUpdatePromise("userModel", userCriteria, dataToUpdate, {})
            let result3 = await find.findOnePromise("userModel", userCriteria, {}, {})
            response.sendsuccessData(res, ("User signed up sucessfully"), result3);
        } catch (error) {
            response.sendErrorCustomMessage(res, ("Internal Server Error"), "false");
        }
    },


    //------------------check login-------------//
    checkSocalId: async (req, res) => {

        console.log("Request for check social id is=============>", req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            let criteria = {
                socialId: req.body.socialId,
                deleteAccountStatus:false
            }
            console.log(criteria)
            let option = { lean: true }
            let result = await find.findOnePromise("userModel", criteria, {}, { option });
            console.log("Result is==========>", result)
            if (!result) {
                return response.sendSuccessMessage(res, ("User does not exist"))
            }
            let result1 = await find.findAllPromise("languageModel", {}, {}, {})
            if (!result1) {
                return response.sendErrorMessage(res, ("User does not exist"))
            }
            let jwtToken = jwt.sign({ "socialType": result.socialType, _id: result._id, socialId: result.socialId }, config.jwtSecretKey);
            let project = {
                $set: {
                    deviceType: req.body.deviceType,
                    deviceToken: req.body.deviceToken,
                    jwtToken: jwtToken
                }
            }
            criteria2 = {
                _id: result._id
            }

            let opation = { new: true }
            let resu = await find.findByIdAndUpdatePromise("userModel", criteria2, project, opation);
            return response.sendsuccessDataMultiple(res, ("User details found"), resu, result1)
        } catch (error) {
            console.log(error)
            return response.sendErrorCustomMessage(res, ("Internal Server Error"), "false");
        }
    },


    //-------------------getUserDemo--------------------------//
    getUserDemo: async (req, res) => {
        try {
            let criteria = {
                "socialType": "Facebook"
            }
            let option = { lean: true }
            let result = await find.findAllPromise("userModel", criteria, {}, option);

            response.sendsuccessData(res, ("User details found"), result)
        } catch (error) {
            console.log('--------------------   getuserDetails ---------------- ', error);
            response.sendErrorCustomMessage(res, ("Internal Server Error"), "false");
        }
    }
}
async function imageUpload(imageFile) {
    return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(imageFile.path, (error, result) => {
            if (error) {
                console.log(error)
                reject(error);
            } else {
                resolve(result);
            }
        })
    })
}



