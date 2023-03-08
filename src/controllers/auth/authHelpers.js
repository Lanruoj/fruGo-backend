const mongoose = require("mongoose");
const { createCart } = require("../carts/CartHelpers");
const { Cart } = require("../../models/Cart");
const { generateAccessToken } = require("../helpers");
const { getCustomersMerchant } = require("../customers/CustomerHelpers");
const { City } = require("../../models/City");
const { Merchant } = require("../../models/Merchant");
const { Customer } = require("../../models/Customer");
const { Admin } = require("../../models/Admin");

async function loginUser(userID, role) {
  // Log user in if not already logged in
  if (role == "Customer") {
    user = await Customer.findByIdAndUpdate(
      userID,
      { loggedIn: true },
      { returnDocument: "after" }
    )
      .populate({ path: "_city", model: "City" })
      .populate({ path: "_merchant", model: "Merchant" })
      .exec();
  } else if (role == "Merchant") {
    user = await Merchant.findByIdAndUpdate(
      userID,
      { loggedIn: true },
      { returnDocument: "after" }
    )
      .populate({ path: "_city", model: "City" })
      .exec();
  } else if (role == "Admin") {
    user = await Admin.findByIdAndUpdate(
      userID,
      { loggedIn: true },
      { returnDocument: "after" }.exec()
    );
  }
  const accessToken = await generateAccessToken(userID);
  return { user, accessToken };
}

async function logoutUser(userID, role) {
  let user = await mongoose.model(role).findById(userID).exec();
  // Log user out if already logged in
  if (user.loggedIn) {
    user = await mongoose
      .model(role)
      .findByIdAndUpdate(
        userID,
        { loggedIn: false },
        { returnDocument: "after" }
      )
      .exec();
  }
  return user;
}

module.exports = {
  loginUser,
  logoutUser,
};
