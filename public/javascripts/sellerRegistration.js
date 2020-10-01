$(document).ready(function () {
    $(document).on("click", "#register", function (e) {
        var objParams = {};

        objParams.firstName = $("#firstName").val();
        if (!objParams.firstName) {
            $("#firstName_error").show().fadeIn("slow");;
            $("#firstName").focus();
            return false;
        }
        $("#firstName_error").hide();

        objParams.lastName = $("#lastName").val();
        if (!objParams.lastName) {
            $("#lastName_error").show().fadeIn("slow");;
            $("#lastName").focus();
            return false;
        }
        $("#lastName_error").hide();

        objParams.email = $("#email").val();
        if (!objParams.email) {
            $("#email_error").show();
            $("#email").focus();
            return false;
        } if (!isValidEmail(objParams.email)) {
            $("#email_error").show().fadeIn("slow");;
            $("#email").focus();
            return false;
        } 
        $("#email_error").hide();

        objParams.mobileNumber = $("#mobileNumber").val();
        if (!objParams.mobileNumber) {
            $("#mobileNumber_error").show().fadeIn("slow");;
            $("#mobileNumber").focus();
            return false;
        } if (!isValidMobile(objParams.mobileNumber)) {
            $("#email_error").show().fadeIn("slow");
            $("#email").focus();
            return false;
        } 
        $("#mobileNumber_error").hide();

        objParams.password = $("#password").val();
        if (!objParams.password) {
            $("#password_error").show().fadeIn("slow");
            $("#password").focus();
            return false;
        }
        $("#password_error").hide();

        $("#signup_error").hide();

        // if (!$('#agreement').is(':checked')){
        //     $("#agreement_error").show().fadeIn("slow");;
        //     $("#agreement").focus();
        //     return false;
        // }
        // $("#agreement_error").hide().fadeOut("slow");;
    
        signUpSeller(objParams);

    })
});

function signUpSeller(objParams) {
    $.ajax({
        data: objParams,
        url: "/api/seller-signup",
        type: "post",
        success: function (response) {
            if (response.status == 200){
                $("#signup_error").show();
                $("#signup_error").html("User created.");
            } else {
                $("#signup_error").show();
                $("#signup_error").html(response.error);
            }
        },
        error: function () {
            $("#signup_error").show();
            $("#signup_error").html("Server error.");
        }  
    })
}