const express = require("express");
const router = express.Router();
const { loginUser } = require("./authHelpers");
const { validateLoginDetails } = require("./authMiddleware");

router.post("/login", validateLoginDetails, async (request, response, next) => {
  const accessToken = await loginUser(request.user);
  response.status(200).json({
    status: 200,
    accessToken: accessToken,
  });
});

module.exports = router;
