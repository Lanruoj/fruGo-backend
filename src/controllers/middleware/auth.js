const { isEmail } = require("validator");

function validateEmail(error, request, response, next) {
  if (!isEmail(request.body.email)) {
    return next(new Error(error));
  }

  next();
}

module.exports = { validateEmail };
