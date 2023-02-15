const express = require("express");
const router = express.Router();
const { createCustomer } = require("./CustomerHelpers");
const { validateEmail } = require("../auth/authMiddleware");
const { generateAccessToken } = require("../auth/authHelpers");

router.post("/register", validateEmail, async (request, response) => {
  let newCustomer;
  try {
    newCustomer = await createCustomer({
      email: request.body.email,
      password: request.body.password,
      username: request.body.password,
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      streetAddress: request.body.streetAddress,
      city: request.body.city,
    });
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
  const accessToken = await generateAccessToken({ customer: newCustomer._id });

  response
    .status(201)
    .json({ customer: newCustomer, accessToken: accessToken });
});

module.exports = router;
