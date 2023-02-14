const { Customer } = require("../../models/Customer");
const { hashString } = require("../auth/authHelpers");

async function createCustomer(data) {
  const customerData = {
    email: data.email,
    password: await hashString(data.password),
    username: data.username,
    firstName: data.firstName,
    lastName: data.lastName,
    streetAddress: data.streetAddress,
    city: data.city,
  };
  return await Customer.create(data);
}

module.exports = { createCustomer };
