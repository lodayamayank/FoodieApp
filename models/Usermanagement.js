var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var Schema = mongoose.Schema;

function UsermanagementSchema(connection, gConfig) {
    var UsermanagementSchema = new Schema({
        createdBy: {
            type: String,
            required: false,
            default: 'Self'
        },
        createdOn: {
            type: Date,
            required: true,
            default: new Date()
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
        userId: {
            type: String,
            required: false
        },
        isUserVerified: {
            type: Number,
            required: true,
            default: 0
        },
        isEmailVerified: {
            type: Number,
            required: true,
            default: 0
        },
        isMobileVerified: {
            type: Number,
            required: true,
            default: 0
        },
        roleName: {
            type: String,
            required: true
        },
        isAdmin: {
            type: Number,
            required: true,
            default: 0
        },
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true
        },
        mobileNumber: {
            type: Number,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            trim: true
        },
        profileImage: {
            type: String,
            required: false
        },
        address: {
            type: Schema.Types.Mixed,
            required: false
        }
    });
    gConfig.UsermanagementSchema = connection.model("Usermanagement", UsermanagementSchema)
    return gConfig;
}


module.exports = UsermanagementSchema
