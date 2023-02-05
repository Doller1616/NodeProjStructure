const response = require('../../utils/response');
const create = require('../../query/create');
const find = require('../../query/find');
var ObjectId = require('mongodb').ObjectId;
const Point = require('../../models/chatModel')
const GameOver = require('../../models/gameOverModel')
const Chat = require('../../models/chatModel.js')
var _ = require('lodash');


module.exports = {
    //-------------------------------------chatData-------------------//
    chatData: async (req, res) => {
        try {
            let checkRoomCriteria = { room_id: req.body.room_id }
            var options = {
                sort: { card: -1 }
            }
            let checkRoom = await find.findAllPromise("chatModel", checkRoomCriteria, {}, {}, options)
            if (checkRoom.length > 0) {
                game_id = checkRoom[0].game_id;
                let checkUserCriteria1 = { _id: game_id }
                let checkgame = await find.findOnePromise("gameModel", checkUserCriteria1, {}, {});
                let languageCode = { code: checkgame.languageCode }
                let checkCode = await find.findOnePromise("languageModel", languageCode, {}, {});
                var criteriaDetails = {};
                criteriaDetails._id = req.body.receiver_id;
                var receiverUserDetails = await find.findOnePromise("userModel", criteriaDetails, {}, {});

                response.sendsuccessChatData(res, ("chat list"), checkRoom, checkCode, receiverUserDetails);

                let obj1 = [{
                    userId: req.user._id
                }]
                let searchQuery = { $and: [{ room_id: req.body.room_id }, { "isSeenBy.userId": { $ne: req.user._id } }] }
                let dataS = await Chat.update(searchQuery, { $push: { isSeenBy: obj1 } }, { new: true, multi: true })
                console.log("Save data is=========>", dataS)
            }
            else {
                response.sendsuccessChatData(res, ("chat list"), checkRoom, {});
            }
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: error.message })
        }
    },
    //-----------------------chatUserList---------------------------//
    chatUserList: async (req, res) => {
        try {
            let finalArray = []
            var d = new Date();
            d.setDate(d.getDate() - 15);
            let criteria = {
                sender_id: ObjectId(req.user._id),
                "room_status": req.body.status,
                status: { $ne: 4 },
                status: { $ne: 1 },
                updatedAt:{$gte:d}
            }
            let populate = {
                path: "receiver_id"
            }
            let project = {
                lastmessage: 1,
                fullName: 1,
                profilePic: 1,
                room_id: 1,
                updatedAt: 1,
                game_id: 1,
                sender_id: 1,
                createdAt: 1,
                timeUpdate: 1,
                deleteAccountStatus:1

            }
            let option = {
                sort: {
                    createdAt: 1,
                },
                lean: true
            }
            let result = await find.getAllPopulatePromise("roomModel", criteria, project, option, populate)

            console.log("Data is===========>",result)
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    if(result[i].receiver_id.deleteAccountStatus==false){
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
                            sender_id: req.user._id,
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
                            lives: lives,
                        })
                    }
              
                }
            }
            let criteria1 = {
                receiver_id: ObjectId(req.user._id),
                "room_status": req.body.status,
                status: { $ne: 4 },
                updatedAt:{$gte:d}
            }
            let populate1 = {
                path: "sender_id"
            }
            let project1 = {
                sender_id: 1,
                profilePic: 1,
                propertyId: 1,
                propertyType: 1,
                room_id: 1,
                updatedAt: 1,
                game_id: 1,
                createdAt: 1,
                timeUpdate: 1,
                deleteAccountStatus:1

            }
            let option1 = {
                sort: {
                    "updatedAt": -1,
                },
                lean: true
            }
            let result1 = await find.getAllPopulatePromise("roomModel", criteria1, project1, option1, populate1)
            console.log("Result1 is===========>",result1)
            
            if (result1.length > 0) {
                for (var i = 0; i < result1.length; i++) {

                    if(result1[i].sender_id.deleteAccountStatus==false){
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
                            game_id: result1[i].game_id,
                            room_id: result1[i].room_id,
                            sender_id: result1[i].sender_id._id,
                            profilePic: result1[i].sender_id.profilePic,
                            receiver_id: req.user._id,
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
                            lives: lives,
                        })
                    }
               
                }
            }

            finalArray.sort(function (a, b) {
                return new Date(b.updatedAt) - new Date(a.updatedAt);
            });

            console.log("Final arrray is=============>",finalArray)
            //--------------------------------------game data-----------------//
            if (finalArray.length > 0) {
                for (var i = 0; i < finalArray.length; i++) {
                    let likewisePersanteges = await GameOver.aggregate([
                        {
                            $match: {
                                $or: [{
                                    $and: [{
                                        "sender_id": ObjectId(finalArray[i].sender_id)
                                    },
                                    {
                                        "receiver_id": ObjectId(finalArray[i].receiver_id)
                                    }]
                                },
                                {
                                    $and: [{
                                        "receiver_id": ObjectId(finalArray[i].sender_id)
                                    },
                                    {
                                        "sender_id": ObjectId(finalArray[i].receiver_id)
                                    }]
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

                    // let followerDetail1 = await GameOver.aggregate([
                    //     {
                    //         $match: {
                    //             $or: [{
                    //                 $and: [{
                    //                     "sender_id": ObjectId(finalArray[i].sender_id)
                    //                 },
                    //                 {
                    //                     "receiver_id": ObjectId(finalArray[i].receiver_id)
                    //                 }]
                    //             },
                    //             {
                    //                 $and: [{
                    //                     "receiver_id": ObjectId(finalArray[i].sender_id)
                    //                 },
                    //                 {
                    //                     "sender_id": ObjectId(finalArray[i].receiver_id)
                    //                 }]
                    //             }],
                    //         },
                    //     },
                    //     {
                    //         $group:
                    //         {
                    //             sumStreaks: { $sum: "$likewisePersantegeValue" },
                    //             _id: finalArray[i].room_id,
                    //             count: { $sum: 1 }
                    //         },
                    //     },
                    // ])
                    // console.log("Sum is=[==============>",followerDetail1)
                    // let details = {
                    //     PointTotalMatchPersantege: 0,
                    //     count: 1,
                    //     All_LikeWise_Persantege:0
                    // }
                    // if (followerDetail1.length > 0) {
                    //     let foll = (followerDetail1[0].sumStreaks === undefined) ? 1 : followerDetail1[0].sumStreaks;
                    //     let count = (followerDetail1[0].count === undefined) ? 0 : followerDetail1[0].count
                    //     let per = foll / count
                    //     details = {
                    //         PointTotalMatchPersantege: per,
                    //         count: count,
                    //         All_LikeWise_Persantege:per
                    //     }
                    // } 
                    // console.log("Sum2 is=[==============>",details)

                    let followerDetail = await Point.aggregate([
                        {
                            $match: {
                                room_id: finalArray[i].room_id
                            }
                        },
                        {
                            $group:
                            {
                                scoreMax: { $max: "$score" },
                                pointMax: { $max: "$point" },
                                sumStreaks: { $sum: "$streaks" },
                                bonus: { $max: "$bonus" },
                                _id: finalArray[i].room_id,
                            },
                        },
                    ])
                    let criteria = {
                        room_id: finalArray[i].room_id,
                    }

                    let TotalMessage = 0
                    let totalMessage = await find.findCountPromise("chatModel", criteria, {}, {});

                    // let TotalMessage = await find.findCountPromise("chatModel", criteria, {}, {});
                    let criteria1 = {
                        room_id: finalArray[i].room_id,
                        isMatched: true
                    }
                    let matchPersantages = {
                        room_id: finalArray[i].room_id,
                    }
                    Persantagess = 0;
                    let matchPersantagesResult = await find.findOnePromise("gameOverModel", matchPersantages, {}, {});
                    if (matchPersantagesResult === null) {
                        Persantagess = 0;
                    } else {
                        Persantagess = matchPersantagesResult.likewisePersantegeValue
                    }
                    let TotalMatch = 0
                    let match = await find.findCountPromise("chatModel", criteria1, {}, {});
                    TotalMatch = Number(match) / 2
                    TotalMessage = totalMessage - TotalMatch
                    // let TotalMatch = await find.findCountPromise("chatModel", criteria1, {}, {});
                    let criteria2 = {
                        room_id: finalArray[i].room_id,
                    }
                    let sort = {
                        isMatched: -1
                    }
                    var limit = (TotalMessage >= 2) ? TotalMessage / 2 : TotalMessage;
                    let Average_lowest_half_of_All_Matched = await find.findSortBy("chatModel", criteria2, sort, limit);
                    sum = 0;
                    for (let i = 0; i <= Average_lowest_half_of_All_Matched.length - 1; i++) {
                        sum = sum + Average_lowest_half_of_All_Matched[i].all_matched;
                    }
                    let Average_lowest_half_of_All_Matched_Avreage = sum / Average_lowest_half_of_All_Matched.length
                    var sumStreaksPersantege = 0;
                    if (!followerDetail) {
                        if (followerDetail[0].sumStreaks > 0) {
                            sumStreaksPersantege = followerDetail[0].sumStreaks;
                        }
                    }
                    let PointTotalMatchPersantege = (TotalMatch / TotalMessage * 100);
                    // if(details.All_LikeWise_Persantege==1){
                    //     details.All_LikeWise_Persantege=0
                    // }
                    if (isNaN(PointTotalMatchPersantege) && followerDetail.length == 0) {

                        // console.log("Hiii",details)
                        finalArray[i].pointDetails = {
                            PointTotalMatchPersantege: 0,
                            "followerDetail": [
                                {
                                    "scoreMax": 0,
                                    "pointMax": 0,
                                    "sumStreaks": 0,
                                    "bonus": 0,
                                }
                            ],
                            LikeWisePersantege: 0,
                            TotalMatch: 0,
                            likewisePersantegess:req.user.likewisePersantegess,
                            All_LikeWise_Persantege:likewisePer
                        }
                    } else {
                        // console.log("Hiii2",details)
                        finalArray[i].pointDetails = {
                            PointTotalMatchPersantege: PointTotalMatchPersantege,
                            followerDetail: followerDetail,
                            LikeWisePersantege: Persantagess,
                            TotalMatch: TotalMatch,
                            likewisePersantegess:req.user.likewisePersantegess,
                            // details:details,
                            All_LikeWise_Persantege:likewisePer
                        }
                    }

                    let searchQuery = { $and: [{ room_id: finalArray[i].room_id }, { game_id: finalArray[i].game_id }, { "isSeenBy.userId": { $ne: req.user._id } }] }
                    let count = await Chat.find(searchQuery).count()
                    finalArray[i].messageCount = count
                }
                console.log("Final Array is============>",finalArray)
                response.sendsuccessData(res, ("Chat Data"), finalArray);
            } else {
                response.sendsuccessData(res, ("Chat Data"), finalArray);
            }
        } catch (error) {
            console.log('-------------------- chatUserList ---------------- ', error);
            return res.status(500).send({ message: error.message })
        };
    },
    //---------------------------myMatch---------------------------//
    myMatch: async (req, res) => {
        try {
            if (req.body.gameType === '3') {
                let finalArray = []
                let criteria = {
                    sender_id: ObjectId(req.user._id),
                    "room_status": false,
                }
                let populate = {
                    path: "receiver_id"
                }
                let project = {
                    lastmessage: 1,
                    fullName: 1,
                    profilePic: 1,
                    room_id: 1,
                    updatedAt: 1,
                    game_id: 1,
                    sender_id: 1,
                    createdAt: 1,
                }
                let option = {
                    sort: {
                        createdAt: 1,
                    },
                    lean: true
                }
                let result = await find.getAllPopulatePromise("roomModel", criteria, project, option, populate);
                if (result.length > 0) {
                    for (var i = 0; i < result.length; i++) {
                        let property = await find.findOnePromise("userModel", {
                            "_id": result[i]._id,
                        })
                        var propetyOwner = ''
                        if (property) {
                            propetyOwner = property._id
                        }
                       
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
                            key: result[i].receiver_id._id,
                            gameType: result[i].gameType,
                            details: "",
                        })
                    }
                }
                let criteria1 = {
                    receiver_id: ObjectId(req.user._id),
                    "room_status": false,
                }
                let populate1 = {
                    path: "sender_id"
                }
                let project1 = {
                    sender_id: 1,
                    receiver_id: 1,
                    profilePic: 1,
                    propertyId: 1,
                    propertyType: 1,
                    room_id: 1,
                    updatedAt: 1,
                    game_id: 1,
                    createdAt: 1
                }
                let option1 = {
                    sort: {
                        "updatedAt": -1,
                    },
                    lean: true
                }
                let result1 = await find.getAllPopulatePromise("roomModel", criteria1, project1, option1, populate1)
                if (result1.length > 0) {
                    for (var i = 0; i < result1.length; i++) {
                        let property = await find.findOnePromise("userModel", {
                            "_id": result1[i]._id,
                        })
                        var propetyOwner = ''
                        if (property) {
                            propetyOwner = property._id
                        }
                      
                        finalArray.push({
                            game_id: result1[i].game_id,
                            room_id: result1[i].room_id,
                            sender_id: result1[i].sender_id._id,
                            profilePic: result1[i].sender_id.profilePic,
                            receiver_id: result1[i].receiver_id,
                            name: result1[i].sender_id.name,
                            createdAt: result1[i].createdAt,
                            updatedAt: result1[i].updatedAt,
                            user_type: result1[i].sender_id.type,
                            key: result1[i].sender_id._id,
                            gameType: result1[i].gameType,
                            details: "",
                        })
                    }
                }
                finalArray.sort(function (a, b) {
                    return new Date(b.updatedAt) - new Date(a.updatedAt);
                });
                var arrayUniqueByKey = finalArray.filter((thing, i, arr) => {
                    return arr.indexOf(arr.find(t => t.name === thing.name)) === i;
                });
                if (arrayUniqueByKey.length > 0) {
                    for (let i = 0; i <= arrayUniqueByKey.length - 1; i++) {
                        let followerDetail = await GameOver.aggregate([
                            {
                                $match: {
                                    $or: [{
                                        $and: [{
                                            "sender_id": ObjectId(arrayUniqueByKey[i].sender_id)
                                        },
                                        {
                                            "receiver_id": ObjectId(arrayUniqueByKey[i].receiver_id)
                                        }]
                                    },
                                    {
                                        $and: [{
                                            "receiver_id": ObjectId(arrayUniqueByKey[i].sender_id)
                                        },
                                        {
                                            "sender_id": ObjectId(arrayUniqueByKey[i].receiver_id)
                                        }]
                                    }],
                                },
                            },
                            {
                                $group:
                                {
                                    sumStreaks: { $sum: "$likewisePersantegeValue" },
                                    _id: finalArray[i].room_id,
                                    count: { $sum: 1 }
                                },
                            },
                        ])
                        if (followerDetail.length > 0) {
                            let foll = (followerDetail[0].sumStreaks === undefined) ? 1 : followerDetail[0].sumStreaks;
                            let count = (followerDetail[0].count === undefined) ? 0 : followerDetail[0].count
                            let per = foll / count
                            arrayUniqueByKey[i].details = {
                                PointTotalMatchPersantege: per,
                                count: count,
                                All_LikeWise_Persantege:req.user.All_LikeWise_Persantege
                            }
                        } else {
                            arrayUniqueByKey[i].details = {
                                PointTotalMatchPersantege: 1,
                                count: 1,
                                All_LikeWise_Persantege:req.user.All_LikeWise_Persantege
                            }
                        }
                    }
                }
                console.log("Array unique is==========>", arrayUniqueByKey)
                let chars = _.orderBy(arrayUniqueByKey, ['PointTotalMatchPersantege'], ['desc']);
                console.log("Sort data is==========>", chars)
                return response.sendsuccessData(res, ("Chat Data"), chars);
            }
            else {
                let finalArray = []
                let criteria = {
                    sender_id: ObjectId(req.user._id),
                    "room_status": false,
                    "gameType": req.body.gameType,
                }
                let populate = {
                    path: "receiver_id"
                }
                let project = {
                    lastmessage: 1,
                    fullName: 1,
                    profilePic: 1,
                    room_id: 1,
                    updatedAt: 1,
                    game_id: 1,
                    sender_id: 1,
                    createdAt: 1,
                }
                let option = {
                    sort: {
                        createdAt: 1,
                    },
                    lean: true
                }
                let result = await find.getAllPopulatePromise("roomModel", criteria, project, option, populate);
                if (result.length > 0) {
                    for (var i = 0; i < result.length; i++) {
                        let property = await find.findOnePromise("userModel", {
                            "_id": result[i]._id,
                        })
                        var propetyOwner = ''
                        if (property) {
                            propetyOwner = property._id
                        }
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
                            key: result[i].receiver_id._id,
                            gameType: result[i].gameType,
                            details: "",
                        })
                    }
                }
                let criteria1 = {
                    receiver_id: ObjectId(req.user._id),
                    "room_status": false,
                    "gameType": req.body.gameType,
                }
                let populate1 = {
                    path: "sender_id"
                }
                let project1 = {
                    sender_id: 1,
                    receiver_id: 1,
                    profilePic: 1,
                    propertyId: 1,
                    propertyType: 1,
                    room_id: 1,
                    updatedAt: 1,
                    game_id: 1,
                    createdAt: 1
                }
                let option1 = {
                    sort: {
                        "updatedAt": -1,
                    },
                    lean: true
                }
                let result1 = await find.getAllPopulatePromise("roomModel", criteria1, project1, option1, populate1)
                if (result1.length > 0) {
                    for (var i = 0; i < result1.length; i++) {
                        let property = await find.findOnePromise("userModel", {
                            "_id": result1[i]._id,
                        })
                        var propetyOwner = ''
                        if (property) {
                            propetyOwner = property._id
                        }
                        finalArray.push({
                            game_id: result1[i].game_id,
                            room_id: result1[i].room_id,
                            sender_id: result1[i].sender_id._id,
                            profilePic: result1[i].sender_id.profilePic,
                            receiver_id: result1[i].receiver_id,
                            name: result1[i].sender_id.name,
                            createdAt: result1[i].createdAt,
                            updatedAt: result1[i].updatedAt,
                            user_type: result1[i].sender_id.type,
                            key: result1[i].sender_id._id,
                            gameType: result1[i].gameType,
                            details: ""
                        })
                    }
                }
                finalArray.sort(function (a, b) {
                    return new Date(b.updatedAt) - new Date(a.updatedAt);
                });
                var arrayUniqueByKey = finalArray.filter((thing, i, arr) => {
                    return arr.indexOf(arr.find(t => t.name === thing.name)) === i;
                });
               
                if (arrayUniqueByKey.length > 0) {
                    for (let i = 0; i <= arrayUniqueByKey.length - 1; i++) {
                        let followerDetail = await GameOver.aggregate([
                            {
                                $match: {
                                    $or: [{
                                        $and: [{
                                            "sender_id": ObjectId(arrayUniqueByKey[i].sender_id)
                                        },
                                        {
                                            "receiver_id": ObjectId(arrayUniqueByKey[i].receiver_id)
                                        }]
                                    },
                                    {
                                        $and: [{
                                            "receiver_id": ObjectId(arrayUniqueByKey[i].sender_id)
                                        },
                                        {
                                            "sender_id": ObjectId(arrayUniqueByKey[i].receiver_id)
                                        }]
                                    }],
                                },
                            },
                            {
                                $group:
                                {
                                    sumStreaks: { $sum: "$likewisePersantegeValue" },
                                    _id: finalArray[i].room_id,
                                    count: { $sum: 1 }
                                },
                            },
                        ])

                        if (followerDetail.length > 0) {
                            let foll = (followerDetail[0].sumStreaks === undefined) ? 1 : followerDetail[0].sumStreaks;
                            let count = (followerDetail[0].count === undefined) ? 0 : followerDetail[0].count
                            let per = foll / count
                            arrayUniqueByKey[i].details = {
                                PointTotalMatchPersantege: per,
                                count: count,
                                likewisePersantegess:req.user.likewisePersantegess
                            }
                        } else {
                            arrayUniqueByKey[i].details = {
                                PointTotalMatchPersantege: 1,
                                count: 1,
                                likewisePersantegess:req.user.likewisePersantegess
                            }
                        }
                    }
                }
                console.log("Array unique is==========>", arrayUniqueByKey)
                let chars = _.orderBy(arrayUniqueByKey, ['PointTotalMatchPersantege'], ['desc']);
                console.log("Sort data is==========>", chars)
                return response.sendsuccessData(res, ("Chat Data"), chars);
            }
        } catch (error) {
            console.log('-------------------- chatUserList ---------------- ', error);
            return res.status(500).send({ message: error.message })
        };
    },
    //-----------------------chatMatch-----------------------------//
    MatchUserList: async (req, res) => {
        try {
            let finalArray = []
            let criteria = {
                sender_id: ObjectId(req.user._id),
                "room_status": false,
            }
            let populate = {
                path: "receiver_id"
            }
            let project = {
                lastmessage: 1,
                fullName: 1,
                profilePic: 1,
                room_id: 1,
                updatedAt: 1,
                game_id: 1,
                sender_id: 1,
                createdAt: 1,
            }
            let option = {
                sort: {
                    updatedAt: -1,
                },
                lean: true
            }
            let result = await find.getAllPopulatePromise("roomModel", criteria, project, option, populate)
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
                let checkCode = await find.findOnePromise("languageModel", {
                    "code": gameFullDetails.languageCode,
                });
                let morePrecisely = await find.findOnePromise("converseModel", {
                    "_id": gameFullDetails.morePrecisely,
                });
                let objective = await find.findOnePromise("explanationModel", {
                    "_id": gameFullDetails.objective,
                });
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
                    pointDetails: "",
                    mode: gameFullDetails.mode,
                    languageDetails: checkCode,
                    objectives: objective.explanation,
                    morePreciselys: morePrecisely.converse
                })
            }
            let criteria1 = {
                receiver_id: ObjectId(req.user._id),
                "room_status": req.body.status,
            }
            let populate1 = {
                path: "sender_id"
            }
            let project1 = {
                sender_id: 1,
                profilePic: 1,
                propertyId: 1,
                propertyType: 1,
                room_id: 1,
                updatedAt: 1,
                game_id: 1,
                createdAt: 1
            }
            let option1 = {
                sort: {
                    updatedAt: -1,
                },
                lean: true
            }
            let result1 = await find.getAllPopulatePromise("roomModel", criteria1, project1, option1, populate1)
            for (var i = 0; i < result1.length; i++) {
                let property = await find.findOnePromise("userModel", {
                    "_id": result1[i]._id,
                })
                var propetyOwner = ''
                if (property) {
                    propetyOwner = property._id
                }
                let gameFullDetails = await find.findOnePromise("gameModel", {
                    "_id": result[i].game_id,
                });
                let checkCode = await find.findOnePromise("languageModel", {
                    "code": gameFullDetails.languageCode,
                });

                let morePrecisely = await find.findOnePromise("converseModel", {
                    "_id": gameFullDetails.morePrecisely,
                });

                let objective = await find.findOnePromise("explanationModel", {
                    "_id": gameFullDetails.objective,
                });
                finalArray.push({
                    game_id: result1[i].game_id,
                    room_id: result1[i].room_id,
                    sender_id: result1[i].sender_id._id,
                    profilePic: result1[i].sender_id.profilePic,
                    receiver_id: result1[i].sender_id._id,
                    name: result1[i].sender_id.name,
                    createdAt: result1[i].createdAt,
                    updatedAt: result1[i].updatedAt,
                    user_type: result[i].receiver_id.type,
                    pointDetails: "",
                    mode: gameFullDetails.mode,
                    languageDetails: checkCode,
                    objectives: objective.explanation,
                    morePreciselys: morePrecisely.converse
                })
            }

            finalArray.sort(function (a, b) {
                return new Date(b.updatedAt) - new Date(a.updatedAt);
            });
            //--------------------------------------game data-----------------//
            if (finalArray.length > 0) {
                for (var i = 0; i < finalArray.length; i++) {

                    let followerDetail = await Point.aggregate([
                        {
                            $match: {
                                room_id: finalArray[i].room_id
                            }
                        },
                        {
                            $group:
                            {
                                scoreMax: { $max: "$score" },
                                pointMax: { $max: "$point" },
                                sumStreaks: { $sum: "$streaks" },
                                bonus: { $max: "$bonus" },
                                _id: finalArray[i].room_id,
                            },
                        },
                    ])

                    let criteria = {
                        room_id: finalArray[i].room_id,
                    }
                    let TotalMessage = await find.findCountPromise("chatModel", criteria, {}, {});

                    let criteria1 = {
                        room_id: finalArray[i].room_id,
                        isMatched: true
                    }
                    let TotalMatch = await find.findCountPromise("chatModel", criteria1, {}, {});

                    let criteria2 = {
                        room_id: finalArray[i].room_id,
                    }
                    let sort = {
                        isMatched: -1
                    }

                    var limit = (TotalMessage >= 2) ? TotalMessage / 2 : TotalMessage;
                    let Average_lowest_half_of_All_Matched = await find.findSortBy("chatModel", criteria2, sort, limit);

                    sum = 0;
                    for (let i = 0; i <= Average_lowest_half_of_All_Matched.length - 1; i++) {
                        sum = sum + Average_lowest_half_of_All_Matched[i].all_matched;
                    }

                    let Average_lowest_half_of_All_Matched_Avreage = sum / Average_lowest_half_of_All_Matched.length

                    var sumStreaksPersantege = 0;
                    if (!followerDetail) {
                        if (followerDetail[0].sumStreaks > 0) {
                            sumStreaksPersantege = followerDetail[0].sumStreaks;
                        }
                    }

                    let PointTotalMatchPersantege = (TotalMatch / TotalMessage * 100);
                    let BonusTotalMatchPersantege = (TotalMatch / TotalMessage * 100);

                    let LikeWisePersantege = (PointTotalMatchPersantege + BonusTotalMatchPersantege + Average_lowest_half_of_All_Matched_Avreage) / 3 + sumStreaksPersantege;

                    if (isNaN(PointTotalMatchPersantege) && followerDetail.length == 0) {
                        finalArray[i].pointDetails = {
                            PointTotalMatchPersantege: 0,
                            "followerDetail": [
                                {
                                    "scoreMax": 0,
                                    "pointMax": 0,
                                    "sumStreaks": 0,
                                    "bonus": 0,
                                }
                            ],
                            LikeWisePersantege: 0,
                            TotalMatch: 0
                        }
                    } else {
                        finalArray[i].pointDetails = {
                            PointTotalMatchPersantege: PointTotalMatchPersantege,
                            followerDetail: followerDetail,
                            LikeWisePersantege: LikeWisePersantege,
                            TotalMatch: TotalMatch
                        }
                    }
                }
                response.sendsuccessData(res, ("Chat Data"), finalArray);
            } else {
                response.sendsuccessData(res, ("Chat Data"), finalArray);
            }
        } catch (error) {
            console.log('-------------------- chatUserList ---------------- ', error);
            return res.status(500).send({ message: error.message })
        };
    },
    //--------------------roomStatusUpdate-----------------------//
    roomCreate: async (req, res) => {
        try {
            project = {
                sender_id: 1,
                receiver_id: 1,
                room_id: 1,
            }
            var criteria = {
                $or: [{
                    $and: [{
                        "sender_id": ObjectId(req.body.sender_id)
                    },
                    {
                        "receiver_id": ObjectId(req.body.receiver_id)
                    },
                    {
                        "game_id": ObjectId(req.body.game_id)
                    }
                    ]
                },
                {
                    $and: [
                        {
                            "receiver_id": ObjectId(req.body.sender_id)
                        },
                        {
                            "sender_id": ObjectId(req.body.receiver_id)
                        },
                        {
                            "game_id": ObjectId(req.body.game_id)
                        }
                    ]
                }]
            }

            let roomVerification = await find.findOnePromise("roomModel", criteria, project, {})

            if (roomVerification === null) {
                let otp = Math.floor(10000000 + Math.random() * 90000000);
                let otp1 = Math.floor(10000000 + Math.random() * 90000000);
                let otp2 = Math.floor(10000000 + Math.random() * 90000000);
                let otp3 = Math.floor(10000000 + Math.random() * 90000000);
                let otp4 = Math.floor(10000000 + Math.random() * 90000000);
                let randomNumber = otp.toString()
                let randomNumber1 = otp1.toString()
                let randomNumber2 = otp2.toString()
                let randomNumber3 = otp3.toString()
                let randomNumber4 = otp4.toString()
                let room_id = randomNumber3 + randomNumber4 + req.body.sender_id + randomNumber1 + req.body.receiver_id + randomNumber2 + randomNumber;
                let roomjson = {
                    "sender_id": req.body.sender_id,
                    "receiver_id": req.body.receiver_id,
                    "room_id": room_id,
                    "game_id": req.body.game_id,
                    "room_status": true,
                    "type": req.body.type,
                    "languageCode": req.body.languageCode,
                    "gameType": req.body.gameType
                }
                let result = await create.create("roomModel", roomjson);
                response.sendsuccessData(res, ("Room is created"), result);
            } else {
                return response.sendsuccessData(res, ("Room already Exists"), roomVerification);
            }

        } catch (error) {
            console.log('------------------getRoomId---------------------', error)
            response.sendErrorCustomMessage(res, ("Internal server error"), "false")
        }
    },
    //---------------------roomStatusUpdate---------------------------//
    roomStatusUpdate: async (req, res) => {
        try {
            let userCriteria = {
                room_id: req.body.room_id
            }
            let dataToUpdate = {};
            dataToUpdate.room_status = false
            let result1 = await find.findAndUpdatePromise("roomModel", userCriteria, dataToUpdate, {})
            response.sendsuccessData(res, ("Room is created"), result);
        } catch (error) {
            console.log('------------------getRoomId---------------------', error)
            response.sendErrorCustomMessage(res, ("Internal server error"), "false")
        }
    },
    //--------------------------------------------addLives---------------------------------//
    addLives: async (req, res) => {
        try {
            let roomjson = {
                "room_id": req.body.room_id,
                "card": req.body.card,
                "Lives": Lives,
                "match": req.body.match
            }
            let result = await create.create("cardModel", roomjson)
            response.sendsuccessData(res, ("cardModel is created"), result);
        } catch (error) {
            console.log('------------------cardModel---------------------', error)
            response.sendErrorCustomMessage(res, ("Internal server error"), "false")
        }
    },
    //---------------------------------------------getChatData--------------------------//
    getChatData: async (req, res) => {
        try {
            let checkRoomCriteria = { room_id: req.body.room_id, card: req.body.card }
            let checkRoom = await find.findAllPromise("chatModel", checkRoomCriteria, {}, {}, {})
            response.sendsuccessData(res, ("chat list"), checkRoom);
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: error.message })
        }
    },
}