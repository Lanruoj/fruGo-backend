const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart", required: true },
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
