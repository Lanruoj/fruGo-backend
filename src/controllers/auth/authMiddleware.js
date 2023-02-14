const { isEmail } = require("validator");
const { verifyJWT } = require("./authHelpers");
const { Customer } = require("../../models/Customer");
const { Merchant } = require("../../models/Merchant");
const { Admin } = require("../../models/Admin");

function validateEmail(request, response, next) {
  if (!isEmail(request.body.email)) {
    return next(new Error("Invalid email address"));
  }
  next();
}

async function authenticateUser(request, response, next) {
  let verifiedJWT;
  try {
    verifiedJWT = verifyJWT(request.body["authorization"]);
    next();
  } catch (error) {
    return next(new Error("Invalid access token"));
  }
  const decryptedUser = decryptString(verifiedJWT.payload.user);
  const userString = JSON.parse(decryptedUser);
  const userDocument =
    (await Customer.findById(user).exec()) ||
    (await Merchant.findById(user).exec()) ||
    (await Admin.findById(user).exec());
  if (
    !userDocument.email == userString.email ||
    !userDocument.password == userDocument.password
  ) {
    return next(new Error("Authentication failed"));
  }
  next();
}

module.exports = { validateEmail, authenticateUser };
