module.exports = function (app, gConfig) {
  getOrder = function (req, res) {
    var token = req.params.tokenKey;
    gConfig.verifyToken(token, function (responseToken) {
      if (responseToken != false) {
        gConfig.getUserMenu(responseToken, token, function (menu) {
          var resObj = {};
          resObj.appName = 'EShopper';
          resObj.title = 'Orders Details';
          resObj.menu = menu;
          resObj.token = token;
          resObj.recordId = req.params.recordId;
          res.render('orderdetails', resObj);
        });
      } else {
        res.redirect('/');
      }
    });
  };

  getOrderItemsList = function (req, res) {
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

          const conditionOrderItems = {};
          conditionOrderItems.orderId = req.body.recordId;
          conditionOrderItems.isDelete = 0;

          let resOrderItems;
          let errOrderItems;

          try {
            resOrderItems = await gConfig.OrderitemsSchema.find(
              conditionOrderItems
            ).exec();
          } catch (error) {
            errOrderItems = error;
          }

          if (errOrderItems) {
            responseJSON.status = 1;
            responseJSON.err = '';
            responseJSON.data = [];
            return res.json(responseJSON);
          } else {
            var arrRecords = [];
            var index = 0;
            var totalRecords = 0;
            gConfig.async.eachSeries(
              resOrderItems,
              function (order, orderCallback) {
                index++;
                var json = {};
                json.index = index;
                json._id = order._id;
                json.productName = order.productName;
                json.quantity = order.quantity;
                json.actualPrice = order.actualPrice;
                arrRecords.push(json);
                orderCallback();
              },
              function () {
                gConfig.OrderitemsSchema.countDocuments(conditionOrderItems).exec(function (
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

  app.get('/orderdetails/:tokenKey/:recordId', getOrder);
  app.post('/getAjaxOrderItemsList', getOrderItemsList);
};
