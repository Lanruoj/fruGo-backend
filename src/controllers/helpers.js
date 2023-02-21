const mongoose = require("mongoose");

async function filterCollection(model, queryString) {
  const queries = Object.entries(queryString);
  // Construct query object to use in find()
  let queryObject = {};
  for (query of queries) {
    const key = query[0];
    const valueIsObjectId = mongoose.isValidObjectId(query[1]);
    if (key[0] == "_" && valueIsObjectId) {
      value = query[1];
    } else {
      value = { $regex: new RegExp(query[1], "i") };
    }
    queryObject[key] = value;
  }
  const results = await mongoose.model(model).find(queryObject).exec();
  if (!results.length) {
    throw {
      message: ": : No customers found matching that criteria",
      status: 404,
    };
  }
  return results;
}

module.exports = { filterCollection };
