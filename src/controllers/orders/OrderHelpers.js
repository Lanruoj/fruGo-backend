const { Order } = require("../../models/Order");
const { Customer } = require("../../models/Customer");
const { Merchant } = require("../../models/Merchant");
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
  let totalPrice = 0;
  let cartProducts = [];
  for (let cartProduct of cart.products) {
    totalPrice +=
      cartProduct.subQuantity * cartProduct._stockProduct._product.price;
    cartProducts.push(cartProduct);
  }
  cart.totalPrice = totalPrice;
  cart.save();
  const order = await Order.create({ _cart: cart });
  return order;
}

module.exports = {
  getAllOrders,
  getOrderByID,
  getOrdersByCustomerID,
  getOrdersByMerchantID,
  createOrder,
};
