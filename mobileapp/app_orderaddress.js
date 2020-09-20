function getProductsListByCategory() {
  const ajaxurl = $('#ajaxurl').val();
  const objParams = {};
  objParams.token = getParameterByName('token');

  let shineHTML = '';
  for (let i = 0; i <= 10; i++) {
    shineHTML += `
        <div class="col s12 m4 l3">
          <div class="card animate fadeUp">
              <div class="card-content">
                <div class="row">
                  <div class="col s12">
                      <lines class="shine" style="width:100%"></lines>
                      <lines class="shine" style="width:100%"></lines>
                      <lines class="shine" style="width:100%"></lines>
                  </div>
                </div>
              </div>
            </div>              
          </div>
        </div>`;
  }
  $('#productsList').html(shineHTML);
  $.ajax({
    data: objParams,
    url: ajaxurl + '/getAddresses',
    type: 'post',
    success: function (response) {
      if (response.status == 0) {
        let html = '';
        if (response.data.length !== 0) {
          response.data.forEach(function (data, index) {
            let image;
            if (data.productImage !== undefined) {
              image = data.productImage[0].url;
            } else {
              image = 'placeholder.png';
            }
            html += `<div class="col s12 m4 l3">
                      <div class="card animate fadeUp">
                        <div class="card-content">
                          <div class="row">
                            <div class="col s1" style="line-height:56px;">
                              <label>
                                <input class="with-gap" name="address" type="radio" id="selectAddress${index}" value="${data._id}" />
                                <span for="selectAddress${index}"></span>
                              </label>
                            </div>
                            <div class="col s11">
                              <div class="row">
                                <div class="col s12">
                                  <h6 class="bold text-ellipsis" style="font-size:20px;">${data.name}</h6>
                                </div>
                                <div class="col s12">
                                  <h6>${data.address1}, ${data.address2}<h6>
                                  <h6>${data.landmark}, ${data.city}<h6>
                                  <h6>${data.district}, ${data.state} - ${data.pincode}<h6>
                                  <h6>${data.mobileNumber}<h6>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>`;
          });
          $('#continue').removeAttr('disabled');
          $('#productsList').html(html);
        } else {
          $('#productsList').html(
            `
        <div class="col s12 m4 l3">
          <div class="card animate fadeUp">
              <div class="card-content">
                <div class="row">
                  <div class="col s12">
                     <h6 class="center-align">No addresses found</h6>
                  </div>
                  <div class="col s12 mt-4">
                     <a id="addAddress" class="btn waves-effect waves-light" style="color:#fff;width:100%" >Add New Address</a>
                  </div>
                </div>
              </div>
            </div>              
          </div>
        </div>`
          );
          $('#continue').attr('disabled', true);
        }
      } else {
        $('#productsList').html('');
      }
      $('#displayLoading').addClass('hide');
    },
    error: function () {
      $('#login').attr('disabled', false);
      $('#displayLoading').addClass('hide');
    },
  });
}
/**
 *  This function is placing order and creating order
 * @param {this} button  // this is a button datails which is used to disable the button when we click on Place order button
 */
function updateAjaxOrderAdress(button) {
  const ajaxurl = $('#ajaxurl').val();
  const objParams = {};
  objParams.token = getParameterByName('token');
  objParams.recordId = getParameterByName('recordId');
  objParams.addressId = $("input[name='address']:checked"). val();
  if (objParams.addressId === undefined || objParams.addressId === ""){
    M.toast({html: 'Please select delivery address first'})
    return false;
  }
  $(button).prop('disable', true);
  $('#displayLoading').removeClass('hide');
  $.ajax({
    data: objParams,
    url: ajaxurl + '/updateAjaxOrderAdress',
    type: 'post',
    success: function (response) {
      if (response.status == 0) {
        const token = getParameterByName('token');
        const recordId = response.data._id;
        window.location.href = `app_ordersummary.html?token=${token}&recordId=${recordId}`;
      }
      $('#displayLoading').addClass('hide');
      $(button).prop('disable', false);
    },
    error: function () {
      M.toast({
        html: 'Unable to place order now. Please try agaon after sometime.',
      });
      $('#displayLoading').addClass('hide');
      $(button).prop('disable', false);
    },
  });
}
$(document).ready(() => {
  getProductsListByCategory();
});

$(document).on('click', '#continue', function () {
  const button = $(this);
  updateAjaxOrderAdress(button);
});

$(document).on('click', '.back-arrow', function () {
  const token = getParameterByName('token');
  window.location.href = `app_cart.html?token=${token}`;
});

$(document).on('click', '#addAddress', function () {
  const token = getParameterByName('token');
  const backPage = 'app_orderaddress.html';
  const orderId = getParameterByName('recordId');
  window.location.href = `app_addaddress.html?token=${token}&backPage=${backPage}&orderId=${orderId}`;
});
