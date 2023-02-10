const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
  streetAddress: { type: String, required: true },
  orders: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  ],
});

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = { Customer };
