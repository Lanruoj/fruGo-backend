const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  _customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  _merchant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Merchant",
    required: true,
  },
  products: [
    {
      _stockProduct: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StockProduct",
      },
      subQuantity: { type: Number, default: 1 },
    },
  ],
  totalPrice: { type: Number, default: 0 },
});

const Cart = mongoose.model("Cart", CartSchema);

module.exports = { Cart };
