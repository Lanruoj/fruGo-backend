const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart", required: true },
  timestamps: true,
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "complete", "cancelled"],
  },
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = { Order };
