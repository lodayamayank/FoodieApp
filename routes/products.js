module.exports = function (app, gConfig) {
  getProduct = function (req, res) {
    var token = req.params.tokenKey;
    gConfig.verifyToken(token, function (responseToken) {
      if (responseToken != false) {
        gConfig.getUserMenu(responseToken, token, function (menu) {
          var resObj = {};
          resObj.appName = "EShopper";
          resObj.title = "Products";
          resObj.menu = menu;
          resObj.token = token;
          res.render("products", resObj);
        });
      } else {
        res.redirect("/");
      }
    });
  };

  getProductsList = function (req, res) {
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
          var take = 0;
          var skip = 0;
          if (req.body.take != "" && req.body.take != undefined) {
            take = req.body.take;
          }
          if (req.body.skip != "" && req.body.skip != undefined) {
            skip = req.body.skip;
          }
          gConfig.ProductsSchema.find(condition)
            .sort({ order: 1 })
            .exec(function (errSchema, resSchema) {
              if (errSchema) {
                responseJSON.status = 1;
                responseJSON.err = "";
                responseJSON.data = [];
                return res.json(responseJSON);
              } else {
                var arrRecords = [];
                var index = 0;
                var totalRecords = 0;
                gConfig.async.eachSeries(
                  resSchema,
                  function (product, productCallback) {
                    index++;
                    var json = {};
                    json.index = index;
                    json._id = product._id;
                    json.name = product.productName;
                    json.actualPrice = product.actualPrice;
                    json.availableQuantity = product.availableQuantity;
                    json.productImage = product.productImage;
                    json.productDesc = product.productDesc;
                    json.createdOn = gConfig
                      .moment(product.createdOn)
                      .format("DD/MM/YYYY");
                    json.updatedOn = gConfig
                      .moment(product.updatedOn)
                      .format("DD/MM/YYYY");
                    arrRecords.push(json);
                    productCallback();
                  },
                  function () {
                    gConfig.ProductsSchema.countDocuments(condition).exec(function (
                      err,
                      count
                    ) {
                      totalRecords = count;
                      responseJSON.status = 0;
                      responseJSON.data = arrRecords;
                      responseJSON.totalRecords = totalRecords;
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

  

  getProductRecordById = function (req, res) {
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
          gConfig.ProductsSchema.findOne(condition)
            .sort({ order: 1 })
            .exec(function (errSchema, resSchema) {
              if (errSchema) {
                responseJSON.status = 1;
                responseJSON.err = "Error while getting the data";
                return res.json(responseJSON);
              } else if (resSchema) {
                var json = {};
                json.name = resSchema.productName;
                json.productName = resSchema.productName;
                json.productDesc = resSchema.productDesc;
                json.actualPrice = resSchema.actualPrice;
                
                json.availableQuantity = resSchema.availableQuantity;
                
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

  saveProduct = function (req, res) {
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
          var resSaveCommon = new gConfig.ProductsSchema({});
          resSaveCommon.createdOn = new Date();
          resSaveCommon.userId = responseToken.userId;

          if (req.body.name != "" && req.body.name != undefined) {
            resSaveCommon.productName = req.body.name;
          }
          
          if (req.body.actualPrice != "" && req.body.actualPrice != undefined) {
            resSaveCommon.actualPrice = req.body.actualPrice;
          }
         
          if (
            req.body.availableQuantity != "" &&
            req.body.availableQuantity != undefined
          ) {
            resSaveCommon.availableQuantity = req.body.availableQuantity;
          }
         
          if (req.body.productDesc != "" && req.body.productDesc != undefined) {
            resSaveCommon.productDesc = req.body.productDesc;
          }
          
          resSaveCommon = gConfig.extend(resSaveCommon, req.body);
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
    } catch (err) {
      responseJSON.status = 1;
      responseJSON.err = "";
      return res.json(responseJSON);
    }
  };

  updateProduct = function (req, res) {
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
          gConfig.ProductsSchema.findOne(condition).exec(function (
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
                resUpdateSchema.productName = req.body.name;
              }
              
              
              if (
                req.body.actualPrice != "" &&
                req.body.actualPrice != undefined
              ) {
                resUpdateSchema.actualPrice = req.body.actualPrice;
              }
              
              if (
                req.body.availableQuantity != "" &&
                req.body.availableQuantity != undefined
              ) {
                resUpdateSchema.availableQuantity = req.body.availableQuantity;
              }
              
              // if (req.body.productDesc != '' && req.body.productDesc != undefined) {
              //   resUpdateSchema.productDesc = req.body.productDesc;
              // }
              // if (req.body.warranty != '' && req.body.warranty != undefined) {
              //   resUpdateSchema.warranty = req.body.warranty;
              // }
              if (req.body.productImage != undefined) {
                resUpdateSchema.productImage = req.body.productImage;
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

  deleteProduct = function (req, res) {
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
          gConfig.ProductsSchema.findOne(condition).exec(function (
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
  app.get("/products/:tokenKey", getProduct);
  app.post("/getProducts", getProductsList);
  app.post("/getProductRecordById", getProductRecordById);
  app.post("/saveAjaxProducts", saveProduct);
  app.post("/updateAjaxProducts", updateProduct);
  app.post("/deleteAjaxProducts", deleteProduct);
  
};
