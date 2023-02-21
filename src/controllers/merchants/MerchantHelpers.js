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

module.exports = { getMerchantByID, createMerchant };
