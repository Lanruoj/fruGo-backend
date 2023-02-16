const mongoose = require("mongoose");
const validator = require("validator");
const uniqueValidator = require("mongoose-unique-validator");
const { hashString } = require("../controllers/auth/authHelpers");

const AdminSchema = new mongoose.Schema({
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
});

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = { Admin };
