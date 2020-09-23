function getProductDetails() {
  const ajaxurl = $("#ajaxurl").val();
  const objParams = {};
  objParams.token = getParameterByName("token");
  objParams.recordId = getParameterByName("productId");

  $.ajax({
    data: objParams,
    url: ajaxurl + "/getProductRecordById",
    type: "post",
    success: function (response) {
      if (response.status == 0) {
        let html = "";
        if (response.data.productImage !== undefined) {
          response.data.productImage.forEach(function (data, index) {
            html += `<div class="carousel-item" href="#one${index}!" >
                <img src="${data.url}">
            </div>`;
          });
        } else {
          html += `<img class="responsive-img" src="placeholder.png">`;
        }
        $("#productImages").html(html);
        if (response.data.productImage !== undefined) {
          $(".carousel.carousel-slider").carousel({
            fullWidth: true,
            indicators: true,
          });
        }
        $("#productName").html(response.data.productName);
        $("#actualPrice").html(response.data.actualPrice);
        let availability = "Available";
        $("#availability").html(availability);
        $("#desciption").html(response.data.productDesc);
      } else {
        $("#productsList").html("");
      }
    },
    error: function () {
      $("#login").attr("disabled", false);
      $("#displayLoading").addClass("d-none");
      $("#login_error").html("Server error.");
      $("#displayLoading").addClass("hide");
    },
  });
}
/**
 * 
 * @param {this} button  // this is a button datails which is used to disable the button when we click on add to cat button
 */
function addProductToCart(button) {
  const ajaxurl = $("#ajaxurl").val();
  const objParams = {};
  objParams.token = getParameterByName("token");
  objParams.productId = getParameterByName("productId");

  $(button).prop("disable", true);
  $("#displayLoading").removeClass("hide");
  $.ajax({
    data: objParams,
    url: ajaxurl + "/saveAjaxCart",
    type: "post",
    success: function (response) {
      if (response.status == 0) {
        M.toast({
          html: "Product Added to Cart",
        });
      } else {
        M.toast({
          html: "Unable to add product product in cart",
        });
      }
      
      $("#displayLoading").addClass("hide");
      $(button).prop("disable", false);
    },
    error: function () {
      M.toast({
        html: "Unable to add product product in cart",
      });
      $("#displayLoading").addClass("hide");
      $(button).prop("disable", false);
    },
  });
}
function addProductToWishlist(button) {
  const ajaxurl = $("#ajaxurl").val();
  const objParams = {};
  objParams.token = getParameterByName("token");
  objParams.productId = getParameterByName("productId");
  $(button).prop("disable", true);
  $("#displayLoading").removeClass("hide");
  $.ajax({
    data: objParams,
    url: ajaxurl + "/saveAjaxWishlist",
    type: "post",
    success: function (response) {
      if (response.status == 0) {
        M.toast({
          html: "Product Added to Wishlist",
        });
      } else {
        M.toast({
          html: "Unable to add product product in Wishlist",
        });
      }

      $("#displayLoading").addClass("hide");
      $(button).prop("disable", false);
    },
    error: function () {
      M.toast({
        html: "Unable to add product product in Wishlist",
      });
      $("#displayLoading").addClass("hide");
      $(button).prop("disable", false);
    },
  });
}


$(document).ready(() => {
  getProductDetails();
  $(".carousel.carousel-slider").carousel({
    fullWidth: true,
    indicators: true,
  });
});
$(document).on("click", "#addToCart", function () {
  const button = $(this);
  addProductToCart(button);

});
$(document).on("click", "#addToWishlist", function () {
  const button = $(this);
  addProductToWishlist(button);

});
$(document).on("click", "#backbutton", function () {
  const token = getParameterByName("token");
  let queryparams = "";
  if (token != undefined && token != null && token != "") {
    queryparams += `token=${token}`;
  }
  window.location.href = `home.html?${queryparams}`;
});
