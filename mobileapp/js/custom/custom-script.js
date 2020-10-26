/*================================================================================
	Item Name: Materialize - Material Design Admin Template
	Version: 5.0
	Author: PIXINVENT
	Author URL: https://themeforest.net/user/pixinvent/portfolio
================================================================================

NOTE:
------
PLACE HERE YOUR OWN JS CODES AND IF NEEDED.
WE WILL RELEASE FUTURE UPDATES SO IN ORDER TO NOT OVERWRITE YOUR CUSTOM SCRIPT IT'S BETTER LIKE THIS. */
$(document).ready(function () {
	$('.modal').modal({
		dismissible: false, // Modal can be dismissed by clicking outside of the modal
		opacity: .5, // Opacity of modal background
		inDuration: 300, // Transition in duration
		outDuration: 200, // Transition out duration
		startingTop: '4%', // Starting top style attribute
		endingTop: '10%', // Ending top style attribute
		ready: function (modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
			alert("Ready");
			console.log(modal, trigger);
		},
		complete: function () { alert('Closed'); } // Callback for Modal close
	}
	);
	
	$('.carousel.carousel-slider').carousel({
		fullWidth: true,
		indicators: true
	  });
});

function sendAjaxRequest(objParams, callback) {
	$("#displayLoading").removeClass("hide");
	$.ajax({
		data: objParams,
		url: objParams.url,
		type: "post",
		success: function (response) {
			$("#displayLoading").addClass("hide");
			callback(response);
		},
		error: function (xhr, err) {
			$("#displayLoading").addClass("hide");
			callback(err);
		}
	})
}

function resetFields(form) {
	$("#"+form).find(':input').not(':button, :submit, :reset, :hidden, :checkbox, :radio').val('');
	$("#"+form).find(':checkbox, :radio').prop('checked', false);
	M.updateTextFields();
}
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
$(document).on('click','.redirecttomenu',function (){
	const pagename = $(this).attr('pagename');
	const token = getParameterByName("token");
	window.location.href = `${pagename}?token=${token}`;
	});
function openMap(){
    // If it's an iPhone..
    if( (navigator.platform.indexOf("iPhone") != -1) 
        || (navigator.platform.indexOf("iPod") != -1)
        || (navigator.platform.indexOf("iPad") != -1))
         window.open("maps://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=12.9690803,77.5821472");
    else
         window.open("https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=12.9690803,77.5821472");
}