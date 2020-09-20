function Captcha() {
  var alpha = new Array(
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9'
  );
  var i;
  for (i = 0; i < 6; i++) {
    var a = alpha[Math.floor(Math.random() * alpha.length)];
    var b = alpha[Math.floor(Math.random() * alpha.length)];
    var c = alpha[Math.floor(Math.random() * alpha.length)];
    var d = alpha[Math.floor(Math.random() * alpha.length)];
    var e = alpha[Math.floor(Math.random() * alpha.length)];
    var f = alpha[Math.floor(Math.random() * alpha.length)];
    var g = alpha[Math.floor(Math.random() * alpha.length)];
  }
  var code =
    a + ' ' + b + ' ' + ' ' + c + ' ' + d + ' ' + e + ' ' + f + ' ' + g;
  document.getElementById('mainCaptcha').innerHTML = code;
  document.getElementById('mainCaptcha').value = code;
}
function ValidCaptcha() {
  var string1 = removeSpaces(document.getElementById('mainCaptcha').value);
  var string2 = removeSpaces(document.getElementById('txtInput').value);
  if (string1 == string2) {
    return true;
  } else {
    return false;
  }
}
function removeSpaces(string) {
  return string.split(' ').join('');
}

function getOrderItemsOfOrder() {
  const ajaxurl = $('#ajaxurl').val();
    const objParams = {};
  objParams.token = getParameterByName('token');
  
  let shineHTML = '';
  shineHTML += `<ul class="collection with-header">`;
  shineHTML += `<li class="collection-item collection-desc">`;
  shineHTML += `<div class="list-content">`;
  shineHTML += `<div class="list-title-area">`;
  shineHTML += `<div class="list-title"><h6 class="bold">Order Items</h6></div></div>`;

  for (let i = 0; i <= 2; i++) {
    shineHTML += `<div class="row">`;
      shineHTML += `
        <div class="col s12 m4 l3" style="padding:0px">
          <div class="card">
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
    shineHTML += `</div>`;
    }
  shineHTML += `</ul>`;
  $('#productsList').html(shineHTML);

  shineHTML = '';
  for (let i = 0; i < 1; i++) {
    shineHTML += `<ul class="collection with-header">`;
    shineHTML += `<li class="collection-item collection-desc">`;
    shineHTML += `<div class="list-content">`;
    shineHTML += `<div class="list-title-area">`;
    shineHTML += `<div class="list-title"><h6 class="bold">Price Details</h6></div></div>`;
    shineHTML += `<div class="row">
                    <lines class="shine" style="width:100%" ></lines>
                    <lines class="shine" style="width:100%" ></lines>
                    <lines class="shine" style="width:100%" ></lines>
                  </div>`;

    shineHTML += `</ul>`;
  }
  $('#priceDetails').html(shineHTML);

  shineHTML = '';
  for (let i = 0; i < 1; i++) {
    shineHTML += `<ul class="collection with-header">`;
    shineHTML += `<li class="collection-item collection-desc">`;
    shineHTML += `<div class="list-content">`;
    shineHTML += `<div class="list-title-area">`;
    shineHTML += `<div class="list-title"><h6 class="bold">Payment Details</h6></div></div>`;
    shineHTML += `<div class="row">
                    <lines class="shine" style="width:100%" ></lines>
                    <lines class="shine" style="width:100%" ></lines>
                    <lines class="shine" style="width:100%" ></lines>
                  </div>`;

    shineHTML += `</ul>`;
  }
  $('#paymentList').html(shineHTML);

    $.ajax({
      data: objParams,
    url: ajaxurl + '/getCartList',
    type: 'post',
      success: function (response) {
        if (response.status == 0) {
        let html = '';
        html += `<ul class="collection with-header">`;
        html += `<li class="collection-item collection-desc">`;
        html += `<div class="list-content">`;
        html += `<div class="list-title-area">`;
        html += `<div class="list-title" style="border-bottom:1px solid #ddd;"><h6 class="bold">Order Items</h6></div></div>`;
        let actualPrice = 0;
        let sellingPrice = 0;
          response.data.forEach(function (data) {
          actualPrice += data.actualPrice * data.quantity;
          sellingPrice += data.sellingPrice * data.quantity;
            let image;
            if (data.productImage !== undefined) {
              image = data.productImage[0].url;
            } else {
            image = 'placeholder.png';
            }
          html += `<div class="row">`;
          html += `<div class="col s12 m4 l3" style="padding:0px !important;">
                      <div class="card">
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
                                  <small>${data.categoryName}</small>
                                </div>
                                <div class="col s6">
                                  <h6><b>₹${data.sellingPrice}</b> <small><strike>₹${data.actualPrice}</strike></small><h6>
                                </div>
                                <div class="col s6">
                                  <h6 class="right"><b>Qty: ${data.quantity}</b><h6>
                                    </div>
                                  </div>
                                </div>
                              </div>
                        </div>
                      </div>
                    </div>`;
          html += `</div>`;
          });
        html += `</ul>`;
        $('#productsList').html(html);

        html = '';
        html += `<ul class="collection with-header">`;
        html += `<li class="collection-item collection-desc">`;
        html += `<div class="list-content">`;
        html += `<div class="list-title-area">`;
        html += `<div class="list-title" style="border-bottom:1px solid #ddd;"><h6 class="bold">Payment Type</h6></div></div>`;
        html += `<div class="row">
                  <p>
                    <label>
                      <input class="with-gap" name="paymentType" type="radio" checked/>
                      <span style="color:#333;">Cash On Delivery</span>
                    </label>
                  </p>
                  <p>
                    <label>
                      <input class="with-gap" name="paymentType" type="radio"/>
                      <span style="color:#333;">Credit</span>
                    </label>
                  </p>
                  </div>`;

        html += `</ul>`;
        $('#paymentList').html(html);

        html = '';
        html += `<ul class="collection with-header">`;
        html += `<li class="collection-item collection-desc">`;
        html += `<div class="list-content">`;
        html += `<div class="list-title-area">`;
        html += `<div class="list-title" style="border-bottom:1px solid #ddd;"><h6 class="bold">Price Details</h6></div></div>`;
        // html += `<hr>`;
        html += `<div class="row" style="margin:0px !important"><div class="col s6" style="padding:0px">Price:</div><div class="col s6" style="padding:0px"><span class="right">₹${actualPrice}</span></div></div>`;
        html += `<div class="row" style="margin:0px !important"><div class="col s6" style="padding:0px">Discount:</div><div class="col s6" style="padding:0px"><span class="right">₹${
          actualPrice - sellingPrice
        }</span></div></div>`;
        html += `<div class="row" style="margin:0px !important"><div class="col s6" style="padding:0px"><h6 class="bold">Amount Payable:</h6></div><div class="col s6" style="padding:0px"><h6 class="bold right">₹${sellingPrice}</h6></div></div>`;
        html += `</ul>`;
        $('#priceDetails').html(html);

        $('#cartTotal').html(response.cartTotal);
        } else {
        $('#productsList').html('');
        }
      },
      error: function () {
      $('#login').attr('disabled', false);
      $('#displayLoading').addClass('d-none');
      $('#login_error').html('Server error.');
      $('#displayLoading').addClass('hide');
    },
  });
}
function getOrderDetails() {
  const ajaxurl = $('#ajaxurl').val();
  const objParams = {};
  objParams.token = getParameterByName('token');
  objParams.recordId = getParameterByName('recordId');

  shineHTML = '';
  for (let i = 0; i < 1; i++) {
    shineHTML += `<ul class="collection with-header">`;
    shineHTML += `<li class="collection-item collection-desc">`;
    shineHTML += `<div class="list-content">`;
    shineHTML += `<div class="list-title-area">`;
    shineHTML += `<div class="list-title"><h6 class="bold">Delivery Address</h6></div></div>`;
    shineHTML += `<div class="row">
                    <lines class="shine" style="width:100%" ></lines>
                    <lines class="shine" style="width:100%" ></lines>
                    <lines class="shine" style="width:100%" ></lines>
                  </div>`;

    shineHTML += `</ul>`;
  }
  $('#addressDetails').html(shineHTML);

  $.ajax({
    data: objParams,
    url: ajaxurl + '/getOrderRecordById',
    type: 'post',
    success: function (response) {
      if (response.status == 0) {
        let html = '';
        html += `<ul class="collection with-header">`;
        html += `<li class="collection-item collection-desc">`;
        html += `<div class="list-content">`;
        html += `<div class="list-title-area">`;
        html += `<div class="list-title" style="border-bottom:1px solid #ddd;"><h6 class="bold">Delivery Address</h6></div></div>`;
        html += `<div class="row">
                    <h6 class="bold text-ellipsis" style="font-size:20px;">${response.data.name}</h6>
                    <h6>${response.data.address1}, ${response.data.address2}<h6>
                    <h6>${response.data.landmark}, ${response.data.city}<h6>
                    <h6>${response.data.district}, ${response.data.state} - ${response.data.pincode}<h6>
                    <h6>${response.data.mobileNumber}<h6>
                  </div>`;

        html += `</ul>`;
        $('#addressDetails').html(html);

        $('#cartTotal').html(response.cartTotal);
      } else {
        $('#productsList').html('');
      }
    },
    error: function () {
      $('#login').attr('disabled', false);
      $('#displayLoading').addClass('d-none');
      $('#login_error').html('Server error.');
      $('#displayLoading').addClass('hide');
      },
    });
  }
  $(document).ready(() => {
  getOrderItemsOfOrder();
  getOrderDetails();
  });
$(document).on('click', '.back-arrow', function () {
  const token = getParameterByName('token');
    window.location.href = `home.html?token=${token}`;
  });
  
$(document).on('click', '#confirmOrder', function () {
  $('#confirmOrderModal').modal('open');
  });
  
/**
 *  This function is placing order
 * @param {this} button  // this is a button datails which is used to disable the button when we click on Place order button
 */
function updateOrderConfirmation(button) {
  const ajaxurl = $('#ajaxurl').val();
  const objParams = {};
  objParams.token = getParameterByName('token');
  objParams.recordId = getParameterByName('recordId');

  $(button).prop('disable', true);
  $('#displayLoading').removeClass('hide');
  $.ajax({
    data: objParams,
    url: ajaxurl + '/updateAjaxOrderConfirmation',
    type: 'post',
    success: function (response) {
      if (response.status == 0) {
        const token = getParameterByName('token');
        const recordId = response.data._id;
        window.location.href = `app_ordersummary.html?token=${token}`;
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

$(document).on('click', '#placeOrder', function () {
  const button = $(this);
  updateOrderConfirmation(button);
});
