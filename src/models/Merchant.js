const mongoose = require("mongoose");
const validator = require("validator");
const uniqueValidator = require("mongoose-unique-validator");
const { hashString } = require("../controllers/auth/authHelpers");

const MerchantSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
    minLength: [6, "Password must be greater than 6 characters long"],
  },
  username: {
    type: String,
    required: true,
    validate: {
      validator: (username) => {
        return validator.isAlphanumeric(username, ["en-US"], { ignore: "_-" });
      },
      message: "Username may only contain alphanumeric characters",
    },
  },
  name: {
    type: String,
    required: true,
    validate: {
      validator: (name) => {
        return validator.isAlphanumeric(name, ["en-US"], { ignore: "_-" });
      },
      message: "Username may only contain alphanumeric characters",
    },
  },
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

MerchantSchema.pre("save", async function () {
  // Hash password prior to saving
  this.password = await hashString(this.password);
});

const Merchant = mongoose.model("Merchant", MerchantSchema);

module.exports = { Merchant };
