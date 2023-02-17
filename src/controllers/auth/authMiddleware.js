const { verifyJWT, decryptString } = require("./authHelpers");
const { Customer } = require("../../models/Customer");
const { Merchant } = require("../../models/Merchant");
const { Admin } = require("../../models/Admin");

async function authenticateUser(request, response, next) {
  let verifiedJWT;
  try {
    verifiedJWT = verifyJWT(request.headers.authorization);
  } catch (error) {
    error.status = 401;
    return next(error);
  }
  const decryptedData = decryptString(verifiedJWT.payload.user);
  const userID = JSON.parse(decryptedData);
  // Find user subtype
  const foundCustomer = await Customer.findById(userID).exec();
  const foundMerchant = await Merchant.findById(userID).exec();
  const foundAdmin = await Admin.findById(userID).exec();
  const userDocument = foundCustomer || foundMerchant || foundAdmin;
  request.user = userDocument._id;
  request.role =
    (foundCustomer && "customer") ||
    (foundMerchant && "merchant") ||
    (foundAdmin && "admin") ||
    null;
  next();
}

async function allowAdminOnly(request, response, next) {
  if (request.role !== "admin") {
    const notAdmin = new Error("Must be an adminstrator to perform this task");
    notAdmin.status = 401;
    return next(notAdmin);
  }

  next();
}

module.exports = { authenticateUser, allowAdminOnly };
