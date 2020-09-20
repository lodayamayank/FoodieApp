var jwt = require('jsonwebtoken');
var config = require("../config/config")



module.exports = function (gConfig) {
  function verifyToken(token, tokenCallack) {
    var tokenInput = token;
    if (!tokenInput)
      tokenCallack(false);
    jwt.verify(tokenInput, config.commonObjects.jsonsecretkey, function (err, decoded) {
      if (err) {
        tokenCallack(false);
      } else {
        tokenCallack(decoded)
      }
    });
  }


  function getUserMenu(responseToken, token, menuCallack) {
    var condition = {};
    condition.roleName = responseToken.roleName;
    var menuHTML = "";
    gConfig.UserRolesSchema.findOne(condition).exec(function (errMenu, resMenu) {
      resMenu.menus.sort(function (a, b) {
        return parseFloat(a.order) - parseFloat(b.order);
      });
      gConfig.async.eachSeries(resMenu.menus, function (menu, callback) {
        var routePath = menu.route.replace(":tokenKey", token);
        // menuHTML += '<li class="nav-item">'
        // menuHTML += '<a class="nav-link" href="' + routePath + '">'
        // menuHTML += '<i class="fas fa-fw ' + menu.icon + '"></i>'
        // menuHTML += '<span>' + menu.name + '</span></a>'
        // menuHTML += '</li>';



        if (menu.subMenu) {
          menuHTML += '<li class="bold">'
          menuHTML += '<a class="collapsible-header waves-effect waves-cyan " href="#">'
          menuHTML += '<i class="material-icons">' + menu.icon + '</i>'
          menuHTML += '<span class="menu-title" data-i18n="">' + menu.name + '</span>'
          menuHTML += '</a>'
          menuHTML += '<div class="collapsible-body">'
          menuHTML += '<ul class="collapsible collapsible-sub" data-collapsible="accordion">'

          gConfig.async.eachSeries(menu.subMenu, function (subMenu, callback) {
            var routePath = subMenu.route.replace(":tokenKey", token);
            menuHTML += '<li>'
            menuHTML += '<a class="collapsible-body" href="' + routePath + '" data-i18n="">'
            menuHTML += '<i class="material-icons">' + menu.icon + '</i>'
            menuHTML += '<span>' + subMenu.name + '</span>'
            menuHTML += '</a>'
            menuHTML += '</li>'
            callback();
          }, function () {
            menuHTML += '</ul>'
            menuHTML += '</div>'
            menuHTML += '</li>'
          })

        } else {
          menuHTML += '<li class="bold">'
          menuHTML += '<a class="waves-effect waves-cyan" href="' + routePath + '">'
          menuHTML += '<i class="material-icons">' + menu.icon + '</i>'
          menuHTML += '<span class="menu-title" data-i18n="">' + menu.name + '</span>'
          menuHTML += '</a>'
          menuHTML += '</li>'
        }

        callback();
      }, function () {
        menuCallack(menuHTML);
      })
    })
  }

  gConfig.getUserMenu = getUserMenu;
  gConfig.verifyToken = verifyToken;
  return gConfig;
};
