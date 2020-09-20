var mongoose = require("mongoose");
var Schema = mongoose.Schema;
function UserRolesSchema(connection, gConfig) {
    var UserRolesSchema = new Schema({
        createdBy: {
            type: String,
            required: false,
            default: 'Admin'
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
        roleName: {
            type: String,
            required: true
        },
        displayName: {
            type: String,
            required: true
        },
        menus: {
            type: Schema.Types.Mixed,
            required: false
        }
    });
    gConfig.UserRolesSchema = connection.model("userrole", UserRolesSchema)
    return gConfig;
}

module.exports = UserRolesSchema;
