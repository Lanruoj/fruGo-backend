const { Customer } = require("../../models/Customer");
const { Cart } = require("../../models/Cart");
const { Merchant } = require("../../models/Merchant");
const { StockProduct } = require("../../models/StockProduct");

async function getCartByCustomerID(customerID) {
  try {
    const cart = await Cart.findOne({ _customer: customerID })
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
    const city = customer._city.toString();
    const merchant = await Merchant.findOne({ _city: city }).exec();
    if (!merchant)
      throw { message: ": : No merchants currently found in your city" };
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

async function addToCart(customerID, stockProductID) {
  try {
    const cart = await Cart.findOneAndUpdate(
      {
        _customer: customerID,
        "products._stockProduct": { $ne: stockProductID },
      },
      {
        $addToSet: {
          products: { _stockProduct: stockProductID },
        },
      },
      { returnDocument: "after" }
    )
      .populate({
        path: "products",
        populate: {
          path: "_stockProduct",
          model: "StockProduct",
          populate: { path: "_product", model: "Product" },
        },
      })
      .exec();
    return cart;
  } catch (error) {
    console.log(error);
    error.status = 400;
    throw error;
  }
}

async function updateCartProductQuantity(customerID, stockProductID, quantity) {
  try {
    const stockProduct = await StockProduct.findById(stockProductID)
      .populate({ path: "_product", model: "Product" })
      .exec();
    if (stockProduct.quantity < quantity) {
      const error = new Error();
      error.message = `: : Only ${stockProduct.quantity} ${
        stockProduct._product.name.toLowerCase() + "s"
      } in stock`;
      throw error;
    }
    const cart = await Cart.findOneAndUpdate(
      {
        _customer: customerID,
        "products._stockProduct": stockProductID,
      },
      {
        $set: {
          "products.$.subQuantity": quantity,
        },
      },
      { returnDocument: "after" }
    )
      .populate({
        path: "products",
        populate: {
          path: "_stockProduct",
          model: "StockProduct",
          populate: { path: "_product", model: "Product" },
        },
      })
      .exec();
    return cart;
  } catch (error) {
    console.log(error);
    error.status = 400;
    throw error;
  }
}

async function removeFromCart(customerID, stockProductID) {
  try {
    const cart = await Cart.findOneAndUpdate(
      { _customer: customerID },
      { $pull: { products: { _stockProduct: stockProductID } } },
      { returnDocument: "after" }
    )
      .populate({
        path: "products",
        populate: {
          path: "_stockProduct",
          model: "StockProduct",
          populate: { path: "_product", model: "Product" },
        },
      })
      .exec();
    return cart;
  } catch (error) {
    console.log(error);
    error.status = 400;
    throw error;
  }
}

module.exports = {
  getCartByCustomerID,
  createCart,
  addToCart,
  removeFromCart,
  updateCartProductQuantity,
};
