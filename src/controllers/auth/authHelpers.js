const mongoose = require("mongoose");
const { createCart } = require("../carts/CartHelpers");
const { Cart } = require("../../models/Cart");
const { generateAccessToken } = require("../helpers");
const { getCustomersMerchant } = require("../customers/CustomerHelpers");

async function loginUser(userID, role) {
  let user = await mongoose.model(role).findById(userID).exec();
  let cart;
  let merchant;
  // Log user in if not already logged in
  if (!user.loggedIn) {
    user = await mongoose
      .model(role)
      .findByIdAndUpdate(
        userID,
        { loggedIn: true },
        { returnDocument: "after" }
      )
      .exec();
    // If user is a customer, create a cart
    if (role == "Customer") {
      cart = await createCart(userID);
    }
  }
  if (user.loggedIn && role == "Customer") {
    merchant = await getCustomersMerchant(userID);
    cart = await Cart.findOne({ _customer: userID }).exec();
  }
  const accessToken = await generateAccessToken(userID);
  return { user, cart, merchant, accessToken };
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
