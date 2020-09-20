var mongoose = require("mongoose");
var Schema = mongoose.Schema;
function couponSchema(connection, gConfig) {
    var couponSchema = new Schema({
        createdBy: {
            type: String,
            required: false
        },
        createdOn: {
            type: Date,
            required: true,
            default: new Date()
        },
        updatedBy: {
            type: String,
            required: false,
        },
        updatedOn: {
            type: Date,
            required: false,
        },
        userId: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: false,
            default: 'Pending'
        },
        isDelete: {
            type: Number,
            required: true,
            default: 0
        },
        isActive: {
            type: Number,
            required: true,
            default: 1
        },
        categoryId: {
            type: String,
            required: true,
            ref: "Categories"
        },
        subCategoryId: {
            type: String,
            required: true,
            ref: "Subcategories"
        },
        coupon: {
            type: String,
            required: true
        },

    });
    gConfig.couponSchema = connection.model("coupon", couponSchema)
    return gConfig;
}

module.exports = couponSchema;
