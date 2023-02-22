const { Customer } = require("../../models/Customer");
const { Cart } = require("../../models/Cart");

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

module.exports = { getCartByCustomerID };
