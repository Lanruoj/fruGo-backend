const { omit } = require("underscore");
const mongoose = require("mongoose");
const { Merchant } = require("../../models/Merchant");
const { StockProduct } = require("../../models/StockProduct");

async function createMerchant(data) {
  let newMerchant;
  try {
    newMerchant = await Merchant.create(data);
  } catch (error) {
    error.status = 400;
    throw new Error(error);
  }
  return newMerchant;
}

async function getMerchantByID(merchantID) {
  let result;
  try {
    result = await Merchant.findById(merchantID).exec();
  } catch (error) {
    throw {
      message: `: : No merchants found with ID ${merchantID}`,
      status: 404,
    };
  }
  return result;
}

async function getMerchantStock(merchantID) {
  let merchant, stock;
  try {
    merchant = await Merchant.findById(merchantID)
      .populate({
        path: "stock",
        model: "StockProduct",
        populate: {
          path: "_product",
          model: "Product",
        },
      })
      .exec();
    stock = merchant.stock;
  } catch (error) {
    throw {
      message: `: : No merchants found with ID ${merchantID}`,
      status: 404,
    };
  }
  return stock;
}

async function updateMerchant(updateData) {
  const { id, data } = updateData;
  try {
    return await Merchant.findByIdAndUpdate(id, data, {
      returnDocument: "after",
    })
      .lean()
      .exec();
  } catch (err) {
    console.log(err);
    throw { message: ": : Merchant could not be found", status: 400 };
  }
}

async function updateStockQuantity(updateData) {
  const { stockProduct, quantity } = updateData;
  try {
    return await StockProduct.findOneAndUpdate(
      { _id: stockProduct },
      {
        quantity: quantity,
      },
      {
        returnDocument: "after",
      }
    )
      .lean()
      .exec();
  } catch (err) {
    throw { message: ": : Merchant could not be found", status: 400 };
  }
}

async function createNewStockProduct(data) {
  try {
    const newStockProduct = await StockProduct.create(data);
    console.log(data);
    await Merchant.updateOne(
      { _id: data._merchant },
      { $push: { stock: newStockProduct } }
    );
    return newStockProduct;
  } catch (error) {
    console.log(error);
    throw {
      message: ": : Unable to add product to stock",
      status: 400,
    };
  }
}

async function removeStockProduct(data) {
  try {
    const stockProduct = await StockProduct.findByIdAndDelete(data).exec();
    return stockProduct;
  } catch (error) {
    console.log(error);
    throw {
      message: ": : Unable to remove product from stock",
      status: 400,
    };
  }
}

async function searchStockProducts(merchantID, queryString) {
  const queries = Object.entries(queryString);
  let queryArray = [];
  if (!queryString)
    return await StockProduct.find({ _merchant: merchantID }).exec();
  for (let query of queries) {
    let queryObject = {};
    const valueIsObjectId = mongoose.isValidObjectId(query[1]);
    if (query[0][0] == "_" && valueIsObjectId) {
      key = `${query[0]}`;
      value = mongoose.Types.ObjectId(query[1]);
    } else {
      key = `product.${query[0]}`;
      value = { $regex: new RegExp(query[1], "i") };
    }
    queryObject[key] = value;
    queryArray.push(queryObject);
  }
  const results = await StockProduct.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "_product",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $match: {
        $and: [
          { "_merchant": mongoose.Types.ObjectId(merchantID) },
          ...queryArray,
        ],
      },
    },
    { $unwind: "$product" },
  ]).exec();
  return results;
}

module.exports = {
  getMerchantByID,
  createMerchant,
  getMerchantStock,
  updateMerchant,
  updateStockQuantity,
  createNewStockProduct,
  removeStockProduct,
  searchStockProducts,
};
