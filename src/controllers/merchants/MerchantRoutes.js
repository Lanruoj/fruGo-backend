const express = require("express");
const router = express.Router();
const { filterCollection } = require("../helpers");
const { createMerchant, getMerchantByID } = require("./MerchantHelpers");
const { authenticateUser, allowAdminOnly } = require("../auth/authMiddleware");
const { parseJWT } = require("../auth/authHelpers");

router.post(
  "/register",
  authenticateUser,
  allowAdminOnly,
  async (request, response, next) => {
    let newMerchant;
    try {
      newMerchant = await createMerchant(request.body);
    } catch (error) {
      return next(error);
    }
    response.status(201).json({
      status: 201,
      newMerchant: newMerchant,
      accessToken: request.accessToken,
    });
  }
);

router.get("/", async (request, response, next) => {
  let result;
  try {
    result = await filterCollection("Merchant", request.query);
  } catch (error) {
    return next(error);
  }
  response.status(200).json({
    status: 200,
    result: result.flat(),
    accessToken: parseJWT(request.headers.authorization) || null,
  });
});

router.get("/:id", async (request, response, next) => {
  let result;
  try {
    result = await getMerchantByID(request.params.id);
  } catch (error) {
    return next(error);
  }
  response.status(200).json({
    status: 200,
    result: result,
    accessToken: parseJWT(request.headers.authorization) || null,
  });
});

module.exports = router;
