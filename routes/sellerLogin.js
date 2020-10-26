var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var config = require("../config/config");

module.exports = function (app, gConfig) {
  getLoginPage = function (req, res) {
    var token = req.cookies.token;
    gConfig.verifyToken(token, function(responseToken){
      if (responseToken != false) {
        res.redirect('/dashboard/'+token);
      } else {
        var resObj = {};
        resObj.appName = "Blue Butter Fly";
        resObj.title = "Login";
        res.render('sellerLogin', resObj);
      }
    })

  }

  sellerLogin = function (req, res) {
    var responseJson = {};
    var condition = {};
    if (req.body.email != '' && req.body.email != undefined) {
      condition.email = req.body.email;
    }
   
    gConfig.UsermanagementSchema.findOne(condition).exec(function (errSchema, resSchema) {
      if (errSchema) {
        responseJson.data = '';
        responseJson.status = 401;
        responseJson.error = 'Error while checking user.';
        return res.json(responseJson);
      } else if (!resSchema) {
        responseJson.data = '';
        responseJson.status = 401;
        responseJson.error = 'Invalid email address.';
        return res.json(responseJson);
      } else {
        bcrypt.compare(req.body.password, resSchema.password).then(match => {
          if (match) {
            var tokenData = {};
            tokenData.isAdmin = resSchema.isAdmin;
            tokenData.roleName = resSchema.roleName;
            tokenData.userId = resSchema.userId;
            tokenData.userName = `${resSchema.firstName}`;
            tokenData.isUserVerified = resSchema.isUserVerified;
            tokenData.isEmailVerified = resSchema.isEmailVerified;
            tokenData.isMobileVerified = resSchema.isMobileVerified;
            req.session.user = resSchema.userId;

            var tokenOption = {};
            tokenOption.expiresIn = 86400;
            var token = jwt.sign(tokenData, config.commonObjects.jsonsecretkey, tokenOption);
            req.session.token = token;

                responseJson.data = '';
                responseJson.token = token;
                responseJson.status = 200;
                responseJson.error = 'Login Success.';
                res.cookie("token", token);
                return res.json(responseJson);


            
          } else {
            responseJson.data = '';
            responseJson.status = 401;
            responseJson.error = 'Invalid password.';
            return res.json(responseJson);
          }
        })
      }
    })
  }
  app.get('/', getLoginPage);
  app.get('/sellerLogin', getLoginPage);
  app.post('/api/seller-login', sellerLogin);
};
