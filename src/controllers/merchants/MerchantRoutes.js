const express = require("express");
const router = express.Router();
const { filterCollection } = require("../helpers");
const {
  createMerchant,
  getMerchantByID,
  getMerchantStock,
  updateMerchant,
  updateMerchantStock,
  createNewStockProduct,
} = require("./MerchantHelpers");
const {
  authenticateUser,
  allowAdminOnly,
  allowOwnerOrAdmin,
} = require("../auth/authMiddleware");
const { parseJWT } = require("../helpers");

router.post(
  "/register",
  authenticateUser,
  allowAdminOnly,
  async (request, response, next) => {
    try {
      const newMerchant = await createMerchant(request.body);
      response.status(201).json({
        status: 201,
        newMerchant: newMerchant,
        accessToken: request.accessToken,
      });
    } catch (error) {
      return next(error);
    }
  }
);

router.get("/", async (request, response, next) => {
  try {
    const result = await filterCollection("Merchant", request.query);
    response.status(200).json({
      status: 200,
      result: result.flat(),
      accessToken: parseJWT(request.headers.authorization) || null,
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (request, response, next) => {
  try {
    const result = await getMerchantByID(request.params.id);
    response.status(200).json({
      status: 200,
      result: result,
      accessToken: parseJWT(request.headers.authorization) || null,
    });
  } catch (error) {
    return next(error);
  }
});

router.put(
  "/:id",
  authenticateUser,
  allowOwnerOrAdmin,
  async (request, response, next) => {
    try {
      const result = await updateMerchant({
        id: request.params.id,
        data: request.body,
      });
      response.status(200).json({
        status: 200,
        updates: result.updatedFields,
        accessToken: request.accessToken,
      });
    } catch (error) {
      console.log(error);
      error.status = 400;
      return next(error);
    }
  }
);

router.get("/:id/stock", async (request, response, next) => {
  try {
    const result = await getMerchantStock(request.params.id);
    response.status(200).json({
      status: 200,
      result: result,
      accessToken: parseJWT(request.headers.authorization) || null,
    });
  } catch (error) {
    return next(error);
  }
});

router.put(
  "/:id/stock",
  authenticateUser,
  allowOwnerOrAdmin,
  async (request, response, next) => {
    try {
      const result = await updateMerchantStock({
        _merchant: request.params.id,
        quantity: request.body.quantity,
      });
      response.status(200).json({
        status: 200,
        data: result,
        accessToken: request.accessToken,
      });
    } catch (error) {
      error.status = 400;
      return next(error);
    }
  }
);

router.post(
  "/:id/stock",
  authenticateUser,
  allowOwnerOrAdmin,
  async (request, response, next) => {
    try {
      const result = await createNewStockProduct({
        _merchant: request.params.id,
        _product: request.body._product,
        quantity: request.body.quantity,
      });
      response.status(201).json({
        status: 201,
        data: result,
        accessToken: request.accessToken,
      });
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;
