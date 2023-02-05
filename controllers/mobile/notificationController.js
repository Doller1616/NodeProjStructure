const find = require('../../query/find');
const response = require('../../utils/response');
const i18n_module = require("i18n-nodejs");
var ObjectId = require('mongodb').ObjectId;
const Notifications = require('../../models/notificationModel')

const configs = {
    "lang": ['en', 'ar'],
    "langFile": "./../../helper/language.json"
}
module.exports = {

    notificationUpdate: async (req, res) => {
        try {
            let criteria = {
                "userId": ObjectId("5e736538341bc31c238ddd0b"),
                "status": '2'
            }


            let option = { sort: { createdAt: -1 }, lean: true }
            let notificationResult = await find.findOnePromise("notificationModel", criteria, {}, option);

            if (!notificationResult) {
                return response.sendErrorMessage(res, ("Email already exists"));
            }
            var criteria1 = {};
            criteria1.sender_id = notificationResult.sender_id;
            var senderDetails = await find.findOnePromise("userModel", criteria1, {}, {});



            var criteria2 = {};
            criteria2.receiver_id = notificationResult.receiver_id;
            var receiverDetails = await find.findOnePromise("userModel", criteria2, {}, {});



            var criteriaFinal = {};
            criteriaFinal._id = notificationResult.gameId;
            var gameDetailsAll = await find.findOnePromise("gameModel", criteriaFinal, {}, {});

            var objectDetails = {
                senderDetails, receiverDetails, gameDetailsAll, notificationResult
            }

            console.log(objectDetails);
            response.sendsuccessData(objectDetails, ("notification Setting updated"))
        } catch (error) {
            console.log('--------------------   notificationSetting ---------------- ', error);
            response.sendErrorCustomMessage(res, ("Internal Server Error"), "false");
        }
    },

    notificationCount: async (req, res) => {
        try {
            let criteria = {
                UserId: req.user._id,
                isSeen:false
            }
            let result = await find.findCountPromise("notificationModel", criteria, {}, {})
            response.sendsuccessData(res, ("Notification list found successfully"), result)
        } catch (error) {
            console.log('--------------------   notificationCount ---------------- ', error);
            response.sendErrorCustomMessage(res, ("Internal Server Error"), "false");
        }
    },

    notificationList: async (req, res) => {
        try {
            let populate = {
                path: "userId"
            }
            let option = { sort: { createdAt: -1 }, lean: true }
            if (req.user._id) {
                let criteria = {
                    userId: req.user._id,
                    createdAt: -1
                }
                let result = await find.getAllPopulatePromise("notificationModel", criteria, {}, option, populate)

                for (var i = 0; i < result.length; i++) {
                    result[i].fullName = result[i].userId.fullName
                    result[i].userId = result[i].userId._id
                }
                let deleteCriteria = {
                    userId: req.params.userId,
                    createdAt: -1
                }
                find.findAndRemoveManyPromise("notificationModel", deleteCriteria, {})
                response.sendsuccessData(res, ("Notification list found successfully"), result)
                return
            }
        } catch (error) {
            console.log('--------------------   notificationList ---------------- ', error);
            response.sendErrorCustomMessage(res, ("Internal Server Error"), "false");
        }
    },
    notificationListbyId: async (req, res) => {
        try {
            let notificationsList = await Notifications.aggregate([
                {
                    $match: {
                        "receiverId": ObjectId(req.user._id),
                    }
                },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "usersDetail"
                    }
                },
                {
                    $project: {
                        'usersDetail.aboutus': 1,
                        '_id': 1,
                        userId: 1,
                        receiverId: 1,
                        gameId: 1,
                        profilePic: 1,
                        title: 1,
                        type: 1,
                        fullName: 1,
                        status: 1,
                        createdAt: 1,
                        isSeen:1
                    }
                },
                
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $limit:30
                }
            ])
            objectDetailsAll = {
                list: notificationsList
            }
            let userCriteria = {
                "receiverId": ObjectId(req.user._id),
                isSeen:false
            }
            console.log(userCriteria)
            let dataToUpdate = {};
            // dataToUpdate.status = 4;
            dataToUpdate.isSeen = true;
            console.log(dataToUpdate)
            let result1 = await find.findAndUpdateAllPromise("notificationModel", userCriteria, dataToUpdate, {})
            console.log("Notification list is===========>",notificationsList)
            return response.sendsuccessData(res, ("Notification list found successfully"), objectDetailsAll)
        } catch (error) {
            console.log('--------------------   notificationList ---------------- ', error);
            response.sendErrorCustomMessage(res, ("Internal Server Error"), "false");
        }
    },
}

