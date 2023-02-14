const { isEmail } = require("validator");

function validateEmail(request, response, next) {
  if (!isEmail(request.body.email)) {
    return next(new Error("Invalid email address"));
  }

  next();
}

function generateJWT(request, response, next) {}

module.exports = { validateEmail };
