$(document).ready(function () {
    $(document).on("click", "#login", function (e) {
        $("#login_error").addClass("hide");;
        var objParams = {};

        objParams.email = $("#email").val();
        if (!objParams.email) {
            $("#email_error").removeClass("hide");
            $("#email").focus();
            return false;
        } if (!isValidEmail(objParams.email)) {
            $("#email_error").removeClass("hide");
            $("#email").focus();
            return false;
        } 
        $("#email_error").addClass("hide");;

        objParams.password = $("#password").val();
        if (!objParams.password) {
            $("#password_error").removeClass("hide");
            $("#password").focus();
            return false;
        }
        $("#password_error").addClass("hide");;    
        loginSeller(objParams);

    })
});

function loginSeller(objParams) {
    $("#displayLoading").removeClass("hide");
    $("#login").attr("disabled",true);
    const ajaxurl =  $("#ajaxurl").val();
    $.ajax({
        data: objParams,
        url: ajaxurl+"/api/seller-login",
        type: "post",
        success: function (response) {
            if (response.status == 200){
                $("#login").attr("disabled",false);
                window.location.href = "home.html?token="+response.token;
                $("#displayLoading").addClass("hide");
            } else {
                $("#login").attr("disabled",false);
                M.toast({html: response.error});
                $("#login_error").html(response.error);
                $("#displayLoading").addClass("hide");
            }
        },
        error: function () {
            $("#login").attr("disabled",false);
            M.toast({html: 'Error while login. Please try after sometime.'});
            $("#login_error").html("Server error.");
            $("#displayLoading").addClass("hide");
        }  
    })
}
