const find = require('../../query/find');
const create = require('../../query/create');
const response = require('../../utils/response');
const { validationResult } = require('express-validator/check');
const cloudinary = require('cloudinary');
const ConverseModel = require('../../models/converseModel')
const Admin = require('../../models/adminModel.js');
const User = require('../../models/userModel.js');
cloudinary.config({
    cloud_name: "altsols-com",
    api_key: "432157412791339",
    api_secret: "iLBqwz_JwopOvIRkoNulrLajSxY"
});
const ChatModel = require('../../models/chatModel');
const { ObjectId } = require('bson');

module.exports = {
    //---------------addPrivacyPolicy---------//
    addPrivacyPolicy: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            let dataToSave = {}
            dataToSave = req.body;
            let result = await create.create("privacypolicyModel", dataToSave);
            response.sendsuccessData(res, 'privacy poicy created', result)
        } catch (error) {
            console.log('--------------------   contentAdd ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------addPrivacyPolicy---------//
    editPrivacyPolicy: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            let criteria = {
                _id: req.body._id
            }
            let dataToUpdate = req.body;
            let result = await find.findAndUpdatePromise("privacypolicyModel", criteria, dataToUpdate, { new: true })
            response.sendsuccessData(res, 'privacy poicy updated', result)
        } catch (error) {
            console.log('--------------------   contentEdit ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------listPrivacyPolicy---------//
    listPrivacyPolicy: async (req, res) => {
        try {
            let result = await find.findAllPromise("helpandSuportModel", {}, {}, {})
            response.sendsuccessData(res, 'privacy poicy list', result[2])

        } catch (error) {
            console.log('--------------------   contentList ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------addFeedback---------//
    addFeedback: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            var dataToSave = {}
            dataToSave = req.body;
            if (req.files.image) {
                let uploadedImage = await imageUpload(req.files.image);
                dataToSave.image = uploadedImage.secure_url
            }
            console.log(dataToSave)
            let result = await create.create("feedbackModel", dataToSave);
            response.sendsuccessData(res, 'feedback send of Admin', result)
        } catch (error) {
            console.log('--------------------   contentAdd ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------deleteFeedback---------//
    deleteFeedback: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            let criteria = {
                _id: req.body._id
            }
            let dataToUpdate = req.body;
            let result = await find.findAndRemovePromise("feedbackModel", criteria, dataToUpdate, { new: true })
            response.sendsuccessData(res, 'delete Feedback successfully ', result)
        } catch (error) {
            console.log('--------------------   contentEdit ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------listFeedback---------//
    listFeedback: async (req, res) => {
        try {
            let result = await find.findAllPromise("feedbackModel", {}, {}, {})
            response.sendsuccessData(res, 'feedback list', result)

        } catch (error) {
            console.log('--------------------   contentList ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------addFaq---------//
    addFaq: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            let dataToSave = {}
            dataToSave = req.body;
            let result = await create.create("faqModel", dataToSave);
            response.sendsuccessData(res, 'Create successful faq ', result)
        } catch (error) {
            console.log('--------------------   contentAdd ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------deleteFaq---------//
    deleteFaq: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            let criteria = {
                _id: req.body._id
            }
            let dataToUpdate = req.body;
            let result = await find.findAndRemovePromise("faqModel", criteria, dataToUpdate, { new: true })
            response.sendsuccessData(res, 'delete Faq successfully ', result)
        } catch (error) {
            console.log('--------------------   contentEdit ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------listFaq---------//
    listFaq: async (req, res) => {
        try {
            let result = await find.findAllPromise("helpandSuportModel", {}, {}, {})
            response.sendsuccessData(res, 'Faq list', result[4])

        } catch (error) {
            console.log('--------------------   contentList ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------editFaq---------//
    editFaq: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            let criteria = {}
            criteria.answer = req.body.answer;
            let userExist = await find.findOnePromise("faqModel", criteria, {}, {})
            if (userExist) {
                return response.sendErrorMessage(res, ("faq already exists"));
            }
            let criteria1 = {
                _id: req.body._id
            }
            let dataToUpdate = req.body;
            let result = await find.findAndUpdatePromise("faqModel", criteria1, dataToUpdate, { new: true })
            response.sendsuccessData(res, 'faq updated', result)
        } catch (error) {
            console.log('--------------------   contentEdit ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    getLanguageId: async (req, res) => {
        try {
            let criteria = {
                _id: req.params._id
            }

            let result = await find.findOnePromise("languageModel", criteria, {}, {})
            console.log("Language detail is=========>", result)
            return response.sendsuccessData(res, "language converse", result)
        } catch (error) {
            console.log('--------------------   language ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------addLanguage---------//
    addLanguage: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            let criteria = {}
            criteria.language = req.body.language;
            // let userExist = await find.findOnePromise("languageModel", criteria, {}, {})
            // if (userExist) {
            //     return response.sendErrorMessage(res, ("Language already exists"));
            // }
            let dataToSave = {}
            dataToSave = req.body;
            if (req.files.picture) {
                let uploadedImage = await imageUpload(req.files.picture);
                dataToSave.picture = uploadedImage.secure_url
            }
            if (req.files.greyImage) {
                let uploadedImage = await imageUpload(req.files.greyImage);
                dataToSave.greyImage = uploadedImage.secure_url
            }
            let result = await create.create("languageModel", dataToSave);
            response.sendsuccessData(res, 'Create successful language ', result)
        } catch (error) {
            console.log('--------------------   contentAdd ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //------------------------uploadedImage------------------//
    uploadImage: async (req, res) => {
        try {
            var senderUserDetails = {}
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

            return response.sendsuccessData(res, "Image Create successfully", senderUserDetails);
        }
        catch (error) {
            console.log(error)
            return res.status(500).send({ message: error.message })
        }
    },
    //---------------deleteLanguage---------//
    deleteLanguage: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {

            let criteria = {
                _id: req.body._id
            }

            let dataToUpdate = req.body;
            let result = await find.findAndRemovePromise("languageModel", criteria, dataToUpdate, { new: true })
            response.sendsuccessData(res, 'language delete successfully ', result)
        } catch (error) {
            console.log('--------------------   contentEdit ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------listLanguagePagination---------//
    listLanguagePagination: async (req, res) => {
        try {
            var options = {
                page: parseInt(req.params.pageNumber) || 1,
                limit: parseInt(req.params.limit) || 10,
                sort: { createdAt: -1 },
            }
            let result = await find.pagination("languageModel", {}, options);
            response.sendsuccessData(res, 'explanation list', result)
        } catch (error) {
            console.log('--------------------   contentList ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------listLanguage---------//
    listLanguage: async (req, res) => {
        try {
            console.log("quert====>", req.query.language)
            if (req.query.language == undefined) {
                let result = await find.findAllPromise("languageModel", { sort: { created: -1 } }, {}, {})
                return response.sendsuccessData1(res, 'languages list', result, "")
            }
            else {
                let result = await find.findAllPromise("languageModel", {}, {}, {})
                console.log("Language list is=========>", result)
                let lan = req.query.language
                console.log("Query is=========>", lan)
                let actLan = lan.split(",")
                console.log("Lan is=========>", actLan)
                let obj = []
                let checkAdmin = await Admin.findOne({ status: 'Active' })
                console.log("Admin data=========>", checkAdmin.gameUserCount)
                for (let i = 0; i < actLan.length; i++) {
                    let myArray = []
                    myArray.push(actLan[i])
                    let checkUserList = await User.find({ languageCode: { $in: myArray } })
                    if (checkUserList.length >= checkAdmin.gameUserCount) {
                        console.log("Chat user list is=========>", checkUserList.length)
                        let acObj = {
                            language: actLan[i],
                            status: true
                        }
                        obj.push(acObj)
                    }
                    else {
                        let acObj = {
                            language: actLan[i],
                            status: false
                        }
                        obj.push(acObj)
                    }
                }
                console.log("Obj is==========>", obj)
                return response.sendsuccessData1(res, 'languages list', result, obj)
            }

        } catch (error) {
            console.log('--------------------   contentList ---------------- ', error);
            return response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------popularLanguageList---------//
    popularLanguageList: async (req, res) => {
        try {
            project = {
                status: { $eq: '1' }
            }
            let result = await find.findAllPromise("languageModel", project, {}, {})
            response.sendsuccessData(res, 'languages list', result)

        } catch (error) {
            console.log('--------------------   contentList ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------editLanguage---------//
    editLanguage: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            let criteria = {
                _id: req.params._id
            }
            let dataToUpdate = {};
            dataToUpdate = req.body;
            if (req.files.picture) {
                let imageArr = [];
                let uploadedImage = await imageUpload(req.files.picture)
                imageArr.push(uploadedImage.secure_url);
                dataToUpdate.picture = imageArr[0];
            }
            if (req.files.greyImage) {
                let uploadedImage = await imageUpload(req.files.greyImage);
                dataToUpdate.greyImage = uploadedImage.secure_url
            }
            let result = await find.findAndUpdatePromise("languageModel", criteria, dataToUpdate, { new: true })
            response.sendsuccessData(res, 'language updated', result)

        } catch (error) {
            console.log('--------------------   contentEdit ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------addExplanation---------//
    addExplanation: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            let criteria = {}
            criteria.explanation = req.body.explanation;
            let userExist = await find.findOnePromise("explanationModel", criteria, {}, {})
            if (userExist) {
                return response.sendErrorMessage(res, ("explanation already exists"));
            }
            let dataToSave = {}
            dataToSave = req.body;
            if (req.files.picture) {
                let uploadedImage = await imageUpload(req.files.picture);
                selectedPicture = [{
                    picture: uploadedImage.secure_url,
                    type: "selected"
                }
                ]
            }
            if (req.files.picture2) {
                let uploadedImage = await imageUpload(req.files.picture2);
                dataToSave.picture = selectedPicture.concat([{
                    picture: uploadedImage.secure_url,
                    type: "Unselected"
                }])
            }
            let result = await create.create("explanationModel", dataToSave);
            response.sendsuccessData(res, 'Create successful explanation ', result)
        } catch (error) {
            console.log('--------------------   contentAdd ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------deleteExplanation---------//
    deleteExplanation: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {

            let criteria = {
                _id: req.body._id
            }
            let dataToUpdate = req.body;
            let result = await find.findAndRemovePromise("explanationModel", criteria, dataToUpdate, { new: true })
            response.sendsuccessData(res, 'delete explanation successfully ', result)
        } catch (error) {
            console.log('--------------------   contentEdit ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------listExplanation---------//


    listExplanation: async (req, res) => {
        try {
            console.log("Request for exp is========>", req.body)
            let result = await find.findAllPromise("explanationModel", {}, {}, {})
            let results = await find.findAllPromise("converseModel", {}, {}, {})
            let criteria = {
                // "socialType": req.body.type,
                _id: { $ne: req.user._id },
                deleteAccountStatus: false
            }
            let userData = []
            // if (req.body.type == "facebook") {
            //     criteria = {
            //         "socialType": req.body.type,
            //         _id: { $ne: req.user._id },
            //         deleteAccountStatus: false
            //     }
            // }
            // if (req.body.type == "Instagram") {
            //     criteria = {
            //         "type": "2",
            //         _id: { $ne: req.user._id },
            //         deleteAccountStatus: false
            //     }
            // }
            let option = { lean: true }
            var criteria2 = { _id: req.user._id }
            let userDetails = await find.findOnePromise("userModel", criteria2, {}, {});
            let query1 = { $or: [{ sender_id: req.user._id }, { receiver_id: req.user._id }] }
            let chatDataList = await ChatModel.find(query1).sort({updatedAt:-1})
            for (let i = 0; i < chatDataList.length; i++) {
                if ((req.user._id).toString() == (chatDataList[i].sender_id).toString()) {
                    let checkUsr = await User.findOne({ _id: chatDataList[i].receiver_id,deleteAccountStatus: false })
                    if(checkUsr){
                        userData.push(checkUsr)
                    }
                   
                }
                if ((req.user._id).toString() == (chatDataList[i].receiver_id).toString()) {
                    let checkUsr = await User.findOne({ _id: chatDataList[i].sender_id,deleteAccountStatus: false })
                    if(checkUsr){
                        userData.push(checkUsr)
                    }
                }
                
            }
            // let result3 = await find.findAllPromise("userModel", criteria, {}, option);
            // for (let i = 0; i < result3.length; i++) {
            //     let query1 = { $and: [{ sender_id: req.user._id }, { receiver_id: result3[i]._id }] }
            //     let ChatData = await ChatModel.findOne(query1).sort({ createdAt: -1 })
            //     if (ChatData) {
            //         userData.push(result3[i])
            //     }
            //     if (!ChatData) {
            //         let query2 = { $and: [{ sender_id: result3[i]._id }, { receiver_id: req.user._id }] }
            //         let chatData = await ChatModel.findOne(query2).sort({ createdAt: -1 })
            //         if (chatData) {
            //             userData.push(result3[i])
            //         }
            //     }
            // }
            console.log("Users is===========>", userData)
            let result4 = await find.findAllPromise("languageModel", {}, {}, {})
            response.sendsuccessDataMultipleExp(res, 'converse list', result, results, userData, result4, userDetails)
        } catch (error) {
            console.log('--------------------   contentList ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------listExplanation---------//
    listExplanationss: async (req, res) => {
        try {
            let result = await find.findAllPromise("explanationModel", {}, {}, {})
            let results = await find.findAllPromise("converseModel", {}, {}, {})
            let criteria = {
                "socialType": "facebook",
            }
            let option = { lean: true }

            let result3 = await find.findAllPromise("userModel", criteria, {}, option);
            let result4 = await find.findAllPromise("languageModel", {}, {}, {})
            response.sendsuccessDataMultipleExp(res, 'converse list', result, results, result3, result4)
        } catch (error) {
            console.log('--------------------   contentList ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    getExplanationById: async (req, res) => {
        try {
            let criteria = {
                _id: req.params._id
            }
            let project = {
                _id: 1,
                explanation: 1,
                picture: 1,
                picture2: 1
            }
            let result = await find.findOnePromise("explanationModel", criteria, project, {})
            response.sendsuccessData(res, "explanation found succesfully", result)
        } catch (error) {
            console.log('--------------------   explanation ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------listExplanationPagination---------//
    listExplanationPagination: async (req, res) => {
        try {
            console.log("Request get explanation is==========>")
            var options = {
                page: parseInt(req.params.pageNumber) || 1,
                limit: parseInt(req.params.limit) || 10,
                sort: { createdAt: -1 },
                populate: { path: 'explanation_id' }
            }
            let result = await find.pagination("explanationModel", {}, options);
            console.log("Data is==========>", result)
            response.sendsuccessData(res, 'explanation list', result)

        } catch (error) {
            console.log('--------------------   contentList ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------editExplanation---------//
    editExplanation: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {

            let criteria = {
                _id: req.params._id
            }
            let result3 = await find.findAllPromise("explanationModel", criteria, {}, {});
            var selected = (result3[0].picture[0]);
            var unSelected = (result3[0].picture[1]);
            var dataToSave = {};
            dataToSave = req.body;
            if (req.body.file === '0' && req.body.file1 === '1') {
                if (req.files.picture) {
                    let uploadedImage = await imageUpload(req.files.picture);
                    selectedPicture = [{
                        picture: uploadedImage.secure_url,
                        type: "selected"
                    }
                    ]
                }
                if (req.files.picture2) {
                    let uploadedImage = await imageUpload(req.files.picture2);
                    dataToSave.picture = selectedPicture.concat([{
                        picture: uploadedImage.secure_url,
                        type: "Unselected"
                    }])
                }
            } else if (req.body.file === '0') {
                if (req.files.picture) {
                    let uploadedImage = await imageUpload(req.files.picture);
                    selectedPicture = [{
                        picture: uploadedImage.secure_url,
                        type: "selected"
                    }]
                }
                dataToSave.picture = selectedPicture.concat([{
                    picture: unSelected.picture,
                    type: "Unselected"
                }])
            } else if (req.body.file1 === '1') {
                if (req.files.picture2) {
                    var uploadedImage = await imageUpload(req.files.picture2);
                    selectedPicture = [{
                        picture: uploadedImage.secure_url,
                        type: "Unselected"
                    }
                    ]
                }
                var testing = [{
                    picture: selected.picture,
                    type: "selected"
                }]
                dataToSave.picture = testing.concat([{
                    picture: uploadedImage.secure_url,
                    type: "Unselected"
                }])
            }
            console.log(dataToSave);
            let result = await find.findAndUpdatePromise("explanationModel", criteria, dataToSave, { new: true })
            response.sendsuccessData(res, 'explanation updated', result)
        } catch (error) {
            console.log('--------------------   contentEdit ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------addConverse---------//
    addConverse: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            let dataToSave = {}
            dataToSave = req.body;
            let result = await create.create("converseModel", dataToSave);
            response.sendsuccessData(res, 'Create successful converse ', result)
        } catch (error) {
            console.log('--------------------   contentAdd ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------getConverseById---------//
    getConverseById: async (req, res) => {
        try {
            let criteria = {
                _id: req.params._id
            }
            let result = await find.findOnePromise("converseModel", criteria, {}, {})
            response.sendsuccessData(res, "explanation converse", result)
        } catch (error) {
            console.log('--------------------   explanation ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------getConverseByIdExpantion---------//
    getConverseByIdExpantion: async (req, res) => {
        try {
            let criteria = {
                explanation_id: req.body.explanation_id
            }
            console.log(criteria)
            let result = await find.findOnePromise("converseModel", criteria, {}, {})
            response.sendsuccessData(res, "explanation converse", result)
        } catch (error) {
            console.log('--------------------   explanation ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------getConverseByIdExp---------//
    getConverseByIdExp: async (req, res) => {
        try {
            let criteria = {
                explanation_id: req.params._id
            }
            let result = await find.findOnePromise("converseModel", criteria, {}, {})
            response.sendsuccessData(res, "explanation converse", result)
        } catch (error) {
            console.log('--------------------   explanation ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------deleteConverse---------//
    deleteConverse: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            let criteria = {
                _id: req.body._id
            }
            let dataToUpdate = req.body;
            let result = await find.findAndRemovePromise("converseModel", criteria, dataToUpdate, { new: true })
            response.sendsuccessData(res, 'delete converse successfully ', result)
        } catch (error) {
            console.log('--------------------   contentEdit ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------listConverse---------//
    listConverse: async (req, res) => {
        try {
            let result = await find.findAllPromise("converseModel", {}, {}, {})
            response.sendsuccessData(res, 'converse list', result)

        } catch (error) {
            console.log('--------------------   contentList ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------listConversePagination---------//
    listConversePagination: async (req, res) => {
        try {
            var size = 10
            let results = await ConverseModel.aggregate([
                {
                    $lookup: {
                        from: "explanations",
                        localField: "explanation_id",
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
                    $project: {
                        _id: 1,
                        explanation: 1,
                        converse: 1,
                        'forecasterData.explanation': 1,
                    }
                },
                { $sort: { createdAt: -1 }, },
                { "$skip": (size * (req.params.pageNumber - 1)) },
                { $limit: parseInt(req.params.limit) || 10 }
            ])
            let options = {
                page: parseInt(req.params.pageNumber) || 1,
                limit: parseInt(req.params.limit) || 10,
                sort: { createdAt: -1 },
            }
            let notifications = await ConverseModel.aggregatePaginate(results, options)
            var test = { docs: results, page: options.page, limit: options.limit, total: notifications.totalCount, pages: notifications.pageCount }
            response.sendsuccessData(res, 'converse list', test)
        } catch (error) {
            console.log('--------------------   contentList ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------editConverse---------//
    editConverse: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }

        try {
            let criteria = {
                _id: req.params._id
            }
            let dataToUpdate = req.body;
            let result = await find.findAndUpdatePromise("converseModel", criteria, dataToUpdate, { new: true })
            response.sendsuccessData(res, 'converse updated', result)
        } catch (error) {
            console.log('--------------------   contentEdit ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------addList---------//
    addList: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            let dataToSave = {}
            dataToSave = req.body;

            let result = await create.create("listModel", dataToSave);
            response.sendsuccessData(res, 'Create successful list ', result)
        } catch (error) {
            console.log('--------------------   listModel ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------deleteList---------//
    deleteList: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            let criteria = {
                _id: req.body._id
            }
            let dataToUpdate = req.body;
            let result = await find.findAndRemovePromise("listModel", criteria, dataToUpdate, { new: true })
            response.sendsuccessData(res, 'list converse successfully ', result)
        } catch (error) {
            console.log('--------------------   listModel ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------listList---------//
    listList: async (req, res) => {
        try {
            let result = await find.findAllPromise("listModel", {}, {}, {})
            response.sendsuccessData(res, ' list', result)

        } catch (error) {
            console.log('--------------------   List ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------editList---------//
    editList: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            let criteria = {
                _id: req.body._id
            }
            let dataToUpdate = req.body;

            let result = await find.findAndUpdatePromise("listModel", criteria, dataToUpdate, { new: true })
            response.sendsuccessData(res, 'list updated', result)
        } catch (error) {
            console.log('--------------------   listEdit ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------addTheme---------//
    addTheme: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            let dataToSave = {}
            dataToSave = req.body;
            let result = await create.create("themeModel", dataToSave);
            response.sendsuccessData(res, 'Create successful Themes ', result)
        } catch (error) {
            console.log('--------------------   ThemeModel ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------deleteTheme---------//
    deleteTheme: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            let criteria = {
                _id: req.body._id
            }
            let dataToUpdate = req.body;
            let result = await find.findAndRemovePromise("themeModel", criteria, dataToUpdate, { new: true })
            response.sendsuccessData(res, 'Theme converse successfully ', result)
        } catch (error) {
            console.log('--------------------   ThemeModel ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------ThemeTheme---------//
    listTheme: async (req, res) => {
        try {
            let result = await find.findAllPromise("themeModel", {}, {}, {})
            response.sendsuccessData(res, 'themeModel', result)

        } catch (error) {
            console.log('--------------------   Theme ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------editTheme---------//
    editTheme: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            let criteria = {
                _id: req.body._id
            }
            let dataToUpdate = req.body;
            let result = await find.findAndUpdatePromise("themeModel", criteria, dataToUpdate, { new: true })
            response.sendsuccessData(res, 'Theme updated', result)
        } catch (error) {
            console.log('--------------------   ThemeEdit ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //-----------------------Coin-----------------------------------//
    addCoin: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            let dataToSave = {}
            dataToSave = req.body;
            let result = await create.create("coinModel", dataToSave);
            response.sendsuccessData(res, 'Create successful Coin ', result)
        } catch (error) {
            console.log('--------------------   contentAdd ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //-------------------getCoinById---------------------------//
    getCoinById: async (req, res) => {
        try {
            let criteria = {
                _id: req.params._id
            }
            let result = await find.findOnePromise("coinModel", criteria, {}, {})
            response.sendsuccessData(res, "explanation Coin", result)
        } catch (error) {
            console.log('--------------------   explanation ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------listCoin---------//
    listCoin: async (req, res) => {
        try {
            let result = await find.findAllPromise("coinModel", {}, {}, {})
            response.sendsuccessData(res, 'Coin list', result)

        } catch (error) {
            console.log('--------------------   contentList ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------editCoin---------//
    editCoin: async (req, res) => {

        console.log("Update coin is==========>", req.body);
        let admimData = await Admin.findOne({ status: 'Active' })
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            let criteria = {
                _id: req.params._id
            }
            let dataToUpdate = req.body;
            console.log(dataToUpdate);
            await Admin.findByIdAndUpdate({ _id: admimData._id }, { $set: { gameUserCount: req.body.gameUserCount } }, { new: true })
            let result = await find.findAndUpdatePromise("coinModel", criteria, dataToUpdate, { new: true })
            console.log(result);
            response.sendsuccessData(res, 'Coin updated', result)
        } catch (error) {
            console.log('--------------------   contentEdit ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //-----------------------Mobile---------------------//
    addPayCoin: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            var criteria1 = {};
            criteria1._id = req.user._id;
            var userDetails = await find.findOnePromise("userModel", criteria1, {}, {});
            let dataToUpdate = {}
            dataToUpdate.coins = (parseInt(userDetails.coins) + (parseInt(req.body.coin)));
            let result2 = await find.findByIdAndUpdatePromise("userModel", criteria1, dataToUpdate, { new: true }, {})
            response.sendsuccessData(res, 'Coin Add successful', result2)
        } catch (error) {
            console.log('--------------------   contentAdd ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //-----------------------Mobile---------------------//
    addMobileCoin: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            let dataToSave = {}
            dataToSave = req.body;
            let result = await create.create("coinPay", dataToSave);
            response.sendsuccessData(res, 'Create successful Coin ', result)
        } catch (error) {
            console.log('--------------------   contentAdd ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //-------------------getCoinById---------------------------//
    getMobileCoinById: async (req, res) => {
        try {
            let criteria = {
                _id: req.params._id
            }
            let result = await find.findOnePromise("coinPay", criteria, {}, {})
            response.sendsuccessData(res, "getMobileCoinById Coin", result)
        } catch (error) {
            console.log('--------------------   getMobileCoinById ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------listCoin---------//
    listMobileCoin: async (req, res) => {
        try {
            let result = await find.findAllPromise("coinPay", {}, {}, {});
            let results = await find.findAllPromise("coinModel", {}, {}, {});

            let coin = {
                coinPay: result,
                coinModel: results
            }
            response.sendsuccessData(res, 'list Mobile Coin list', coin);
        } catch (error) {
            console.log('--------------------   listMobileCoin ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    //---------------editMobileCoin---------//
    editMobileCoin: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }

        try {
            let criteria = {
                _id: req.params._id
            }
            let dataToUpdate = req.body;
            console.log(criteria)
            let result = await find.findAndUpdatePromise("coinPay", criteria, dataToUpdate, { new: true })
            response.sendsuccessData(res, 'Coin updated', result)
        } catch (error) {
            console.log('--------------------   contentEdit ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },
    checkCoinRemove: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.sendErrorMessage(res, errors.array().slice(0, 1).map(function (errs) { return errs.msg; }).toString(), "false");
        }
        try {
            let dataTosave1 = {};
            dataTosave1.user_id = req.body._id;
            dataTosave1.room_id = req.body.game_id;
            let userExist1 = await find.findOnePromise("checkCoinModel", dataTosave1, {}, {});
            let result = {};
            console.log(userExist1)
            if (userExist1 === null) {
                result.status = "true";
                response.sendsuccessData(res, 'Coin Status', result)
            } else {
                result.status = "false";
                response.sendsuccessData(res, 'Coin Status', result)
            }
        } catch (error) {
            console.log('--------------------   contentEdit ---------------- ', error);
            response.sendErrorCustomMessage(res, "Internal Server Error", "false");
        }
    },


    searchUser: async (req, res) => {
        try {
            console.log("Request for user is==========>", req.body);
            let lan = req.body.language
            console.log("Query is=========>", lan)
            let actLan = lan.split(",")
            console.log("Lan is=========>", actLan)
            let searchQuery = {
                "name": { $regex: "^" + req.body.search, $options: 'i' },
                languageCode: { $in: actLan },
                type: { $ne: "3" },
                deleteAccountStatus: false,
                _id: { $ne: ObjectId(req.user._id) }

            }
            let checkUserList = await User.find(searchQuery)
            console.log("Obj is==========>", checkUserList)
            return response.sendsuccessData1(res, 'languages list', checkUserList, "")
        } catch (error) {
            console.log('--------------------   contentList ---------------- ', error);
            return response.sendErrorCustomMessage(res, "Internal Server Error", "false");
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