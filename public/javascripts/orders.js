$(document).ready(function () {
    getOrdersList();
});
$(document).on("click", "#save", function () {
    saveUpdateOrder();
});
$(document).on('click', "#addButton", function () {
    $("#recordId").val("");
    resetFields("orderModal");
    $("#orderModal").modal("open");
})
function getOrdersList() {
    $("#grid").kendoGrid({
        dataSource: {
            // type: "json",
            transport: {
                read: {
                    url: "/getOrders",
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
            pageOrder: 10
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
            },
            {
                field: "orderNumber",
                template: '<a href="\\#!" recordid="#: _id#" class="orderdetail">#:orderNumber#</a>',
                title: "Order Number"
            },
             {
                field: "createdBy",
                title: "Name"
            }, {
                field: "totalAmount",
                title: "Total Amount"
            },
            {
                field: "itemsCount",
                title: "Total Ordered Items"
            },
             {
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
function saveUpdateOrder() {
    var recordId = $("#recordId").val();
    var objParams = {};
    objParams.name = $("#name").val();
    if (!objParams.name) {
        $("#name_error").show();
        $("#name").focus();
        return false;
    }
    $("#name_error").hide();

    objParams.order = $("#order").val();
    if (!objParams.order) {
        $("#order_error").show();
        $("#order").focus();
        return false;
    }
    $("#order_error").hide();

    if (recordId != "") {
        objParams.url = "/updateAjaxOrders";
        objParams.recordId = recordId;
    } else {
        objParams.url = "/saveAjaxOrders"
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
            $("#orderModal").modal("close");
            getOrdersList();
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
            objParams.url = "/deleteAjaxOrders";
            sendAjaxRequest(objParams, function (response) {
                if (response.status == 1) {
                    M.toast({ html: response.err, classes: 'rounded' });
                } else if (response.status == 0) {
                    swal("Order has been deleted successfully", {
                        icon: "success",
                    });
                    getOrdersList();
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
    objParams.url = "/getOrderRecordById";
    sendAjaxRequest(objParams, function (response) {
        if (response.status == 1) {
            M.toast({ html: response.err, classes: 'rounded' });
        } else if (response.status == 0) {
            $("#name").val(response.data.name);
            $("#order").val(response.data.order);
            $("#orderModal").modal("open");
            M.updateTextFields();
        } else {
            M.toast({ html: "Processign Error", classes: 'rounded' });
        }
    })
});
$(document).on('click', '.orderdetail', function () {
    const recordId = $(this).attr('recordid');
    const token = $('#token').val();
    window.location.href = `/orderdetails/${token}/${recordId}`
  });