
module.exports = function (app, gConfig) {
  getColor = function (req, res) {
    var token = req.params.tokenKey;
    gConfig.verifyToken(token, function (responseToken) {
      if (responseToken != false) {
        gConfig.getUserMenu(responseToken, token, function (menu) {
          var resObj = {};
          resObj.appName = "Blue Butter Fly";
          resObj.title = "Colors";
          resObj.menu = menu;
          resObj.token = token;
          res.render('colors', resObj);
        })

      } else {
        res.redirect("/")
      }
    })

  }

  getColorsList = function (req, res) {
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
          gConfig.ColorsSchema.find(condition).sort({ "name": 1 }).exec(function (errSchema, resSchema) {
            if (errSchema) {
              responseJSON.status = 1;
              responseJSON.err = "";
              responseJSON.data = [];
              return res.json(responseJSON);
            } else {
              var arrRecords = [];
              var index = 0;
              var totalRecords = 0;
              gConfig.async.eachSeries(resSchema, function (color, colorCallback) {
                index++;
                var json = {};
                json.index = index;
                json._id = color._id;
                json.name = color.name;
                json.colorCode = color.colorCode;
                json.createdOn = gConfig.moment(color.createdOn).format("DD/MM/YYYY");
                json.updatedOn = gConfig.moment(color.updatedOn).format("DD/MM/YYYY");
                arrRecords.push(json);
                colorCallback();

              }, function () {
                gConfig.ColorsSchema.count(condition).exec(function (err, count) {
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

  getColorRecordById = function (req, res) {
    var responseJSON = {};
    try {
      var token = req.cookies.token;
      gConfig.verifyToken(token, function (responseToken) {
        if (responseToken != false) {
          var condition = {};
          condition._id = req.body.recordId;
          gConfig.ColorsSchema.findOne(condition).exec(function (errSchema, resSchema) {
            if (errSchema) {
              responseJSON.status = 1;
              responseJSON.err = "Error while getting the data";
              return res.json(responseJSON);
            } else if (resSchema) {
              var json = {}
              json.name = resSchema.name;
              json.colorCode = resSchema.colorCode;
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

  saveColor = function (req, res) {
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
            colorCode: req.body.colorCode
          }];
          gConfig.ColorsSchema.findOne(condition).exec(function (errSchema, resSchema) {
            if (errSchema) {
              responseJSON.status = 1;
              responseJSON.err = '';
              return res.json(responseJSON);
            } else if (resSchema) {
              responseJSON.status = 2;
              responseJSON.err = 'Name or color code already present.';
              return res.json(responseJSON);
            } else {
              var resSaveCommon = new gConfig.ColorsSchema({});
              resSaveCommon.createdOn = new Date();
              resSaveCommon.userId = responseToken.userId;
              if (req.body.name != '' && req.body.name != undefined) {
                resSaveCommon.name = req.body.name;
              }
              if (req.body.colorCode != '' && req.body.colorCode != undefined) {
                resSaveCommon.colorCode = req.body.colorCode;
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

  updateColor = function (req, res) {
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
            colorCode: req.body.colorCode
          }];
          condition._id = { $nin: [req.body.recordId] }
          gConfig.ColorsSchema.find(condition).exec(function (errSchema, resSchema) {
            if (errSchema) {
              responseJSON.status = 1;
              responseJSON.err = '';
              return res.json(responseJSON);
            } else if (resSchema.length != 0) {
              responseJSON.status = 2;
              responseJSON.err = 'Name or color code already present.';
              return res.json(responseJSON);
            } else {

              var condition = {};
              condition._id = req.body.recordId;
              gConfig.ColorsSchema.findOne(condition).exec(function (errSchema, resSchema) {
                if (errSchema) {
                  responseJSON.status = 1;
                  responseJSON.err = "Error while getting the data";
                  return res.json(responseJSON);
                } else if (resSchema) {
                  var resUpdateSchema = resSchema;
                  if (req.body.name != '' && req.body.name != undefined) {
                    resUpdateSchema.name = req.body.name;
                  }
                  if (req.body.colorCode != '' && req.body.colorCode != undefined) {
                    resUpdateSchema.colorCode = req.body.colorCode;
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

  deleteColor = function (req, res) {
    var responseJSON = {};
    try {
      var token = req.cookies.token;
      gConfig.verifyToken(token, function (responseToken) {
        if (responseToken != false) {
          var condition = {};
          condition._id = req.body.recordId;
          gConfig.ColorsSchema.findOne(condition).exec(function (errSchema, resSchema) {
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
  app.get('/colors/:tokenKey', getColor);
  app.post('/getColors', getColorsList);
  app.post('/getColorRecordById', getColorRecordById);
  app.post('/saveAjaxColors', saveColor);
  app.post('/updateAjaxColors', updateColor);
  app.post('/deleteAjaxColors', deleteColor);
}