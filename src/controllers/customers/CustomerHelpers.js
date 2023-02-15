const { Customer } = require("../../models/Customer");
const { hashString, emailExists } = require("../auth/authHelpers");

async function customerEmailExists(email) {
  const foundEmail = await Customer.findOne({ email: email }).exec();
  return foundEmail;
}

async function createCustomer(data) {
  if (await customerEmailExists(data.email))
    throw new Error("Email is already in use");

  const customerData = {
    email: data.email,
    password: await hashString(data.password),
    username: data.username,
    firstName: data.firstName,
    lastName: data.lastName,
    streetAddress: data.streetAddress,
    city: data.city,
  };
  return await Customer.create(customerData);
}

module.exports = { createCustomer };
