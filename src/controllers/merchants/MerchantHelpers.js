const { Merchant } = require("../../models/Merchant");

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

module.exports = { getMerchantByID, createMerchant, getMerchantStock };
