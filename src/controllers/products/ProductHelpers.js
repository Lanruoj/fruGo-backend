const { omit } = require("underscore");
const { Product } = require("../../models/Product");

async function getProductByID(productID) {
  const product = await Product.findById(productID).exec();
  if (!product) {
    throw {
      message: ": : Product could not be found",
      status: 404,
    };
  }
  return product;
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

async function updateProduct(updateData) {
  const { id, data } = updateData;
  let originalProduct;
  try {
    originalProduct = await Product.findByIdAndUpdate(id, data, {
      returnDocument: "before",
    })
      .lean()
      .exec();
  } catch (err) {
    console.log(err);
    throw { message: ": : Product could not be found", status: 400 };
  }
  const updatedProduct = await Product.findById(id).lean().exec();
  const updatedFields = omit(updatedProduct, (value, field) => {
    return originalProduct[field]?.toString() === value?.toString();
  });
  // MAY NOT NEED... /////////////////////////////////////////////
  if (!Object.keys(updatedFields).length) {
    throw { message: ": : No updates specified", status: 400 };
  }
  return {
    updatedProduct: updatedProduct,
    updatedFields: updatedFields,
  };
}

async function deleteProduct(data) {
  try {
    const product = await Product.findByIdAndDelete(data);
    return product;
  } catch (error) {
    console.log(error);
    throw {
      message: ": : Product could not be deleted",
      status: 400,
    };
  }
}

module.exports = {
  getProductByID,
  createProduct,
  deleteProduct,
  updateProduct,
};
