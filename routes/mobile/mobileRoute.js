const router = require('express').Router();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const validator = require('../../validator/validation');
const auth = require('../../middleware/auth');
const userController = require('../../controllers/mobile/userController');
const gameController = require('../../controllers/mobile/game.Controller');
const chatController = require('../../controllers/mobile/chatController');
const notificationController = require('../../controllers/mobile/notificationController');
const mobileContentController = require('../../controllers/mobile/mobileContentController');
const contentController = require('../../controllers/admin/contentController');


router.post('/resetPassword', userController.resetPassword);

router.post('/checkEmail', multipartMiddleware, validator.validate('checkemail'), userController.checkEmail);
router.post('/signup', multipartMiddleware, validator.validate('signup'), userController.signup);
router.post('/login', multipartMiddleware, validator.validate('login'), userController.Login);
router.post('/forgetpassword', multipartMiddleware, validator.validate('forgetpassword'), userController.ForgotPassword);
router.post('/socialLogin', multipartMiddleware, validator.validate('socialLogin'), userController.socialLogin);
router.get('/explanation', multipartMiddleware, gameController.Explanation);
router.post('/loginWithOutCredentials', multipartMiddleware, userController.loginWithOutCredentials);
router.post('/guestLogin', multipartMiddleware, userController.guestLogin);
router.post('/checkSocalId', multipartMiddleware, userController.checkSocalId);
router.get('/getUserDemo', multipartMiddleware, userController.getUserDemo);
router.post('/gameDetails', multipartMiddleware, gameController.gameDetails);
router.post('/inviteFriend', multipartMiddleware, gameController.inviteFriend);

//-------------------------privacyPolicy-----------------------//
router.post('/editPrivacyPolicy', multipartMiddleware, validator.validate('editPrivacyPolicy'), mobileContentController.editPrivacyPolicy);
router.get('/listPrivacyPolicy', multipartMiddleware, mobileContentController.listPrivacyPolicy);
router.post('/addPrivacyPolicy', multipartMiddleware, mobileContentController.addPrivacyPolicy);

//-------------------------Feedback-----------------------------//
router.get('/listFeedback', multipartMiddleware, mobileContentController.listFeedback);
router.post('/addFeedback', multipartMiddleware, validator.validate('addFeedback'), mobileContentController.addFeedback);
router.post('/deleteFeedback', multipartMiddleware, validator.validate('deleteFeedback'), mobileContentController.deleteFeedback);

//-------------------------FAQ-----------------------//
router.post('/editFaq', multipartMiddleware, validator.validate('editFaq'), mobileContentController.editFaq);
router.get('/listFaq', multipartMiddleware, mobileContentController.listFaq);
router.post('/addFaq', multipartMiddleware, validator.validate('addFaq'), mobileContentController.addFaq);
router.post('/deleteFaq', multipartMiddleware, validator.validate('deleteFaq'), mobileContentController.deleteFaq);

//-------------------------Language-----------------------//
router.post('/editLanguage/:_id', multipartMiddleware, validator.validate('editLanguage'), mobileContentController.editLanguage);
router.get('/listLanguage', multipartMiddleware, mobileContentController.listLanguage);
router.post('/addLanguage', multipartMiddleware, validator.validate('addLanguage'), mobileContentController.addLanguage);
router.post('/deleteLanguage', multipartMiddleware, validator.validate('deleteFaq'), mobileContentController.deleteLanguage);
router.post('/listLanguage/:limit/:pageNumber', multipartMiddleware, mobileContentController.listLanguagePagination);
router.get('/listLanguage/:_id', multipartMiddleware, mobileContentController.getLanguageId);
router.get('/popularLanguageList', multipartMiddleware, mobileContentController.popularLanguageList);


//-------------------------Explanation-----------------------//
router.post('/deleteExplanation', multipartMiddleware, validator.validate('deleteExplanation'), mobileContentController.deleteExplanation);
router.post('/editExplanation/:_id', multipartMiddleware, validator.validate('editExplanation'), mobileContentController.editExplanation);
router.post('/addExplanation', multipartMiddleware, validator.validate('addExplanation'), mobileContentController.addExplanation);
router.get('/getExplanationById/:_id', multipartMiddleware, mobileContentController.getExplanationById);
router.post('/listExplanation/:limit/:pageNumber', multipartMiddleware, mobileContentController.listExplanationPagination);

//-------------------------Converse-----------------------//
router.post('/listConverse/:limit/:pageNumber', multipartMiddleware, mobileContentController.listConversePagination);
router.post('/editConverse/:_id', multipartMiddleware, validator.validate('editConverse'), mobileContentController.editConverse);
router.get('/listConverse', multipartMiddleware, mobileContentController.listConverse);
router.post('/addConverse', multipartMiddleware, validator.validate('addConverse'), mobileContentController.addConverse);
router.post('/deleteConverse', multipartMiddleware, validator.validate('deleteExplanation'), mobileContentController.deleteConverse);
router.get('/getConverseById/:_id', multipartMiddleware, mobileContentController.getConverseById);
router.get('/getConverseByIdExpantion', multipartMiddleware, mobileContentController.getConverseByIdExpantion);
router.get('/getConverseByIdExp/:_id', multipartMiddleware, mobileContentController.getConverseByIdExp);


