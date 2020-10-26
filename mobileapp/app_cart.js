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
  $('#productsList').html(shineHTML);
  $.ajax({
    data: objParams,
    url: ajaxurl + '/getCartList',
    type: 'post',
    success: function (response) {
      if (response.status == 0) {
        let html = '';
        if (response.data.length !== 0) {
        response.data.forEach(function (data) {
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
                          <div class="col s4">
                            <img src="${image}" class="responsive-img" alt="">
                          </div>
                          <div class="col s8">
                            <div class="row">
                              <div class="col s12">
                                <span class="bold text-ellipsis">${data.productName}</span>
                              </div>
                              <div class="col s12">
                                <small></small>
                              </div>
                              <div class="col s8">
                                <h6><b>₹${data.actualPrice}</b><h6>
                              </div>
                              <div class="col s4">
                                <div class="row">
                                  <div class="center" style="margin-top: 4px;">
                                    <span class="material-icons left decrease" action="decrease" productId="${data._id}">
                                      remove_circle_outline
                                    </span>
                                    <span style="font-size:16px;font-weight:bold;">${data.quantity}</span>
                                    <span class="material-icons right increase" action="increase" productId="${data._id}">
                                      add_circle_outline
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="card-action">
                        <a href="#" class="btn-flat waves-effect waves-light" style="padding:0px 4px;margin:0px"><i class="material-icons-outlined left" style="">favorite_border</i>Move to Wishlist</a> 
                        <a href="#" id="deleteFromCart" class="btn-flat waves-effect waves-light red-text right" recordId="${data._id}" style="padding: 0px 4px;margin:0px"><i class="material-icons-outlined left" style="">delete</i>Remove</a>
                      </div>
                    </div>
                  </div>`;
        });
          $("#placeOrder").removeAttr('disabled');
      } else {
          $("#placeOrder").attr('disabled', true);
      }
        $('#productsList').html(html);
        $('#cartTotal').html(response.cartTotal);
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
function saveOrder(button) {
  const ajaxurl = $('#ajaxurl').val();
  const objParams = {};
  objParams.token = getParameterByName('token');
  $(button).prop('disable', true);
  $('#displayLoading').removeClass('hide');
  $.ajax({
    data: objParams,
    url: ajaxurl + '/saveAjaxOrders',
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
function deleteCartProduct(button) {
  const ajaxurl = $('#ajaxurl').val();
  const objParams = {};
  objParams.token = getParameterByName('token');
  objParams.recordId = $(button).attr('recordId');
  
  $(button).prop('disable', true);
  $('#displayLoading').removeClass('hide');
  $.ajax({
    data: objParams,
    url: ajaxurl + '/deleteAjaxCart',
    type: 'post',
    success: function (response) {
      if (response.status == 0) {
        getProductsListByCategory();
        getCartCount();
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

$(document).on('click', '#placeOrder', function () {
  const button = $(this);
  saveOrder(button);
});
$(document).on('click', '#deleteFromCart', function () {
  const button = $(this);
  deleteCartProduct(button);
});
$(document).on('click', '.back-arrow', function () {
  const token = getParameterByName('token');
  window.location.href = `home.html?token=${token}`;
});

$(document).on('click', '.increase, .descrese', function () {
  const action = $(this).attr('action');
});
