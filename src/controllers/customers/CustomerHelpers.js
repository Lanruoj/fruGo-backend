const { omit } = require("underscore");
const mongoose = require("mongoose");
const { Customer } = require("../../models/Customer");
const { City } = require("../../models/City");

async function createCustomer(data) {
  try {
    const cityID = data._city;
    const cityExists = await City.findById(cityID).exec();
    if (!cityExists) {
      throw {
        message: `: : Invalid city [${cityID}]`,
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

async function getAllCustomers() {
  return await Customer.find({}).exec();
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
  let originalCustomer;
  try {
    originalCustomer = await Customer.findByIdAndUpdate(id, data, {
      returnDocument: "before",
    })
      .select("+password")
      .lean()
      .exec();
  } catch (err) {
    throw { message: ": : Customer could not be found", status: 400 };
  }
  const updatedCustomer = await Customer.findById(id)
    .select("+password")
    .lean()
    .exec();
  const updatedFields = omit(updatedCustomer, (value, field) => {
    return originalCustomer[field]?.toString() === value?.toString();
  });
  // MAY NOT NEED... /////////////////////////////////////////////
  if (!Object.keys(updatedFields).length) {
    throw { message: ": : No updates specified", status: 400 };
  }
  if (updatedFields.password) {
    updatedFields.password = "Password updated";
  }
  return {
    updatedCustomer: updatedCustomer,
    updatedFields: updatedFields,
  };
}

async function deleteCustomer(customerID) {
  return await Customer.findByIdAndDelete(customerID).exec();
}

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerByID,
  updateCustomer,
  deleteCustomer,
};
