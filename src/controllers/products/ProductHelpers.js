const { Product } = require("../../models/Product");

async function getProductByID(productID) {
  return await Product.findById(productID).exec();
}

async function createProduct(data) {
  try {
    const newProduct = await Product.create(data);
    return newProduct;
  } catch (error) {
    console.log(error);
    throw {
      message: ": : Product could not be created",
      status: 400,
    };
  }
}

module.exports = { getProductByID, createProduct };
