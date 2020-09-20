var mongoose = require("mongoose");
var Schema = mongoose.Schema;
function CategoriesSchema(connection, gConfig) {
    var CategoriesSchema = new Schema({
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
        section: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Sections"
        }
    });
    gConfig.CategoriesSchema = connection.model("Categories", CategoriesSchema)
    return gConfig;
}

module.exports = CategoriesSchema;
