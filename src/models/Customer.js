const mongoose = require("mongoose");
const validator = require("validator");
const { hashString } = require("../controllers/auth/authHelpers");

const CustomerSchema = new mongoose.Schema({
  email: { type: String, required: true },
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
        return validator.isAlphanumeric(username, ["en-US"]);
      },
      message: "Username may only contain alphanumeric characters",
    },
  },
  firstName: {
    type: String,
    required: true,
    validate: {
      validator: (username) => {
        return validator.isAlpha(username, ["en-US"]);
      },
      message: "First name may only contain letters",
    },
  },
  lastName: { type: String, required: true },
  city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
  streetAddress: { type: String, required: true },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
});

CustomerSchema.pre("save", async function () {
  // Hash password prior to saving
  this.password = await hashString(this.password);
});

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = { Customer };
