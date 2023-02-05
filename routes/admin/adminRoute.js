const router = require('express').Router()
const userController = require('../../controllers/admin/userController');
const contentController = require('../../controllers/admin/contentController');
const gameController = require('../../controllers/admin/gameController');
const auth = require('../../middleware/auth');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const validator = require('../../validator/validation');



router.post('/createAdmin', multipartMiddleware, userController.createAdmin);
// router.post('/adminLogin', multipartMiddleware, validator.validate('login'), userController.adminLogin);
router.get('/adminDetails', multipartMiddleware, auth.adminAuth, userController.adminDetails);
// //user api
// router.post('/listUser/:limit/:pageNumber', multipartMiddleware, userController.listUser)
router.get('/ForgotPassword', userController.adminForgotPassword)
// router.post('/socialLogin', multipartMiddleware, userController.socialLogin)
router.post('/login', multipartMiddleware, userController.Login)
// router.post('/createGame', multipartMiddleware, userController.createGame)


// router.use(auth.adminAuth);

router.get('/getUserDetails/:_id/', multipartMiddleware, userController.getUserDetails)
router.post('/listUser/:limit/:pageNumber', multipartMiddleware, userController.listUser)
router.post('/editImage/:_id', multipartMiddleware, contentController.editImage);
router.post('/editGame/:_id', multipartMiddleware, gameController.editGame);
router.get('/listImage', multipartMiddleware, contentController.listImage);
router.post('/addImage', multipartMiddleware, contentController.addImage);
router.post('/deleteImage', multipartMiddleware, validator.validate('deleteFaq'), contentController.deleteImage);
router.post('/listImage/:limit/:pageNumber', multipartMiddleware, contentController.imagePagination);
router.get('/listImage/:_id', multipartMiddleware, contentController.getImageById);
router.post('/gameCreate', multipartMiddleware, gameController.gameCreate);
router.get('/gameDetailsById/:_id', multipartMiddleware, gameController.gameDetailsById);
router.post('/listGame/:limit/:pageNumber', multipartMiddleware, gameController.listGamePagination);
router.post('/AllUserNotification', multipartMiddleware, contentController.AllUserNotification);
router.post('/totalUser', multipartMiddleware, contentController.totalUser);
router.post('/updateUserProfileStatus', multipartMiddleware, userController.updateUserProfileStatus);
router.post('/PageLoadTotalUser', multipartMiddleware, contentController.PageLoadTotalUser);
router.post('/helpandsuport', multipartMiddleware, contentController.helpandsuport);
router.get('/helpAndSuportValue/:type', multipartMiddleware, contentController.helpAndSuportValue);
router.post('/helpAndSuportUpdate', multipartMiddleware, contentController.helpAndSuportUpdate);
router.post('/updateGameCount', userController.updateGameCount);
router.post('/getAdminData', userController.getAdminData);

module.exports = router;
