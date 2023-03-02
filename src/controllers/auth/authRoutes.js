const express = require("express");
const router = express.Router();
const { loginUser, logoutUser } = require("./authHelpers");
const { validateLoginDetails, authenticateUser } = require("./authMiddleware");

// Universal login
router.post("/login", validateLoginDetails, async (request, response, next) => {
  try {
    const { user, merchant, accessToken } = await loginUser(
      request.user,
      request.role
    );
    const responseObject = {
      status: 200,
      message: "You have been logged in",
      user: user,
      role: request.role,
      accessToken: accessToken,
    };
    if (merchant) responseObject.merchant = merchant;
    response.status(200).json(responseObject);
  } catch (error) {
    error.status = 401;
    console.log(error);
    return next(error);
  }
});

// Universal logout
router.post("/logout", authenticateUser, async (request, response, next) => {
  try {
    const user = await logoutUser(request.user, request.role);
    response
      .status(200)
      .json({ status: 200, message: "You have been logged out", user: user });
  } catch (error) {
    error.status = 401;
    console.log(error);
    return next(error);
  }
});

module.exports = router;
