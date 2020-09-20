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
