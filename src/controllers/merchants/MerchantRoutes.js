const express = require("express");
const router = express.Router();
const { filterCollection } = require("../helpers");
const { getMerchantByID } = require("./MerchantHelpers");

router.get("/", async (request, response, next) => {
  let result;
  try {
    result = await filterCollection("Merchant", request.query);
  } catch (err) {
    return next(err);
  }
  response.status(200).json({
    status: 200,
    result: result,
    accessToken: request.accessToken || null,
  });
});

router.get("/:id", async (request, response, next) => {
  let result;
  try {
    result = await getMerchantByID(request.params.id);
  } catch (err) {
    return next(err);
  }
  response.status(200).json({
    status: 200,
    result: result,
    accessToken: request.accessToken || null,
  });
});

module.exports = router;
