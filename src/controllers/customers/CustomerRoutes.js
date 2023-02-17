const express = require("express");
const router = express.Router();
const { createCustomer, getAllCustomers } = require("./CustomerHelpers");
const { generateAccessToken } = require("../auth/authHelpers");

// Register a new customer
router.post("/register", async (request, response, next) => {
  let newCustomer;
  try {
    newCustomer = await createCustomer({
      email: request.body.email,
      password: request.body.password,
      username: request.body.username,
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      streetAddress: request.body.streetAddress,
      city: request.body.city,
    });
  } catch (error) {
    error.status = 422;
    return next(error);
  }
  const accessToken = await generateAccessToken(newCustomer._id);
  response
    .status(201)
    .json({ customer: newCustomer, accessToken: accessToken });
});

// Get all customers (admin only)
router.get("/", async (request, response, next) => {
  const customers = await getAllCustomers();
  response.status(200).json({
    customers: customers,
    accessToken: request.headers["authorization"],
  });
});

module.exports = router;
