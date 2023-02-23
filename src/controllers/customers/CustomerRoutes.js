const express = require("express");
const router = express.Router();
const {
  createCustomer,
  getCustomerByID,
  updateCustomer,
  deleteCustomer,
} = require("./CustomerHelpers");
const {
  authenticateUser,
  allowAdminOnly,
  allowOwnerOrAdmin,
} = require("../auth/authMiddleware");
const { filterCollection } = require("../helpers");
const { getCartByCustomerID } = require("../carts/CartHelpers");
const { loginUser } = require("../auth/authHelpers");

// Register a new customer
router.post("/register", async (request, response, next) => {
  let newCustomer;
  try {
    newCustomer = await createCustomer(request.body);
  } catch (error) {
    error.status = 422;
    console.log(error);
    return next(error);
  }
  const { user, cart, accessToken } = await loginUser(
    newCustomer._id,
    "Customer"
  );
  response
    .status(201)
    .json({ status: 201, user: user, cart: cart, accessToken: accessToken });
});

// Get list of customers with optional search query (admin only)
router.get(
  "/",
  authenticateUser,
  allowAdminOnly,
  async (request, response, next) => {
    let result;
    try {
      result = await filterCollection("Customer", request.query);
    } catch (err) {
      return next(err);
    }
    response.status(200).json({
      status: 200,
      result: result.flat(),
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
    let result;
    try {
      result = await getCustomerByID(request.params.id);
    } catch (err) {
      return next(err);
    }
    response.status(200).json({
      result: result,
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

// Get customer's cart
router.get(
  "/:id/cart",
  authenticateUser,
  allowOwnerOrAdmin,
  async (request, response, next) => {
    try {
      const cart = await getCartByCustomerID(request.params.id);
      response.status(200).json({
        status: 200,
        cart: cart,
        accessToken: request.accessToken,
      });
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;
