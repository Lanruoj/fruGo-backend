const mongoose = require("mongoose");

const StockProductSchema = new mongoose.Schema({
  merchant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Merchant",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
});

const StockProduct = mongoose.model("StockProduct", StockProductSchema);

modules.export = { StockProduct };
