const express = require("express");
const router = express.Router();
const { loginUser } = require("./authHelpers");
const { validateLoginDetails } = require("./authMiddleware");

// Universal login
router.post("/login", validateLoginDetails, async (request, response, next) => {
  const accessToken = await loginUser(request.user);
  response.status(200).json({
    status: 200,
    user: request.user,
    accessToken: accessToken,
  });
});

module.exports = router;
