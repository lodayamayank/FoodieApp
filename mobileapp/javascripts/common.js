const ajaxurl = "http://localhost:3000";
const menuArray = [
  {
    icon: "home",
    name: "Home",
    url: "home.html",
  },
  {
    icon: "local_mall",
    name: "Orders",
    url: "home.html",
  },
  {
    icon: "shopping_cart",
    name: "Cart",
    url: "app_cart.html",
  },
   {
    icon: "notifications",
    name: "Notifications",
    url: "home.html",
  },
  {
    icon: "settings",
    name: "Settings",
    url: "account.html",
  },
  {
    icon: "power_settings_new",
    name: "Logout",
    url: "home.html",
  },
];
const bottomMenuArray = [
  {
    icon: "home",
    name: "Home",
    url: "home.html",
  },
  {
    icon: "local_mall",
    name: "Orders",
    url: "home.html",
  },
  {
    icon: "account_circle",
    name: "Account",
    url: "account.html",
  },
];
$(document).ready(function () {
  $("#ajaxurl").val(ajaxurl);
  getmenu();
  getBottomMenu();
  getCartCount();
  $(document).on("keydown", ".numberOnly", function (e) {
    if (
      !(
        event.keyCode == 8 || // backspace
        event.keyCode == 9 ||
        event.keyCode == 16 ||
        event.keyCode == 46 || // delete
        (event.keyCode >= 35 && event.keyCode <= 40) || // arrow keys/home/end
        (event.keyCode >= 48 && event.keyCode <= 57) || // numbers on keyboard
        (event.keyCode >= 96 && event.keyCode <= 105)
      ) // number on keypad
    ) {
      event.preventDefault(); // Prevent character input
    } else {
      return true;
    }
  });
});

function isValidEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

function isValidMobile(mobile) {
  var regex = new RegExp("^[7-9][0-9]{9}$");
  return regex.test(mobile);
}
function getmenu() {
  let menuHTML = "";
  const token = getParameterByName("token");
  menuHTML += `<div class="sidebar-header">
  <div class="row  animate fadeLeft">
            <div class="col s12 media-image center-align">
              <img src="./images/user/12.jpg" alt="" class="circle z-depth-2 responsive-img profileImage">
            </div>
            <div class="col s12">
              <div class="subtitle font-weight-700 white-text center-align">Lawrence Collins</div>
              <div class="text-muted white-text center-align">lawrence.collins@xyz.com</div>
            </div>
          </div>
</div>`;
  menuArray.forEach(function (menu) {
    menuHTML += '<li class="bold">';
    menuHTML +=
      '<a class="waves-effect waves-cyan" href="' +
      menu.url +
      "?token=" +
      token +
      '">';
    menuHTML += '<i class="material-icons">' + menu.icon + "</i>";
    menuHTML +=
      '<span class="menu-title" data-i18n="">' + menu.name + "</span>";
    menuHTML += "</a>";
    menuHTML += "</li>";
  });

  $("#slide-out").html(menuHTML);
}

function getBottomMenu() {
  let menuHTML = "";
  const token = getParameterByName("token");
  bottomMenuArray.forEach(function (menu) {
    menuHTML += `
    <div class="col s4 bottom-menu redirecttomenu" menupage="${menu.name.toLowerCase()}">
        <div class="bottom_menu_icon">
          <span class="material-icons-outlined bottom-menu">
              ${menu.icon}
          </span>
        </div>
        <div class="bottom_menu_title">
          <span class="bottom_menu_title bottom-menu">${menu.name}</span>
        </div>
    </div>
    `;
  });

  $("#bottomMenu").html(menuHTML);
}

function getCartCount() {
  const ajaxurl = $("#ajaxurl").val();
  const objParams = {};
  objParams.token = getParameterByName("token");
  $.ajax({
    data: objParams,
    url: ajaxurl + "/getCartCount",
    type: "post",
    success: function (response) {
      if (response.status == 0) {
        $("#cartCount").html(response.data);
      } else {
        $("#cartCount").html(0);
      }
    },
    error: function () {
      $("#cartCount").html(0);
    },
  });
}

$(document).on("click", ".cartButton", function () {
  const token = getParameterByName("token");
  let queryparams = "";
  if (token != undefined && token != null && token != "") {
    queryparams += `token=${token}`;
  }
  window.location.href = `app_cart.html?${queryparams}`;
});
