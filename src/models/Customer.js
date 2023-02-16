const mongoose = require("mongoose");
const validator = require("validator");
const uniqueValidator = require("mongoose-unique-validator");
const { hashString } = require("../controllers/auth/authHelpers");

const CustomerSchema = new mongoose.Schema({
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
  firstName: {
    type: String,
    required: true,
    validate: {
      validator: (firstName) => {
        return validator.isAlpha(firstName, ["en-US"]);
      },
      message: "First name may only contain letters",
    },
  },
  lastName: {
    type: String,
    required: true,
    validate: {
      validator: (lastName) => {
        return validator.isAlpha(lastName, ["en-US"]);
      },
      message: "Last name may only contain letters",
    },
  },
  city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
  streetAddress: {
    type: String,
    required: true,
  },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
});

// Handle 'unique: true' error
CustomerSchema.plugin(uniqueValidator, {
  message: "Email address must be unique",
});

CustomerSchema.pre("save", async function () {
  // Hash password prior to saving
  this.password = await hashString(this.password);
});

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = { Customer };
