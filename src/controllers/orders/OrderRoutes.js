const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../auth/authMiddleware");
const { filterCollection } = require("../helpers");
const { getAllOrders } = require("./OrderHelpers");

router.get("/", authenticateUser, async (request, response, next) => {
  try {
    const result = await getAllOrders(request.params.id);
    response.status(200).json({
      status: 200,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
