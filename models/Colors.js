var mongoose = require("mongoose");
var Schema = mongoose.Schema;
function ColorsSchema(connection, gConfig) {
    var ColorsSchema = new Schema({
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
        colorCode: {
            type: String,
            required: true
        }
    });
    gConfig.ColorsSchema = connection.model("Colors", ColorsSchema)
    return gConfig;
}

module.exports = ColorsSchema;
