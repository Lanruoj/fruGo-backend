const { Order } = require("../../models/Order");
const { Cart } = require("../../models/Cart");
const { Customer } = require("../../models/Customer");
const { filterCollection } = require("../helpers");

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

async function getAllOrdersByCustomerID(customerID, status) {
  return await Customer.findById(customerID)
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
}

module.exports = { getAllOrders, getOrderByID, getAllOrdersByCustomerID };
