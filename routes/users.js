var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var config = require("../config/config");

module.exports = function (app, gConfig) {
  getUser = function (req, res) {
    var token = req.params.tokenKey;
    gConfig.verifyToken(token, function (responseToken) {
      if (responseToken != false) {
        gConfig.getUserMenu(responseToken, token, function (menu) {
          var resObj = {};
          resObj.appName = "Foodie App";
          resObj.title = "Users";
          resObj.menu = menu;
          resObj.token = token;
          res.render('users', resObj);
        })

      } else {
        res.redirect("/")
      }
    })

  }

  getUsersList = function (req, res) {
    var responseJSON = {};
    try {
      let token; 
if (req.body.token){
        token = req.body.token;
      } else {
        token = req.cookies.token;
      }
      gConfig.verifyToken(token, function (responseToken) {
        if (responseToken != false) {
          var condition = {};
          condition.isDelete = 0;
          var take = 0;
          var skip = 0;
          if (req.body.take != '' && req.body.take != undefined) {
            take = req.body.take;
          }
          if (req.body.skip != '' && req.body.skip != undefined) {
            skip = req.body.skip;
          }
          gConfig.UsermanagementSchema.find(condition).sort({ "order": 1 }).exec(function (errSchema, resSchema) {
            if (errSchema) {
              responseJSON.status = 1;
              responseJSON.err = "";
              responseJSON.data = [];
              return res.json(responseJSON); p
            } else {
              var arrRecords = [];
              var index = 0;
              var totalRecords = 0;
              gConfig.async.eachSeries(resSchema, function (user, userCallback) {
                index++;
                var json = {};
                json.index = index;
                json._id = user._id;
                json.firstName = user.firstName;
                json.email = user.email;
                json.mobileNumber = user.mobileNumber;
                json.wing = user.wing;
                json.flatNumber = user.flatNumber;
                json.createdOn = gConfig.moment(user.createdOn).format("DD/MM/YYYY");
                json.updatedOn = gConfig.moment(user.updatedOn).format("DD/MM/YYYY");
                
            
                arrRecords.push(json);
                userCallback();

              }, function () {
                gConfig.UsermanagementSchema.countDocuments(condition).exec(function (err, count) {
                  totalRecords = count;
                  responseJSON.status = 0;
                  responseJSON.data = arrRecords;
                  responseJSON.totalRecords = totalRecords;
                  return res.json(responseJSON);
                });
              })
            }
          })
        } else {
          responseJSON.status = 1;
          responseJSON.err = "";
          responseJSON.data = [];
          return res.json(responseJSON);
        }
      });
    } catch (err) {
      responseJSON.status = 1;
      responseJSON.data = [];
      responseJSON.err = "Error while loading";
      return res.json(responseJSON);
    }
  }

  getUserRecordById = function (req, res) {
    var responseJSON = {};
    try {
      let token; 
if (req.body.token){
        token = req.body.token;
      } else {
        token = req.cookies.token;
      }
      gConfig.verifyToken(token, function (responseToken) {
        if (responseToken != false) {
          var condition = {};
          condition._id = req.body.recordId;
          gConfig.UsermanagementSchema.findOne(condition).sort({ "order": 1 }).exec(function (errSchema, resSchema) {
            if (errSchema) {
              responseJSON.status = 1;
              responseJSON.err = "Error while getting the data";
              return res.json(responseJSON);
            } else if (resSchema) {
              var json = {}
              json.firstName = resSchema.firstName;
              json.lastName = resSchema.lastName;
              json.email = resSchema.email;
              json.mobileNumber = resSchema.mobileNumber;
              
              json.order = resSchema.order;
              responseJSON.status = 0;
              responseJSON.data = json;
              return res.json(responseJSON);
            } else {
              responseJSON.status = 1;
              responseJSON.err = "No record found";
              return res.json(responseJSON);
            }
          });
        } else {
          responseJSON.status = 1;
          responseJSON.err = "";
          return res.json(responseJSON);
        }
      });
    } catch (err) {
      responseJSON.status = 1;
      responseJSON.data = [];
      responseJSON.err = "Error while loading";
      return res.json(responseJSON);
    }
  }

  userSignUp = function (req, res) {
    var responseJson = {};
    var resSaveCommon = new gConfig.UsermanagementSchema({});
    resSaveCommon.createdOn = new Date();
    resSaveCommon.roleName = 'User';
    resSaveCommon.isAdmin = 1;

    if (req.body.firstName != '' && req.body.firstName != undefined) {
        resSaveCommon.firstName = req.body.firstName;
    }

    if (req.body.lastName != '' && req.body.lastName != undefined) {
        resSaveCommon.lastName = req.body.lastName;
    }

    if (req.body.email != '' && req.body.email != undefined) {
        resSaveCommon.email = req.body.email;
    }

    if (req.body.mobileNumber != '' && req.body.mobileNumber != undefined) {
        resSaveCommon.mobileNumber = req.body.mobileNumber;
    }

    if (req.body.mobileNumber != '' && req.body.mobileNumber != undefined) {
        resSaveCommon.mobileNumber = req.body.mobileNumber;
    }

    if (req.body.password != '' && req.body.password != undefined) {
        bcrypt.genSalt(config.commonObjects.encryptionRound, function (err, salt) {

            bcrypt.hash(req.body.password, salt, function (err, hash) {
                if (err) {
                    responseJson.data = '';
                    responseJson.status = 1;
                    responseJson.error = 'Error while creating user.';
                    return res.json(responseJson);
                } else {
                    resSaveCommon.password = hash;
                }
            });
        });

    }

    var condition = {};
    // condition.$or = [
    //     { mobileNumber: req.body.mobileNumber },
    //     { email: req.body.email },
    // ];
    condition.isDelete = 0;
    condition.email = req.body.email;
  gConfig.UsermanagementSchema.findOne(condition).exec(function (errSchema, resSchema) {
        if (errSchema) {
            responseJson.data = '';
            responseJson.status = 1;
            responseJson.error = 'Error while creating user.';
            return res.json(responseJson);
        } else if (resSchema) {
            responseJson.data = '';
            responseJson.status = 1;
            responseJson.error = 'Email or mobile number already exists.';
            return res.json(responseJson);
        } else if (errSchema == null && resSchema == null) {
            resSaveCommon.save(function (errUserSchema, resUserSchema) {
                if (errUserSchema) {
                    responseJson.data = '';
                    responseJson.status = 1;
                    responseJson.error = 'Error while creating user.';
                    return res.json(responseJson);
                } else {
                    var resUpdateUser = resUserSchema;
                    resUpdateUser.userId = resUserSchema._id;
                    resUpdateUser.save(function (errUserUpdateSchema, resUserUpdateSchema) {
                        if (errUserUpdateSchema) {
                            responseJson.data = '';
                            responseJson.status = 1;
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
                                    responseJson.status = 1;
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
                                    responseJson.status = 0;
                                    return res.json(responseJson);
                                } else {
                                    responseJson.data = '';
                                    responseJson.status = 1;
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

updateUser = function (req, res) {
  var responseJSON = {};
  try {
    let token; 
if (req.body.token){
        token = req.body.token;
      } else {
        token = req.cookies.token;
      }
    gConfig.verifyToken(token, function (responseToken) {
      if (responseToken != false) {
        var condition = {};
        condition.isDelete = 0;
        condition.$or = [{
          name: req.body.name
        },
        {
          order: req.body.order
        }];
        condition._id = { $nin: [req.body.recordId] }
        gConfig.UsermanagementSchema.find(condition).exec(function (errSchema, resSchema) {
          if (errSchema) {
            responseJSON.status = 1;
            responseJSON.err = '';
            return res.json(responseJSON);
          } else if (resSchema.length != 0) {
            responseJSON.status = 2;
            responseJSON.err = 'Name or display order already present.';
            return res.json(responseJSON);
          } else {

            var condition = {};
            condition._id = req.body.recordId;
            gConfig.UsermanagementSchema.findOne(condition).exec(function (errSchema, resSchema) {
              if (errSchema) {
                responseJSON.status = 1;
                responseJSON.err = "Error while getting the data";
                return res.json(responseJSON);
              } else if (resSchema) {
                var resUpdateSchema = resSchema;
                if (req.body.name != '' && req.body.name != undefined) {
                  resUpdateSchema.name = req.body.name;
                }
                if (req.body.order != '' && req.body.order != undefined) {
                  resUpdateSchema.order = req.body.order;
                }
                resUpdateSchema.save(function (errUpdate, resUpdate) {
                  if (errUpdate) {
                    responseJSON.status = 1;
                    responseJSON.err = "Err while updating";
                    return res.json(responseJSON);
                  } else {
                    responseJSON.status = 0;
                    responseJSON.err = "";
                    return res.json(responseJSON);
                  }
                })
              } else {
                responseJSON.status = 1;
                responseJSON.err = "No record found";
                return res.json(responseJSON);
              }
            });
          }
        });
      } else {
        responseJSON.status = 1;
        responseJSON.err = '';
        return res.json(responseJSON);
      }
    })
  } catch (err) {
    responseJSON.status = 1;
    responseJSON.err = '';
    return res.json(responseJSON);
  }
}

deleteUser = function (req, res) {
  var responseJSON = {};
  try {
    let token; 
if (req.body.token){
        token = req.body.token;
      } else {
        token = req.cookies.token;
      }
    gConfig.verifyToken(token, function (responseToken) {
      if (responseToken != false) {
        var condition = {};
        condition._id = req.body.recordId;
        gConfig.UsermanagementSchema.findOne(condition).exec(function (errSchema, resSchema) {
          if (errSchema) {
            responseJSON.status = 1;
            responseJSON.err = "Error while getting the data";
            return res.json(responseJSON);
          } else if (resSchema) {
            var resUpdateSchema = resSchema;
            if (req.body.isDelete != '' && req.body.isDelete != undefined && req.body.isDelete == "1") {
              resUpdateSchema.isDelete = parseInt(req.body.isDelete);
            }
            resUpdateSchema.save(function (errUpdate, resUpdate) {
              if (errUpdate) {
                responseJSON.status = 1;
                responseJSON.err = "Err while updating";
                return res.json(responseJSON);
              } else {
                responseJSON.status = 0;
                responseJSON.err = "";
                return res.json(responseJSON);
              }
            })
          } else {
            responseJSON.status = 1;
            responseJSON.err = "No record found";
            return res.json(responseJSON);
          }
        });
      }
    });
  } catch (err) {
    responseJSON.status = 1;
    responseJSON.err = '';
    return res.json(responseJSON);
  }
}

getLoggedInUserInfoApp = function (req, res) {
  var responseJSON = {};
  try {
    let token; 
if (req.body.token){
      token = req.body.token;
    } else {
      token = req.cookies.token;
    }
    gConfig.verifyToken(token, function (responseToken) {
      if (responseToken != false) {
        var condition = {};
        condition._id = responseToken.userId;
        gConfig.UsermanagementSchema.findOne(condition, {firstName: 1, email: 1, profileImage: 1, mobileNumber: 1,wing:1,flatNumber:1,userId:1}).exec(function (errSchema, resSchema) {
          if (errSchema) {
            responseJSON.status = 1;
            responseJSON.err = "Error while getting the data";
            return res.json(responseJSON);
          } else if (resSchema) {
            var json = {}
            json.name = `${resSchema.firstName}`;
            json.email = resSchema.email;
            json.profileImage = resSchema.profileImage;
            json.mobileNumber = resSchema.mobileNumber;
            json.wing = resSchema.wing;
            json.flatNumber = resSchema.flatNumber;
            json.userId = resSchema.userId;
            responseJSON.status = 0;
            responseJSON.data = json;
            return res.json(responseJSON);
          } else {
            responseJSON.status = 1;
            responseJSON.err = "No record found";
            return res.json(responseJSON);
          }
        });
      } else {
        responseJSON.status = 1;
        responseJSON.err = "";
        return res.json(responseJSON);
      }
    });
  } catch (err) {
    responseJSON.status = 1;
    responseJSON.data = [];
    responseJSON.err = "Error while loading";
    return res.json(responseJSON);
  }
}
saveUpdateUser = function (req, res) {
  var responseJSON = {};
  try {
    let token;
    if (req.body.token) {
      token = req.body.token;
    } else {
      token = req.cookies.token;
    }
    gConfig.verifyToken(token, function (responseToken) {
      if (responseToken != false) {
        var condition = {};
        condition._id = req.body.userId;
        gConfig.UsermanagementSchema.findOne(condition).exec(function (
          errSchema,
          resSchema
        ) {
          if (errSchema) {
            responseJSON.status = 1;
            responseJSON.err = "Error while getting the data";
            return res.json(responseJSON);
          } else if (resSchema) {
            var resUpdateSchema = resSchema;
            if (req.body.firstName != "" && req.body.firstName != undefined) {
              resUpdateSchema.firstName = req.body.firstName;
            }
            if (req.body.email != "" && req.body.email != undefined) {
              resUpdateSchema.email = req.body.email;
            }
            if (req.body.mobileNumber != "" && req.body.mobileNumber != undefined) {
              resUpdateSchema.mobileNumber = req.body.mobileNumber;
            }
            if (
              req.body.flatNumber != "" &&
              req.body.flatNumber != undefined
            ) {
              resUpdateSchema.flatNumber = req.body.flatNumber;
            }
            if (
              req.body.wing != "" &&
              req.body.wing != undefined
            ) {
              resUpdateSchema.wing = req.body.wing;
            }
          
            resUpdateSchema = gConfig.extend(resUpdateSchema, req.body);
            
            resUpdateSchema.markModified('productImage')
            resUpdateSchema.save(function (errUpdate, resUpdate) {
              if (errUpdate) {
                responseJSON.status = 1;
                responseJSON.err = "Err while updating";
                return res.json(responseJSON);
              } else {
                responseJSON.status = 0;
                responseJSON.err = "";
                return res.json(responseJSON);
              }
            });
          } else {
            responseJSON.status = 1;
            responseJSON.err = "No record found";
            return res.json(responseJSON);
          }
        });
      } else {
        responseJSON.status = 1;
        responseJSON.err = "";
        return res.json(responseJSON);
      }
    });
  } catch (err) {
    responseJSON.status = 1;
    responseJSON.err = "";
    return res.json(responseJSON);
  }
};
app.get('/users/:tokenKey', getUser);
app.post('/getUsers', getUsersList);
app.post('/getUserRecordById', getUserRecordById);
app.post('/saveAjaxUsers', userSignUp);
app.post('/updateAjaxUsers', updateUser);
app.post('/deleteAjaxUsers', deleteUser);
app.post('/getAjaxLoggedInUserInfoApp', getLoggedInUserInfoApp);
app.post('/updateUserAjax', saveUpdateUser);

}
