const mongoose = require("mongoose");
const { Order } = require("../../models/Order");
const { Customer } = require("../../models/Customer");
const { Merchant } = require("../../models/Merchant");
const { Cart } = require("../../models/Cart");
const { createCart, clearCart } = require("../carts/CartHelpers");
const { updateStockQuantity } = require("../merchants/MerchantHelpers");
const { getCustomersMerchant } = require("../customers/CustomerHelpers");

async function getAllOrders() {
  try {
    const orders = await Order.find()
      .populate({
        path: "_orderProducts",
        populate: {
          path: "stockProduct",
          model: "StockProduct",
          populate: {
            path: "_product",
            model: "Product",
          },
        },
      })
      .exec();
    for (let order of orders) {
      order = await Order.findById(order._id).populate({
        path: "_orderProducts",
        populate: {
          path: "stockProduct",
          model: "StockProduct",
          populate: {
            path: "_product",
            model: "Product",
          },
        },
      });
    }
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
    const order = await Order.findById(orderID)
      .populate({
        path: "_orderProducts",
        populate: {
          path: "stockProduct",
          model: "StockProduct",
          populate: {
            path: "_product",
            model: "Product",
          },
        },
      })
      .exec();
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
  let orders = await Order.find({ _customer: customerID })
    .populate({
      path: "_orderProducts",
      populate: {
        path: "stockProduct",
        model: "StockProduct",
        populate: {
          path: "_product",
          model: "Product",
        },
      },
    })
    .exec();
  for (let order of orders) {
    order = await Order.findById(order._id).populate({
      path: "_orderProducts",
      populate: {
        path: "stockProduct",
        model: "StockProduct",
        populate: {
          path: "_product",
          model: "Product",
        },
      },
    });
  }
  console.log(orders);
  if (status) {
    orders = orders.filter((order) => order.status == status);
  }
  return orders;
}

async function getOrdersByMerchantID(merchantID, status) {
  let orders = await Order.find({ _merchant: merchantID })
    .populate({
      path: "_orderProducts",
      populate: {
        path: "stockProduct",
        model: "StockProduct",
        populate: {
          path: "_product",
          model: "Product",
        },
      },
    })
    .exec();
  for (let order of orders) {
    order = await Order.findById(order._id).populate({
      path: "_orderProducts",
      populate: {
        path: "stockProduct",
        model: "StockProduct",
        populate: {
          path: "_product",
          model: "Product",
        },
      },
    });
  }
  if (status) {
    orders = orders.filter((order) => order.status == status);
  }
  return orders;
}

async function createOrder(customerID, data) {
  try {
    const merchant = await getCustomersMerchant(customerID);
    let totalPrice = 0;
    for (let cartProduct of data.cartProducts) {
      totalPrice +=
        cartProduct.quantity * cartProduct.stockProduct._product.price;
    }
    const order = await Order.create({
      _customer: customerID,
      _merchant: merchant._id,
      _orderProducts: data.cartProducts,
      totalPrice: totalPrice,
    });
    await Customer.findByIdAndUpdate(
      order._customer,
      {
        $push: { orders: order },
      },
      { returnDocument: "after" }
    );
    await Merchant.findByIdAndUpdate(
      order._merchant,
      {
        $push: { orders: order },
      },
      { returnDocument: "after" }
    );
    await Cart.findOneAndDelete({ _customer: customerID });
    await createCart(customerID);
    return order;
  } catch (error) {
    console.log(error);
    error.message = ": : Could not create order";
    error.status = 400;
    throw error;
  }
}

async function updateOrder(updateData) {
  const { id, data } = updateData;
  try {
    return await Order.findByIdAndUpdate(id, data, {
      returnDocument: "after",
    })
      .lean()
      .exec();
  } catch (err) {
    console.log(err);
    throw { message: ": : Order could not be found", status: 400 };
  }
}

module.exports = {
  getAllOrders,
  getOrderByID,
  getOrdersByCustomerID,
  getOrdersByMerchantID,
  createOrder,
  updateOrder,
};
