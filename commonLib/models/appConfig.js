var mongoose = require("mongoose");
var Schema = mongoose.Schema;
function AppConfigSchema(connection, gConfig) {
    var AppConfigSchema = new Schema({
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
        appId: {
            type: String,
            required: false
        },
        modelFiles: {
            type: Schema.Types.Mixed,
            required: true
        },
        routeFiles: {
            type: Schema.Types.Mixed,
            required: true
        }
    })
    gConfig.AppConfigSchema = connection.model("appconfig", AppConfigSchema)
    return gConfig;
}

module.exports = AppConfigSchema;
