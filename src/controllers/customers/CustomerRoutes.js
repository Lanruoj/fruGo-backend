const express = require("express");
const router = express.Router();
const {
  createCustomer,
  getAllCustomers,
  getCustomerByID,
  updateCustomer,
  deleteCustomer,
  filterCustomers,
} = require("./CustomerHelpers");
const { generateAccessToken } = require("../auth/authHelpers");
const {
  authenticateUser,
  allowAdminOnly,
  allowOwnerOrAdmin,
} = require("../auth/authMiddleware");
const { filterCollection } = require("../helpers");

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

// Get list of customers with optional search query (admin only)
router.get(
  "/",
  authenticateUser,
  allowAdminOnly,
  async (request, response, next) => {
    let customers;
    try {
      if (!Object.keys(request.query).length) {
        customers = await getAllCustomers();
      } else {
        customers = await filterCollection("Customer", request.query);
      }
    } catch (err) {
      return next(err);
    }
    response.status(200).json({
      status: 200,
      customers: customers.flat(),
      accessToken: request.accessToken,
    });
  }
);

// Get customer profile by ID (owner or admin only)
router.get(
  "/:id",
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

// Update customer (owner or admin only)
router.put(
  "/:id",
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

// Delete customer (owner or admin only)
router.delete(
  "/:id",
  authenticateUser,
  allowOwnerOrAdmin,
  async (request, response, next) => {
    await deleteCustomer(request.params.id);
    response.status(204).json();
  }
);

module.exports = router;
