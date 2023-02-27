const { Order } = require("../../models/Order");
const { Customer } = require("../../models/Customer");

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
          model: "StockProduct",
          populate: { path: "_product", model: "Product" },
        },
      },
    })
    .exec();
  let orders = customer.orders;
  if (status) {
    orders = orders.filter((order) => order.status == status);
  }
  return orders;
}

module.exports = { getAllOrders, getOrderByID, getOrdersByCustomerID };
