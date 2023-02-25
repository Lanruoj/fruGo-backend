const express = require("express");
const { filterCollection } = require("../helpers");
const { getProductByID } = require("./ProductHelpers");
const router = express.Router();

router.get("/", async (request, response, next) => {
  try {
    const result = await filterCollection("Product", request.query);
    response.status(200).json({
      status: 200,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (request, response, next) => {
  try {
    const result = await getProductByID(request.params.id);
    response.status(200).json({
      status: 200,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
