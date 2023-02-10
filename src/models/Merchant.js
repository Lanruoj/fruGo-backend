const mongoose = require("mongoose");

const MerchantSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  streetAddress: { type: String, required: true },
  city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
  stock: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StockProduct",
    },
  ],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
});

const Merchant = mongoose.model("Merchant", MerchantSchema);

module.exports = { Merchant };
