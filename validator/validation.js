const { check } = require("express-validator");

class Validations {

    validate(method) {
        switch (method) {

            case 'signup': {
                return [
                    check('name', 'please enter fullName ').not().isEmpty(),
                    check('name', 'please enter fullName ').trim(),
                    check('email', 'please enter emailid ').not().isEmpty(),
                    check('email', 'Please Enter a proper emailId').isEmail(),
                    check('username', 'please enter username ').not().isEmpty(),
                    check('username', 'please enter username ').trim(),
                    check('password', 'please enter password ').not().isEmpty(),
                    check('password', 'please enter password ').trim(),
                ]
            }

            case 'checkemail': {
                return [

                    check('email', 'please enter emailid ').not().isEmpty(),
                ]
            }
            case 'checkUserName': {
                return [
                    check('username', 'please enter username ').not().isEmpty(),
                ]
            }

            case 'login': {
                return [
                    check('email', 'please enter email').notEmpty(),
                    check('password', 'please enter password').notEmpty(),
                ]
            }

            case 'forgetpassword': {
                return [
                    check('email', 'please enter email').notEmpty(),
                ]
            }

            case 'socialLogin': {
                return [
                    check('socialId', 'Please enter  socialId').notEmpty(),
                    check('socialType', 'Please enter socialType').notEmpty(),
                ]
            }

            case 'particularPost': {
                return [
                    check('postId', 'Please enter a postId ').notEmpty(),
                ]
            }

            case 'statusChange': {
                return [
                    check('postId', 'Please enter postId').notEmpty(),
                ]
            }


            case 'gameCreate': {
                return [
                    check('mode', 'Please enter mode').notEmpty(),

                ]
            }

            case 'deletePost': {
                return [
                    check('_id', 'Please enter postId').notEmpty(),
                ]
            }

            case 'unfollow': {
                return [
                    check('userId', 'Please enter userId').notEmpty(),
                ]
            }

            case 'likes': {
                return [
                    check('postId', 'Please enter a postId ').notEmpty(),
                ]
            }
            case 'otherUserProfile': {
                return [
                    check('userId', 'Please enter userId').notEmpty(),
                ]
            }
            case 'addFeedback': {
                return [
                    check('message', 'Please enter message').notEmpty(),

                ]
            }
            case 'deleteFeedback': {
                return [
                    check('_id', 'Please enter Id').notEmpty(),

                ]
            }
            case 'deleteFaq': {
                return [
                    check('_id', 'Please enter Id').notEmpty(),
                ]
            }
            case 'deleteExplanation': {
                return [
                    check('_id', 'Please enter Id').notEmpty(),
                ]
            }
            case 'addPrivacyPolicy': {
                return [
                    check('policy', 'Please enter policy').not().notEmpty(),
                ]
            }

            case 'editFaq': {
                return [
                    check('question', 'Please enter question').notEmpty(),
                    check('answer', 'Please enter answer').notEmpty(),
                    check('_id', 'Please enter Id').notEmpty(),
                ]
            }

            case 'contentEdit': {
                return [
                    check('contentId', 'Please enter Id').notEmpty(),
                ]
            }

            case 'addFaq': {
                return [
                    check('question', 'Please enter question').notEmpty(),
                    check('answer', 'Please enter answer').notEmpty(),
                ]
            }
            case 'addLanguage': {
                return [
                    check('language', 'Please enter language').notEmpty(),
                    // check('code', 'Please enter code').notEmpty(),
                    check('description', 'Please enter description').notEmpty(),
                ]
            }
            case 'addExplanation': {
                return [
                    check('explanation', 'Please enter explanation').notEmpty(),

                ]
            }
            case 'addConverse': {
                return [
                    check('converse', 'Please enter converse').notEmpty(),

                ]
            }
            case 'addList': {
                return [
                    check('list', 'Please enter List').notEmpty(),

                ]
            }
            case 'editExplanation': {
                return [
                    check('explanation', 'Please enter explanation').notEmpty(),
                    check('_id', 'Please enter _id').not().notEmpty(),

                ]
            }
            case 'editConverse': {
                return [
                    check('converse', 'Please enter Converse').notEmpty(),
                    check('_id', 'Please enter _id').not().notEmpty(),
                ]
            }
            case 'editLanguage': {
                return [
                    check('language', 'Please enter language').notEmpty(),
                    check('code', 'Please enter code').notEmpty(),
                    check('description', 'Please enter description').notEmpty(),
                ]
            }
            case 'editPrivacyPolicy': {
                return [
                    check('policy', 'Please enter policy').not().notEmpty(),
                    check('_id', 'Please enter _id').not().notEmpty(),

                ]
            }
            case 'contentList': {
                return [
                    check('contentId', 'Please enter Id').notEmpty(),
                ]
            }
        }
    }
}

module.exports = new Validations();