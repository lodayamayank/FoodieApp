var mongoose = require("mongoose");
var Schema = mongoose.Schema;
function CartSchema(connection, gConfig) {
    var CartSchema = new Schema({
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
        productId: {
            type: String,
            required: true,
            ref: 'Products'
        },
        quantity: {
            type: Number,
            required: true,
        },
    });
    gConfig.CartSchema = connection.model("Cart", CartSchema)
    return gConfig;
}

module.exports = CartSchema;
