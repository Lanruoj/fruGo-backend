const express = require("express");
const router = express.Router();
const { filterCollection } = require("../helpers");
const {
  createMerchant,
  getMerchantByID,
  getMerchantStock,
  updateMerchant,
  updateStockQuantity,
  createNewStockProduct,
  removeStockProduct,
} = require("./MerchantHelpers");
const {
  authenticateUser,
  allowAdminOnly,
  allowOwnerOrAdmin,
} = require("../auth/authMiddleware");
const { parseJWT } = require("../helpers");
const { getOrdersByMerchantID } = require("../orders/OrderHelpers");

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

router.get("/:id/stock/products", async (request, response, next) => {
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
  "/:id/stock/products",
  authenticateUser,
  allowOwnerOrAdmin,
  async (request, response, next) => {
    try {
      const result = await updateStockQuantity({
        stockProduct: request.body.stockProduct,
        quantity: request.body.quantity,
      });
      response.status(200).json({
        status: 200,
        message: "Merchant updated",
        accessToken: request.accessToken,
      });
    } catch (error) {
      error.status = 400;
      return next(error);
    }
  }
);

router.post(
  "/:id/stock/products",
  authenticateUser,
  allowOwnerOrAdmin,
  async (request, response, next) => {
    try {
      const result = await createNewStockProduct({
        _merchant: request.params.id,
        _product: request.body._product,
        quantity: request.body.quantity,
      });
      response.status(200).json({
        status: 200,
        data: result,
        accessToken: request.accessToken,
      });
    } catch (error) {
      return next(error);
    }
  }
);

router.delete(
  "/:id/stock/products",
  authenticateUser,
  allowOwnerOrAdmin,
  async (request, response, next) => {
    try {
      const result = await removeStockProduct(request.body.stockProduct);
      response.status(200).json({
        status: 200,
        data: result,
        accessToken: request.accessToken,
      });
    } catch (error) {
      return next(error);
    }
  }
);

router.get(
  "/:id/orders/",
  authenticateUser,
  allowOwnerOrAdmin,
  async (request, response, next) => {
    try {
      const result = await getOrdersByMerchantID(
        request.params.id,
        request.query.status
      );
      response.status(200).json({
        status: 200,
        data: result,
        accessToken: request.accessToken,
      });
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;
