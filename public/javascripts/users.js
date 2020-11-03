$(document).ready(function () {
    getUsersList();
});
function getUsersList() {
    $("#grid").kendoGrid({
        dataSource: {
            // type: "json",
            transport: {
                read: {
                    url: "/getUsers",
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
                field: "firstName",
                title: "Name"
            },
             {
                field: "email",
                title: "Email ID"
            }, {
                field: "mobileNumber",
                title: "Mobile Number"
            },
            {
                field: "wing",
                title: "Wing"
            },
            {
                field: "flatNumber",
                title: "Flat Number"
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