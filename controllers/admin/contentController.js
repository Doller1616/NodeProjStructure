const find = require('../../query/find');
const create = require('../../query/create');
const response = require('../../utils/response');
const { validationResult } = require('express-validator/check');
const cloudinary = require('cloudinary');
const notificationFunc = require('../../utils/notification');
var isodate = require("isodate");
cloudinary.config({
    cloud_name: "altsols-com",
    api_key: "432157412791339",
    api_secret: "iLBqwz_JwopOvIRkoNulrLajSxY"
});

const update = require('../../query/update');
module.exports = {

    imagePagination: async (req, res) => {
        try {
            var options = {
                page: parseInt(req.params.pageNumber) || 1,
                limit: parseInt(req.params.limit) || 10,
                sort: { createdAt: -1 },
            }
            let result = await find.pagination("imageModel", {}, options);
            response.sendsuccessData(res, 'explanation list', result)

        } catch (error) {
            console.log('--------------------   ImageList ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    getImageById: async (req, res) => {
        try {
            let criteria = {
                _id: req.params._id
            }
            let result = await find.findOnePromise("imageModel", criteria, {}, {})
            response.sendsuccessData(res, "image", result)
        } catch (error) {
            console.log('--------------------   image ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------addImage---------//
    addImage: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            let criteria = {};
            criteria = req.body;
            if (req.files.images) {
                let imageArr = [];
                if (req.files.images.length > 0) {
                    for (var i = 0; i < req.files.images.length; i++) {
                        let uploadedImage = await imageUpload(req.files.images[i])
                        imageArr.push(uploadedImage.secure_url)
                        criteria.images = imageArr
                    }
                } else {
                    let imageArr = [];
                    let uploadedImage = await imageUpload(req.files.images)
                    imageArr.push(uploadedImage.secure_url)
                    criteria.images = imageArr
                }
            }
            console.log(criteria)
            let result = await create.create("imageModel", criteria);
            if (criteria.images.length > 0) {
                for (let i = 0; i <= criteria.images.length - 1; i++) {
                    let senderUserDetail = {}
                    senderUserDetail.Image = criteria.images[i];
                    await create.create("imageCount", senderUserDetail);
                }
            }
            response.sendsuccessData(res, 'Create successful Image ', result)
        } catch (error) {
            console.log('--------------------   contentAdd ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },


    //---------------addImage---------//
    helpandsuport: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            let criteria = {};
            criteria = req.body;
            let result = await create.create("helpandSuportModel", criteria);
            response.sendsuccessData(res, 'Create successful Image ', result)
        } catch (error) {
            console.log('--------------------   contentAdd ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------addImage---------//
    helpAndSuportValue: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            let criteria = {};
            criteria.type = req.params.type;
            let result = await find.findOnePromise("helpandSuportModel", criteria);
            response.sendsuccessData(res, 'Create successful Image ', result)
        } catch (error) {
            console.log('--------------------   contentAdd ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------addImage---------//
    helpAndSuportUpdate: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            let criteria = {};
            criteria.type = req.body.type;
            dataToUpdate = {};
            dataToUpdate.value = req.body.value;
            let option = { lean: true }
            let result = await find.findAndUpdatePromise("helpandSuportModel", criteria, dataToUpdate, option);
            let criteria1 = {};
            criteria1.type = req.body.type;
            let result1 = await find.findOnePromise("helpandSuportModel", criteria1);
            response.sendsuccessData(res, 'Create successful Image ', result1)
        } catch (error) {
            console.log('--------------------   contentAdd ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },



    //---------------deleteImage------------//
    deleteImage: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            let criteria = {
                _id: req.body._id
            }
            let dataToUpdate = req.body;
            let result = await find.findAndRemovePromise("imageModel", criteria, dataToUpdate, { new: true })
            response.sendsuccessData(res, 'Image delete successfully ', result)
        } catch (error) {
            console.log('--------------------   contentEdit ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------listImage---------//
    listImage: async (req, res) => {
        try {
            let result = await find.findAllPromise("imageModel", {}, {}, {})
            response.sendsuccessData(res, 'Images list', result)

        } catch (error) {
            console.log('--------------------   contentList ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------editImage---------//
    editImage: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            let criteria = {
                _id: req.params._id
            }
            let removeArrayToUpdate = {};
            removeArrayToUpdate.images = [];
            let results = await find.findAndUpdatePromise("imageModel", criteria, removeArrayToUpdate, { new: true })
            let dataToUpdate = {};
            if (req.files.images) {
                let imageArr = [];
                if (req.files.images.length > 0) {
                    for (var i = 0; i < req.files.images.length; i++) {
                        let uploadedImage = await imageUpload(req.files.images[i])
                        imageArr.push(uploadedImage.secure_url)
                        dataToUpdate.images = imageArr
                    }
                } else {
                    let imageArr = [];
                    let uploadedImage = await imageUpload(req.files.images)
                    imageArr.push(uploadedImage.secure_url)
                    dataToUpdate.images = imageArr
                }
            }
            let result = await find.findAndUpdatePromise("imageModel", criteria, dataToUpdate, { new: true })
            if (req.body.preImage) {
                let criteria = {
                    _id: req.params._id
                }
                let senderUserpublicGallery = {};
                senderUserpublicGallery = {
                    $push: { images: { $each: req.body.preImage } },
                };
                let gameCreate = await update.updateMany("imageModel", criteria, senderUserpublicGallery, {});
            }
            let resultsss = await find.findAllPromise("imageModel", {}, {}, {})
            response.sendsuccessData(res, 'Image updated', result)
        } catch (error) {
            console.log('--------------------   contentEdit ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------AllUserNotification send -----------------------//
    AllUserNotification: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            let option = { lean: true }
            let result = await find.findAllPromise("userModel", {}, {}, option);
            for (let i = 0; i <= result.length - 1; i++) {
                if (result[i].deviceToken) {
                    var tital = req.body.tital;
                    var msg = req.body.message;
                    notificationFunc.sendNotificationForAndroid(result[i].deviceToken, tital, msg, "req.user", "receiverUserDetails", 'gameDetailsAll', "resultNotification._id")
                }
            }
            response.sendsuccessData(res, 'send notification multiple users ..', "")

        } catch (error) {
            console.log('--------------------send notification ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------AllUserNotification send -----------------------//

    totalUser: async (req, res) => {
        try {
            console.log(req.body)
            let criteria = {
                createdAt: {
                    $gte: new isodate(req.body.startDate),
                    $lt: new isodate(req.body.endDate)
                }
            }
            console.log(criteria)
            let user = await find.findCountPromise("userModel", criteria, {}, {});
            let totalUser = await find.findCountPromise("userModel", {}, {}, {});
            let game = await find.findCountPromise("gameModel", criteria, {}, {});
            response.sendsuccessDeshbord(res, ("Total user data succesfully"), user, totalUser, game)
        } catch (error) {
            console.log('--------------------   totalUser ---------------- ', error);
            response.sendErrorCustomMessage(res, ("Internal Server Error"), "false");
        }
    },
    PageLoadTotalUser: async (req, res) => {
        try {
            let user = await find.findCountPromise("userModel", {}, {}, {});
            let totalUser = await find.findCountPromise("userModel", {}, {}, {});
            let game = await find.findCountPromise("gameModel", {}, {}, {});
            response.sendsuccessDeshbord(res, ("Total user data succesfully"), user, totalUser, game)
        } catch (error) {
            console.log('--------------------   totalUser ---------------- ', error);
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