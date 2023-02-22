const { omit } = require("underscore");
const { Merchant } = require("../../models/Merchant");
const { StockProduct } = require("../../models/StockProduct");

async function createMerchant(data) {
  let newMerchant;
  try {
    newMerchant = await Merchant.create(data);
  } catch (error) {
    error.status = 400;
    throw new Error(error);
  }
  return newMerchant;
}

async function getMerchantByID(merchantID) {
  let result;
  try {
    result = await Merchant.findById(merchantID).exec();
  } catch (error) {
    throw {
      message: `: : No merchants found with ID ${merchantID}`,
      status: 404,
    };
  }
  return result;
}

async function getMerchantStock(merchantID) {
  let merchant, stock;
  try {
    merchant = await Merchant.findById(merchantID)
      .populate({
        path: "stock",
        populate: {
          path: "_product",
          model: "Product",
        },
      })
      .exec();
    stock = merchant.stock;
  } catch (error) {
    throw {
      message: `: : No merchants found with ID ${merchantID}`,
      status: 404,
    };
  }
  return stock;
}

async function updateMerchant(updateData) {
  const { id, data } = updateData;
  let originalMerchant;
  try {
    originalMerchant = await Merchant.findByIdAndUpdate(id, data, {
      returnDocument: "before",
    })
      .lean()
      .exec();
  } catch (err) {
    console.log(err);
    throw { message: ": : Merchant could not be found", status: 400 };
  }
  const updatedMerchant = await Merchant.findById(id).lean().exec();
  const updatedFields = omit(updatedMerchant, (value, field) => {
    return originalMerchant[field]?.toString() === value?.toString();
  });
  // MAY NOT NEED... /////////////////////////////////////////////
  if (!Object.keys(updatedFields).length) {
    throw { message: ": : No updates specified", status: 400 };
  }
  if (updatedFields.password) {
    updatedFields.password = "Password updated";
  }
  return {
    updatedMerchant: updatedMerchant,
    updatedFields: updatedFields,
  };
}

async function updateMerchantStock(updateData) {
  let { _merchant, quantity } = updateData;
  let originalStockProduct;
  try {
    originalStockProduct = await StockProduct.findOneAndUpdate(
      { _merchant: _merchant },
      {
        quantity: quantity,
      },
      {
        returnDocument: "before",
      }
    )
      .lean()
      .exec();
  } catch (err) {
    throw { message: ": : Merchant could not be found", status: 400 };
  }
  const updatedStockProduct = await StockProduct.findOne({
    _merchant: _merchant,
  })
    .lean()
    .exec();
  const updatedFields = omit(updatedStockProduct, (value, field) => {
    return originalStockProduct[field]?.toString() === value?.toString();
  });
  // MAY NOT NEED... /////////////////////////////////////////////
  if (!Object.keys(updatedFields).length) {
    throw { message: ": : No updates specified", status: 400 };
  }
  if (updatedFields.password) {
    updatedFields.password = "Password updated";
  }
  return {
    updatedStockProduct: updatedStockProduct,
    updatedFields: updatedFields,
  };
}

module.exports = {
  getMerchantByID,
  createMerchant,
  getMerchantStock,
  updateMerchant,
  updateMerchantStock,
};
