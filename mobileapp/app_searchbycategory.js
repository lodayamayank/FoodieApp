function getProductsListByCategory() {
  const ajaxurl = $("#ajaxurl").val();
  const objParams = {};
  objParams.token = getParameterByName("token");
  objParams.category = getParameterByName("category");

  let shineHTML = "";
  for (let i = 0; i <= 10; i++) {
    shineHTML += `
    <div class="col s12 m4 l3">
      <div class="card animate fadeLeft">
          <div class="card-content">
            <div class="row">
              <div class="col s4">
                 <box class="shine"></box>
              </div>
              <div class="col s8">
                <div class="row">
                  <lines class="shine"></lines>
                  <lines class="shine"></lines>
                  <lines class="shine"></lines>
                </div>
              </div>
            </div>
          </div>
        </div>              
      </div>
    </div>`;
  }
  $("#productsList").html(shineHTML);
  $.ajax({
    data: objParams,
    url: ajaxurl + "/getProductsListByCategory",
    type: "post",
    success: function (response) {
      if (response.status == 0) {
        let html = "";
        response.data.forEach(function (data) {
          html += `<div class="col s12 m4 l3">
                  <div class="card animate fadeLeft">
                    <div class="card-badge"><a class="white-text"> <b>On Offer</b> </a></div>
                    <div class="card-content">
                    <div class="row">
                      <div class="col s4">
                      <img src="./images/cards/watch-2.png" class="responsive-img" alt="">
                      </div>
                      <div class="col s8">
                      <div class="row">
                      <span class="card-title text-ellipsis">${data.name}</span>
                      <p>${data.categoryName}</p>
                      <h6>₹${data.sellingPrice}  <small><strike>₹${data.actualPrice}</strike></small><h6>
                      </div>
                    </div>
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
      $("#login").attr("disabled", false);
      $("#displayLoading").addClass("d-none");
      $("#login_error").html("Server error.");
      $("#displayLoading").addClass("hide");
    },
  });
}
$(document).ready(() => {
  getProductsListByCategory();
});
$(document).on("click", ".back-arrow", function () {
  const token = getParameterByName("token");
  window.location.href = `home.html?token=${token}`;
});
