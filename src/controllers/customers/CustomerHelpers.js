const { Customer } = require("../../models/Customer");

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

module.exports = { createCustomer, getAllCustomers, getCustomerByID };
