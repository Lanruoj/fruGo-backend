const express = require("express");
const router = express.Router();
const { createCustomer } = require("./CustomerHelpers");

router.post("/register", async (request, response) => {
  const newCustomer = await createCustomer({
    email: request.body.email,
    password: request.body.password,
    username: request.body.password,
    firstName: request.body.firstName,
    lastName: request.body.lastName,
    streetAddress: request.body.streetAddress,
    city: request.body.city,
  });

  response.json({ customer: newCustomer });
});

module.exports = router;
