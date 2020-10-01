const mongoose = require("mongoose");
const Schema = mongoose.Schema;
function OrderitemsSchema(connection, gConfig) {
  const OrderitemsSchema = new Schema({
    createdBy: {
      type: String,
      required: false,
    },
    createdOn: {
      type: Date,
      required: true,
      default: new Date(),
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
      required: true,
    },
    status: {   
      type: String,
      required: false,
      default: "Pending",
    },
    isDelete: {
      type: Number,
      required: true,
      default: 0,
    },
    isActive: {
      type: Number,
      required: true,
      default: 1,
    },
    productId: {
      type: String,
      required: true,
      ref: "Products",
    },
    productImage: {
      type: Schema.Types.Mixed,
      required: false,
    },
    productName: {
      type: String,
      required: true,
    },
    actualPrice: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
      ref: "Orders",
    },
  });
  gConfig.OrderitemsSchema = connection.model("Orderitems", OrderitemsSchema);
  return gConfig;
}
module.exports = OrderitemsSchema;