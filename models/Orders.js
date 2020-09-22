var mongoose = require("mongoose");
var Schema = mongoose.Schema;
function OrdersSchema(connection, gConfig) {
    var OrdersSchema = new Schema({
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
        orderNumber: {
            type: String,
            required: true
        },
        totalAmount: {
            type: Number,
            required: true,
            default: 0
        },
        itemsCount: {
            type: Number,
            required: true,
            default: 0
        },
        name: {
            type: String,
            required: false,
        },
        mobileNumber: {
            type: String,
            required: false,
        },
        address1: {
            type: String,
            required: false,
        },
        address2: {
            type: String,
            required: false,
        },
        landmark: {
            type: String,
            required: false,
        },
        city: {
            type: String,
            required: false,
        },
        district: {
            type: String,
            required: false,
        },
        state: {
            type: String,
            required: false,
        },
        pincode: {
            type: Number,
            required: false,
        },

    });
    gConfig.OrdersSchema = connection.model("Orders", OrdersSchema)
    return gConfig;
}

module.exports = OrdersSchema;
