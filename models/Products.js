var mongoose = require("mongoose");
var Schema = mongoose.Schema;
function ProductsSchema(connection, gConfig) {
    var ProductsSchema = new Schema({
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
        productName: {
            type: String,
            required: true
        },
        productDesc: {
            type: String,
            required: true
        },
        productImage: {
            type: Schema.Types.Mixed,
            required: false
        },
        
        actualPrice: {
            type: Number,
            required: true
        },
        availableQuantity: {
            type: Number,
            required: true
        },
        
    });
    gConfig.ProductsSchema = connection.model("Products", ProductsSchema)
    return gConfig;
}

module.exports = ProductsSchema;
