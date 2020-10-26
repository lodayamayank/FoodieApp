function getOrderItemsOfOrder() {
    const ajaxurl = $('#ajaxurl').val();
    const objParams = {};
    objParams.token = getParameterByName('token');
    objParams.recordId = getParameterByName('recordId');
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
      url: ajaxurl + '/getAjaxOrderItemsList',
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
     
          response.data.forEach(function (data) {
            actualPrice += data.actualPrice * data.quantity;
            
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
                                      <h6><b>₹${data.actualPrice}</b> <small><h6>
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
          html += `<div class="list-title" style="border-bottom:1px solid #ddd;"><h6 class="bold">Price Details</h6></div></div>`;
          // html += `<hr>`;
          html += `<div class="row" style="margin:0px !important"><div class="col s6" style="padding:0px">Price:</div><div class="col s6" style="padding:0px"><span class="right">₹${actualPrice}</span></div></div>`;
          html += `<div class="row" style="margin:0px !important"><div class="col s6" style="padding:0px">Discount:</div><div class="col s6" style="padding:0px"><span class="right">₹${0}</span></div></div>`;
          html += `<div class="row" style="margin:0px !important"><div class="col s6" style="padding:0px"><h6 class="bold">Amount Payable:</h6></div><div class="col s6" style="padding:0px"><h6 class="bold right">₹${actualPrice}</h6></div></div>`;
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

  function getUserAddress() {
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
      shineHTML += `<div class="list-title"><h6 class="bold">Address</h6></div></div>`;
      shineHTML += `<div class="row">
                        <lines class="shine" style="width:100%" ></lines>
                        <lines class="shine" style="width:100%" ></lines>
                        <lines class="shine" style="width:100%" ></lines>
                      </div>`;
  
      shineHTML += `</ul>`;
    }
    $.ajax({
      data: objParams,
      url: ajaxurl + '/getAjaxLoggedInUserInfoApp',
      type: 'post',
      success: function (response) {
        if (response.status == 0) {
          let html = '';
          html += `<ul class="collection with-header">`;
          html += `<li class="collection-item collection-desc">`;
          html += `<div class="list-content">`;
          html += `<div class="list-title-area">`;
          html += `<div class="list-title" style="border-bottom:1px solid #ddd;"><h6 class="bold">Address</h6></div></div>`;
          html += `<div class="row">
                        <h6 class="bold text-ellipsis">${response.data.name}</h6>
                        <h6>${response.data.flatNumber}<h6>
                        <h6>${response.data.wing}<h6>
                      </div>`;
  
          html += `</ul>`;
          $('#addressDetails').html(html);
  
          
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
      shineHTML += `<div class="list-title"><h6 class="bold">Order Details</h6></div></div>`;
      shineHTML += `<div class="row">
                        <lines class="shine" style="width:100%" ></lines>
                        <lines class="shine" style="width:100%" ></lines>
                        <lines class="shine" style="width:100%" ></lines>
                      </div>`;
  
      shineHTML += `</ul>`;

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
          html += `<div class="list-title" style="border-bottom:1px solid #ddd;"><h6 class="bold">Address</h6></div></div>`;
          html += `<div class="row">
                        <h6 class="bold text-ellipsis">${response.data.name}</h6>
                        <h6>${response.data.deliveryAddress}<h6>
                        <h6>${response.data.mobileNumber}<h6>
                      </div>`;
  
          html += `</ul>`;
          $('#addressDetails').html(html);
  
          html = '';
          html += `<ul class="collection with-header">`;
          html += `<li class="collection-item collection-desc">`;
          html += `<div class="list-content">`;
          html += `<div class="list-title-area">`;
          html += `<div class="list-title" style="border-bottom:1px solid #ddd;"><h6 class="bold">Order Details</h6></div></div>`;
          html += `<div class="row" style="border-bottom:1px solid #ddd;">
                      <div class="col s6 no-padding">
                        <p class="bold text-ellipsis">Order #</p>
                      </div>
                      <div class="col s6 no-padding">
                        <p class="right">${response.data.orderNumber}<p>
                      </div>
                  </div>`;
          html += `<div class="row" style="border-bottom:1px solid #ddd;">
                      <div class="col s6 no-padding">
                        <p class="bold text-ellipsis">Order Date</p>
                      </div>
                      <div class="col s6 no-padding">
                        <p class="right">${response.data.createdOn}<p>
                      </div>
                  </div>`;
          html += `<div class="row" style="border-bottom:1px solid #ddd;">
                      <div class="col s6 no-padding">
                        <p class="bold text-ellipsis">Placed By</p>
                      </div>
                      <div class="col s6 no-padding">
                        <p class="right">${response.data.createdBy}<p>
                      </div>
                  </div>`;
  
          html += `<div class="row" style="border-bottom:1px solid #ddd;">
                      <div class="col s6 no-padding">
                        <p class="bold text-ellipsis">Delivery Date</p>
                      </div>
                      <div class="col s6 no-padding">
                        <p class="right">${response.data.deliveryDate || 'N/A'}<p>
                      </div>
                  </div>`;
  
          let statusColor = '';
          switch (response.data.status) {
            case 'Order Placed':
              statusColor = 'blue-text';
              break;
            case 'Order Rejected':
              statusColor = 'red-text';
              break;
            case 'Shipped':
              statusColor = 'blue-text';
              break;
            case 'Cancelled':
              statusColor = 'red-text';
              break;
            case 'Out for delivery':
              statusColor = 'amber-text';
              break;
            case 'Delivered':
              statusColor = 'green-text';
              break;
            case 'Returned':
              statusColor = 'orange-text';
              break;
            case 'Refunded':
              statusColor = 'amber-text';
              break;
            default:
              statusColor = 'blue-text';
              break;
          }
          html += `<div class="row">
                      <div class="col s6 no-padding">
                        <p class="bold text-ellipsis">Order Status</p>
                      </div>
                      <div class="col s6 no-padding">
                        <p class="right ${statusColor}">${response.data.status}<p>
                      </div>
                  </div>`;
  
  
          html += `</ul>`;
          $('#orderDetails').html(html);
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
    
  }
  $(document).ready(() => {
    getOrderItemsOfOrder();
    getOrderDetails();
    getUserAddress();
  });
  $(document).on('click', '.back-arrow', function () {
    const token = getParameterByName('token');
    window.location.href = `app_myorders.html?token=${token}`;
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
          window.location.href = `app_orderthankyou.html?token=${token}`;
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
  