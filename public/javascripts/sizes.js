$(document).ready(function () {
    getSectionsList();
    getSizesList();
});
function getSectionsList() {
    var objParams = {};
    objParams.url = "/getSections"
    sendAjaxRequest(objParams, function (response) {
        if (response.status == 1) {
            M.toast({ html: response.err, classes: 'rounded' });
        } else if (response.status == 0) {
            var selectOption = '';
            $.each(response.data, function (index, section) {
                selectOption += '<option value="' + section._id + '">' + section.name + '</option>'
            });
            $("#section").html(selectOption);
            $("#section").formSelect();
            $("#section").trigger("change");
        } else {
            M.toast({ html: "Processign Error", classes: 'rounded' });
        }
    })
}
$(document).on("change", "#section", function () {
    var objParams = {};
    objParams.section = $("#section :selected").val()
    getCategoriesList(objParams, '');
});
function getCategoriesList(objParams, categoryId) {
    objParams.url = "/getCategoriesListBySection";
    sendAjaxRequest(objParams, function (response) {
        if (response.status == 1) {
            M.toast({ html: response.err, classes: 'rounded' });
        } else if (response.status == 0) {
            var selectOption = '';
            $.each(response.data, function (index, category) {
                selectOption += '<option value="' + category._id + '">' + category.name + '</option>'
            });
            $("#category").html(selectOption);
            if (category != "") {
                $("#category").val(categoryId);
            } else {
                $("#category").val('');
            }
            $("#category").formSelect();
        } else {
            M.toast({ html: "Processign Error", classes: 'rounded' });
        }
    })
}
$(document).on("click", "#save", function () {
    saveUpdateSize();
});
$(document).on('click', "#addButton", function () {
    $("#recordId").val("");
    resetFields("sizeModal");
    $("#sizeModal").modal("open");
})
function getSizesList() {
    $("#grid").kendoGrid({
        dataSource: {
            // type: "json",
            transport: {
                read: {
                    url: "/getSizes",
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
                field: "order",
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
function saveUpdateSize() {
    var recordId = $("#recordId").val();
    var objParams = {};
    objParams.section = $("#section :selected").val();
    if (!objParams.section) {
        $("#section_error").show();
        $("#section").focus();
        return false;
    }
    $("#section_error").hide();

    objParams.category = $("#category :selected").val();
    if (!objParams.category) {
        $("#category_error").show();
        $("#category").focus();
        return false;
    }
    $("#category_error").hide();
    
    objParams.name = $("#name").val();
    if (!objParams.name) {
        $("#name_error").show();
        $("#name").focus();
        return false;
    }
    $("#name_error").hide();
    if (recordId != "") {
        objParams.url = "/updateAjaxSizes";
        objParams.recordId = recordId;
    } else {
        objParams.url = "/saveAjaxSizes"
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
            $("#sizeModal").modal("close");
            getSizesList();
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
            objParams.url = "/deleteAjaxSizes";
            sendAjaxRequest(objParams, function (response) {
                if (response.status == 1) {
                    M.toast({ html: response.err, classes: 'rounded' });
                } else if (response.status == 0) {
                    swal("Size has been deleted successfully", {
                        icon: "success",
                    });
                    getSizesList();
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
    objParams.url = "/getSizeRecordById";
    sendAjaxRequest(objParams, function (response) {
        if (response.status == 1) {
            M.toast({ html: response.err, classes: 'rounded' });
        } else if (response.status == 0) {
            $("#name").val(response.data.name);
            $("#order").val(response.data.order);
            $("#sizeModal").modal("open");
            M.updateTextFields();
        } else {
            M.toast({ html: "Processign Error", classes: 'rounded' });
        }
    })
});
