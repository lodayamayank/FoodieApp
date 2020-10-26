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
    url: "app_myorders.html",
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
  // {
  //   icon: "local_mall",
  //   name: "Orders",
  //   url: "app_myorder.html",
  // },
 
  {
    icon: "account_circle",
    name: "Account",
    url: "account.html",
  },
  {
    icon: "local_mall",
    name: "Order",
    url: "app_myorders.html",
  },
];
$(document).ready(function () {
  $("#ajaxurl").val(ajaxurl);
  getmenu();
  getBottomMenu();
  getCartCount();
  getLoggedInUserInfoApp();
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
              <img src="./default-user-avatar.jpg" alt="" class="circle z-depth-2 responsive-img profileImage">
            </div>
            <div class="col s12">
              <div id="loggedInUserName" class="subtitle font-weight-700 white-text center-align">Lawrence Collins</div>
              <div id="loggedInEmail" class="text-muted white-text center-align">lawrence.collins@xyz.com</div>
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
    <div class="col s4 bottom-menu redirecttomenu" menupage="${menu.name.toLowerCase()}" pagename="${menu.url.toLowerCase()}">
        <div class="bottom_menu_icon">
          <span class="material-icons-outlined bottom-menu ${menu.name.toLowerCase().replace(" ","")}">
              ${menu.icon}
          </span>
        </div>
        <div class="bottom_menu_title">
          <span class="bottom_menu_title bottom-menu ${menu.name.toLowerCase().replace(" ","")}">${menu.name}</span>
        </div>
    </div>
    `;
  });

  $("#bottomMenu").html(menuHTML);
  const pagename = window.location.pathname;
  if (pagename.indexOf('home.html') !== -1){
      $('.home').removeClass('bottom-menu')
      $('.home').addClass('bottom-menu-active')
  } else if (pagename.indexOf('account.html') !== -1){
      $('.account').removeClass('bottom-menu')
      $('.account').addClass('bottom-menu-active')
  } else if (pagename.indexOf('app_myorder.html') !== -1){
      $('.myorders').removeClass('bottom-menu')
      $('.myorders').addClass('bottom-menu-active')
  }
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
function getLoggedInUserInfoApp() {
  const ajaxurl = $("#ajaxurl").val();
  const objParams = {};
  objParams.token = getParameterByName("token");
  $.ajax({
    data: objParams,
    url: ajaxurl + "/getAjaxLoggedInUserInfoApp",
    type: "post",
    success: function (response) {
      if (response.status == 0) {
        $("#loggedInUserName").html(response.data.name);
        $("#loggedInEmail").html(response.data.email);
        let profileImage = 'default-user-avatar.jpg';
        if (response.data.profileImage) {
          if (response.data.profileImage.length !== 0) {
          response.data.profileImage.forEach(function (data) {
            profileImage = `${data.url}`;
          });
        }
      }
        $(".profileImage").attr("src",profileImage);
      } else {
        $("#loggedInUserName").html('');
      }
    },
    error: function () {
      $("#loggedInUserName").html('');
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
// $(document).on('click', '.editRecord', function () {
//   var recordId = $(this).attr('recordid');
//   $('#recordId').val(recordId);
//   var objParams = {};
//   objParams.recordId = recordId;
//   objParams.url = '/getOrderRecordById';
//   sendAjaxRequest(objParams, function (response) {
//     if (response.status == 1) {
//       M.toast({ html: response.err, classes: 'rounded' });
//     } else if (response.status == 0) {
//       $('#name').val(response.data.name);
//       $('#order').val(response.data.order);
//       $('#orderModal').modal('open');
//       M.updateTextFields();
//     } else {
//       M.toast({ html: 'Processign Error', classes: 'rounded' });
//     }
//   });
// });