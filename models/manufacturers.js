var mongoose = require("mongoose");
var Schema = mongoose.Schema;
function manufacturersSchema(connection, gConfig) {
    var manufacturersSchema = new Schema({
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
        manufacturers: {
            type: String,
            required: true
        },

    });
    gConfig.manufacturersSchema = connection.model("manufacturers", manufacturersSchema)
    return gConfig;
}

module.exports = manufacturersSchema;
