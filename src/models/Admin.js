const mongoose = require("mongoose");
const validator = require("validator");
const uniqueValidator = require("mongoose-unique-validator");
const { hashString } = require("../controllers/auth/authHelpers");

const AdminSchema = new mongoose.Schema({
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
});

AdminSchema.plugin(uniqueValidator, {
  message: "Email address must be unique",
});

// Hash password prior to saving
AdminSchema.pre("save", async function () {
  this.password = await hashString(this.password);
});

// Hash password prior to saving upon update
AdminSchema.pre("findOneAndUpdate", async function () {
  if (this._update.password) {
    this._update.password = await hashString(this._update.password);
  }
});

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = { Admin };
