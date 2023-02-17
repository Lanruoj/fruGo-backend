const { verifyJWT } = require("./authHelpers");
const { Customer } = require("../../models/Customer");
const { Merchant } = require("../../models/Merchant");
const { Admin } = require("../../models/Admin");

async function authenticateUser(request, response, next) {
  let verifiedJWT;
  try {
    verifiedJWT = verifyJWT(request.headers["authorization"]);
  } catch (error) {
    return next(new Error("Invalid access token"));
  }
  const decryptedUser = decryptString(verifiedJWT.payload.user);
  const userObject = JSON.parse(decryptedUser);
  // Find user subtype
  const foundCustomer = await Customer.findById(userObject._id).exec();
  const foundMerchant = await Merchant.findById(userObject._id).exec();
  const foundAdmin = await Admin.findById(userObject._id).exec();
  const userDocument = foundCustomer || foundMerchant || foundAdmin;
  if (
    !userDocument.email == userObject.email ||
    !userDocument.password == userObject.password
  ) {
    const error = new Error("Authentication failed");
    error.status = 401;
    return next(error);
  }
  request.user = userDocument._id;
  request.role = userDocument.modelName;
  next();
}

// async function allowAdminOnly(request, response, next) {
//   request.headers["authorization"];
// }

module.exports = { authenticateUser };
