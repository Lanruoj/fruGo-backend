const { Order } = require("../../models/Order");
const { Customer } = require("../../models/Customer");
const { Merchant } = require("../../models/Merchant");
const { Cart } = require("../../models/Cart");
const { createCart, clearCart } = require("../carts/CartHelpers");
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
  let orders = await Order.find({ _customer: customerID }).exec();
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
      path: "_cartProducts",
      populate: {
        path: "_stockProduct",
        model: "StockProduct",
        populate: { path: "_product", model: "Product" },
      },
    })
    .exec();
  if (!cart._cartProducts.length) {
    const error = new Error();
    error.message = ": : Cart is empty";
    error.status = 400;
    throw error;
  }
  for (cartProduct of cart._cartProducts) {
    await updateStockQuantity({
      stockProduct: cartProduct._stockProduct._id,
      quantity: cartProduct._stockProduct.quantity - cartProduct.subQuantity,
    });
  }
  const merchant = await getCustomersMerchant(customerID);
  const order = await Order.create({
    _customer: customerID,
    _merchant: merchant._id,
    _orderProducts: cart._cartProducts,
  });
  console.log("order" + order);
  await Customer.findByIdAndUpdate(
    order._customer,
    {
      $push: { orders: order },
    },
    { returnDocument: "after" }
  );
  await Merchant.findByIdAndUpdate(
    order._customer_merchant,
    {
      $push: { orders: order },
    },
    { returnDocument: "after" }
  );
  await Cart.findOneAndDelete({ _customer: customerID });
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
