
$(document).ready(function () {
    getProductsList();
    // getSectionsList();
    getBrandList();
    getCategoriesList({});
    getManufacturerList();
    getColorList();
    getUnitsList();
    $('.dropify').dropify();
    CKEDITOR.replace('productDesc', { height: '150px' });

});
$(document).on("click", "#save", function () {
    saveUpdateProduct();
});
$(document).on('click', "#addButton", function () {
    $("#recordId").val("");
    resetFields("productModal");
    $("#productModal").modal("open");
})
function getSectionsList() {
    var objParams = {};
    objParams.url = "/getSections"
    sendAjaxRequest(objParams, function (response) {
        if (response.status == 1) {
            M.toast({ html: response.err, classes: 'rounded' });
        } else if (response.status == 0) {
            var selectOption = '<option value="">Select</option>';
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
function getUnitsList() {
    var objParams = {};
    objParams.url = "/getunits"
    sendAjaxRequest(objParams, function (response) {
        if (response.status == 1) {
            M.toast({ html: response.err, classes: 'rounded' });
        } else if (response.status == 0) {
            var selectOption = '<option value="">Select</option>';
            $.each(response.data, function (index, unit) {
                selectOption += '<option value="' + unit._id + '">' + unit.name + '</option>'
            });
            $("#unitOfMetricsId").html(selectOption);
            $("#unitOfMetricsId").formSelect();
            $("#unitOfMetricsId").trigger("change");
        } else {
            M.toast({ html: "Processign Error", classes: 'rounded' });
        }
    })
}
function getBrandList() {
    var objParams = {};
    objParams.url = "/getBrands"
    sendAjaxRequest(objParams, function (response) {
        if (response.status == 1) {
            M.toast({ html: response.err, classes: 'rounded' });
        } else if (response.status == 0) {
            var selectOption = '<option value="">Select</option>';
            
            $.each(response.data, function (index, section) {
                selectOption += '<option value="' + section._id + '">' + section.name + '</option>'
            });
            $("#brands").html(selectOption);
            $("#brands").formSelect();
            $("#brands").trigger("change");
        } else {
            M.toast({ html: "Processign Error", classes: 'rounded' });
        }
    })
}
function getManufacturerList() {
    var objParams = {};
    objParams.url = "/getManufacturers"
    sendAjaxRequest(objParams, function (response) {
        if (response.status == 1) {
            M.toast({ html: response.err, classes: 'rounded' });
        } else if (response.status == 0) {
            var selectOption = '<option value="">Select</option>';
            $.each(response.data, function (index, section) {
                selectOption += '<option value="' + section._id + '">' + section.name + '</option>'
            });
            $("#manufacturers").html(selectOption);
            $("#manufacturers").formSelect();
            $("#manufacturers").trigger("change");
        } else {
            M.toast({ html: "Processign Error", classes: 'rounded' });
        }
    })
}
function getColorList() {
    var objParams = {};
    objParams.url = "/getColors"
    sendAjaxRequest(objParams, function (response) {
        if (response.status == 1) {
            M.toast({ html: response.err, classes: 'rounded' });
        } else if (response.status == 0) {
            var selectOption = '<option value="">Select</option>';
            $.each(response.data, function (index, section) {
                selectOption += '<option value="' + section._id + '">' + section.name + '</option>'
            });
            $("#colors").html(selectOption);
            $("#colors").formSelect();
            $("#colors").trigger("change");
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
function getCategoriesList(objParams, categoryId,subCategoryId) {
    objParams.url = "/getCategories";
    sendAjaxRequest(objParams, function (response) {
        if (response.status == 1) {
            M.toast({ html: response.err, classes: 'rounded' });
        } else if (response.status == 0) {
            var selectOption = '<option value="">Select</option>';
            $.each(response.data, function (index, category) {
                selectOption += '<option value="' + category._id + '">' + category.name + '</option>'
            });
            $("#category").html(selectOption);
            if (categoryId != "") {
                $("#category").val(categoryId);
            } else {
                $("#category").val('');
            }
            $("#category").formSelect();
            if(subCategoryId!=""){
                const objParams={};
                objParams.category = $("#category :selected").val()
                getSubCategoriesList(objParams, subCategoryId);
            }
        } else {
            M.toast({ html: "Processign Error", classes: 'rounded' });
        }
    })
}
$(document).on("change", "#category", function () {
    var objParams = {};
    objParams.category = $("#category :selected").val()
    getSubCategoriesList(objParams, '');
});
function getSubCategoriesList(objParams, categoryId) {
    objParams.url = "/getSubCategoriesListByCategory";
    sendAjaxRequest(objParams, function (response) {
        if (response.status == 1) {
            M.toast({ html: response.err, classes: 'rounded' });
        } else if (response.status == 0) {
            var selectOption = '<option value="">Select</option>';
            $.each(response.data, function (index, category) {
                selectOption += '<option value="' + category._id + '">' + category.name + '</option>'
            });
            $("#subcategory").html(selectOption);
            if (category != "") {
                $("#subcategory").val(categoryId);
            } else {
                $("#subcategory").val('');
            }
            $("#subcategory").formSelect();
        } else {
            M.toast({ html: "Processign Error", classes: 'rounded' });
        }
    })
}
function getProductsList() {
    $("#grid").kendoGrid({
        dataSource: {
            // type: "json",
            transport: {
                read: {
                    url: "/getProducts",
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
            pageProduct: 10
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
                title: "#",
                width: "80px"
            }, {
                field: "name",
                title: "Name",
                width: "180px"
            }, {
                field: "categoryName",
                title: "Category",
                width: "180px"
            },
            {
                field: "actualPrice",
                title: "Actual Price",
                width: "150px"
            }, 
            {
                field: "sellingPrice",
                title: "Selling Price",
                width: "150px"
            }, 
            {
                field: "discount",
                title: "Discount",
                width: "150px"
            },
            {
                field: "availableQuantity",
                title: "Quantity",
                width: "150px"
            },
            {
                field: "availableQuantity",
                title: "Status",
                width:"200px",
                template: function(data){
                    let html="";
                    if(data.availableQuantity>=50){
                        html = "<span class='badge green'>In Stock</span>"
                    }
                    else if(data.availableQuantity<50 && data.availableQuantity>0){
                        html = "<span class='badge orange'>Running Low</span>"
                    }
                    else{
                        html = "<span class='badge red'>Out Of Stock</span>"  
                    }
                    return html;
                }
            }
            , 
            // {
            //     field: "createdOn",
            //     title: "Created On",
            //     width: "150px"
            // },
             {
                field: "updatedOn",
                title: "Updated On",
                width: "150px"
            }, {
                field: "_id",
                title: "Action",
                width: "105px",
                template: '<a href="\\#!" recordid="#: _id #" class="editRecord" style="display:inline;"><i class="material-icons">create_outlined</i></a><a href="\\#!" recordid="#: _id #" class="deleteRecord" style="color: red;"><i class="material-icons">delete_outlined</i></a>'
            }
        ]
    });
}
function saveUpdateProduct() {
    var recordId = $("#recordId").val();
    var objParams = {};
    objParams.name = $("#name").val();
    if (!objParams.name) {
        $("#name_error").show();
        $("#name").focus();
        return false;
    }
    $("#name_error").hide();

    // objParams.section = $("#section :selected").val();
    // if (!objParams.section) {
    //     $("#section_error").show();
    //     $("#section").focus();
    //     return false;
    // }
    // $("#section_error").hide();

    objParams.category = $("#category :selected").val();
    if (!objParams.category) {
        $("#category_error").show();
        $("#category").focus();
        return false;
    }
    $("#category_error").hide();
   
    objParams.subCategory = $("#subcategory :selected").val();
    if (!objParams.subCategory) {
        $("#subcategory_error").show();
        $("#subcategory").focus();
        return false;
    }
    $("#subcategory_error").hide();

    objParams.actualPrice = $("#actualprice").val();
    if (!objParams.actualPrice) {
        $("#actualprice_error").show();
        $("#actualprice").focus();
        return false;
    }
    $("#actualprice_error").hide();

    objParams.sellingPrice = $("#sellingprice").val();
    if (!objParams.sellingPrice) {
        $("#sellingprice_error").show();
        $("#sellingprice").focus();
        return false;
    }
    $("#sellingprice_error").hide();

    objParams.availableQuantity = $("#quantity").val();
    if (!objParams.availableQuantity) {
        $("#quantity_error").show();
        $("#quantity").focus();
        return false;
    }
    $("#quantity_error").hide();

    objParams.unitOfMetricsId = $("#unitOfMetricsId :selected").val();
    if (!objParams.unitOfMetricsId) {
        $("#unitOfMetricsId_error").show();
        $("#unitOfMetricsId").focus();
        return false;
    }
    $("#unitOfMetricsId_error").hide();

    objParams.metrics = $("#metrics").val();
    if (!objParams.metrics) {
        $("#metrics_error").show();
        $("#metrics").focus();
        return false;
    }
    $("#metrics_error").hide();

    objParams.priceOnPurchaseQuantity = $("#priceOnPurchaseQuantity").val();
    if (!objParams.priceOnPurchaseQuantity) {
        $("#priceOnPurchaseQuantity_error").show();
        $("#priceOnPurchaseQuantity").focus();
        return false;
    }
    $("#metrics_error").hide();
    objParams.purchaseQuantity = $("#purchaseQuantity").val();
    if (!objParams.purchaseQuantity) {
        $("#purchaseQuantity_error").show();
        $("#purchaseQuantity").focus();
        return false;
    }
    $("#purchaseQuantity_error").hide();

    objParams.productDesc = $.trim(CKEDITOR.instances['productDesc'].getData());;
    if (!objParams.productDesc) {
        $("#productDesc_error").show();
        $("#productDesc").focus();
        return false;
    }
    $("#productDesc_error").hide();
    objParams.discount = $("#discount").val();
    objParams.colors = $("#colors :selected").val();
    objParams.brands = $("#brands :selected").val();
    objParams.manufacturers = $("#manufacturers :selected").val();
    objParams.warranty = $("#warranty").val();

    if (recordId != "") {
        objParams.url = "/updateAjaxProducts";
        objParams.recordId = recordId;
    } else {
        objParams.url = "/saveAjaxProducts"
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
            $("#productModal").modal("close");
            getProductsList();
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
            objParams.url = "/deleteAjaxProducts";
            sendAjaxRequest(objParams, function (response) {
                if (response.status == 1) {
                    M.toast({ html: response.err, classes: 'rounded' });
                } else if (response.status == 0) {
                    swal("Product has been deleted successfully", {
                        icon: "success",
                    });
                    getProductsList();
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
    objParams.url = "/getProductRecordById";
    sendAjaxRequest(objParams, function (response) {
        if (response.status == 1) {
            M.toast({ html: response.err, classes: 'rounded' });
        } else if (response.status == 0) {
            $("#name").val(response.data.name);
            $("#actualprice").val(response.data.actualPrice);
            $("#sellingprice").val(response.data.sellingPrice);
            $("#quantity").val(response.data.availableQuantity);
            $("#discount").val(response.data.discount);
            $("#warranty").val(response.data.warranty);
            CKEDITOR.instances['productDesc'].setData(response.data.productDesc);
            $("#section").val(response.data.sectionId);
            $("#section").formSelect();
            $("#brands").val(response.data.brandId);
            $("#brands").formSelect();
            $("#manufacturers").val(response.data.manufacturerId);
            $("#manufacturers").formSelect();
            $("#colors").val(response.data.colorId);
            $("#colors").formSelect();
            var objParams = {};
            objParams.section = $("#section :selected").val()
            getCategoriesList(objParams, response.data.categoryId,response.data.subCategoryId);
            
            $("#productModal").modal("open");
            M.updateTextFields();
        } else {
            M.toast({ html: "Processign Error", classes: 'rounded' });
        }
    })
});