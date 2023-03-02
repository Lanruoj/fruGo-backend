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
const {
  getCartByCustomerID,
  addToCart,
  removeFromCart,
  updateCartProductQuantity,
} = require("../carts/CartHelpers");
const { loginUser } = require("../auth/authHelpers");
const { getOrdersByCustomerID } = require("../orders/OrderHelpers");

// Register a new customer
router.post("/register", async (request, response, next) => {
  try {
    const newCustomer = await createCustomer(request.body);
    const { user, cart, merchant, accessToken } = await loginUser(
      newCustomer._id,
      "Customer"
    );
    response.status(201).json({
      status: 201,
      user: user,
      cart: cart,
      merchant: merchant,
      role: "Customer",
      accessToken: accessToken,
    });
  } catch (error) {
    error.status = 422;
    console.log(error);
    return next(error);
  }
});

// Get list of customers with optional search query (admin only)
router.get(
  "/",
  authenticateUser,
  allowAdminOnly,
  async (request, response, next) => {
    try {
      const result = await filterCollection("Customer", request.query);
      response.status(200).json({
        status: 200,
        result: result.flat(),
      });
    } catch (err) {
      return next(err);
    }
  }
);

// Get customer profile by ID (owner or admin only)
router.get(
  "/:id",
  authenticateUser,
  allowOwnerOrAdmin,
  async (request, response, next) => {
    try {
      const result = await getCustomerByID(request.params.id);
      response.status(200).json({
        result: result,
      });
    } catch (err) {
      return next(err);
    }
  }
);

// Update customer (owner or admin only)
router.put(
  "/:id",
  authenticateUser,
  allowOwnerOrAdmin,
  async (request, response, next) => {
    try {
      const result = await updateCustomer({
        id: request.params.id,
        data: request.body,
      });
      response.status(200).json({
        status: 200,
        message: "Customer updated",
      });
    } catch (error) {
      error.status = 400;
      return next(error);
    }
  }
);

// Delete customer (owner or admin only)
router.delete(
  "/:id",
  authenticateUser,
  allowOwnerOrAdmin,
  async (request, response, next) => {
    await deleteCustomer(request.params.id);
    response.status(204).json({
      status: 204,
      message: "Customer deleted",
    });
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
        data: cart,
      });
    } catch (error) {
      return next(error);
    }
  }
);

router.post(
  "/:id/cart/products",
  authenticateUser,
  allowOwnerOrAdmin,
  async (request, response, next) => {
    try {
      const updatedCart = await addToCart(
        request.params.id,
        request.body.product
      );
      response.status(200).json({
        status: 200,
        message: "Product added to cart",
        data: updatedCart,
      });
    } catch (error) {
      return next(error);
    }
  }
);

router.put(
  "/:id/cart/products",
  authenticateUser,
  allowOwnerOrAdmin,
  async (request, response, next) => {
    try {
      const updatedCart = await updateCartProductQuantity(
        request.params.id,
        request.body.product,
        request.body.quantity
      );
      response.status(200).json({
        status: 200,
        message: "Product added to cart",
      });
    } catch (error) {
      return next(error);
    }
  }
);

router.delete(
  "/:id/cart/products",
  authenticateUser,
  allowOwnerOrAdmin,
  async (request, response, next) => {
    try {
      const updatedCart = await removeFromCart(
        request.params.id,
        request.body.product
      );
      response.status(200).json({
        status: 200,
        message: "Product removed from cart",
      });
    } catch (error) {
      return next(error);
    }
  }
);

router.get(
  "/:id/orders/",
  authenticateUser,
  allowOwnerOrAdmin,
  async (request, response, next) => {
    try {
      const result = await getOrdersByCustomerID(
        request.params.id,
        request.query.status
      );
      response.status(200).json({
        status: 200,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;
