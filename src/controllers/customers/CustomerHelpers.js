const { omit } = require("underscore");
const { Customer } = require("../../models/Customer");
const { City } = require("../../models/City");
const { Merchant } = require("../../models/Merchant");

async function createCustomer(data) {
  try {
    const cityExists = await City.findById(data._city).exec();
    if (!cityExists) {
      throw {
        message: `: : Invalid city [${data._city}]`,
        status: 404,
      };
    }
    const customer = await Customer.create(data);
    return customer;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getCustomerByID(customerID) {
  let customer;
  try {
    customer = await Customer.findById(customerID).exec();
  } catch (error) {
    throw {
      message: `: : No customer found with ID of ${customerID}`,
      status: 404,
    };
  }
  return customer;
}

async function updateCustomer(updateData) {
  const { id, data } = updateData;
  try {
    return await Customer.findByIdAndUpdate(id, data, {
      returnDocument: "before",
    })
      .lean()
      .exec();
  } catch (err) {
    throw { message: ": : Customer could not be found", status: 400 };
  }
}

async function deleteCustomer(customerID) {
  return await Customer.findByIdAndDelete(customerID).exec();
}

async function getCustomersMerchant(customerID) {
  const customer = await Customer.findById(customerID).exec();
  return await Merchant.findOne({ _city: customer._city });
}

module.exports = {
  createCustomer,
  getCustomerByID,
  updateCustomer,
  deleteCustomer,
  getCustomersMerchant,
};
