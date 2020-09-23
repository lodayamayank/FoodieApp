module.exports = function (app, gConfig) {
    getCartList = function (req, res) {
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
            condition.isDelete = 0;
            condition.userId = responseToken.userId;
            var take = req.body.take || 10;
            var skip = req.body.skip || 0;
            if (req.body.take != "" && req.body.take != undefined) {
              take = req.body.take;
            }
            if (req.body.skip != "" && req.body.skip != undefined) {
              skip = req.body.skip;
            }
            gConfig.CartSchema.find(condition)
            .populate({
              path: "productId"
            })
              .sort({ order: 1 })
              .skip(skip)
              .limit(take)
              .exec(function (errSchema, resSchema) {
                if (errSchema) {
                  responseJSON.status = 1;
                  responseJSON.err = "";
                  responseJSON.data = [];
                  return res.json(responseJSON);
                } else {
                  var arrRecords = [];
                  var index = 0;
                  var cartTotal = 0;
                  gConfig.async.eachSeries(
                    resSchema,
                    function (cart, cartCallback) {
                      index++;
                      
                      if (cart.productId.isDelete === 0) {
                        var json = {};
                        json.index = index;
                        json._id = cart._id;
                        json.quantity = cart.quantity;
                        json.productName = cart.productId.productName;
                        json.productImage = cart.productId.productImage;
                        json.actualPrice = cart.productId.actualPrice;
                        cartTotal += cart.productId.actualPrice * cart.quantity;
                        json.availableQuantity = cart.productId.availableQuantity;
                        json.productName = cart.productId.productName;
                        arrRecords.push(json);
                      }
                      cartCallback();
                    },
                    function () {
                      gConfig.CartSchema.countDocuments(condition).exec(function (
                        err,
                        count
                      ) {
                        totalRecords = count;
                        responseJSON.status = 0;
                        responseJSON.data = arrRecords;
                        responseJSON.totalRecords = totalRecords;
                        responseJSON.cartTotal = cartTotal;
                        return res.json(responseJSON);
                      });
                    }
                  );
                }
              });
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
    };
    getCartCount = function (req, res) {
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
            condition.isDelete = 0;
            condition.userId = responseToken.userId;
  
            gConfig.CartSchema.countDocuments(condition).exec(function (
              errSchema,
              resSchema
            ) {
              if (errSchema) {
                responseJSON.status = 1;
                responseJSON.err = "";
                responseJSON.data = [];
                return res.json(responseJSON);
              } else {
                responseJSON.status = 0;
                responseJSON.data = resSchema;
                return res.json(responseJSON);
              }
            });
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
    };
  
    getCartRecordById = function (req, res) {
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
            condition._id = req.body.recordId;
            gConfig.CartSchema.findOne(condition)
              .sort({ order: 1 })
              .exec(function (errSchema, resSchema) {
                if (errSchema) {
                  responseJSON.status = 1;
                  responseJSON.err = "Error while getting the data";
                  return res.json(responseJSON);
                } else if (resSchema) {
                  var json = {};
                  json.name = resSchema.name;
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
    };
  
    addToCart = function (req, res) {
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
            condition.isDelete = 0;
            condition.userId = responseToken.userId;
            condition.productId = req.body.productId;
            gConfig.CartSchema.findOne(condition).exec(function (
              errSchema,
              resSchema
            ) {
              if (errSchema) {
                responseJSON.status = 1;
                responseJSON.err = "";
                return res.json(responseJSON);
              } else if (resSchema) {
                let resSaveCommon = resSchema;
                resSaveCommon.quantity += req.body.quantity || 1;
                resSaveCommon.save(function (errSaveSchema, resSaveSchema) {
                  if (errSaveSchema) {
                    responseJSON.status = 1;
                    responseJSON.err = "";
                    return res.json(responseJSON);
                  } else {
                    responseJSON.status = 0;
                    responseJSON.err = "";
                    return res.json(responseJSON);
                  }
                });
              } else {
                var resSaveCommon = new gConfig.CartSchema({});
                resSaveCommon.createdOn = new Date();
                resSaveCommon.userId = responseToken.userId;
                if (req.body.productId != "" && req.body.productId != undefined) {
                  resSaveCommon.productId = req.body.productId;
                }
                if (req.body.quantity != "" && req.body.quantity != undefined) {
                  resSaveCommon.quantity = req.body.quantity;
                } else {
                  resSaveCommon.quantity = 1;
                }
  
                resSaveCommon.save(function (errSaveSchema, resSaveSchema) {
                  if (errSaveSchema) {
                    responseJSON.status = 1;
                    responseJSON.err = "";
                    return res.json(responseJSON);
                  } else {
                    responseJSON.status = 0;
                    responseJSON.err = "";
                    return res.json(responseJSON);
                  }
                });
              }
            });
          }
        });
      } catch (err) {
        responseJSON.status = 1;
        responseJSON.err = "";
        return res.json(responseJSON);
      }
    };
  
    updateCart = function (req, res) {
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
            condition.isDelete = 0;
            condition.name = {
              $regex: new RegExp(["^", req.body.name, "$"].join(""), "i"),
            };
            condition._id = { $nin: [req.body.recordId] };
            gConfig.CartSchema.find(condition).exec(function (
              errSchema,
              resSchema
            ) {
              if (errSchema) {
                responseJSON.status = 1;
                responseJSON.err = "";
                return res.json(responseJSON);
              } else if (resSchema.length != 0) {
                responseJSON.status = 2;
                responseJSON.err = "Name or display order already present.";
                return res.json(responseJSON);
              } else {
                var condition = {};
                condition._id = req.body.recordId;
                gConfig.CartSchema.findOne(condition).exec(function (
                  errSchema,
                  resSchema
                ) {
                  if (errSchema) {
                    responseJSON.status = 1;
                    responseJSON.err = "Error while getting the data";
                    return res.json(responseJSON);
                  } else if (resSchema) {
                    var resUpdateSchema = resSchema;
                    if (req.body.name != "" && req.body.name != undefined) {
                      resUpdateSchema.name = req.body.name;
                    }
                    if (req.body.order != "" && req.body.order != undefined) {
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
                    });
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
  
    deleteCart = function (req, res) {
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
            condition._id = req.body.recordId;
            gConfig.CartSchema.findOne(condition).exec(function (
              errSchema,
              resSchema
            ) {
              if (errSchema) {
                responseJSON.status = 1;
                responseJSON.err = "Error while getting the data";
                return res.json(responseJSON);
              } else if (resSchema) {
                var resUpdateSchema = resSchema;
                if (
                  req.body.isDelete != "" &&
                  req.body.isDelete != undefined &&
                  req.body.isDelete == "1"
                ) {
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
                });
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
        responseJSON.err = "";
        return res.json(responseJSON);
      }
    };
    app.post("/getCartList", getCartList);
    app.post("/getCartRecordById", getCartRecordById);
    app.post("/saveAjaxCart", addToCart);
    app.post("/updateAjaxCart", updateCart);
    app.post("/deleteAjaxCart", deleteCart);
    app.post("/getCartCount", getCartCount);
  };
  