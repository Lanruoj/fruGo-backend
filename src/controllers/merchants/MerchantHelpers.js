const { Merchant } = require("../../models/Merchant");

async function getMerchantByID(merchantID) {
  let result;
  try {
    result = await Merchant.findById(merchantID).exec();
  } catch (err) {
    throw {
      message: `: : No merchants found with ID ${merchantID}`,
      status: 404,
    };
  }
  return result;
}

module.exports = { getMerchantByID };
