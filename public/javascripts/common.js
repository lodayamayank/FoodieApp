$(document).ready(function () {


    $(document).on("keydown", ".numberOnly", function (e) {
        if( !(event.keyCode == 8                               // backspace
            || event.keyCode == 9
            || event.keyCode == 16
            || event.keyCode == 46                              // delete
            || (event.keyCode >= 35 && event.keyCode <= 40)     // arrow keys/home/end
            || (event.keyCode >= 48 && event.keyCode <= 57)     // numbers on keyboard
            || (event.keyCode >= 96 && event.keyCode <= 105))   // number on keypad
            ) {
                event.preventDefault();     // Prevent character input
        } else {
            return true;
        }
    });
})

function isValidEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function isValidMobile(mobile) {
    var regex = new RegExp("^[7-9][0-9]{9}$");
    return regex.test(mobile);
}