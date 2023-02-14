const { isEmail } = require("validator");

function validateEmail(request, response, next) {
  if (!isEmail(request.body.email)) {
    return next(new Error("Invalid email address"));
  }

  next();
}

module.exports = { validateEmail };
