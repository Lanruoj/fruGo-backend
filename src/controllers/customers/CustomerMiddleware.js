const { Customer } = require("../../models/Customer");

async function validateCustomerLogin(request, response, next) {
  const foundCustomer = await Customer.find({
    email: request.body.email,
  }).exec();
  if (!foundCustomer) throw new Error("Email is incorrect");
  if (!foundCustomer.password == request.body.password) {
    throw new Error("Password is incorrect");
  }
  next();
}

module.exports = { validateCustomerLogin };
