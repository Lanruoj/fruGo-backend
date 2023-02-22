const express = require("express");
const router = express.Router();
const { filterCollection } = require("../helpers");
const {
  createMerchant,
  getMerchantByID,
  getMerchantStock,
  updateMerchant,
} = require("./MerchantHelpers");
const {
  authenticateUser,
  allowAdminOnly,
  allowOwnerOrAdmin,
} = require("../auth/authMiddleware");
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

router.put(
  "/:id",
  authenticateUser,
  allowOwnerOrAdmin,
  async (request, response, next) => {
    let result = {};
    try {
      result = await updateMerchant({
        id: request.params.id,
        data: request.body,
      });
    } catch (error) {
      console.log(error);
      error.status = 400;
      return next(error);
    }
    response.status(200).json({
      status: 200,
      updates: result.updatedFields,
      accessToken: request.accessToken,
    });
  }
);

router.get("/:id/stock", async (request, response, next) => {
  let result;
  try {
    result = await getMerchantStock(request.params.id);
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
