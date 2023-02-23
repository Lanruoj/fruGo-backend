const express = require("express");
const { createCart } = require("../carts/CartHelpers");
const router = express.Router();
const { loginUser } = require("./authHelpers");
const { validateLoginDetails } = require("./authMiddleware");

// Universal login
router.post("/login", validateLoginDetails, async (request, response, next) => {
  try {
    const accessToken = await loginUser(request.user);
    const cart = await createCart(request.user);
    response.status(200).json({
      status: 200,
      user: request.user,
      cart: cart,
      accessToken: accessToken,
    });
  } catch (error) {
    error.status = 401;
    return next(error);
  }
});

module.exports = router;
