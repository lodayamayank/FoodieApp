$(document).ready(function () {
    $("#ajaxurl").val(ajaxurl);
    
    getLoggedInUserInfoApp();
    
  });

  $(document).on('click', '#submit', function () {
    saveUpdateUser();
  });
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
          $("#firstName").val(response.data.name);
          $('#userId').val(response.data.userId);
          $("#email").val(response.data.email);
          $("#mobileNumber").val(response.data.mobileNumber);
          $("#flatNumber").val(response.data.flatNumber);
          $("#wing").val(response.data.wing);
          $("#wing").formSelect();
          let profileImage = 'default-user-avatar.jpg';
          if (response.data.profileImage) {
            if (response.data.profileImage.length !== 0) {
            response.data.profileImage.forEach(function (data) {
              profileImage = `${data.url}`;
            });
          }
        }
          $(".profileImage").attr("src",profileImage);
          M.updateTextFields();
        } else {
        //   $("#loggedInUserName").html('');
        }
      },
      error: function () {
        // $("#loggedInUserName").html('');
      },
    });
  }
  function saveUpdateUser() {
    var userId = $("#userId").val();
    var objParams = {};
    objParams.firstName = $("#firstName").val();
    if (!objParams.firstName) {
      $("#firstName_error").show();
      $("#firstName").focus();
      return false;
    }
    $("#firstName_error").hide();
  
    objParams.email = $("#email").val();
    if (!objParams.email) {
      $("#email_error").show();
      $("#email").focus();
      return false;
    }
    $("#email_error").hide();

    objParams.mobileNumber = $("#mobileNumber").val();
    if (!objParams.mobileNumber) {
      $("#mobileNumber_error").show();
      $("#mobileNumber").focus();
      return false;
    }
    $("#mobileNumber_error").hide();

    objParams.flatNumber = $("#flatNumber").val();
    if (!objParams.flatNumber) {
      $("#flatNumber_error").show();
      $("#flatNumber").focus();
      return false;
    }
    $("#flatNumber_error").hide();
    // objParams.section = $("#section :selected").val();
    // if (!objParams.section) {
    //     $("#section_error").show();
    //     $("#section").focus();
    //     return false;
    // }
    // $("#section_error").hide();
  
    objParams.wing = $("#wing :selected").val();
    if (!objParams.wing) {
      $("#wing_error").show();
      $("#wing").focus();
      return false;
    }
    $("#wing_error").hide();
    
      objParams.userId = userId;
      objParams.token = getParameterByName('token');
      $('#submit').prop('disable', true);
      $('#displayLoading').removeClass('hide');
      $.ajax({
        data: objParams,
        url: ajaxurl + '/updateUserAjax',
        type: 'post',
        success: function (response) {
          if (response.status == 0) {
            const token = getParameterByName('token');
            window.location.href = `account.html?token=${token}`;
            M.toast({
              html: 'Account Updated successfully.',
            });
            $('#displayLoading').addClass('hide');
           $('#submit').prop('disable', false);
          }
          $('#displayLoading').addClass('hide');
          // $('#save').prop('disable', false);
        },
        error: function () {
          M.toast({
            html: 'Unable to update Account. Please try agaon after sometime.',
          });
          $('#displayLoading').addClass('hide');
          // $('#save').prop('disable', false);
        },
      });
  }