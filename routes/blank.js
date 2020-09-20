
module.exports = function (app, gConfig) {
  getBlankPage = function (req, res) {
    var token = req.params.tokenKey;
    gConfig.verifyToken(token, function(responseToken){
      if (responseToken != false) {
        gConfig.getUserMenu(responseToken,token, function(menu){
          var resObj = {};
          resObj.appName = "Blue Butter Fly";
          resObj.title = "blank";
          resObj.menu = menu;
          resObj.token = token;
          res.render('blank', resObj);
        })
        
      } else {
        res.redirect("/")
      }
    })
    
  }
  app.get('/blank/:tokenKey', getBlankPage)
}