//-------------------------List-----------------------//
router.post('/editList', multipartMiddleware, validator.validate('editConverse'), mobileContentController.editList);
router.get('/listList', multipartMiddleware, mobileContentController.listList);
router.post('/addList', multipartMiddleware, validator.validate('addList'), mobileContentController.addList);
router.post('/deleteList', multipartMiddleware, validator.validate('deleteExplanation'), mobileContentController.deleteList);

//-------------------------Theme-----------------------//
router.post('/editTheme', multipartMiddleware, mobileContentController.editTheme);
router.get('/listTheme', multipartMiddleware, mobileContentController.listTheme);
router.post('/addTheme', multipartMiddleware, mobileContentController.addTheme);
router.post('/deleteTheme', multipartMiddleware, mobileContentController.deleteTheme);
router.post('/uploadImage', multipartMiddleware, mobileContentController.uploadImage);



//-----------------------------Coin---------------------------------//
router.post('/editCoin/:_id', multipartMiddleware, mobileContentController.editCoin);
router.get('/listCoin', multipartMiddleware, mobileContentController.listCoin);
router.post('/addCoin', multipartMiddleware, mobileContentController.addCoin);
router.get('/getCoinById/:_id', multipartMiddleware, mobileContentController.getCoinById);






//-----------------------------Coin Mobile---------------------------------//
router.post('/editMobileCoin/:_id', multipartMiddleware, mobileContentController.editMobileCoin);
router.get('/listMobileCoin', multipartMiddleware, mobileContentController.listMobileCoin);
router.post('/addMobileCoin', multipartMiddleware, mobileContentController.addMobileCoin);
router.get('/getMobileCoinById/:_id', multipartMiddleware, mobileContentController.getMobileCoinById);




router.get('/listImage', multipartMiddleware, contentController.listImage);
router.post('/editConverse/:_id', multipartMiddleware, validator.validate('editConverse'), mobileContentController.editConverse);
router.get('/listConverse', multipartMiddleware, mobileContentController.listConverse);
router.post('/addConverse', multipartMiddleware, validator.validate('addConverse'), mobileContentController.addConverse);
router.post('/deleteConverse', multipartMiddleware, validator.validate('deleteExplanation'), mobileContentController.deleteConverse);
router.get('/getConverseById/:_id', multipartMiddleware, mobileContentController.getConverseById);
router.post('/listConverse/:limit/:pageNumber', multipartMiddleware, mobileContentController.listConversePagination);


//------------------------------Lives------------------------------------------
router.get('/listImage', multipartMiddleware, chatController.addLives);
router.post('/getChatData', multipartMiddleware, chatController.getChatData);
router.post('/socialIdValidOrNot', multipartMiddleware, gameController.socialIdValidOrNot);
router.post('/gameCardCount', multipartMiddleware, gameController.gameCardCount);
router.post('/leaderboard', gameController.leaderboard);
router.get('/listExplanationss', multipartMiddleware, mobileContentController.listExplanationss);
//-----------------------Check auth--------------------.//

router.use(auth.authCheck);

router.get('/getOtherUserDetails/:id', multipartMiddleware, gameController.getOtherUserDetails);

router.post('/checkCoinRemove', multipartMiddleware, mobileContentController.checkCoinRemove);
router.post('/listExplanation', multipartMiddleware, mobileContentController.listExplanation);
router.post('/searchUser', multipartMiddleware, mobileContentController.searchUser);
router.post('/addPayCoin', multipartMiddleware, mobileContentController.addPayCoin);
router.post('/gameOver', multipartMiddleware, gameController.gameOver);
router.get('/dailyCheckCoin', multipartMiddleware, gameController.dailyCheckCoin);
router.post('/updateUserProfile', multipartMiddleware, userController.updateUserProfile);
router.post('/deleteUserAcount', multipartMiddleware, userController.deleteUserAcount);
router.get('/getUserDetails', multipartMiddleware, userController.getUserDetails);
router.post('/logout', multipartMiddleware, userController.logout);
router.post('/gameCreate', multipartMiddleware, validator.validate('gameCreate'), gameController.gameCreate);
router.post('/addDailyCoin', multipartMiddleware, gameController.addDailyCoin);
router.post('/addCoins', multipartMiddleware, gameController.addCoins);
router.post('/checkDailyCoin', multipartMiddleware, gameController.checkDailyCoin);
router.post('/addVideo', multipartMiddleware, gameController.addVideo);
router.post('/viewVideo', multipartMiddleware, gameController.viewVideo);
router.post('/getGameDetails', multipartMiddleware, gameController.getGameDetails);
router.post('/getFindPatner', multipartMiddleware, gameController.getFindPatner);
router.post('/countCardValue', multipartMiddleware, gameController.countCardValue);

//-----------------------------notification -----------------------------//
router.post('/notificationUpdate', multipartMiddleware, userController.notificationUpdate);
router.post('/notificationCount', multipartMiddleware, notificationController.notificationCount);
router.post('/notificationList', multipartMiddleware, notificationController.notificationList);
router.get('/notificationListWithToken', multipartMiddleware, notificationController.notificationListbyId);


//--------------------------------------chat---------------------------//
router.post('/roomCreate', multipartMiddleware, validator.validate('statusChange'), chatController.roomCreate);
router.post('/chatData', multipartMiddleware, chatController.chatData);
router.post('/roomStatusUpdate', multipartMiddleware, chatController.roomStatusUpdate);
router.post('/chatUserList', multipartMiddleware, chatController.chatUserList);
router.post('/myMatch', multipartMiddleware, chatController.myMatch);



module.exports = router;



