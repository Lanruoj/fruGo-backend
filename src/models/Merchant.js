const mongoose = require("mongoose");
const validator = require("validator");
const uniqueValidator = require("mongoose-unique-validator");
const { StockProduct } = require("./StockProduct");
const { hashString } = require("../controllers/helpers");

const MerchantSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => {
        return validator.isEmail(email);
      },
      message: "Must be a valid email address",
    },
  },
  password: {
    type: String,
    required: true,
    minLength: [6, "Password must be greater than 6 characters long"],
    select: false,
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
        return validator.isAlphanumeric(name, ["en-US"], { ignore: " _-" });
      },
      message: "Username may only contain alphanumeric characters",
    },
  },
  description: { type: String, required: true },
  streetAddress: { type: String, required: true },
  _city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
  stock: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StockProduct",
    },
  ],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  loggedIn: {
    type: Boolean,
    required: true,
    default: false,
  },
});

MerchantSchema.plugin(uniqueValidator, {
  message: "Email address must be unique",
});

// Hash password prior to saving
MerchantSchema.pre("save", async function () {
  this.password = await hashString(this.password);
});

// Hash password prior to saving upon update
MerchantSchema.pre("findOneAndUpdate", async function () {
  if (this._update.password) {
    this._update.password = await hashString(this._update.password);
  }
});

const Merchant = mongoose.model("Merchant", MerchantSchema);

module.exports = { Merchant };
