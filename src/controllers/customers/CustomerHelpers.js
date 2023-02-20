const { Customer } = require("../../models/Customer");
const { generateAccessToken } = require("../auth/authHelpers");

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

async function loginCustomer(userID) {
  const token = await generateAccessToken(userID);
  return token;
}

module.exports = { createCustomer, getAllCustomers, loginCustomer };
