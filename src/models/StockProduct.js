const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
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
    unique: true,
  },
  quantity: { type: Number, required: true, default: 0 },
});

// Handle 'unique: true' error
StockProductSchema.plugin(uniqueValidator, {
  message: "Product already exists in stock",
});

const StockProduct = mongoose.model("StockProduct", StockProductSchema);

module.exports = { StockProduct };
