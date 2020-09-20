$(document).ready(function () {
    $('#colorcode').colorpicker({
        colorSelectors: {
          'red': '#f44336',
          'pink': '#e91e63',
          'purple': '#9c27b0',
          'deep-purple': '#673ab7',
          'indigo': '#3f51b5',
          'blue': '#2196f3',
          'light-blue': '#03a9f4',
          'cyan': '#00bcd4',
          'teal': '#009688',
          'green': '#4caf50',
          'light-green': '#8bc34a',
          'lime': '#cddc39',
          'yellow': '#ffeb3b',
          'amber': '#ffc107',
          'orange': '#ff9800',
          'deep-orange': '#ff5722',
          'brown': '#795548',
          'grey': '#9e9e9e',
          'blue-grey': '#607d8b',
          'black': '#000000',
          'white': '#ffffff'
        },
        format: 'hex',
        color:  'green'
      });
    getColorsList();
});
$(document).on("click", "#save", function () {
    saveUpdateColor();
});
$(document).on('click', "#addButton", function () {
    $("#recordId").val("");
    resetFields("colorModal");
    $("#colorModal").modal("open");
})
function getColorsList() {
    $("#grid").kendoGrid({
        dataSource: {
            // type: "json",
            transport: {
                read: {
                    url: "/getColors",
                    dataType: "json",
                    type: "POST",
                },
                parameterMap: function (options, type) {
                    $("#displayLoading").removeClass("hide");
                    var objParams = {};
                    objParams.take = options.take;
                    objParams.skip = options.skip;
                    return objParams;
                }
            },
            schema: {
                data: function (data) {
                    $("#displayLoading").addClass("hide");
                    return data.data;
                },
                total: function (data) {
                    return data.totalRecords;
                },
                model: {
                    fields: {
                        name: { field: "name", type: "string" }
                    }
                }
            },
            pageSize: 10
        },
        sortable: true,
        filterable: true,
        serverPaging: true,
        pageable: {
            buttonCount: 5
        },
        columns: [
            {
                field: "index",
                title: "Sr. No."
            }, {
                field: "name",
                title: "Name"
            }, {
                field: "colorCode",
                title: "Color Code"
            }, {
                field: "createdOn",
                title: "Created On",
            }, {
                field: "updatedOn",
                title: "Updated On",
            }, {
                field: "_id",
                title: "Action",
                template: '<a href="\\#!" recordid="#: _id #" class="editRecord" style="display:inline;"><i class="material-icons">create_outlined</i></a><a href="\\#!" recordid="#: _id #" class="deleteRecord" style="color: red;"><i class="material-icons">delete_outlined</i></a>'
            }
        ]
    });
}
function saveUpdateColor() {
    var recordId = $("#recordId").val();
    var objParams = {};
    objParams.name = $("#name").val();
    if (!objParams.name) {
        $("#name_error").show();
        $("#name").focus();
        return false;
    }
    $("#name_error").hide();

    objParams.colorCode = $("#colorCode").val();
    if (!objParams.colorCode) {
        $("#colorCode_error").show();
        $("#colorCode").focus();
        return false;
    }
    $("#colorCode_error").hide();

    if (recordId != "") {
        objParams.url = "/updateAjaxColors";
        objParams.recordId = recordId;
    } else {
        objParams.url = "/saveAjaxColors"
    }
    $("#save").prop("disable", true);
    sendAjaxRequest(objParams, function (response) {
        if (response.status == 1) {
            $("#save").prop("disable", false);
            M.toast({ html: response.err, classes: 'rounded' });
        } else if (response.status == 2) {
            $("#save").prop("disable", false);
            M.toast({ html: response.err, classes: 'rounded' });
        } else if (response.status == 0) {
            $("#save").prop("disable", false);
            $("#colorModal").modal("close");
            getColorsList();
        } else {
            $("#save").prop("disable", false);
            M.toast({ html: "Processign Error", classes: 'rounded' });
        }
    })
}
$(document).on('click', '.deleteRecord', function () {
    var recordId = $(this).attr("recordid");
    swal({
        title: "Are you sure?",
        icon: 'warning',
        dangerMode: true,
        buttons: {
            cancel: 'No',
            delete: 'Yes, Delete It'
        }
    }).then(function (willDelete) {
        if (willDelete) {
            var objParams = {};
            objParams.recordId = recordId;
            objParams.isDelete = 1;
            objParams.url = "/deleteAjaxColors";
            sendAjaxRequest(objParams, function (response) {
                if (response.status == 1) {
                    M.toast({ html: response.err, classes: 'rounded' });
                } else if (response.status == 0) {
                    swal("Color has been deleted successfully", {
                        icon: "success",
                    });
                    getColorsList();
                } else {
                    M.toast({ html: "Processign Error", classes: 'rounded' });
                }
            })

        }
    });
})
$(document).on('click', '.editRecord', function () {
    var recordId = $(this).attr("recordid");
    $("#recordId").val(recordId);
    var objParams = {};
    objParams.recordId = recordId;
    objParams.url = "/getColorRecordById";
    sendAjaxRequest(objParams, function (response) {
        if (response.status == 1) {
            M.toast({ html: response.err, classes: 'rounded' });
        } else if (response.status == 0) {
            $("#name").val(response.data.name);
            $("#colorCode").val(response.data.colorCode);
            $("#colorModal").modal("open");
            M.updateTextFields();
        } else {
            M.toast({ html: "Processign Error", classes: 'rounded' });
        }
    })
});