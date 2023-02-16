const mongoose = require("mongoose");
const validator = require("validator");
const uniqueValidator = require("mongoose-unique-validator");
const { hashString } = require("../controllers/auth/authHelpers");

const MerchantSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
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

MerchantSchema.plugin(uniqueValidator, {
  message: "Email address must be unique",
});

const Merchant = mongoose.model("Merchant", MerchantSchema);

module.exports = { Merchant };
