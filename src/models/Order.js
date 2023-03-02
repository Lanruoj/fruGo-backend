const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    _customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    _merchant: { type: mongoose.Schema.Types.ObjectId, ref: "Merchant" },
    _orderProducts: [
      {
        stockProduct: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "StockProduct",
        },
        quantity: { type: Number },
      },
    ],
    totalPrice: { type: Number },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "complete", "cancelled"],
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = { Order };
