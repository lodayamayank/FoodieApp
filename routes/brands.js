
module.exports = function (app, gConfig) {
  getbrands = function (req, res) {
    var token = req.params.tokenKey;
    gConfig.verifyToken(token, function (responseToken) {
      if (responseToken != false) {
        gConfig.getUserMenu(responseToken, token, function (menu) {
          var resObj = {};
          resObj.appName = "Blue Butter Fly";
          resObj.title = "brands";
          resObj.menu = menu;
          resObj.token = token;
          res.render('brands', resObj);
        })

      } else {
        res.redirect("/")
      }
    })

  }

  getbrandsList = function (req, res) {
    var responseJSON = {};
    try {
      var token = req.cookies.token;
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
          gConfig.brandsSchema.find(condition).sort({ "order": 1 }).exec(function (errSchema, resSchema) {
            if (errSchema) {
              responseJSON.status = 1;
              responseJSON.err = "";
              responseJSON.data = [];
              return res.json(responseJSON);
            } else {
              var arrRecords = [];
              var index = 0;
              var totalRecords = 0;
              gConfig.async.eachSeries(resSchema, function (brands, brandsCallback) {
                index++;
                var json = {};
                json.index = index;
                json._id = brands._id;
                json.name = brands.name;
                json.order = brands.order;
                json.createdOn = gConfig.moment(brands.createdOn).format("DD/MM/YYYY");
                json.updatedOn = gConfig.moment(brands.updatedOn).format("DD/MM/YYYY");
                arrRecords.push(json);
                brandsCallback();

              }, function () {
                gConfig.brandsSchema.count(condition).exec(function (err, count) {
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

  getbrandsRecordById = function (req, res) {
    var responseJSON = {};
    try {
      var token = req.cookies.token;
      gConfig.verifyToken(token, function (responseToken) {
        if (responseToken != false) {
          var condition = {};
          condition._id = req.body.recordId;
          gConfig.brandsSchema.findOne(condition).sort({ "order": 1 }).exec(function (errSchema, resSchema) {
            if (errSchema) {
              responseJSON.status = 1;
              responseJSON.err = "Error while getting the data";
              return res.json(responseJSON);
            } else if (resSchema) {
              var json = {}
              json.name = resSchema.name;
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

  savebrands = function (req, res) {
    var responseJSON = {};
    try {
      var token = req.cookies.token;
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
          gConfig.brandsSchema.findOne(condition).exec(function (errSchema, resSchema) {
            if (errSchema) {
              responseJSON.status = 1;
              responseJSON.err = '';
              return res.json(responseJSON);
            } else if (resSchema) {
              responseJSON.status = 2;
              responseJSON.err = 'Name or display order already present.';
              return res.json(responseJSON);
            } else {
              var resSaveCommon = new gConfig.brandsSchema({});
              resSaveCommon.createdOn = new Date();
              resSaveCommon.userId = responseToken.userId;
              if (req.body.name != '' && req.body.name != undefined) {
                resSaveCommon.name = req.body.name;
              }
              if (req.body.order != '' && req.body.order != undefined) {
                resSaveCommon.order = req.body.order;
              }

              resSaveCommon.save(function (errSaveSchema, resSaveSchema) {
                if (errSaveSchema) {
                  responseJSON.status = 1;
                  responseJSON.err = '';
                  return res.json(responseJSON);
                } else {
                  responseJSON.status = 0;
                  responseJSON.err = '';
                  return res.json(responseJSON);
                }
              })
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

  updatebrands = function (req, res) {
    var responseJSON = {};
    try {
      var token = req.cookies.token;
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
          gConfig.brandsSchema.find(condition).exec(function (errSchema, resSchema) {
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
              gConfig.brandsSchema.findOne(condition).exec(function (errSchema, resSchema) {
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

  deletebrands = function (req, res) {
    var responseJSON = {};
    try {
      var token = req.cookies.token;
      gConfig.verifyToken(token, function (responseToken) {
        if (responseToken != false) {
          var condition = {};
          condition._id = req.body.recordId;
          gConfig.brandsSchema.findOne(condition).exec(function (errSchema, resSchema) {
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
  app.get('/brands/:tokenKey', getbrands);
  app.post('/getbrands', getbrandsList);
  app.post('/getbrandsRecordById', getbrandsRecordById);
  app.post('/saveAjaxbrands', savebrands);
  app.post('/updateAjaxbrands', updatebrands);
  app.post('/deleteAjaxbrands', deletebrands);
}