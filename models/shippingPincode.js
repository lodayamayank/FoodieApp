var mongoose = require("mongoose");
var Schema = mongoose.Schema;
function ShippingpincodeSchema(connection, gConfig) {
    var ShippingpincodeSchema = new Schema({
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
        name: {
            type: String,
            required: true
        },
        order: {
            type: Number,
            required: true
        }
    });
    gConfig.ShippingpincodeSchema = connection.model("Shippingpincode", ShippingpincodeSchema)
    return gConfig;
}

module.exports = ShippingpincodeSchema;
