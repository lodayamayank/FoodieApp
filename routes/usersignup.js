var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var config = require("../config/config");
var UserSchema = require('../models/Usermanagement');


module.exports = function (app, gConfig) {
    getRegistrationPage = function (req, res) {
        var resObj = {};
        resObj.loginLink = "/";
        resObj.title = "Registration";
        res.render('sellerRegistration', resObj);
    }

    sellerSignUp = function (req, res) {
        var responseJson = {};
        var resSaveCommon = new gConfig.UsermanagementSchema({});
        resSaveCommon.createdOn = new Date();
        resSaveCommon.roleName = 'User';
        resSaveCommon.isAdmin = 1;

        if (req.body.firstName != '' && req.body.firstName != undefined) {
            resSaveCommon.firstName = req.body.firstName;
        }
         if (req.body.email != '' && req.body.email != undefined) {
            resSaveCommon.email = req.body.email;
        }

        if (req.body.mobileNumber != '' && req.body.mobileNumber != undefined) {
            resSaveCommon.mobileNumber = req.body.mobileNumber;
        }

        if (req.body.flatNumber != '' && req.body.flatNumber != undefined) {
            resSaveCommon.flatNumber = req.body.flatNumber;
        }
        if (req.body.wing != '' && req.body.wing != undefined) {
            resSaveCommon.wing = req.body.wing;
        }
        if (req.body.password != '' && req.body.password != undefined) {
            bcrypt.genSalt(config.commonObjects.encryptionRound, function (err, salt) {

                bcrypt.hash(req.body.password, salt, function (err, hash) {
                    if (err) {
                        responseJson.data = '';
                        responseJson.status = 401;
                        responseJson.error = 'Error while creating user.';
                        return res.json(responseJson);
                    } else {
                        resSaveCommon.password = hash;
                    }
                });
            });

        }

        var condition = {};
        condition.$or = [
            { mobileNumber: req.body.mobileNumber },
            { email: req.body.email },
        ];
        condition.isDelete = 0;
        debugger;
        gConfig.UsermanagementSchema.findOne(condition).exec(function (errSchema, resSchema) {
            if (errSchema) {
                responseJson.data = '';
                responseJson.status = 401;
                responseJson.error = 'Error while creating user.';
                return res.json(responseJson);
            } else if (resSchema) {
                responseJson.data = '';
                responseJson.status = 401;
                responseJson.error = 'Email or mobile number already exists.';
                return res.json(responseJson);
            } else if (errSchema == null && resSchema == null) {
                resSaveCommon.save(function (errUserSchema, resUserSchema) {
                    if (errUserSchema) {
                        responseJson.data = '';
                        responseJson.status = 401;
                        responseJson.error = 'Error while creating user.';
                        return res.json(responseJson);
                    } else {
                        var resUpdateUser = resUserSchema;
                        resUpdateUser.userId = resUserSchema._id;
                        resUpdateUser.save(function (errUserUpdateSchema, resUserUpdateSchema) {
                            if (errUserUpdateSchema) {
                                responseJson.data = '';
                                responseJson.status = 401;
                                responseJson.error = 'Error while updating user data.';
                                return res.json(responseJson);
                            } else {
                                var resSaveHistory = new gConfig.HistorySchema({});
                                resSaveHistory.userId = resUserUpdateSchema.userId;
                                resSaveHistory.createdBy = resUserUpdateSchema.userId;
                                resSaveHistory.historyType = "Signup";
                                resSaveHistory.historyDetail = "User Created";
                                resSaveHistory.save(function (errSaveHistory, resHistorySchema) {
                                    if (errSaveHistory) {
                                        responseJson.data = '';
                                        responseJson.status = 401;
                                        responseJson.error = 'Error while saving user history';
                                        return res.json(responseJson);
                                    } else if (resHistorySchema) {
                                        var tokenData = {};
                                        tokenData.isAdmin = resUserUpdateSchema.isAdmin;
                                        tokenData.roleName = resUserUpdateSchema.roleName;
                                        tokenData.userId = resUserUpdateSchema.userId;
                                        tokenData.isUserVerified = resUserUpdateSchema.isUserVerified;
                                        tokenData.isEmailVerified = resUserUpdateSchema.isEmailVerified;
                                        tokenData.isMobileVerified = resUserUpdateSchema.isMobileVerified;
                                        var token = jwt.sign(tokenData, config.commonObjects.jsonsecretkey);

                                        responseJson.token = token;
                                        responseJson.data = '';
                                        responseJson.status = 200;
                                        return res.json(responseJson);
                                    } else {
                                        responseJson.data = '';
                                        responseJson.status = 401;
                                        responseJson.error = 'Error while saving user history';
                                        return res.json(responseJson);
                                    }
                                })
                            }
                        })
                    }
                })
            }
        });

    }

    app.get('/seller-registration', getRegistrationPage);
    app.post('/api/seller-signup', sellerSignUp);
};
