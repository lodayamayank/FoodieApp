module.exports = function (app, gConfig) {
  function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join('0') + num;
  }

  getOrder = function (req, res) {
    var token = req.params.tokenKey;
    gConfig.verifyToken(token, function (responseToken) {
      if (responseToken != false) {
        gConfig.getUserMenu(responseToken, token, function (menu) {
          var resObj = {};
          resObj.appName = 'EShopper';
          resObj.title = 'Orders';
          resObj.menu = menu;
          resObj.token = token;
          res.render('orders', resObj);
        });
      } else {
        res.redirect('/');
      }
    });
  };

  getOrdersList = function (req, res) {
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
          gConfig.OrdersSchema.find(condition)
            .sort({ order: 1 })
            .exec(function (errSchema, resSchema) {
            if (errSchema) {
              responseJSON.status = 1;
                responseJSON.err = '';
              responseJSON.data = [];
              return res.json(responseJSON);
            } else {
              var arrRecords = [];
              var index = 0;
              var totalRecords = 0;
                gConfig.async.eachSeries(
                  resSchema,
                  function (order, orderCallback) {
                index++;
                var json = {};
                json.index = index;
                json._id = order._id;
                json.name = order.name;
                json.order = order.order;
                    json.createdOn = gConfig
                      .moment(order.createdOn)
                      .format('DD/MM/YYYY');
                    json.updatedOn = gConfig
                      .moment(order.updatedOn)
                      .format('DD/MM/YYYY');
                arrRecords.push(json);
                orderCallback();
                  },
                  function () {
                    gConfig.OrdersSchema.countDocuments(condition).exec(
                      function (err, count) {
                  totalRecords = count;
                  responseJSON.status = 0;
                  responseJSON.data = arrRecords;
                  responseJSON.totalRecords = totalRecords;
                  return res.json(responseJSON);
                      }
                    );
                  }
                );
              }
                });
        } else {
          responseJSON.status = 1;
          responseJSON.err = '';
          responseJSON.data = [];
          return res.json(responseJSON);
        }
      });
    } catch (err) {
      responseJSON.status = 1;
      responseJSON.data = [];
      responseJSON.err = 'Error while loading';
      return res.json(responseJSON);
    }
  };

  getOrderRecordById = function (req, res) {
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
          gConfig.OrdersSchema.findOne(condition)
            .sort({ order: 1 })
            .exec(function (errSchema, resSchema) {
            if (errSchema) {
              responseJSON.status = 1;
                responseJSON.err = 'Error while getting the data';
              return res.json(responseJSON);
            } else if (resSchema) {
                var json = {};
              json.name = resSchema.name;
                json.name = resSchema.name;
                json.mobileNumber = resSchema.mobileNumber;
                json.address1 = resSchema.address1;
                json.address2 = resSchema.address2;
                json.landmark = resSchema.landmark;
                json.city = resSchema.city;
                json.district = resSchema.district;
                json.state = resSchema.state;
                json.pincode = resSchema.pincode;
              responseJSON.status = 0;
              responseJSON.data = json;
              return res.json(responseJSON);
            } else {
              responseJSON.status = 1;
                responseJSON.err = 'No record found';
              return res.json(responseJSON);
            }
          });
        } else {
          responseJSON.status = 1;
          responseJSON.err = '';
          return res.json(responseJSON);
        }
      });
    } catch (err) {
      responseJSON.status = 1;
      responseJSON.data = [];
      responseJSON.err = 'Error while loading';
      return res.json(responseJSON);
    }
  };

  saveOrder = function (req, res) {
    var responseJSON = {};
    try {
      let token; 
if (req.body.token){
        token = req.body.token;
      } else {
        token = req.cookies.token;
      }
      gConfig.verifyToken(token, async (responseToken) => {
        if (responseToken != false) {
          const countCondition = {};
          const resCount = await gConfig.OrdersSchema.countDocuments(
            countCondition
          ).exec();

          const orderNumber = `1${zeroPad(resCount, 7)}`;
          const resSaveCommon = new gConfig.OrdersSchema({});
          resSaveCommon.createdOn = new Date();
          resSaveCommon.orderNumber = orderNumber;
          resSaveCommon.userId = responseToken.userId;
          resSaveCommon.createdBy = responseToken.userName;
          const resSaveSchema = await resSaveCommon.save();

          const condition = {};
          condition.isDelete = 0;
          condition.userId = responseToken.userId;
          const resSchema = await gConfig.CartSchema.find(condition)
            .populate({
              path: 'productId'
            })
            .exec();

          var arrRecords = [];
          var index = 0;
          var cartTotal = 0;
          await gConfig.async.eachSeries(resSchema, function (
            cart,
            cartCallback
          ) {
            if (cart.productId.isDelete === 0) {
              index++;
              var json = {};
              json.quantity = cart.quantity;
              json.createdOn = new Date();
              json.orderNumber = orderNumber;
              json.orderId = resSaveSchema._id;
              json.userId = responseToken.userId;
              json.createdBy = responseToken.userName;
              json.productId = cart.productId._id;
              json.productName = cart.productId.productName;
              json.productImage = cart.productId.productImage || [];
              json.actualPrice = cart.productId.actualPrice;
              cartTotal += cart.productId.actualPrice * cart.quantity;
              json.productName = cart.productId.productName;
              arrRecords.push(json);
            }
            cartCallback();
          });
          await gConfig.OrderitemsSchema.insertMany(arrRecords)
            .then(async () => {
              resSaveSchema.totalAmount = cartTotal;
              resSaveSchema.itemsCount = index;
              resSaveSchema.save(function () {
                responseJSON.status = 0;
                responseJSON.data = resSaveSchema;
                return res.json(responseJSON);
              });
            })
            .catch((err) => {
              responseJSON.status = 1;
              responseJSON.data = err;
              return res.json(responseJSON);
            });
            } else {
                  responseJSON.status = 1;
                  responseJSON.err = '';
                  return res.json(responseJSON);
            }
          });
    } catch (err) {
      responseJSON.status = 1;
      responseJSON.err = '';
      return res.json(responseJSON);
    }
  };

  updateOrder = function (req, res) {
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
          condition.$or = [
            {
              name: req.body.name,
          },
          {
              order: req.body.order,
            },
          ];
          condition._id = { $nin: [req.body.recordId] };
          gConfig.OrdersSchema.find(condition).exec(function (
            errSchema,
            resSchema
          ) {
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
              gConfig.OrdersSchema.findOne(condition).exec(function (
                errSchema,
                resSchema
              ) {
                if (errSchema) {
                  responseJSON.status = 1;
                  responseJSON.err = 'Error while getting the data';
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
                      responseJSON.err = 'Err while updating';
                      return res.json(responseJSON);
                    } else {
                      responseJSON.status = 0;
                      responseJSON.err = '';
                      return res.json(responseJSON);
                    }
                  });
                } else {
                  responseJSON.status = 1;
                  responseJSON.err = 'No record found';
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
      });
    } catch (err) {
      responseJSON.status = 1;
      responseJSON.err = '';
      return res.json(responseJSON);
    }
  };

  deleteOrder = function (req, res) {
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
          gConfig.OrdersSchema.findOne(condition).exec(function (
            errSchema,
            resSchema
          ) {
            if (errSchema) {
              responseJSON.status = 1;
              responseJSON.err = 'Error while getting the data';
              return res.json(responseJSON);
            } else if (resSchema) {
              var resUpdateSchema = resSchema;
              if (
                req.body.isDelete != '' &&
                req.body.isDelete != undefined &&
                req.body.isDelete == '1'
              ) {
                resUpdateSchema.isDelete = parseInt(req.body.isDelete);
              }
              resUpdateSchema.save(function (errUpdate, resUpdate) {
                if (errUpdate) {
                  responseJSON.status = 1;
                  responseJSON.err = 'Err while updating';
                  return res.json(responseJSON);
                } else {
                  responseJSON.status = 0;
                  responseJSON.err = '';
                  return res.json(responseJSON);
                }
              });
            } else {
              responseJSON.status = 1;
              responseJSON.err = 'No record found';
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
  };

  updateOrderAddress = function (req, res) {
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
          gConfig.OrdersSchema.findOne(condition).exec(
            async (errSchema, resSchema) => {
              if (errSchema) {
                responseJSON.status = 1;
                responseJSON.err = 'Error while getting the data';
                return res.json(responseJSON);
              } else if (resSchema) {
                const resUpdateSchema = resSchema;
                const conditionAddress = {};
                conditionAddress._id = req.body.addressId;

                let resAddress;
                let errAddress;

                try {
                  resAddress = await gConfig.AddressesSchema.findOne(
                    conditionAddress
                  ).exec();
                } catch (error) {
                  errAddress = error;
                }

                resUpdateSchema.name = resAddress.name;
                resUpdateSchema.mobileNumber = resAddress.mobileNumber;
                resUpdateSchema.address1 = resAddress.address1;
                resUpdateSchema.address2 = resAddress.address2;
                resUpdateSchema.landmark = resAddress.landmark;
                resUpdateSchema.city = resAddress.city;
                resUpdateSchema.district = resAddress.district;
                resUpdateSchema.state = resAddress.state;
                resUpdateSchema.pincode = resAddress.pincode;

                let resUpdate;
                let errUpdate;
                try {
                  resUpdate = await resUpdateSchema.save();
                } catch (error) {
                  errUpdate = error;
                }

                if (errUpdate) {
                  responseJSON.status = 1;
                  responseJSON.err = 'Err while updating';
                  return res.json(responseJSON);
                } else {
                  responseJSON.status = 0;
                  responseJSON.data = resUpdate;
                  return res.json(responseJSON);
                }
              } else {
                responseJSON.status = 1;
                responseJSON.err = 'No record found';
                return res.json(responseJSON);
              }
            }
          );
        } else {
          responseJSON.status = 1;
          responseJSON.err = '';
          return res.json(responseJSON);
        }
      });
    } catch (err) {
      responseJSON.status = 1;
      responseJSON.err = '';
      return res.json(responseJSON);
    }
  };

  updateOrderConfirmation = function (req, res) {
    var responseJSON = {};
    try {
      let token;
      if (req.body.token) {
        token = req.body.token;
      } else {
        token = req.cookies.token;
      }
      gConfig.verifyToken(token, async (responseToken) => {
        if (responseToken != false) {
          let errSchema;
          let resSchema;

          const condition = {};
          condition._id = req.body.recordId;
          try {
            resSchema = await gConfig.OrdersSchema.findOne(condition).exec();
          } catch (error) {
            errSchema = error;
          }

          if (errSchema) {
            responseJSON.status = 1;
            responseJSON.err = 'Error while getting the data';
            return res.json(responseJSON);
          } else if (resSchema) {
            const resUpdateSchema = resSchema;
            resUpdateSchema.status = 'Order Placed';
            let resUpdate;
            let errUpdate;
            try {
              resUpdate = await resUpdateSchema.save();
            } catch (error) {
              errUpdate = error;
            }

            if (errUpdate) {
              responseJSON.status = 1;
              responseJSON.err = 'Err while updating';
              return res.json(responseJSON);
            } else {
              const conditionOrderItems = {};
              conditionOrderItems.orderId = resUpdate._id;

              let resOrderItems;
              let errOrderItems;

              try {
                resOrderItems = await gConfig.OrderitemsSchema.find(
                  conditionOrderItems
                ).exec();
              } catch (error) {
                errOrderItems = error;
              }

              await gConfig.async.eachSeries(resOrderItems, async (orderItems) => {
                const conditionProduct = {};
                conditionProduct._id = orderItems.productId;
                const resProduct = await gConfig.ProductsSchema.findOne(
                  conditionProduct
                ).exec();
                resProduct.quantity -= orderItems.quantity;
                await resProduct.save();
              });

              await gConfig.CartSchema.updateMany(
                {
                  isDelete: 0,
                  userId: responseToken.userId,
                },
                {
                  isDelete: 1,
                }
              )
                .then(async () => {
                  responseJSON.status = 0;
                  responseJSON.data = resUpdate;
                  return res.json(responseJSON);
                })
                .catch((err) => {
                  responseJSON.status = 1;
                  responseJSON.data = err;
                  return res.json(responseJSON);
                });
            }
          } else {
            responseJSON.status = 1;
            responseJSON.err = 'No record found';
            return res.json(responseJSON);
          }
        } else {
          responseJSON.status = 1;
          responseJSON.err = '';
          return res.json(responseJSON);
        }
      });
    } catch (err) {
      responseJSON.status = 1;
      responseJSON.err = '';
      return res.json(responseJSON);
    }
  };

  app.get('/orders/:tokenKey', getOrder);
  app.post('/getOrders', getOrdersList);
  app.post('/getOrderRecordById', getOrderRecordById);
  app.post('/saveAjaxOrders', saveOrder);
  app.post('/updateAjaxOrders', updateOrder);
  app.post('/updateAjaxOrderAdress', updateOrderAddress);
  app.post('/updateAjaxOrderConfirmation', updateOrderConfirmation);
  app.post('/deleteAjaxOrders', deleteOrder);
};
