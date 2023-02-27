const { Order } = require("../../models/Order");
const { Cart } = require("../../models/Cart");

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
    throw {
      message: ": : Order not found",
      status: 404,
    };
  }
}

module.exports = { getAllOrders };
