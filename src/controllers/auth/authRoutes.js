const express = require("express");
const router = express.Router();
const { loginUser } = require("./authHelpers");
const { validateLoginDetails } = require("./authMiddleware");

// Universal login
router.post("/login", validateLoginDetails, async (request, response, next) => {
  try {
    const { user, cart, accessToken } = await loginUser(
      request.user,
      request.role
    );
    const responseObject = {
      status: 200,
      user: user,
      accessToken: accessToken,
    };
    if (cart) responseObject.cart = cart;
    response.status(200).json(responseObject);
  } catch (error) {
    error.status = 401;
    console.log(error);
    return next(error);
  }
});

module.exports = router;
