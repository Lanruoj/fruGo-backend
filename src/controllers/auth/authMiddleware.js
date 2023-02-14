const { isEmail } = require("validator");
const { verifyJWT } = require("./authHelpers");

function validateEmail(request, response, next) {
  if (!isEmail(request.body.email)) {
    return next(new Error("Invalid email address"));
  }

  next();
}

async function authenticateUser(request, response, next) {
  let verifiedToken;
  try {
    verifiedToken = verifyJWT(request.body["authorization"]);
    next();
  } catch (error) {
    return next(new Error("Invalid access token"));
  }
}

module.exports = { validateEmail, authenticateUser };
