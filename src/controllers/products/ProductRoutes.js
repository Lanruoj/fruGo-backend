const express = require("express");
const { filterCollection } = require("../helpers");
const router = express.Router();

router.get("/", async (request, response, next) => {
  try {
    const result = await filterCollection("Product", request.query);
    response.status(200).json({
      status: 200,
      data: result,
      accessToken: request.accessToken,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
