const mongoose = require("mongoose");
const { Product } = require("./Product");

const StockProductSchema = new mongoose.Schema({
  _merchant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Merchant",
    required: true,
  },
  _product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
});

const StockProduct = mongoose.model("StockProduct", StockProductSchema);

module.exports = { StockProduct };
