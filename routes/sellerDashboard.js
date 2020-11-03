
module.exports = function (app, gConfig) {
  getSellerDashboard = function (req, res) {
    var token = req.cookies.token;
    // var token = req.params.tokenKey;
    gConfig.verifyToken(token, function(responseToken){
      if (responseToken != false) {
        gConfig.getUserMenu(responseToken,token, function(menu){
          var resObj = {};
          resObj.appName = "Foodie App";
          resObj.title = "Dashboard";
          resObj.menu = menu;
          resObj.token = token;
          res.render('sellerDashboard', resObj);
        })
        
      } else {
        res.redirect("/")
      }
    })
    
  }
  app.get('/dashboard/:tokenKey', getSellerDashboard)
}