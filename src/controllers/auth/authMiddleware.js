const {
  verifyJWT,
  decryptString,
  parseJWT,
  validateHashedData,
} = require("../helpers");
const { Customer } = require("../../models/Customer");
const { Merchant } = require("../../models/Merchant");
const { Admin } = require("../../models/Admin");

async function authenticateUser(request, response, next) {
  try {
    const verifiedJWT = verifyJWT(request.headers.authorization);
    const decryptedData = decryptString(verifiedJWT.payload.user);
    const userID = JSON.parse(decryptedData);
    // Find user subtype
    const foundCustomer = await Customer.findById(userID).exec();
    const foundMerchant = await Merchant.findById(userID).exec();
    const foundAdmin = await Admin.findById(userID).exec();
    const userDocument = foundCustomer || foundMerchant || foundAdmin;
    request.user = userDocument.id;
    request.role =
      (foundCustomer && "Customer") ||
      (foundMerchant && "Merchant") ||
      (foundAdmin && "Admin") ||
      null;
    request.accessToken = parseJWT(request.headers.authorization);
    next();
  } catch (error) {
    error.message = ": : User authentication failed";
    error.status = 401;
    return next(error);
  }
}

async function allowAdminOnly(request, response, next) {
  if (request.role !== "Admin") {
    const notAdmin = new Error();
    notAdmin.message = ": : Must be an administrator to perform this task";
    notAdmin.status = 401;
    return next(notAdmin);
  }
  next();
}

async function allowOwnerOrAdmin(request, response, next) {
  if (request.user != request.params.id && request.role !== "Admin") {
    const error = new Error();
    error.message = ": : Unauthorised";
    error.status = 401;
    return next(error);
  }
  next();
}

async function validateLoginDetails(request, response, next) {
  const foundCustomer = await Customer.findOne({
    email: request.body.email,
  })
    .select("+password")
    .exec();
  const foundMerchant = await Merchant.findOne({
    email: request.body.email,
  })
    .select("+password")
    .exec();
  const foundAdmin = await Admin.findOne({
    email: request.body.email,
  })
    .select("+password")
    .exec();
  const foundUser = foundCustomer || foundMerchant || foundAdmin;
  if (!foundUser) {
    const error = new Error(": : Email address does not exist");
    error.status = 401;
    return next(error);
  }
  const passwordIsValid = await validateHashedData(
    request.body.password,
    foundUser.password
  );
  if (!passwordIsValid) {
    const error = new Error(": : Invalid password");
    error.status = 401;
    return next(error);
  }
  request.user = foundUser._id;
  request.role =
    (foundCustomer && "Customer") ||
    (foundMerchant && "Merchant") ||
    (foundAdmin && "Admin") ||
    null;
  next();
}

module.exports = {
  authenticateUser,
  allowAdminOnly,
  validateLoginDetails,
  allowOwnerOrAdmin,
};
