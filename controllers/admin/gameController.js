const find = require('../../query/find');
const create = require('../../query/create');
const response = require('../../utils/response');
const bcrypt = require('../../utils/bcrypt');
const jwt = require('jsonwebtoken');
const config = require('./../../config/config');
const { validationResult } = require('express-validator/check');
var func = require('../../utils/function');
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: "altsols-com",
    api_key: "432157412791339",
    api_secret: "iLBqwz_JwopOvIRkoNulrLajSxY"
});
const update = require('../../query/update');
const GameModel = require('../../models/gameModel');

module.exports = {

    gameCreate: async (req, res) => {
        try {
            let criteria = {};
            // criteria.userId = req.admin._id;
            criteria.mode = req.body.mode;
            criteria.languageCode = req.body.languageCode;
            criteria.customInstructions = req.body.customInstructions;
            criteria.morePrecisely = req.body.morePrecisely;
            criteria.objective = req.body.objective;
            criteria.socialId = req.body.socialId;
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
            let result = await create.create("gameModel", criteria);
            return response.sendsuccessData(res, "Game Create successfully", result);
        }
        catch (error) {
            console.log(error)
            return res.status(500).send({ message: error.message })
        }
    },
    listGamePagination: async (req, res) => {
        try {
            var size = 10
            let results = await GameModel.aggregate([
                {
                    $lookup: {
                        from: "explanations",
                        localField: "objective",
                        foreignField: "_id",
                        as: "forecasterData"
                    }
                },
                {
                    $unwind: {
                        path: "$forecasterData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "converses",
                        localField: "morePrecisely",
                        foreignField: "_id",
                        as: "converserData"
                    }
                },
                {
                    $unwind: {
                        path: "$converserData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: 1,
                        languageCode: 1,
                        converse: 1,
                        userId: 1,
                        morePrecisely: 1,
                        objective: 1,
                        mode: 1,
                        languageCode: 1,
                        status: 1,
                        NotificationStatus: 1,
                        customInstructions: 1,
                        images: 1,
                        'forecasterData.explanation': 1,
                        "converserData.converse": 1
                    }
                },
                { $sort: { createdAt: -1 }, },
                { "$skip": (size * (req.params.pageNumber - 1)) },
                { $limit: parseInt(req.params.limit) || 10 }
            ])
            console.log("results", results)
            let options = {
                page: parseInt(req.params.pageNumber) || 1,
                limit: parseInt(req.params.limit) || 10,
                sort: { createdAt: -1 },
            }

            let notifications = await GameModel.aggregatePaginate(results, options)
            var test = { docs: results, page: options.page, limit: options.limit, total: notifications.totalCount, pages: notifications.pageCount }
            response.sendsuccessData(res, 'converse list', test);

        } catch (error) {
            console.log('--------------------   contentList ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    gameDetailsById: async (req, res) => {
        try {
            let criteria = {};
            criteria._id = req.params._id;
            let userExist = await find.findOnePromise("gameModel", criteria, {}, {});
            return response.sendsuccessData(res, "Game create successfullly", userExist);

        } catch (error) {
            console.log('--------------------   contentAdd ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------editGame---------//
    editGame: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            console.log(req.body)
            let criteria = {
                _id: req.params._id
            }
            let removeArrayToUpdate = {};
            removeArrayToUpdate.images = [];
            let results = await find.findAndUpdatePromise("gameModel", criteria, removeArrayToUpdate, { new: true })
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
            let result = await find.findAndUpdatePromise("gameModel", criteria, dataToUpdate, { new: true })
            if (req.body.preImage) {
                let criteria = {
                    _id: req.params._id
                }
                let senderUserpublicGallery = {};
                senderUserpublicGallery = {
                    $push: { images: { $each: req.body.preImage } },
                };
                let gameCreate = await update.updateMany("gameModel", criteria, senderUserpublicGallery, {});
            }
            let resultsss = await find.findAllPromise("gameModel", {}, {}, {})
            response.sendsuccessData(res, 'Image updated', result)
        } catch (error) {
            console.log('--------------------   contentEdit ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },

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