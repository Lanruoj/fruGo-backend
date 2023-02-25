const { Product } = require("../../models/Product");

async function getProductByID(productID) {
  return await Product.findById(productID).exec();
}

module.exports = { getProductByID };
