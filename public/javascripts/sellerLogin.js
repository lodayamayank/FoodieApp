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
    $.ajax({
        data: objParams,
        url: "/api/seller-login",
        type: "post",
        success: function (response) {
            if (response.status == 200){
                $("#login").attr("disabled",false);
                $("#displayLoading").addClass("d-none");
                window.location.href = "/dashboard/"+response.token;
                M.toast({html: response.error, classes: 'rounded'});
                $("#displayLoading").addClass("hide");
            } else {
                $("#login").attr("disabled",false);
                M.toast({html: response.error, classes: 'rounded'});
                $("#displayLoading").addClass("d-none");
                $("#login_error").html(response.error);
                $("#displayLoading").addClass("hide");
            }
        },
        error: function () {
            $("#login").attr("disabled",false);
            $("#displayLoading").addClass("d-none");
            $("#login_error").html("Server error.");
            $("#displayLoading").addClass("hide");
        }  
    })
}
