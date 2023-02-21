const express = require("express");
const router = express.Router();
const {
  createCustomer,
  getAllCustomers,
  getCustomerByID,
  updateCustomer,
} = require("./CustomerHelpers");
const { generateAccessToken } = require("../auth/authHelpers");
const {
  authenticateUser,
  allowAdminOnly,
  allowOwnerOrAdmin,
} = require("../auth/authMiddleware");

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
    .json({ status: 201, customer: newCustomer, accessToken: accessToken });
});

// Get all customers (admin only)
router.get(
  "/",
  authenticateUser,
  allowAdminOnly,
  async (request, response, next) => {
    const customers = await getAllCustomers();
    response.status(200).json({
      customers: customers,
      accessToken: request.accessToken,
    });
  }
);

// Get customer profile by ID (own profile or admin only)
router.get(
  "/profile/:id",
  authenticateUser,
  allowOwnerOrAdmin,
  async (request, response, next) => {
    const customer = await getCustomerByID(request.params.id);
    response.status(200).json({
      profile: customer,
      accessToken: request.accessToken,
    });
  }
);

// Update customer (own profile or admin only)
router.put(
  "/profile/:id",
  authenticateUser,
  allowOwnerOrAdmin,
  async (request, response, next) => {
    let result = {};
    try {
      result = await updateCustomer({
        id: request.params.id,
        data: request.body,
      });
    } catch (error) {
      error.status = 400;
      return next(error);
    }
    response.status(200).json({
      status: 200,
      updates: result.updatedFields,
      accessToken: request.accessToken,
    });
  }
);

module.exports = router;
