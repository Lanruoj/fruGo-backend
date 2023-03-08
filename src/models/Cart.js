const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
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
    _cartProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StockProduct",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

const Cart = mongoose.model("Cart", CartSchema);

module.exports = { Cart };
