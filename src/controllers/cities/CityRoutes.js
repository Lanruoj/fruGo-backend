const express = require("express");
const { getAllCities } = require("./CityHelpers");
const router = express.Router();

router.get("/", async (request, response, next) => {
  const result = await getAllCities();
  response.status(200).json({
    status: 200,
    data: result,
  });
});

module.exports = router;
