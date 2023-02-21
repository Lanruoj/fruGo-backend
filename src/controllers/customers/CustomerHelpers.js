const { Customer } = require("../../models/Customer");
const { omit } = require("underscore");

async function createCustomer(data) {
  const customerData = {
    email: data.email,
    password: data.password,
    username: data.username,
    firstName: data.firstName,
    lastName: data.lastName,
    streetAddress: data.streetAddress,
    city: data.city,
  };
  return await Customer.create(customerData);
}

async function getAllCustomers() {
  const customers = await Customer.find({}).exec();
  return customers;
}

async function getCustomerByID(customerID) {
  let customer;
  try {
    customer = await Customer.findById(customerID).exec();
  } catch (error) {
    throw new Error(error);
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
      .lean()
      .exec();
  } catch (err) {
    throw { message: ": : Customer could not be found", status: 400 };
  }
  const updatedCustomer = await Customer.findById(id).lean().exec();
  const updatedFields = omit(updatedCustomer, (value, field) => {
    return originalCustomer[field]?.toString() === value?.toString();
  });
  // MAY NOT NEED... /////////////////////////////////////////////
  if (!Object.keys(updatedFields).length) {
    throw { message: ": : No updates specified", status: 400 };
  }
  return {
    updatedCustomer: updatedCustomer,
    updatedFields: updatedFields,
  };
}

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerByID,
  updateCustomer,
};
