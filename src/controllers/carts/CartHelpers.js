const { Customer } = require("../../models/Customer");
const { Cart } = require("../../models/Cart");
const { Merchant } = require("../../models/Merchant");

async function getCartByCustomerID(customerID) {
  try {
    const customer = await Customer.findById(customerID).exec();
    const cart = await Cart.findOne({ _customer: customer._id })
      .populate({
        path: "products",
        populate: { path: "_product", model: "Product" },
      })
      .exec();
    return cart;
  } catch (error) {
    console.log(error);
    error.status = 404;
    throw error;
  }
}

async function createCart(customerID) {
  try {
    const customer = await Customer.findById(customerID).exec();
    const city = customer._city;
    const merchant = await Merchant.findOne({ _city: city });
    const cart = await Cart.create({
      _customer: customerID,
      _merchant: merchant,
    });
    return cart;
  } catch (error) {
    console.log(error);
    error.status = 400;
    throw error;
  }
}

module.exports = { getCartByCustomerID, createCart };
