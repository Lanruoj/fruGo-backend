const mongoose = require("mongoose");

async function filterCollection(model, queryString) {
  const queries = Object.entries(queryString);
  // Construct query object to use in find()
  let queryObject = {};
  for (query of queries) {
    const key = query[0];
    const value = { $regex: new RegExp(query[1], "i") };
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
