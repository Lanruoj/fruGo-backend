const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  merchant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Merchant",
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StockProduct",
    },
  ],
  totalPrice: Number,
});

const Cart = mongoose.model("Cart", CartSchema);

module.exports = { Cart };
