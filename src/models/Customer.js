const mongoose = require("mongoose");
const validator = require("validator");
const uniqueValidator = require("mongoose-unique-validator");
const { hashString } = require("../controllers/helpers");

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
  _city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
  streetAddress: {
    type: String,
    required: true,
  },
  _merchant: { type: mongoose.Schema.Types.ObjectId, ref: "Merchant" },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  loggedIn: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// Handle 'unique: true' error
CustomerSchema.plugin(uniqueValidator, {
  message: "Email address must be unique",
});

// Hash password prior to saving
CustomerSchema.pre("save", async function () {
  this.password = await hashString(this.password);
});

// Hash password prior to saving upon update
CustomerSchema.pre("findOneAndUpdate", async function () {
  if (this._update.password) {
    this._update.password = await hashString(this._update.password);
  }
});

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = { Customer };
