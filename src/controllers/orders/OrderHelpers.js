const { Order } = require("../../models/Order");
const { Customer } = require("../../models/Customer");
const { Merchant } = require("../../models/Merchant");
const { Cart } = require("../../models/Cart");
const { createCart } = require("../carts/CartHelpers");
const { updateStockQuantity } = require("../merchants/MerchantHelpers");
const { getCustomersMerchant } = require("../customers/CustomerHelpers");

async function getAllOrders() {
  try {
    const orders = await Order.find().exec();
    if (!orders) {
      const error = new Error();
      error.message = ": : No orders found";
      error.status = 404;
      throw error;
    }
    return orders;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getOrderByID(orderID) {
  try {
    const order = await Order.findById(orderID).exec();
    if (!order) {
      const error = new Error();
      error.message = `: : No order found [${orderID}]`;
      error.status = 404;
      throw error;
    }
    return order;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getOrdersByCustomerID(customerID, status) {
  let customer = await Customer.findById(customerID)
    .populate({
      path: "orders",
      populate: {
        path: "_cart",
        model: "Cart",
        populate: {
          path: "products",
          populate: { path: "_product", model: "Product" },
        },
      },
    })
    .exec();
  let orders = customer.orders;
  console.log(orders);
  if (status) {
    orders = orders.filter((order) => order.status == status);
  }
  return orders;
}

async function getOrdersByMerchantID(merchantID, status) {
  let merchant = await Merchant.findById(merchantID)
    .populate({
      path: "orders",
      populate: {
        path: "_cart",
        model: "Cart",
        populate: {
          path: "products",
          model: "StockProduct",
          populate: { path: "_product", model: "Product" },
        },
      },
    })
    .exec();
  let orders = merchant.orders;
  if (status) {
    orders = orders.filter((order) => order.status == status);
  }
  return orders;
}

async function createOrder(customerID) {
  const cart = await Cart.findOne({ _customer: customerID })
    .populate({
      path: "products",
      populate: {
        path: "_stockProduct",
        model: "StockProduct",
        populate: { path: "_product", model: "Product" },
      },
    })
    .exec();
  if (!cart.products.length) {
    const error = new Error();
    error.message = ": : Cart is empty";
    error.status = 400;
    throw error;
  }
  for (cartProduct of cart.products) {
    await updateStockQuantity({
      stockProduct: cartProduct._stockProduct._id,
      quantity: cartProduct._stockProduct.quantity - cartProduct.subQuantity,
    });
  }

  const order = await Order.create({ _cart: cart });
  await Cart.findOneAndDelete({ _customer: customerID }).exec();
  await createCart(customerID);
  return order;
}

module.exports = {
  getAllOrders,
  getOrderByID,
  getOrdersByCustomerID,
  getOrdersByMerchantID,
  createOrder,
};
