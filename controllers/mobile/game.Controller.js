const find = require('../../query/find');
const create = require('../../query/create');
const update = require('../../query/update');
const Point = require('../../models/chatModel')
const response = require('../../utils/response');
const bcrypt = require('../../utils/bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const { validationResult } = require('express-validator/check');
var func = require('../../utils/function');
const cloudinary = require('cloudinary');
const notificationFunc = require('../../utils/notification');
const { ObjectId } = require('mongodb');
const Notifications = require('../../models/notificationModel')
const Room = require('../../models/roomModel');
const User = require('../../models/userModel');
const Image = require('../../models/imageCount');
const gameOver = require('../../models/gameOverModel');
const ChatModel = require('../../models/chatModel');
const Chat = require('../../models/chatModel.js')
cloudinary.config({
    cloud_name: "altsols-com",
    api_key: "432157412791339",
    api_secret: "iLBqwz_JwopOvIRkoNulrLajSxY"
});

module.exports = {

    gameCreate: async (req, res) => {
        try {
            if (req.body.type === 'random_patner') {
                let senderUserDetails = {};
                senderUserDetails.mode = req.body.mode;
                senderUserDetails.languageCode = req.body.languageCode;
                senderUserDetails.customInstructions = req.body.customInstructions;
                senderUserDetails.morePrecisely = ObjectId(req.body.morePrecisely);
                senderUserDetails.objective = ObjectId(req.body.objective);
                senderUserDetails.userId = req.user._id;
                senderUserDetails.gameType = 2;
                senderUserDetails.type = 2;
                senderUserDetails.images = [];
                let gameCreateDetails = await create.create("gameModel", senderUserDetails);
                let criteria1 = {

                };
                criteria1._id = req.body.socialId;
                var receiverUserDetails = await find.findOnePromise("userModel", criteria1, {}, {})
                if (!receiverUserDetails) {
                    return response.sendErrorMessage(res, "Invalid Social Id");
                }
                //----------------------------create game-----------------//
                console.log("publicGallery", req.body.publicGallery)
                if (req.body.publicGallery) {
                    let senderUserpublicGallery = {};
                    senderUserpublicGallery = {
                        $push: { images: { $each: req.body.publicGallery } },
                    };
                    let gamecriteria = {
                        _id: gameCreateDetails._id
                    }
                    let gameCreate = await update.updateMany("gameModel", gamecriteria, senderUserpublicGallery, {});
                }

                if (req.body.publicGallery) {
                    for (let i = 0; i <= req.body.publicGallery.length - 1; i++) {
                        let senderUserDetail = {}
                        senderUserDetail.Image = req.body.publicGallery[i];
                        await create.create("imageCount", senderUserDetail);
                    }
                }
                //-------------------------------------update public Galery-----------------//
                var criteriaFinal = {};
                criteriaFinal._id = gameCreateDetails._id;
                var gameDetailsAll = await find.findOnePromise("gameModel", criteriaFinal, {}, {});

                let type = req.body.mode;
                let notifiCationDetail = {};
                let tital = `${req.user.name} sends you an invitation!`;
                notifiCationDetail.userId = ObjectId(req.user._id);
                notifiCationDetail.receiverId = ObjectId(receiverUserDetails._id);
                notifiCationDetail.gameId = ObjectId(gameCreateDetails._id);
                notifiCationDetail.profilePic = req.user.profilePic;
                notifiCationDetail.fullName = req.user.name;
                notifiCationDetail.type = type;
                let resultNotification = await create.create("notificationModel", notifiCationDetail);
                console.log("receiverUserDetails.deviceToken", receiverUserDetails.deviceToken)
                let receiverDeatil = {
                    name: receiverUserDetails.name,
                    profilePic: receiverUserDetails.profilePic,
                    _id: receiverUserDetails._id,
                    type: receiverUserDetails.type
                }
                let sendDeatil = {
                    name: req.user.name,
                    profilePic: req.user.profilePic,
                    _id: req.user._id,
                    type: req.user.type
                }
                if (receiverUserDetails.deviceToken) {
                    if (receiverUserDetails.notification) {
                        let msg = `${req.user.name} invites you to a LikeWise game. Guess your partner's chat now.`;
                        notificationFunc.sendNotificationForAndroid(receiverUserDetails.deviceToken, tital, msg, "", receiverDeatil, "", resultNotification._id)
                    }
                }
                return response.sendsuccessCreateGame(res, "Invitation Create successfully", gameDetailsAll, receiverUserDetails._id, resultNotification._id);
            } else {
                console.log('hello')
                let senderUserDetails = {};
                senderUserDetails.mode = req.body.mode;
                senderUserDetails.languageCode = req.body.languageCode;
                senderUserDetails.customInstructions = req.body.customInstructions;
                senderUserDetails.morePrecisely = ObjectId(req.body.morePrecisely);
                senderUserDetails.objective = ObjectId(req.body.objective);
                senderUserDetails.socialId = req.body.socialId;
                senderUserDetails.userId = req.user._id;
                senderUserDetails.gameType = 1;
                var criteria1 = {
                    $or: [{ socialId: req.body.socialId }, { _id: req.body.socialId }]
                };
                // criteria1.socialId = req.body.socialId;
                var receiverUserDetails = await find.findOnePromise("userModel", criteria1, {}, {})
                if (!receiverUserDetails) {
                    return response.sendErrorMessage(res, "Invalid Social Id")
                }
                if (req.files.images) {
                    let imageArr = [];
                    if (req.files.images.length > 0) {
                        for (var i = 0; i < req.files.images.length; i++) {
                            let uploadedImage = await imageUpload(req.files.images[i])
                            imageArr.push(uploadedImage.secure_url)
                            senderUserDetails.images = imageArr
                        }
                    } else {
                        let imageArr = [];
                        let uploadedImage = await imageUpload(req.files.images)
                        imageArr.push(uploadedImage.secure_url)
                        senderUserDetails.images = imageArr
                    }
                }

                let gameCreateDetails = await create.create("gameModel", senderUserDetails);

                //----------------------------create game-----------------//
                if (req.body.publicGallery) {
                    let senderUserpublicGallery = {};
                    senderUserpublicGallery = {
                        $push: { images: { $each: req.body.publicGallery } },
                    };
                    let gamecriteria = {
                        _id: gameCreateDetails._id
                    }
                    let gameCreate = await update.updateMany("gameModel", gamecriteria, senderUserpublicGallery, {});
                }

                if (req.body.publicGallery) {
                    for (let i = 0; i <= req.body.publicGallery.length - 1; i++) {
                        let senderUserDetail = {}
                        senderUserDetail.Image = req.body.publicGallery[i];
                        await create.create("imageCount", senderUserDetail);
                    }
                }

                //-------------------------------------update public Galery-----------------//
                var criteriaFinal = {};
                criteriaFinal._id = gameCreateDetails._id;
                var gameDetailsAll = await find.findOnePromise("gameModel", criteriaFinal, {}, {});
                console.log("gameUploadpickExtrCreate", gameDetailsAll)

                let type = req.body.mode;
                let notifiCationDetail = {};
                let tital = `${req.user.name} sends you an invitation!`;
                notifiCationDetail.userId = ObjectId(req.user._id);
                notifiCationDetail.receiverId = ObjectId(receiverUserDetails._id);
                notifiCationDetail.gameId = ObjectId(gameCreateDetails._id);
                notifiCationDetail.profilePic = req.user.profilePic;
                notifiCationDetail.fullName = req.user.name;
                notifiCationDetail.type = type;
                let resultNotification = await create.create("notificationModel", notifiCationDetail);
                console.log("Noti data is==========>", resultNotification)
                console.log("receiverUserDetails.deviceToken", receiverUserDetails.deviceToken)
                let receiverDeatil = {
                    name: receiverUserDetails.name,
                    profilePic: receiverUserDetails.profilePic,
                    _id: receiverUserDetails._id,
                    type: receiverUserDetails.type
                }
                console.log("Rec data is========>", receiverDeatil)
                let sendDeatil = {
                    name: req.user.name,
                    profilePic: req.user.profilePic,
                    _id: req.user._id,
                    type: req.user.type
                }
                if (receiverUserDetails.deviceToken) {
                    if (receiverUserDetails.notification) {
                        let msg = `${req.user.name} invites you to a LikeWise game. Guess your partner's chat now.`;
                        notificationFunc.sendNotificationForAndroid(receiverUserDetails.deviceToken, tital, msg, "", receiverDeatil, "", resultNotification._id)
                    }
                }
                return response.sendsuccessCreateGame(res, "Invitation Create successfully", gameDetailsAll, receiverUserDetails._id, resultNotification._id);
            }
        }
        catch (error) {
            console.log(error)
            return res.status(500).send({ message: error.message })
        }
    },
    socialIdValidOrNot: async (req, res) => {
        try {
            var fullArray = [];
            if (req.body.socalId.length > 0) {
                for (var i = 0; i < req.body.socalId.length; i++) {
                    var criteria = {};
                    criteria.socialId = req.body.socalId[i];
                    var senderUserDetails = await find.findOnePromise("userModel", criteria, {}, {})
                    if (senderUserDetails)
                        fullArray.push(req.body.socalId[i])
                }
            }
            return response.sendsuccessData(res, "SocialId valid", fullArray);
        }
        catch (error) {
            console.log(error)
            return res.status(500).send({ message: error.message })
        }
    },
    dailyCheckCoin: async (req, res) => {
        try {
            let criteria = {
                _id: req.user._id,
                "coinDate":
                {
                    $lt: new Date(),
                    $gte: new Date(new Date().setDate(new Date().getDate() - 1))
                }
            }
            var senderDetails = await find.findOnePromise("userModel", criteria, {}, {});
            if (senderDetails) {
                return response.sendErrorMessage(res, "already send point given");
            } else {
                let data = {
                    result: true
                }
                return response.sendsuccessData(res, "Invitation send successfully", data);
            }
        }
        catch (error) {
            console.log(error)
            return res.status(500).send({ message: error.message })
        }
    },
    addDailyCoin: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            if (req.body.type === 2) {
                let dataToUpdate = {
                    coinDate: new Date(),
                    coinStatus: 1
                }
                let result = await find.findAndUpdatePromise("userModel", criteria, dataToUpdate, { new: true })
                response.sendsuccessData(res, 'Invitation send successfully', result)
            } else {
                let criteria2 = {
                    _id: req.user._id,
                    "coinDate":
                    {
                        $lt: new Date(),
                        $gte: new Date(new Date().setDate(new Date().getDate() - 1))
                    }
                }
                var senderDetails = await find.findOnePromise("userModel", criteria2, {}, {});
                if (senderDetails) {
                    return response.sendErrorMessage(res, "already send point given");
                }
                let criteria = {
                    _id: req.user._id
                }
                let dataToUpdate = {
                    coins: req.user.coins + parseInt(req.body.coin),
                    coinDate: new Date(),
                    coinStatus: 1
                }
                let result = await find.findAndUpdatePromise("userModel", criteria, dataToUpdate, { new: true })
                response.sendsuccessData(res, 'Invitation send successfully', result)
            }

        } catch (error) {
            console.log('--------------------   contentAdd ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    addCoins: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            let criteria = {
                _id: req.user._id
            }
            let dataToUpdate = {
                coins: req.user.coins + parseInt(req.body.coin),
                coinDate: new Date(),
                coinStatus: 1
            }
            console.log(criteria, dataToUpdate)
            let result = await find.findAndUpdatePromise("userModel", criteria, dataToUpdate, { new: true })
            response.sendsuccessData(res, 'Invitation send successfully', result)
        } catch (error) {
            console.log('--------------------   contentAdd ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    checkDailyCoin: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            let criteria2 = {
                _id: req.user._id,
                "coinDate":
                {
                    $lt: new Date(),
                    $gte: new Date(new Date().setDate(new Date().getDate() - 1))
                }
            }
            var senderDetails = await find.findOnePromise("userModel", criteria2, {}, {});
            if (senderDetails) {
                return response.sendErrorMessage(res, "already send point given");
            } else {
                return response.sendErrorMessage(res, "send point given");
            }
        } catch (error) {
            console.log('--------------------   contentAdd ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    addVideo: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            let dataToSave = {}
            dataToSave = req.body;
            if (req.files.video) {
                let uploadedImage = await videoUpload(req.files.video);
                dataToSave.video = uploadedImage.secure_url
            }
            let result = await create.create("videoModel", dataToSave);
            response.sendsuccessData(res, 'Create successful language ', result)
        } catch (error) {
            console.log('--------------------   contentAdd ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    viewVideo: async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }

        try {
            let viewer = { $and: [{ _id: req.body.postId }, { views: req.user._id }] }
            let user1 = await Find.findOnePromise("postModel", viewer, {}, {})
            if (!user1) {
                let newView = await Post.updateOne({ _id: req.body.postId }, { $push: { "views": req.user._id } });
                let criteria4 = { _id: req.body.postId }
                let latestView = await Find.findOnePromise("postModel", criteria4, {}, {})
                var totalView = latestView.views.length
                let criteria8 = {
                    _id: req.body.postId
                }

                let dataToUpdate = { totalViews: latestView.views.length }
                let user2 = await Find.findAndUpdatePromise("postModel", criteria8, dataToUpdate, {})
            }
            // return res.send({ response_code: 200, Data: updatedPost, totalLike })
            response.sendsuccessData(res, 'Create successful language ', result)
        } catch (error) {
            console.log('--------------------   contentAdd ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    Explanation: async (req, res) => {
        try {
            let dataToSave = req.body;
            let result = await create.create("contentModel", dataToSave)
            response.sendsuccessData(res, 'Content created', result)
        } catch (error) {
            console.log('--------------------   contentAdd ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }

    },
    gameDetails: async (req, res) => {
        try {
            console.log("Request for game detail is===========>", req.body)
            var criteriaFinal = {};
            criteriaFinal._id = req.body.game_id;
            var gameDetailsAll = await find.findOnePromise("gameModel", criteriaFinal, {}, {});
            var criteriaExplanations = {};
            criteriaExplanations._id = gameDetailsAll.morePrecisely;
            let project = {
                converse: 1,
                _id: 0
            }
            var gameCriteriaExplanations = await find.findOnePromise("converseModel", criteriaExplanations, project, {});
            var criteriaMorePrecisely = {}
            criteriaMorePrecisely._id = gameDetailsAll.objective;
            let project1 = {
                explanation: 1,
                picture: 1,
                _id: 0,
            }
            var morePrecisely = await find.findOnePromise("explanationModel", criteriaMorePrecisely, project1, {});
            var criterialanguageCode = {}
            var project2 = {
                language: 1,
                code: 1,
                picture: 1,
            }

            criterialanguageCode.code = gameDetailsAll.languageCode;
            var languageCodeDetails = await find.findOnePromise("languageModel", criterialanguageCode, project2, {});
            var criteriaFinalCount = {};
            criteriaFinalCount.game_id = req.body.game_id;
            var gameCount = await find.findOnePromise("cardCountModel", criteriaFinalCount, {}, {});
            var criteriaDetails = {};
            criteriaDetails._id = req.body.receiver_id;
            var receiverUserDetails = await find.findOnePromise("userModel", criteriaDetails, {}, {});
            let coinMangage = await find.findAllPromise("coinModel", {}, {}, {});
            var cardCountArray = [];
            for (let i = 0; i <= gameDetailsAll.images.length - 1; i++) {
                let cardCount = await ChatModel.aggregate([
                    {
                        $match: {
                            Image: gameDetailsAll.images[i],
                        }
                    },
                    {
                        $group: {
                            _id: "$game_id",
                        }
                    },
                ])
                if (cardCount.length < 3) {
                    let object = {
                        Image: gameDetailsAll.images[i],
                        suggestion: 50
                    };
                    cardCountArray.push(object)
                } else if (cardCount.length == 0) {
                    let object = {
                        Image: gameDetailsAll.images[i],
                        suggestion: 50
                    };
                    cardCountArray.push(object);
                } else {
                    let cardCount1 = await ChatModel.aggregate([
                        {
                            $match: {
                                Image: gameDetailsAll.images[i],
                            }
                        },
                        {
                            $group: {
                                _id: "$room_id",
                            }
                        },
                    ])
                    console.log("cardCount1.length", cardCount1.length)
                    if (cardCount1.length > 0) {
                        let criteria = {
                            Image: gameDetailsAll.images[i],
                            isMatched: true
                        }
                        var senderDetails = await find.findAllPromise("chatModel", criteria, {}, {});
                        count = 0;
                        gamecount = [];
                        var test = true;
                        for (let i = 0; i <= senderDetails.length - 1; i++) {
                            if (i == 0) {
                                gamecount.push(senderDetails[i].game_id)
                            } else {
                                if (gamecount.indexOf(senderDetails[i].game_id) !== -1) {
                                    console.log('hello')
                                } else {
                                    console.log('hello1')
                                    gamecount.push(senderDetails[i].game_id)
                                }
                            }
                        }
                        var testing1 = cardCount1.length;
                        var testing2 = gamecount.length;

                        console.log("cardCount1", cardCount1);
                        console.log("gamecount", gamecount.length);
                        var testing3 = testing2 / testing1;
                        let object = {
                            Image: gameDetailsAll.images[i],
                            suggestion: Math.round(testing3 * 100)
                        };
                        cardCountArray.push(object);
                    }
                }
            }
            console.log(cardCountArray)
            let finalArray = []
            let criteria = {
                sender_id: ObjectId(req.body.user_id),
                "room_status": true,
                status: { $ne: 4 },
                game_id: req.body.game_id
                // status:{$ne:5},
            }
            let populate = {
                path: "receiver_id"
            }
            let project10 = {
                lastmessage: 1,
                fullName: 1,
                profilePic: 1,
                room_id: 1,
                updatedAt: 1,
                game_id: 1,
                sender_id: 1,
                createdAt: 1,
                timeUpdate: 1,

            }
            let option = {
                sort: {
                    createdAt: 1,
                },
                lean: true
            }
            let result = await find.getAllPopulatePromise("roomModel", criteria, project10, option, populate)
            if (result.length == 0) {
                let criteria1 = {
                    receiver_id: ObjectId(req.body.user_id),
                    "room_status": true,
                    status: { $ne: 4 },
                    game_id: req.body.game_id
                    // status:{$ne:5},
                }
                let populate2 = {
                    path: "sender_id"
                }
                let project3 = {
                    sender_id: 1,
                    profilePic: 1,
                    propertyId: 1,
                    propertyType: 1,
                    room_id: 1,
                    updatedAt: 1,
                    game_id: 1,
                    createdAt: 1,
                    timeUpdate: 1,

                }
                let option1 = {
                    sort: {
                        "updatedAt": -1,
                    },
                    lean: true
                }
                let result1 = await find.getAllPopulatePromise("roomModel", criteria1, project3, option1, populate2)
                console.log("Result is===========>", result1.length)
                if (result1.length == 0) {
                    console.log("Final array is===========>", finalArray)
                    response.sendsuccessDataMultipleGame(res, 'gameDetails list', gameDetailsAll, gameCriteriaExplanations, morePrecisely, languageCodeDetails, gameCount, receiverUserDetails, coinMangage, cardCountArray, finalArray)
                }
                if (result1.length > 0) {
                    for (var i = 0; i < result1.length; i++) {
                        let property = await find.findOnePromise("userModel", {
                            "_id": result1[i]._id,
                        })
                        var propetyOwner = ''
                        if (property) {
                            propetyOwner = property._id
                        }
                        let gameFullDetails = await find.findOnePromise("gameModel", {
                            "_id": result1[i].game_id,
                            // status:{$ne:"4"}
                        });
                        console.log("Game full data is==========>", gameFullDetails)
                        let checkCode = await find.findOnePromise("languageModel", {
                            "code": gameFullDetails.languageCode,
                        });

                        let morePrecisely = await find.findOnePromise("converseModel", {
                            "_id": gameFullDetails.morePrecisely,
                        });

                        let objective = await find.findOnePromise("explanationModel", {
                            "_id": gameFullDetails.objective,
                        });

                        var options = {
                            createdAt: +1
                        }
                        let criteria = {
                            room_id: result1[i].room_id
                        }
                        // console.log("result1[i].sender_id.profilePic",result1[i].sender_id)

                        var current_card = await find.findLastInsertId("cardpassModel", criteria);
                        current_card = (current_card.length === 0) ? 0 : current_card[0].card + 1;
                        var lives = await find.findLastInsertId("livesModel", criteria);
                        lives = (lives.length === 0) ? 8 : lives[0].lives;
                        finalArray.push({
                            // game_id: result1[i].game_id,
                            room_id: result1[i].room_id,
                            sender_id: result1[i].sender_id._id,
                            profilePic: result1[i].sender_id.profilePic,
                            receiver_id: result1[i].sender_id._id,
                            timeUpdate: result1[i].timeUpdate,
                            name: result1[i].sender_id.name,
                            createdAt: result1[i].createdAt,
                            updatedAt: result1[i].updatedAt,
                            user_type: result1[i].sender_id.type,
                            pointDetails: "",
                            mode: gameFullDetails.mode,
                            languageDetails: checkCode,
                            objectives: objective.explanation,
                            morePreciselys: morePrecisely.converse,
                            current_card: current_card,
                            lives: lives
                        })
                    }
                    console.log("Final array is===========>", finalArray)
                    response.sendsuccessDataMultipleGame(res, 'gameDetails list', gameDetailsAll, gameCriteriaExplanations, morePrecisely, languageCodeDetails, gameCount, receiverUserDetails, coinMangage, cardCountArray, finalArray)
                }

            }

            console.log("Result is===========>", result.length)
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    let property = await find.findOnePromise("userModel", {
                        "_id": result[i]._id,
                    })
                    var propetyOwner = ''
                    if (property) {
                        propetyOwner = property._id
                    }
                    let gameFullDetails = await find.findOnePromise("gameModel", {
                        "_id": result[i].game_id,

                    });
                    console.log("Game full data is==========>", gameFullDetails)
                    let checkCode = await find.findOnePromise("languageModel", {
                        "code": gameFullDetails.languageCode,
                    });
                    let morePrecisely = await find.findOnePromise("converseModel", {
                        "_id": gameFullDetails.morePrecisely,
                    });
                    let objective = await find.findOnePromise("explanationModel", {
                        "_id": gameFullDetails.objective,
                    });
                    options = {
                        "updatedAt": +1,
                    }
                    let criteria = {
                        room_id: result[i].room_id
                    }



                    var current_card = await find.findLastInsertId("cardpassModel", criteria);
                    current_card = (current_card.length === 0) ? 0 : current_card[0].card + 1;

                    var lives = await find.findLastInsertId("livesModel", criteria);
                    lives = (lives.length === 0) ? 8 : lives[0].lives;
                    finalArray.push({
                        room_id: result[i].room_id,
                        sender_id: result[i].sender_id,
                        game_id: result[i].game_id,
                        profilePic: result[i].receiver_id.profilePic,
                        receiver_id: result[i].receiver_id._id,
                        name: result[i].receiver_id.name,
                        updatedAt: result[i].updatedAt,
                        createdAt: result[i].createdAt,
                        user_type: result[i].receiver_id.type,
                        timeUpdate: result[i].timeUpdate,
                        pointDetails: "",
                        mode: gameFullDetails.mode,
                        languageDetails: checkCode,
                        objectives: objective.explanation,
                        morePreciselys: morePrecisely.converse,
                        current_card: current_card,
                        lives: lives
                    })
                }
                console.log("Final array is===========>", finalArray)
                response.sendsuccessDataMultipleGame(res, 'gameDetails list', gameDetailsAll, gameCriteriaExplanations, morePrecisely, languageCodeDetails, gameCount, receiverUserDetails, coinMangage, cardCountArray, finalArray)

            }




        } catch (error) {
            console.log('--------------------   contentAdd ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    gameCardCount: async (req, res) => {
        try {
            let criteria = {};
            var gameCreateDetails
            criteria.game_id = req.body.game_id;
            criteria.card = req.body.card;
            let userExist = await find.findOnePromise("cardCountModel", criteria, {}, {});
            if (userExist === null) {
                criteria.count = 1;
                gameCreateDetails = await create.create("cardCountModel", criteria);
            } else {
                let userExist = await find.findOnePromise("cardCountModel", criteria, {}, {})
                let criteria3 = {
                    game_id: req.body.game_id,
                    card: req.body.card
                }
                let dataToUpdate = {};
                dataToUpdate.count = userExist.count + 1;
                find.findAndUpdatePromise("cardCountModel", criteria3, dataToUpdate, { new: true })
            }
            response.sendsuccessData(res, 'explanation updated', gameCreateDetails)

        } catch (error) {
            console.log('--------------------   contentAdd ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------getOtherUserDetails---------// 
    getOtherUserDetails: async (req, res) => {
        try {
            let criteria = {
                _id: req.params.id
            }
            let option = { lean: true }
            let result = await find.findOnePromise("userModel", criteria, {}, option);
            let result1 = await find.findAllPromise("languageModel", {}, {}, {})
            if (!result) {
                return response.sendErrorMessage(res, ("User does not exist"))
            }

            let totalMatch = await Room.aggregate([
                {
                    $match: {
                        $or: [{
                            $and: [{
                                "sender_id": ObjectId(req.params.id)
                            },
                            ]
                        },
                        {
                            $and: [{
                                "receiver_id": ObjectId(req.params.id)
                            },
                            ]
                        }],
                    },
                },


                {
                    $group:
                    {
                        _id: 1,
                        count: { $sum: 1 },
                        gameType: { $max: "$gameType" }
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
                if (results[i]._id == req.params.id.toString()) {
                    result = results[i]
                }
            }


            let likewisePersanteges = await gameOver.aggregate([
                {
                    $match: {
                        $or: [{
                            $and: [
                                {
                                    "sender_id": ObjectId(req.params.id)
                                },
                                {
                                    "receiver_id": ObjectId(req.user._id)
                                }
                            ]
                        },
                        {
                            $and: [
                                {
                                    "receiver_id": ObjectId(req.params.id)
                                },
                                {
                                    "sender_id": ObjectId(req.user._id)
                                },
                            ]
                        }],
                    },
                },
                {
                    $group:
                    {
                        _id: 1,
                        sumStreaks: { $sum: "$likewisePersantegeValue" },
                        count: { $sum: 1 },
                    },
                },
            ]);
            let likewisePer = 0;
            if (likewisePersanteges.length > 0) {
                if (likewisePersanteges[0].sumStreaks > 0) {
                    likewisePer = likewisePersanteges[0].sumStreaks / likewisePersanteges[0].count
                }
            }
            console.log(likewisePer);

            // let likewisePersanteges = await gameOver.aggregate([
            //     {
            //         $match: {
            //             $or: [{
            //                 $and: [
            //                     {
            //                         "sender_id": ObjectId(req.params.id)
            //                     },
            //                 ]
            //             },
            //             {
            //                 $and: [
            //                     {
            //                         "receiver_id": ObjectId(req.params.id)
            //                     },
            //                 ]
            //             }],
            //         },
            //     },
            //     {
            //         $group:
            //         {
            //             _id: 1,
            //             sumStreaks: { $sum: "$likewisePersantegeValue" },
            //             count: { $sum: 1 },
            //         },
            //     },
            // ]);
            // let likewisePer = 0;
            // if (likewisePersanteges.length > 0) {
            //     if (likewisePersanteges[0].sumStreaks > 0) {
            //         likewisePer = likewisePersanteges[0].sumStreaks / likewisePersanteges[0].count
            //     }
            // }
            let createMatch = await Room.aggregate([
                {
                    $match: {
                        $or: [{
                            $and: [{
                                "sender_id": ObjectId(req.params.id)
                            },]
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
            let commonMatch = await Room.aggregate([
                {
                    $match: {
                        $or: [{
                            $and: [{
                                "sender_id": ObjectId(req.params.id)
                            },
                            {
                                "receiver_id": ObjectId(req.body.local_id)
                            },
                            ]
                        },
                        {
                            $and: [{
                                "receiver_id": ObjectId(req.params.id)
                            },
                            {
                                "sender_id": ObjectId(req.body.local_id)
                            },]
                        }],
                    }
                },
                {
                    $group:
                    {
                        _id: 1,
                        count: { $sum: 1 },
                    },
                },
            ])
            var commonMatchFindallArray = [];
            let commonMatchFindall = await Room.aggregate([
                {
                    $match: {
                        $or: [{
                            $and: [{
                                "sender_id": ObjectId(req.params.id)
                            },

                            ]
                        },
                        {
                            $and: [{
                                "receiver_id": ObjectId(req.params.id)
                            },
                            ]
                        }],
                    }
                },

            ])

            for (let i = 0; i <= commonMatchFindall.length - 1; i++) {
                console.log(commonMatchFindall[i].sender_id == req.params.id)
                var beverage = (commonMatchFindall[i].sender_id !== req.params.id) ? "" : commonMatchFindallArray.push(commonMatchFindall[i].receiver_id);
                var beverages = (commonMatchFindall[i].receiver_id !== req.params.id) ? "" : commonMatchFindallArray.push(commonMatchFindall[i].sender_id);
                console.log(commonMatchFindallArray)
            }
            let wordCountAll = await gameOver.aggregate([
                {
                    $match: {
                        $or: [{
                            $and: [{
                                "sender_id": ObjectId(req.params.id)
                            }]
                        },
                        {
                            $and: [{
                                "receiver_id": ObjectId(req.params.id)
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
            let favoriteMode = await Room.aggregate([
                {
                    $match: {
                        $or: [{
                            $and: [{
                                "sender_id": ObjectId(req.params.id)
                            },
                            {
                                "receiver_id": ObjectId(req.body.local_id)
                            },
                            ]
                        },
                        {
                            $and: [{
                                "receiver_id": ObjectId(req.params.id)
                            },
                            {
                                "sender_id": ObjectId(req.body.local_id)
                            },]
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

            var totalMatchFind = 0;
            if (totalMatch.length > 0) {
                totalMatchFind = totalMatch[0].count
            }
            var createMatchFind = 0;
            if (createMatch.length > 0) {
                createMatchFind = createMatch[0].count
            }
            var commonMatchFind = 0;
            if (commonMatch.length > 0) {
                commonMatchFind = commonMatch[0].count
            }
            var wordCountAlls = 0;
            if (wordCountAll.length > 0) {
                wordCountAlls = wordCountAll[0].WordCounts
            }
            var finalFavoriteModes = 1;
            if (favoriteMode.length === 0) {
                finalFavoriteModes = 1;
            } else if (favoriteMode.length === 1) {
                finalFavoriteModes = favoriteMode[0]._id.name
            } else if (favoriteMode.length === 2) {
                if (favoriteMode[0].count > favoriteMode[1].count) {
                    finalFavoriteModes = favoriteMode[0]._id.name
                } else {
                    finalFavoriteModes = favoriteMode[1]._id.name
                }
            }
            let details = {
                receiver_details: result,
                countryList: result1,
                totalMatchFind: totalMatchFind,
                createMatchFind: createMatchFind,
                commonMatchFind: commonMatchFind,
                wordCountAlls: wordCountAlls,
                finalFavoriteModes: finalFavoriteModes,
                accuracy: likewisePer,
                likewisePersantegess: Math.round(likewisePer)
            }
            response.sendsuccessData(res, ("User details found"), details)
        } catch (error) {
            console.log('--------------------   getuserDetails ---------------- ', error);
            response.sendErrorCustomMessage(res, ("Internal Server Error"), "false");
        }
    },
    gameOver: async (req, res) => {

        console.log("Request for game over is=========>", req.body)
        try {
            let criteria5 = {}
            criteria5.room_id = req.body.room_id;
            let userExist = await find.findOnePromise("chatModel", criteria5, {}, {})
            if (userExist == null) {

                console.log("user not exit ===============>")
                var testing = [{
                    "_id": req.body.room_id,
                    "scoreMax": 0,
                    "pointMax": 0,
                    "sumStreaks": 0,
                    "bonus": 0
                }]
                let TotalMessage = 0;
                let TotalMatch = 0;
                let LikeWisePersantege = 0;
                let Average_lowest_half_of_All_Matched_Avreage = 0;
                let option = { lean: true }
                let criteria9 = {
                    _id: req.body.receiver_id
                }
                let result4 = await find.findOnePromise("userModel", criteria9, {}, option);
                if (!result4) {
                    return response.sendErrorMessage(res, ("User does not exist"))
                }
                let criteria6 = {
                    _id: req.user._id
                }
                let result = await find.findOnePromise("userModel", criteria6, {}, option);
                if (!result) {
                    return response.sendErrorMessage(res, ("User does not exist"))
                }
                let criteria8 = {
                    _id: req.user._id,
                }
                let dataSave = {}
                dataSave.sender_id = req.body.sender_id;
                dataSave.receiver_id = req.body.receiver_id;
                dataSave.room_id = req.body.room_id;
                dataSave.likewisePersantegeValue = 0;
                dataSave.PointTotalMatchPersantege = 0;

                dataSave.WordCount = 0;
                dataSave.score = 0;
                dataSave.rank = 3;

                let dataToUpdate = {};
                dataToUpdate.coins = req.body.coin;
                // dataToUpdate.coins = (parseInt(result.coins) + (parseInt(followerDetail[0].scoreMax / 20)));
                dataToUpdate.totalPoints = (result.totalPoints) + (Number(testing[0].pointMax));
                dataToUpdate.All_LikeWise_NumbtotalPointser = (parseInt(result.All_LikeWise_Number) + (parseInt(1)));
                dataToUpdate.All_LikeWise_Persantege = 0
                dataToUpdate.userValue = ((Number(result.All_LikeWise_Persantege) + (Number(0)))) * (Number(result.All_LikeWise_Number) + (Number(1))) / 100;
                
                await create.create("gameOverModel", dataSave);
                let result2 = await find.findByIdAndUpdatePromise("userModel", criteria8, dataToUpdate, { new: true }, {})
                let results8 = await find.findAllPromise("coinModel", {}, {}, {});
                return response.sendsuccessDataMultipleGameOver(res, 'explanation updated', testing, TotalMessage, TotalMatch, 0, Average_lowest_half_of_All_Matched_Avreage, result4, result2.coins, results8)
            }
            let criteria3 = {
                room_id: req.body.room_id
            }
            let dataToUpdate1 = {};
            dataToUpdate1.room_status = false;
            find.findAndUpdatePromise("roomModel", criteria3, dataToUpdate1, { new: true })
            
            let followerDetail = await Point.aggregate([
                {
                    $match: {
                        room_id: req.body.room_id
                    }
                },
                {
                    $group:
                    {
                        scoreMax: { $max: "$score" },
                        totalMessageWordCount: { $sum: "$messageWordCount" },
                        pointMax: { $max: "$point" },
                        sumStreaks: { $sum: "$streaks" },
                        bonus: { $max: "$bonus" },
                        _id: req.body.room_id,
                    },
                },
            ])
            if (followerDetail.length === 0) {

                console.log("Length zero is==========>")
                var testing = [{
                    "_id": req.body.room_id,
                    "scoreMax": 0,
                    "pointMax": 0,
                    "sumStreaks": 0,
                    "bonus": 0
                }]
                let TotalMessage = 0;
                let TotalMatch = 0;
                let LikeWisePersantege = 0;
                let Average_lowest_half_of_All_Matched_Avreage = 0;
                let option = { lean: true }
                let criteria9 = {
                    _id: req.body.receiver_id
                }
                let result4 = await find.findOnePromise("userModel", criteria9, {}, option);
                if (!result4) {
                    return response.sendErrorMessage(res, ("User does not exist"))
                }
                let criteria6 = {
                    _id: req.user._id
                }
                let result = await find.findOnePromise("userModel", criteria6, {}, option);
                if (!result) {
                    return response.sendErrorMessage(res, ("User does not exist"))
                }
                let criteria8 = {
                    _id: req.user._id,
                }
                let dataSave = {}
                dataSave.sender_id = req.body.sender_id;
                dataSave.receiver_id = req.body.receiver_id;
                dataSave.room_id = req.body.room_id;
                dataSave.likewisePersantegeValue = 0;
                dataSave.PointTotalMatchPersantege = 0;

                dataSave.WordCount = 0;
                dataSave.score = 0;
                dataSave.rank = 3;

                let dataToUpdate = {};
                dataToUpdate.coins = req.body.coin;
                // dataToUpdate.coins = (parseInt(result.coins) + (parseInt(followerDetail[0].scoreMax / 20)));
                dataToUpdate.totalPoints = (result.totalPoints) + (Number(testing[0].pointMax));
                dataToUpdate.All_LikeWise_NumbtotalPointser = (parseInt(result.All_LikeWise_Number) + (parseInt(1)));
                dataToUpdate.All_LikeWise_Persantege = 0
                dataToUpdate.userValue = ((Number(result.All_LikeWise_Persantege) + (Number(0)))) * (Number(result.All_LikeWise_Number) + (Number(1))) / 100;

                await create.create("gameOverModel", dataSave);
                let result2 = await find.findByIdAndUpdatePromise("userModel", criteria8, dataToUpdate, { new: true }, {})
                let results8 = await find.findAllPromise("coinModel", {}, {}, {});
                return response.sendsuccessDataMultipleGameOver(res, 'explanation updated', testing, TotalMessage, TotalMatch, 0, Average_lowest_half_of_All_Matched_Avreage, result4, result2.coins, results8)

                // return response.sendsuccessDataMultipleGameOver(res, 'explanation updated', testing, TotalMessage, TotalMatch, LikeWisePersantege, Average_lowest_half_of_All_Matched_Avreage)
            }

            let totalMatchCount = await Point.aggregate([
                {
                    $match: {
                        room_id: req.body.room_id,
                        isMatched: true
                    }
                },
                {
                    $group:
                    {
                        totalMessageWordCount: { $sum: "$messageWordCount" },
                        _id: req.body.room_id,
                    },
                },
            ])
            let totalNotMatchCount = await Point.aggregate([
                {
                    $match: {
                        room_id: req.body.room_id,
                        isMatched: false
                    }
                },
                {
                    $group:
                    {
                        totalMessageWordCount: { $sum: "$messageWordCount" },
                        _id: req.body.room_id,
                    },
                },
            ])

            let totalMatchWordCountReal = 0
            if (totalMatchCount.length > 0) {
                if (Number(totalMatchCount[0].totalMessageWordCount) > 0) {
                    totalMatchWordCountReal = Number(totalMatchCount[0].totalMessageWordCount) / 2
                }
                else {
                    totalMatchWordCountReal = Number(totalMatchCount[0].totalMessageWordCount)
                }
            }
            let totalNotMatchWordCountReal = Number(totalNotMatchCount[0].totalMessageWordCount)

            let realMessage = totalMatchWordCountReal + totalNotMatchWordCountReal

            console.log("Message count real is==========>", realMessage)


            console.log("Follower data is=========>", followerDetail)

            //total message
            let criteria = {
                room_id: req.body.room_id,
            }
            let TotalMessage = 0
            let totalMessage = await find.findCountPromise("chatModel", criteria, {}, {});

            let queryTotal = {
                room_id: req.body.room_id,
                isMatched: true
            }
            let totalMessageReal = await find.findCountPromise("chatModel", queryTotal, {}, {});

            let criteria1 = {
                room_id: req.body.room_id,
                isMatched: true
            }
            //total match 
            let TotalMatch = 0
            let match = await find.findCountPromise("chatModel", criteria1, {}, {});
            TotalMatch = Number(match) / 2
            console.log("Total match is===========>", TotalMatch)
            let criteria2 = {
                room_id: req.body.room_id,
            }
            let sort = {
                all_matched: 1,

            }
            let matchWordWithBonus = 0
            TotalMessage = totalMessage - TotalMatch
            console.log("Total message is=========>", TotalMessage)
            let bonusSum = await Point.aggregate([
                {
                    $match: {
                        room_id: req.body.room_id,
                        isMatched: true
                    }
                },
                {
                    $group:
                    {

                        bonus: { $sum: "$bonus" },
                        _id: req.body.room_id,
                    },
                },
            ])
            if (bonusSum.length > 0) {
                matchWordWithBonus = Number(bonusSum[0].bonus) / 2
            }
            console.log("Bonus data is========>", bonusSum, matchWordWithBonus)

            // let messageWordCount = Number(followerDetail[0].totalMessageWordCount) / 2

            let BonusTotalMatchPersantege = 0
            // console.log("Message count is=========>", messageWordCount)
            if (totalMessageReal > 0) {
                BonusTotalMatchPersantege = (Number(matchWordWithBonus / realMessage) * 100);
            }
            console.log("Bonus total is===========>", BonusTotalMatchPersantege)

            let limit = totalMessageReal
            // if (TotalMessage > 0) {
            //     limit = Math.round(TotalMessage / 2)
            // }
            // var limit = (TotalMessage >= 2) ? TotalMessage / 2 : TotalMessage;
            console.log("Limit is=========>", totalMessageReal)

            let actualLimit = 0
            if (limit > 0) {
                actualLimit = limit / 2
            }

            // let zeroQuery={
            //     room_id: req.body.room_id,
            //     all_matched:0

            // }
            // let zeroData = await ChatModel.find(zeroQuery).count()

            // let countZero=0
            // if(zeroData>0){
            //     countZero=zeroData/2
            // }

            let avrQuery = {
                room_id: req.body.room_id,
                isMatched: true
            }

            let Average_lowest_half_of_All_Matched = await find.findSortBy("chatModel", avrQuery, sort, actualLimit);
            console.log("Avg data is===============>", Average_lowest_half_of_All_Matched)
            let sum = 0;
            for (let i = 0; i < Average_lowest_half_of_All_Matched.length; i++) {
                sum = sum + Average_lowest_half_of_All_Matched[i].all_matched;
            }
            console.log("Sum is=============>", sum)
            let Low_Ave_All_Matched = Number(sum) / Number(limit)

            // let Average_lowest_half_of_All_Matched_Avreage = (1 - (sum / Average_lowest_half_of_All_Matched.length));
            // let Average_lowest_half_of_All_Matched_Avreage = (1 - Number(Low_Ave_All_Matched));
            let Average_lowest_half_of_All_Matched_Avreage = (100 - Number(Low_Ave_All_Matched));
            console.log("Avg lowest is=======>", Average_lowest_half_of_All_Matched_Avreage)
            let sumStreaksPersantege = 0
            if (followerDetail[0].sumStreaks > 1) {
                sumStreaksPersantege = Number(followerDetail[0].sumStreaks) / 2

            }
            // if (!followerDetail.length === 0) {
            //     if (followerDetail[0].sumStreaks > 0) {
            //         sumStreaksPersantege = followerDetail[0].sumStreaks;
            //     }
            // }
            console.log("Total match is=========>", TotalMatch)
            let PointTotalMatchPersantege = (Number(TotalMatch / TotalMessage) * 100);
            console.log("Point table is=======>", PointTotalMatchPersantege)
            // let BonusTotalMatchPersantege = (Number(TotalMatch / TotalMessage) * 100);
            let newData = (Number(PointTotalMatchPersantege) + Number(BonusTotalMatchPersantege) + Number(Average_lowest_half_of_All_Matched_Avreage)) / 3
            console.log("New data is=======", newData)
            // let LikeWisePersantege = (PointTotalMatchPersantege + BonusTotalMatchPersantege + Average_lowest_half_of_All_Matched_Avreage) / 3 + sumStreaksPersantege;
            let LikeWisePersantege = Math.round(Number(newData) + Number(sumStreaksPersantege))
            console.log("Like wise % is==========>", LikeWisePersantege);

            let criteria6 = {
                _id: req.user._id
            }
            let option = { lean: true }
            let result = await find.findOnePromise("userModel", criteria6, {}, option);
            if (!result) {
                return response.sendErrorMessage(res, ("User does not exist"))
            }
            let criteria9 = {
                _id: req.body.receiver_id
            }
            let result4 = await find.findOnePromise("userModel", criteria9, {}, option);
            if (!result) {
                return response.sendErrorMessage(res, ("User does not exist"))
            }
            let newLikeWisePer = 0
            let senderData = Number(LikeWisePersantege)

            console.log("Sender data is========>", senderData)
            let recData = Number(result4.All_LikeWise_Persantege)
            console.log("rec data is========>", recData)
            if (senderData > recData) {
                newLikeWisePer = recData
            }
            if (recData > senderData) {
                newLikeWisePer = senderData
            }
            if (recData = senderData) {
                newLikeWisePer = senderData
            }

            if (newLikeWisePer >= 100) {
                newLikeWisePer = 100
            }

            if (Number(match) == 0) {
                newLikeWisePer = 0
            }

            console.log("Actual % is=========>", newLikeWisePer)


            let dataToUpdate = {};
            dataToUpdate.coins = req.body.coin;
            // dataToUpdate.coins = (parseInt(result.coins) + (parseInt(followerDetail[0].scoreMax / 20)));
            dataToUpdate.totalPoints = (result.totalPoints) + (Number(followerDetail[0].pointMax));
            dataToUpdate.All_LikeWise_NumbtotalPointser = (parseInt(result.All_LikeWise_Number) + (parseInt(1)));
            dataToUpdate.All_LikeWise_Persantege = newLikeWisePer
            dataToUpdate.userValue = ((Number(result.All_LikeWise_Persantege) + (Number(newLikeWisePer)))) * (Number(result.All_LikeWise_Number) + (Number(1))) / 100;
            let criteria8 = {
                _id: req.user._id,
            }
            //--------------------------------------------Score save-------gameOverModel--------------------//
            let criteria10 = {}
            criteria10.room_id = req.body.room_id;
            let userExists = await find.findOnePromise("gameOverModel", criteria10, {}, {})
            // ChatModel 
            if (userExists == null) {
                let WordCount = await ChatModel.aggregate([
                    {
                        $group:
                        {
                            messageWordCount: { $sum: "$messageWordCount" },
                            _id: req.body.room_id,
                        },
                    },
                ])
                //------------------------------------------create---------------------//
                let dataSave = {};
                dataSave.sender_id = userExist.sender_id;
                dataSave.receiver_id = userExist.receiver_id;
                dataSave.room_id = req.body.room_id;
                dataSave.likewisePersantegeValue = newLikeWisePer;
                dataSave.PointTotalMatchPersantege = PointTotalMatchPersantege;
                dataSave.WordCount = WordCount[0].messageWordCount;
                dataSave.score = followerDetail[0].scoreMax;
                dataSave.rank = 3;
                let result = await create.create("gameOverModel", dataSave);
            }
            let result2 = await find.findByIdAndUpdatePromise("userModel", criteria8, dataToUpdate, { new: true }, {})
            let results8 = await find.findAllPromise("coinModel", {}, {}, {});
            return response.sendsuccessDataMultipleGameOver(res, 'explanation updated', followerDetail, TotalMessage, TotalMatch, newLikeWisePer, Average_lowest_half_of_All_Matched_Avreage, result4, result2.coins, results8)
        } catch (error) {
            console.log('--------------------   contentAdd ---------------- ', error);
            return response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    getGameDetails: async (req, res) => {
        let finalArray = []
        let criteria = {
            $or: [{
                $and: [{
                    "sender_id": ObjectId(req.user._id)
                },]
            },
            {
                $and: [
                    {
                        "receiver_id": ObjectId(req.user._id)
                    },
                ]
            }]
        }
        let populate = {
            path: "receiver_id",

        }
        let project = {
            room_id: 1,
            "sender_id": 1,
            "receiver_id": 1,
        }
        let option = {
            sort: {
                updatedAt: -1
            },
            lean: true
        }

        let result = await find.getAllPopulatePromise("roomModel", criteria, project, option, populate)
        response.sendsuccessData(res, 'gameDetails list', result)
    },
    getFindPatner: async (req, res) => {


        console.log("Request for get partner list is==========>", req.body);
        let finalArray = []
        try {
            // project = {
            //     sender_id: 1,
            //     receiver_id: 1,
            //     room_id: 1,
            // }
            // var criteria = {
            //     "languageCode": req.body.languageCode,
            //     "type": req.body.type,
            //     // "room_status": false,
            //     // "type": 2,
            //     // updatedAt: { $lte: new Date(new Date() - 5 * 60 * 60 * 24 * 1000) }
            // }

            // let roomVerification = await find.findAllPromise("roomModel", criteria, project, {});

            // console.log("Room data is========>", roomVerification)
            // if (roomVerification.length == 0) {
            //     return response.sendErrorMessage(res, ("no partner found."));
            // }
            // if (roomVerification.length > 0) {
            //     for (var i = 0; i < roomVerification.length; i++) {
            //         finalArray.push("" + roomVerification[i].sender_id + "");
            //         finalArray.push("" + roomVerification[i].receiver_id + "");
            //     }
            // }
            // var filterCodeAndType = finalArray.filter((a, b) => finalArray.indexOf(a) === b);
            // for (var i = 0; i < filterCodeAndType.length; i++) {
            //     if (filterCodeAndType[i] === req.user._id) {
            //         filterCodeAndType.splice(i, 1);
            //     }
            // }
            // console.log("Final user id is========>", filterCodeAndType)
            let userDetails = [];
            //for (var i = 0; i < filterCodeAndType.length; i++) {
            // let criteria6 = {
            //     _id: filterCodeAndType[i],
            //     type: { $ne: 3 }
            // }
            let language = []
            language.push(req.body.languageCode)
            console.log("Code is========>", language)
            var criteria = {

                "languageCode": { $in: language },
                // "type": req.body.type,
                // "room_status": false,
                // "type": 2,
                // updatedAt: { $lte: new Date(new Date() - 5 * 60 * 60 * 24 * 1000) }
            }
            let project = {
                "_id": "1",
                "profilePic": "1",
                "All_LikeWise_Persantege": "1",
                "All_LikeWise_Number": "1",
                "userValue": "1",
                "name": "1",
                "gender": "1",
            }
            // let option = { lean: true }
            let list = await User.aggregate([
                {
                    $match: { "languageCode": { $in: language }, _id: { $ne: ObjectId(req.user._id) }, type: { $ne: 3 } }
                },
                {
                    $project: {
                        "_id": 1,
                        "profilePic": 1,
                        "All_LikeWise_Persantege": 1,
                        "All_LikeWise_Number": 1,
                        "userValue": 1,
                        "name": 1,
                        "gender": 1,
                    }
                }
            ])

            // let result = await find.findOnePromise("userModel", criteria, project, option);
            // console.log("Result is==========>", list)
            // if (result.length == 0) {
            //     console.log('null')
            // } else {
            //     userDetails.push(result);
            // }
            //}
            let followerDetail = await Image.aggregate([
                {
                    $group: {
                        _id: { Image: "$Image" },
                        count: { $sum: 1 }
                    }
                },
                // {
                //     $match: {
                //         count: { "$gt": 1 }
                //     }
                // },
                {
                    $sort: {
                        count: -1
                    }
                }
            ])
            let explanationModel = await find.findAllPromise("explanationModel", {}, {}, {})
            let converseModel = await find.findAllPromise("converseModel", {}, {}, {})

            let details = {
                followerDetail: followerDetail,
                userDetails: list,
                converseModel: converseModel,
                explanationModel: explanationModel
            }
            console.log("result is==========>", details)
            response.sendsuccessData(res, 'userDetails', details)
        } catch (error) {
            console.log('------------------getRoomId---------------------', error)
            response.sendErrorCustomMessage(res, ("Internal server error"), "false")
        }
    },
    countCardValue: async (req, res) => {
        try {
            var yes = [];
            for (let i = 0; i < req.body.Data.length; i++) {
                var criteria = {
                    $or: [{
                        $and: [{
                            "sender_id": ObjectId(req.body.sender_id)
                        },
                        {
                            "Image": req.body.Data[i]
                        }
                        ]
                    },
                    {
                        $and: [
                            {
                                "receiver_id": ObjectId(req.body.sender_id)
                            },
                            {
                                "Image": req.body.Data[i]
                            }
                        ]
                    }]
                }
                let roomVerification = await find.findOnePromise("chatModel", criteria, {}, {});
                console.log("roomVerification", roomVerification)
                var criteria1 = {
                    $or: [{
                        $and: [{
                            "sender_id": ObjectId(req.body.receiver_id)
                        },
                        {
                            "Image": req.body.Data[i]
                        }
                        ]
                    },
                    {
                        $and: [
                            {
                                "receiver_id": ObjectId(req.body.receiver_id)
                            },
                            {
                                "Image": req.body.Data[i]
                            }
                        ]
                    }]
                }
                let roomVerification1 = await find.findOnePromise("chatModel", criteria1, {}, {})
                console.log("roomVerification1", roomVerification1)

                if (roomVerification !== null && roomVerification1 !== null) {
                    yes.push({
                        isMatched: false,
                        Image: req.body.Data[i],
                    })
                } else {
                    yes.push({
                        isMatched: true,
                        Image: req.body.Data[i],
                    })
                }
            }
            let Details = {
                cardImage: yes,
            }
            console.log(Details)
            return response.sendsuccessData(res, "SocialId valid", Details);
        } catch (error) {
            console.log('------------------getRoomId---------------------', error)
            response.sendErrorCustomMessage(res, ("Internal server error"), "false")
        }
    },
    leaderboard: async (req, res) => {
        var AarryOfObjects = [];
        let criteria34 = {
            _id: req.body.id
        }
        let option = { lean: true }
        let result = await find.findOnePromise("userModel", criteria34, {}, option);
        let gameCount = await gameOver.aggregate([
            {
                $match: {
                    $or: [{
                        $and: [{
                            "sender_id": ObjectId(req.body.id)
                        }]
                    },
                    {
                        $and: [{
                            "receiver_id": ObjectId(req.body.id)
                        }]
                    }],
                },
            },
            {
                $group:
                {
                    _id: 1,
                    scoreMax: { $max: "$score" },
                    count: { $sum: 1 },
                },
            },
        ]);
        let gameCounts = 0;
        if (gameCount.length > 0) {
            gameCounts = gameCount[0].count
        }
        let scores = 0;
        if (gameCount.length > 0) {
            scores = gameCount[0].scoreMax
        }
        AarryOfObjects.push({
            gameCounts: gameCounts,
            userDetails: result,
            scores: scores,
            rank: 0
        });
        let criteria29 = {
            "type": { $ne: "3" },
        }
        let option1 = {
            sort: {
                "totalPoints": -1,
            },
            lean: true
        }
        let result3 = await find.findAllPromise("userModel", criteria29, {}, option1);
        for (let i = 0; i <= result3.length - 1; i++) {
            if ((result3[i]._id == req.body.id) == false) {

                project = {
                    sender_id: 1,
                    receiver_id: 1,
                    room_id: 1,
                }
                var criteria = {
                    $or: [{
                        $and: [{
                            "sender_id": ObjectId(result3[i]._id)
                        },
                        {
                            "gameType": "2",
                        }
                        ]
                    },
                    {
                        $and: [
                            {
                                "receiver_id": ObjectId(result3[i]._id)
                            },
                            {
                                "gameType": "2",
                            }
                        ]
                    }]
                }
                var roomVerification = await find.findOnePromise("roomModel", criteria, project, {})

                console.log("roomVerification", roomVerification)
                if (roomVerification == null) {
                    roomVerification = 1;
                } else {
                    roomVerification = 2;
                }
                let gameCount = await gameOver.aggregate([
                    {
                        $match: {
                            $or: [{
                                $and: [
                                    {
                                        "sender_id": ObjectId(result3[i]._id)
                                    }
                                ]
                            },
                            {
                                $and: [
                                    {
                                        "receiver_id": ObjectId(result3[i]._id)
                                    }
                                ]
                            },
                            ],
                        },
                    },
                    {
                        $group:
                        {
                            _id: 1,
                            scoreMax: { $max: "$score" },
                            count: { $sum: 1 },
                        },
                    },
                ]);
                let likewisePersanteges = await gameOver.aggregate([
                    {
                        $match: {
                            $or: [{
                                $and: [
                                    {
                                        "sender_id": ObjectId(result3[i]._id)
                                    },
                                    {
                                        "receiver_id": ObjectId(req.body.id)
                                    }
                                ]
                            },
                            {
                                $and: [
                                    {
                                        "receiver_id": ObjectId(result3[i]._id)
                                    },
                                    {
                                        "sender_id": ObjectId(req.body.id)
                                    },
                                ]
                            }],
                        },
                    },
                    {
                        $group:
                        {
                            _id: 1,
                            sumStreaks: { $sum: "$likewisePersantegeValue" },
                            count: { $sum: 1 },
                        },
                    },
                ]);
                let likewisePer = 0;
                if (likewisePersanteges.length > 0) {
                    if (likewisePersanteges[0].sumStreaks > 0) {
                        likewisePer = likewisePersanteges[0].sumStreaks / likewisePersanteges[0].count
                    }
                }
                let gameCounts = 0;
                if (gameCount.length > 0) {
                    gameCounts = gameCount[0].count
                }
                let scores = 0;
                if (gameCount.length > 0) {
                    scores = gameCount[0].scoreMax
                }
                if (gameCounts === 0) {
                    console.log('gameCounts0')
                } else {
                    AarryOfObjects.push({
                        gameCounts: gameCounts,
                        userDetails: result3[i],
                        scores: scores,
                        likewisePer: likewisePer,
                        roomVerification: roomVerification
                    });
                }

            }
        }
        return response.sendsuccessData(res, "SocialId valid", AarryOfObjects);
    },


    inviteFriend: async (req, res) => {

        try {
            console.log("Request for invite friend is===========>", req.body);
            let criteria = {
                "coinReceivedBy._userId": req.body.userId
            }
            let checkAlready = await find.findOnePromise("userModel", criteria, {}, {});
            if (checkAlready) {
                return response.sendErrorMessage(res, ("You have already got the coins from this user."));
            }
            let checkUser = {
                _id: req.body.receiverId
            }
            let checkReceiver = await find.findOnePromise("userModel", checkUser, {}, {});
            if (!checkReceiver) {
                return response.sendErrorMessage(res, ("Invalid Token"));
            }
            let userCoins = Number(checkReceiver.coins) + Number(req.body.coins)
            let dataToUpdate = {}
            dataToUpdate.coins = userCoins
            let updateCoins = await find.findByIdAndUpdatePromise("userModel", checkUser, dataToUpdate, { new: true }, {})
            response.sendsuccessData(res, `You have credited ${req.body.coins} coins.`, updateCoins)
        } catch (error) {
            console.log("Error is===========>", error);
            response.sendErrorCustomMessage(res, ("Internal server error"), "false")
        }
    }
}
async function imageUpload(imageFile) {
    return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(imageFile.path, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        })
    })
}
async function videoUpload(videoFile) {
    return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload_large(videoFile.path, (error, result) => {
            if (error) {
                console.log(error)
                reject(error);
            } else {
                resolve(result);
            }
        })


    })
}
