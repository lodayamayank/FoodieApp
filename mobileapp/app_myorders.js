function getOrdersListByUser() {
    const ajaxurl = $('#ajaxurl').val();
    const objParams = {};
    objParams.token = getParameterByName('token');
  
    let shineHTML = '';
    for (let i = 0; i <= 10; i++) {
      shineHTML += `
          <div class="col s12 m4 l3">
            <div class="card">
                <div class="card-content">
                  <div class="row">
                    <div class="col s12">
                        <lines class="shine" style="width:100%;"></lines>
                        <lines class="shine" style="width:100%;"></lines>
                        <lines class="shine" style="width:100%;"></lines>
                        <lines class="shine" style="width:100%;"></lines>
                    </div>
                  </div>
                </div>
              </div>              
            </div>
          </div>`;
    }
    $('#ordersList').html(shineHTML);
    $.ajax({
      data: objParams,
      url: ajaxurl + '/getOrdersListByUserAjax',
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
              let statusColor = '';
              switch (data.status) {
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
              html += `<div class="col s12 m4 l3">
                        <div class="card">
                          <div class="card-content orderDetails" recordId="${data._id}">
                            <div class="row ">
                              <div class="col s12">
                                <div class="row">
                                  <div class="col s6">
                                    <span class="text-ellipsis">Order #: ${data.orderNumber}</span>
                                  </div>
                                  <div class="col s6">
                                    <span class="right ${statusColor}">${data.status}</span>
                                  </div>
                                  <div class="col s12">
                                    <span class="bold">Placed For: ${data.createdBy}</span>
                                  </div>
                                  <div class="col s12">
                                    <span>Placed On: ${data.createdOn}</b><span>
                                  </div>
                                  <div class="col s12">
                                    <span>Delivery Date: ${data.createdOn}</b><span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>`;
            });
            $('#placeOrder').removeAttr('disabled');
          } else {
            $('#placeOrder').attr('disabled', true);
          }
          $('#ordersList').html(html);
          $('#cartTotal').html(response.cartTotal);
        } else {
          $('#ordersList').html('');
        }
        $('#displayLoading').addClass('hide');
      },
      error: function () {
        $('#login').attr('disabled', false);
        $('#displayLoading').addClass('hide');
      },
    });
  }
  
  $(document).on("click", ".orderDetails", function () {
      const token = getParameterByName("token");
      const recordId = $(this).attr("recordId");
      let queryparams = "";
      if (token != undefined && token != null && token != "") {
        queryparams += `token=${token}`;
      }
      if (recordId != undefined && recordId != null && recordId != "") {
        queryparams += `&recordId=${recordId}`;
      }
      window.location.href = `app_orderdetails.html?${queryparams}`;
    });
  $(document).ready(() => {
    getOrdersListByUser();
  });
  