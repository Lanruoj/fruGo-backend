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
        _stockProduct: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "StockProduct",
        },
        subQuantity: { type: Number, default: 1 },
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

CartSchema.pre("find", function (next) {
  this.populate({
    path: "_cartProducts",
    populate: {
      path: "_stockProduct",
      model: "StockProduct",
      populate: { path: "_product", model: "Product" },
    },
  });
  next();
});

const Cart = mongoose.model("Cart", CartSchema);

module.exports = { Cart };
