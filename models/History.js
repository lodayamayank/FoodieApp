var mongoose = require("mongoose");
var Schema = mongoose.Schema;

function HistorySchema(connection, gConfig) {
    var HistorySchema = new Schema({
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
        userId: {
            type: String,
            required: false
        },
        historyType: {
            type: String,
            required: true
        },
        historyDetail: {
            type: String,
            required: true
        },
        productId: {
            type: String,
            required: false
        },
        orderId: {
            type: String,
            required: false
        },
        transactionId: {
            type: String,
            required: false
        }
    });
    gConfig.HistorySchema = connection.model("History", HistorySchema)
    return gConfig;
}

module.exports = HistorySchema
