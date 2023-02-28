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
    products: [
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

CartSchema.pre("findOne", function (next) {
  this.populate({
    path: "products",
    populate: {
      path: "_stockProduct",
      model: "StockProduct",
      populate: { path: "_product", model: "Product" },
    },
  });
  next();
});

CartSchema.virtual("subTotal").get(function () {
  let subTotal = 0;
  for (let cartProduct of this.products) {
    subTotal +=
      cartProduct.subQuantity * cartProduct._stockProduct._product.price;
  }
  return subTotal;
});

const Cart = mongoose.model("Cart", CartSchema);

module.exports = { Cart };
