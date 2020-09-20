function saveUpdateAddress() {
  const ajaxurl = $('#ajaxurl').val();
  var objParams = {};
  objParams.token = getParameterByName('token');
  objParams.name = $('#name').val();
  if (!objParams.name) {
    $('#name_error').show();
    $('#name').focus();
    return false;
  }
  $('#name_error').hide();

  objParams.mobileNumber = $('#mobileNumber').val();
  if (!objParams.mobileNumber) {
    $('#mobileNumber_error').show();
    $('#mobileNumber').focus();
    return false;
  }
  $('#mobileNumber_error').hide();

  objParams.address1 = $('#address1').val();
  if (!objParams.address1) {
    $('#address1_error').show();
    $('#address1').focus();
    return false;
  }
  $('#address1_error').hide();

  objParams.address2 = $('#address2').val();
  if (!objParams.address2) {
    $('#address2_error').show();
    $('#address2').focus();
    return false;
  }
  $('#address2_error').hide();
  
  objParams.landmark = $('#landmark').val();
  if (!objParams.landmark) {
    $('#landmark_error').show();
    $('#landmark').focus();
    return false;
  }
  $('#landmark_error').hide();

  objParams.city = $('#city').val();
  if (!objParams.city) {
    $('#city_error').show();
    $('#city').focus();
    return false;
  }
  $('#city_error').hide();

  objParams.district = $('#district').val();
  if (!objParams.district) {
    $('#district_error').show();
    $('#district').focus();
    return false;
  }
  $('#district_error').hide();

  objParams.state = $('#state').val();
  if (!objParams.state) {
    $('#state_error').show();
    $('#state').focus();
    return false;
  }
  $('#state_error').hide();

  objParams.pincode = $('#pincode').val();
  if (!objParams.pincode) {
    $('#pincode_error').show();
    $('#pincode').focus();
    return false;
  }
  $('#pincode_error').hide();

  $('#save').prop('disable', true);
  $('#displayLoading').removeClass('hide');
  $.ajax({
    data: objParams,
    url: ajaxurl + '/saveAjaxAddresses',
    type: 'post',
    success: function (response) {
      if (response.status == 0) {
        const token = getParameterByName('token');
        M.toast({
          html: 'Address added successfully.',
        });
      }
      $('#displayLoading').addClass('hide');
      $('#save').prop('disable', false);
    },
    error: function () {
      M.toast({
        html: 'Unable to add address now. Please try agaon after sometime.',
      });
      $('#displayLoading').addClass('hide');
      $('#save').prop('disable', false);
    },
  });
}
$(document).on('click', '#save', function () {
  saveUpdateAddress();
});
$(document).on('click', '.back-arrow', function () {
  const token = getParameterByName('token');
  window.location.href = `home.html?token=${token}`;
});
