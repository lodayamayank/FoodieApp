function getProductList() {
  const ajaxurl = $("#ajaxurl").val();
  const objParams = {};
  objParams.token = getParameterByName("token");

  let shineHTML = "";
  for (let i = 0; i < 6; i++) {
    shineHTML += `
      <div class="col s12 m10 l10">
        <div class="card animate fadeLeft">
            <div class="card-content">
                <lines class="shine"></lines>
                <lines class="shine"></lines>
                <box class="shine"></box>
                <lines class="shine"></lines>
            </div>
        </div>
    </div>`;
  }
  $("#productsList").html(shineHTML);
  $.ajax({
      data: objParams,
      url: ajaxurl+"/getProducts",
      type: "post",
      success: function (response) {
          if (response.status == 0){
        let html = "";
              response.data.forEach(function(data){
          let imageUrl;
          if (data.productImage !== undefined) {
            imageUrl = data.productImage[0].url;
          } else {
            imageUrl ='placeholder.png'
          }
          html += `<div class="col s12 m12 l12">
                  <div class="card productdetails" productId="${data._id}">
                    
                  
                    <div class="card-content homeProductDetails">
                      <p></p>
                      <span class="card-title text-ellipsis">${data.name}</span>
                      <img src="${imageUrl}" class="responsive-img productImage" alt="">
                      <div class="row">
                      <h6 class="col s12 m12 l8 mt-3"><small><strike>₹${data.actualPrice}</strike></small> ₹${data.actualPrice}</h6>
                      </div>
                    </div>
                  </div>

                </div>`;
              });
        $("#productsList").html(html);
          } else {
        $("#productsList").html("");
          }
      },
      error: function () {
          $("#login").attr("disabled",false);
          $("#displayLoading").addClass("d-none");
          $("#login_error").html("Server error.");
          $("#displayLoading").addClass("hide");
    },
  });
}

$(document).ready(() => {

  getProductList();
});

$(document).on("click", ".redirecttopage", function () {
  const token = getParameterByName("token");
  const category = $(this).attr("category");
  let queryparams = "";
  if (token != undefined && token != null && token != "") {
    queryparams += `token=${token}`;
  }
  if (category != undefined && category != null && category != "") {
    queryparams += `&category=${category}`;
  }
  window.location.href = `app_searchbycategory.html?${queryparams}`;
});

$(document).on("click", ".productdetails", function () {
  const token = getParameterByName("token");
  const productId = $(this).attr("productId");
  let queryparams = "";
  if (token != undefined && token != null && token != "") {
    queryparams += `token=${token}`;
  }
  if (productId != undefined && productId != null && productId != "") {
    queryparams += `&productId=${productId}`;
  }
  window.location.href = `app_productdetails.html?${queryparams}`;
});
