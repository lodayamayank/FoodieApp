var mongoose = require("mongoose");
var Schema = mongoose.Schema;
function SubcategorySchema(connection, gConfig) {
    var SubcategorySchema = new Schema({
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
        categoryId: {
            type: String,
            required: true,
            ref: 'Categories'
        },
        sectionId: {
            type: String,
            required: true,
            ref: 'Sections'
        },
    });
    gConfig.SubcategorySchema = connection.model("Subcategory", SubcategorySchema)
    return gConfig;
}

module.exports = SubcategorySchema;
