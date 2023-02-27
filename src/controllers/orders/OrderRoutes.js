const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../auth/authMiddleware");
const { filterCollection } = require("../helpers");
const { getAllOrders, getOrderByID } = require("./OrderHelpers");

router.get("/", authenticateUser, async (request, response, next) => {
  try {
    const result = await getAllOrders();
    response.status(200).json({
      status: 200,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", authenticateUser, async (request, response, next) => {
  try {
    const result = await getOrderByID(request.params.id);
    response.status(200).json({
      status: 200,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
