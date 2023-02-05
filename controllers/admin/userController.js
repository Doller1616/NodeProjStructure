const find = require('../../query/find');
const create = require('../../query/create');
const response = require('../../utils/response');
const bcrypt = require('../../utils/bcrypt');
const jwt = require('jsonwebtoken');
const config = require('./../../config/config');
const { validationResult } = require('express-validator/check');
var func = require('../../utils/function');
const cloudinary = require('cloudinary');
const Admin = require('../../models/adminModel');

cloudinary.config({
    cloud_name: "altsols-com",
    api_key: "432157412791339",
    api_secret: "iLBqwz_JwopOvIRkoNulrLajSxY"
});

module.exports = {
    createAdmin: async (req, res) => {
        try {
            let dataToSave = req.body;
            let criteria = {
                Type: 'Admin'
            }
            let result = await find.findOnePromise("adminModel", criteria, {}, {});
            if (result) {
                return response.sendErrorMessage(res, "Admin already exists")
            } else {
                let password = await bcrypt.bcryptGenerate(req.body.password)
                dataToSave.password = password
                let result = await create.create("adminModel", dataToSave);
                return response.sendsuccessData(res, "Admin created sucessfully", result);
            }
        } catch (error) {
            console.log('--------------------   signup ---------------- ', error);
            return response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },

    adminDetails: async (req, res) => {
        try {
            let criteria = {
                _id: req.admin._id
            }
            let result = await find.findOnePromise("adminModel", criteria, {}, {})
            return response.sendsuccessData(res, "Profile found succesfully", result)
        } catch (error) {
            console.log('--------------------   adminLogout ---------------- ', error);
            return response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },

    listUser: async (req, res) => {
        try {
            var options = {
                page: parseInt(req.params.pageNumber) || 1,
                limit: parseInt(req.params.limit) || 10,
                sort: { createdAt: -1 },
            }
            var query = {deleteAccountStatus:false}
            if (req.body.search) {
                query.$and = [{
                    $or: [
                        { "name": { $regex: "^" + req.body.search, $options: 'i' } },
                        { "username": { $regex: "^" + req.body.search, $options: 'i' } },
                    ]
                }]
            }
            let result = await find.pagination("userModel", query, options);
            response.sendsuccessData(res, "User data succesfully", result)
        } catch (error) {
            console.log('--------------------   listUser ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //------------------------updateUserProfile---------// 
    updateUserProfileStatus: async (req, res) => {
        try {

            let criteria = {
                _id: req.body._id
            }
            let option = { lean: true }
            let result = await find.findOnePromise("userModel", criteria, {}, option);
            var status = (result.status == 1) ? 0 : 1;
            let dataToUpdate = {};
            dataToUpdate.status = status
            let criteria1 = {
                _id: req.body._id
            }
            let result1 = await find.findByIdAndUpdatePromise("userModel", criteria1, dataToUpdate, { new: true }, {})
            response.sendsuccessData(res, ("User status updated"), result1)
        } catch (error) {
            console.log('--------------------   updateProfile ---------------- ', error);
            response.sendErrorCustomMessage(res, ("Internal Server Error"), "false");
        }
    },
    adminForgotPassword: async (req, res) => {
        try {
            if (!req.body.email) {
                response.sendErrorMessage(res, "Email is required", "false");
            }
            req.body.email = req.body.email.toLowerCase();
            let criteria = {}
            criteria.email = req.body.email;
            let checkEmail = await find.findOnePromise("adminModel", criteria, {}, {});

            if (!checkEmail) {
                return response.sendErrorMessage(res, "Invalid Email")
            }
            let adminId = checkEmail._id;
            let otp = Math.floor(10000000 + Math.random() * 90000000)
            let password = otp.toString()
            let newPassword = await bcrypt.bcryptGenerate(password)
            let name = checkEmail.name;
            let criteria1 = {}
            criteria1._id = adminId;
            project = {};
            project.password = newPassword;
            let checkEmail1 = await find.findByIdAndUpdatePromise("adminModel", criteria1, project, {});
            response.sendSuccessMessage(res, "New password has been sent on your registered email");
            func.sendHtmlEmail1(req.body.email, "Forgot Password", name, password, (error1, result1) => {
            })
        } catch (error) {
            console.log(error)
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    getUserDetails: async (req, res) => {
        try {
            let criteria = {
                _id: req.params._id
            }
            let option = { lean: true }
            let result = await find.findOnePromise("userModel", criteria, {}, option)
            if (!result) {
                return response.sendErrorMessage(res, ("User does not exist"))
            }
            // let profileCriteria = {
            //     userId: req.user._id
            // }
            // let profile = await find.findOnePromise("serviceModel", profileCriteria, {}, {})
            // result.profile = profile
            response.sendsuccessData(res, ("User details found"), result)
        } catch (error) {
            console.log('--------------------   getuserDetails ---------------- ', error);
            response.sendErrorCustomMessage(res, ("Internal Server Error"), "false");
        }
    },
    Login: async (req, res) => {
        try {
            console.log("Request for admin login is===========>",req.body)
            let criteria = {}
            criteria.email = req.body.email
            let admin = await find.findOnePromise("adminModel", criteria, {}, {})
            if (!admin) {
                return response.sendErrorMessage(res, "Admin not Found")
            }
            let comparePassword = await bcrypt.bcryptCompare(req.body.password, admin.password);
            if (!comparePassword) {
                return response.sendErrorMessage(res, "Password is incorrect")
            }
            let jwtToken = await jwt.sign({ password: req.body.password, _id: admin._id }, config.jwtSecretKey)
            let dataToUpdate = {}
            dataToUpdate.jwtToken = jwtToken;
            let result1 = await find.findAndUpdatePromise("adminModel", criteria, dataToUpdate, {});
            let result = await find.findOnePromise("adminModel", criteria, {}, {})
            response.sendsuccessData(res, "Login succesfully", result)
        } catch (error) {
            console.log('--------------------   adminLogin ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },

    totalCount: async (req, res) => {
        try {
            query = {};
            if (req.body.startDate && req.body.endDate) {
                query.createdAt = { $gte: req.body.startDate, $lte: req.body.endDate }
            }
            let users = await find.findCountPromise("userModel", {}, {}, {});
            let obj = { "User": users }
            return res.send({ response_code: 200, response_message: "Collection found", obj });
        } catch (error) {
            return res.send({ response_code: 500, response_message: "Internal server error" });
        }
    },

    changePassword: async (req, res) => {
        try {

            let criteria = {
                _id: req.body.adminId
            }
            let admin = await find.findOnePromise("adminModel", criteria, {}, {})
            if (!admin) {
                response.sendErrorCustomMessage(res, "Admin not found")
                return
            }
            let comparePassword = await bcrypt.bcryptCompare(req.body.oldPassword, admin.password);
            if (!comparePassword) {
                response.sendErrorMessage(res, "Invalid password")
                return
            }
            let dataToUpdate = {}
            let password = await bcrypt.bcryptGenerate(req.body.newPassword)
            dataToUpdate.password = password
            let result = await find.findAndUpdatePromise("adminModel", criteria, dataToUpdate, {})
            response.sendSuccessMessage(res, 'Admin password changed successfully')
        } catch (error) {
            console.log('----------------------changePassword---------------', error)
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },

    updateGameCount:async(req,res)=>{

        try{

            let updateAdmin=await Admin.findByIdAndUpdate({_id:req.body.adminId},{$set:{gameUserCount:req.body.gameUserCount}},{new:true})
            if (!updateAdmin) {
                response.sendErrorMessage(res, "Something went wrong")
                return
            }
            return res.send({ response_code: 200, response_message: "Data successfully" });
        }catch(error){
            console.log('Error is---------------', error)
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },

    getAdminData:async(req,res)=>{

        try{
            let admimData=await Admin.findOne({_id:req.body.adminId}).lean()
            if (!admimData) {
                response.sendErrorMessage(res, "Something went wrong")
                return
            }
            delete(admimData.password)
            return res.send({ response_code: 200, response_message: "Data successfully",admimData });
        }catch(error){
            onsole.log('Error is---------------', error)
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
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
