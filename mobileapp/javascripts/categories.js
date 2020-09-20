$(document).ready(function () {
    getSectionsList();
    getCategoriesList();
});
$(document).on("click", "#save", function () {
    saveUpdateCategory();
});
$(document).on('click', "#addButton", function () {
    $("#recordId").val("");
    resetFields("categoryModal");
    $("#categoryModal").modal("open");
});
function getSectionsList() {
    var objParams = {};
    objParams.url = "/getSections"
    sendAjaxRequest(objParams, function (response) {
        if (response.status == 1) {
            M.toast({ html: response.err, classes: 'rounded' });
        } else if (response.status == 0) {
            var selectOption = '';
            $.each(response.data, function(index, section) {
                selectOption += '<option value="'+section._id+'">'+section.name+'</option>'
            });
            $("#section").html(selectOption);
            $("#section").formSelect();
        } else {
            M.toast({ html: "Processign Error", classes: 'rounded' });
        }
    })
}
function getCategoriesList() {
    $("#grid").kendoGrid({
        dataSource: {
            // type: "json",
            transport: {
                read: {
                    url: "/getCategories",
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
                field: "section",
                title: "Display Order"
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
function saveUpdateCategory() {
    var recordId = $("#recordId").val();
    var objParams = {};
    objParams.name = $("#name").val();
    if (!objParams.name) {
        $("#name_error").show();
        $("#name").focus();
        return false;
    }
    $("#name_error").hide();

    objParams.section = $("#section").val();
    if (!objParams.section) {
        $("#section_error").show();
        $("#section").focus();
        return false;
    }
    $("#section_error").hide();

    if (recordId != "") {
        objParams.url = "/updateAjaxCategory";
        objParams.recordId = recordId;
    } else {
        objParams.url = "/saveAjaxCategory"
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
            $("#categoryModal").modal("close");
            getCategoriesList();
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
            objParams.url = "/deleteAjaxCategory";
            sendAjaxRequest(objParams, function (response) {
                if (response.status == 1) {
                    M.toast({ html: response.err, classes: 'rounded' });
                } else if (response.status == 0) {
                    swal("Category has been deleted successfully", {
                        icon: "success",
                    });
                    getCategoriesList();
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
    objParams.url = "/getCategoryRecordById";
    sendAjaxRequest(objParams, function (response) {
        if (response.status == 1) {
            M.toast({ html: response.err, classes: 'rounded' });
        } else if (response.status == 0) {
            $("#name").val(response.data.name);
            $("#section").val(response.data.section);
            $("#section").formSelect();
            $("#categoryModal").modal("open");
            M.updateTextFields();
        } else {
            M.toast({ html: "Processign Error", classes: 'rounded' });
        }
    })
});