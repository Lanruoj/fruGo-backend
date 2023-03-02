const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  allowAdminOnly,
  verifyOwnerOfOrder,
} = require("../auth/authMiddleware");
const { filterCollection } = require("../helpers");
const {
  getAllOrders,
  getOrderByID,
  createOrder,
  updateOrder,
} = require("./OrderHelpers");

router.get(
  "/",
  authenticateUser,
  allowAdminOnly,
  async (request, response, next) => {
    try {
      const result = await getAllOrders();
      response.status(200).json({
        status: 200,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }
);

router.get(
  "/:id",
  authenticateUser,
  verifyOwnerOfOrder,
  async (request, response, next) => {
    try {
      const result = await getOrderByID(request.params.id);
      response.status(200).json({
        status: 200,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }
);

router.post("/", authenticateUser, async (request, response, next) => {
  try {
    const result = await createOrder(request.user, request.body);
    response.status(200).json({
      status: 200,
      message: "Order created",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
});

router.put(
  "/:id",
  authenticateUser,
  verifyOwnerOfOrder,
  async (request, response, next) => {
    try {
      const result = await updateOrder({
        id: request.params.id,
        data: request.body,
      });
      response.status(200).json({
        status: 200,
        message: "Order updated",
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;
