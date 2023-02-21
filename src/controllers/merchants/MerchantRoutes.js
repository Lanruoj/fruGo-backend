const express = require("express");
const router = express.Router();
const { filterCollection } = require("../helpers");

router.get("/", async (request, response, next) => {
  let results;
  try {
    results = await filterCollection("Merchant", request.query);
  } catch (err) {
    return next(err);
  }
  response.status(200).json({
    status: 200,
    results: results,
    accessToken: request.accessToken || null,
  });
});

module.exports = router;
