const find = require('../query/find');
const response = require('../utils/response');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

authCheck = async (req, res, next) => {
    let authorisation = req.headers.authorization ? req.headers.authorization : "";
    let token = authorisation.split(' ')[0];
    if (!token) {
        let message = "Unauthorised user"
        response.sendErrorCustomMessage(res, message, '401');
    } else {
        jwt.verify(token, config.jwtSecretKey, async (err, data) => {
            if (err) {
                let message = "Unauthorised user"
                response.sendErrorCustomMessage(res, message, '401');
            }
            else {
                if (data._id != undefined) {
                    let criteria = {
                        _id: data._id
                    }
                    let user = await find.findOnePromise("userModel", criteria, {}, {});
                    if (!user) {
                        let message = "Unauthorised user"
                        response.sendErrorCustomMessage(res, message, '401');
                    } else if (user.jwtToken !== token) {
                        let message = "Unauthorised user"
                        response.sendErrorCustomMessage(res, message, '401');
                    } else {
                        req.user = user;
                        next();
                    }
                }
            }
        })
    }
},
    adminAuth = async (req, res, next) => {

        let authorisation = req.headers.token ? req.headers.token : "";
        let token = authorisation.split(' ')[0];
        if (!token) {
            let message = 'Access denied. No JWT provided.'
            response.sendErrorCustomMessage(res, message, '401')
        } else {
            jwt.verify(token, config.jwtSecretKey, async (err, data) => {
                if (err) {
                    let message = "Unauthorised user"
                    response.sendErrorCustomMessage(res, message, '401');
                } else {
                    let criteria = {
                        _id: data._id
                    }
                    let admin = await find.findOnePromise("adminModel", criteria, {}, {});
                    req.admin = admin;
                    next();
                }
            })
        }
    }
module.exports = {
    authCheck,
    adminAuth
}