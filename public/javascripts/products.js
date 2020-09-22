let uploadImageArray = [];
$(document).ready(function () {
  $.cloudinary.config({ cloud_name: "isbey-sample", secure: true });
  if ($.fn.cloudinary_fileupload !== undefined) {
    $("input.cloudinary-fileupload[type=file]").cloudinary_fileupload();
  }
  $(".cloudinary-fileupload").bind("cloudinarydone", function (e, data) {
    $("#displayLoading").addClass("hide");
    const html = `<div class="thumbnail" id="${data.result.public_id}"><image src="${data.result.url}" class="responsive-image uploadThumbnail"/><span class="deleteImage" recordId="${data.result.public_id}"></span></div>`;
    $(".preview").append(html);
    const obj = {};
    obj.public_id = data.result.public_id;
    obj.url = data.result.url;
    obj.secure_url = data.result.secure_url;
    uploadImageArray.push(obj);
    // return true;
  });

  $(document).on("click", ".deleteImage", function () {
    const recordId = $(this).attr("recordId");
    $(`#${recordId}`).remove();
    uploadImageArray = uploadImageArray.filter(function (obj) {
      return obj.public_id !== recordId;
    });
  });

  $(".cloudinary-fileupload").bind("fileuploadsend", function (e, data) {
    $("#displayLoading").removeClass("hide");
  });
  getProductsList();
  // getSectionsList();
  
  $(".dropify").dropify();
  CKEDITOR.replace("productDesc", { height: "150px" });
});
$(document).on("click", "#save", function () {
  saveUpdateProduct();
});
$(document).on("click", "#addButton", function () {
  $("#recordId").val("");
  $(".preview").html("");
  resetFields("productModal");
  uploadImageArray = [];
  $("#productModal").modal("open");
});




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


  objParams.actualPrice = $("#actualprice").val();
  if (!objParams.actualPrice) {
    $("#actualprice_error").show();
    $("#actualprice").focus();
    return false;
  }
  $("#actualprice_error").hide();

  

  objParams.availableQuantity = $("#quantity").val();
  if (!objParams.availableQuantity) {
    $("#quantity_error").show();
    $("#quantity").focus();
    return false;
  }
  $("#quantity_error").hide();

  

  

  objParams.productDesc = $.trim(CKEDITOR.instances["productDesc"].getData());
  if (!objParams.productDesc) {
    $("#productDesc_error").show();
    $("#productDesc").focus();
    return false;
  }
  $("#productDesc_error").hide();
 
  objParams.productImage = uploadImageArray;

  if (recordId != "") {
    objParams.url = "/updateAjaxProducts";
    objParams.recordId = recordId;
  } else {
    objParams.url = "/saveAjaxProducts";
  }
  $("#save").prop("disable", true);
  sendAjaxRequest(objParams, function (response) {
    if (response.status == 1) {
      $("#save").prop("disable", false);
      M.toast({ html: response.err, classes: "rounded" });
    } else if (response.status == 2) {
      $("#save").prop("disable", false);
      M.toast({ html: response.err, classes: "rounded" });
    } else if (response.status == 0) {
      $("#save").prop("disable", false);
      $("#productModal").modal("close");
      uploadImageArray = [];
      getProductsList();
      $(".preview").html("");
    } else {
      $("#save").prop("disable", false);
      M.toast({ html: "Processign Error", classes: "rounded" });
    }
  });
}
$(document).on("click", ".deleteRecord", function () {
  var recordId = $(this).attr("recordid");
  swal({
    title: "Are you sure?",
    icon: "warning",
    dangerMode: true,
    buttons: {
      cancel: "No",
      delete: "Yes, Delete It",
    },
  }).then(function (willDelete) {
    if (willDelete) {
      var objParams = {};
      objParams.recordId = recordId;
      objParams.isDelete = 1;
      objParams.url = "/deleteAjaxProducts";
      sendAjaxRequest(objParams, function (response) {
        if (response.status == 1) {
          M.toast({ html: response.err, classes: "rounded" });
        } else if (response.status == 0) {
          swal("Product has been deleted successfully", {
            icon: "success",
          });
          getProductsList();
        } else {
          M.toast({ html: "Processign Error", classes: "rounded" });
        }
      });
    }
  });
});
$(document).on("click", ".editRecord", function () {
  var recordId = $(this).attr("recordid");
  $("#recordId").val(recordId);
  $(".preview").html("");
  uploadImageArray = [];
  var objParams = {};
  objParams.recordId = recordId;
  objParams.url = "/getProductRecordById";
  sendAjaxRequest(objParams, function (response) {
    if (response.status == 1) {
      M.toast({ html: response.err, classes: "rounded" });
    } else if (response.status == 0) {
      $("#name").val(response.data.productName);
      $("#actualprice").val(response.data.actualPrice);
      $("#sellingprice").val(response.data.sellingPrice);
      $("#quantity").val(response.data.availableQuantity);
     
      CKEDITOR.instances["productDesc"].setData(response.data.productDesc);
     
      let html = '';
      if (response.data.productImage !== undefined){
          uploadImageArray = response.data.productImage;
          if (response.data.productImage.length !== 0){
            response.data.productImage.forEach(function(data){
                html += `<div class="thumbnail" id="${data.public_id}"><image src="${data.url}" class="responsive-image uploadThumbnail"/><span class="deleteImage" recordId="${data.public_id}"></span></div>`;
            })
          }
      }
      $(".preview").append(html);
      var objParams = {};
      objParams.section = $("#section :selected").val();
      

      $("#productModal").modal("open");
      M.updateTextFields();
    } else {
      M.toast({ html: "Processign Error", classes: "rounded" });
    }
  });
});
