$(document).ready(function () {
    $(document).on("click", "#register", function (e) {
        var objParams = {};

        objParams.firstName = $("#name").val();
        if (!objParams.firstName) {
            $("#name_error").show().fadeIn("slow");;
            $("#name").focus();
            return false;
        }
        $("#name_error").hide();

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

        objParams.password = $("#password").val();
        if (!objParams.password) {
            $("#password_error").show().fadeIn("slow");
            $("#password").focus();
            return false;
        }
        $("#password_error").hide();

        objParams.mobileNumber = $("#mobile_no").val();
        if (!objParams.mobileNumber) {
            $("#mobile_no_error").show().fadeIn("slow");;
            $("#mobile_no").focus();
            return false;
        } 
        $("#mobile_no_error").hide();

        objParams.flatNumber = $("#flat_no").val();
        if (!objParams.password) {
            $("#flat_no_error").show().fadeIn("slow");
            $("#flat_no").focus();
            return false;
        }
        $("#flat_no_error").hide();

        objParams.wing = $("#wing_name :selected").val();
        if (!objParams.category) {
            $("#wing_name_error").show();
            $("#wing_name").focus();
            return false;
        }
        $("#wing_name_error").hide();

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
