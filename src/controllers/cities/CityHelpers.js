const { City } = require("../../models/City");

async function getAllCities() {
  return await City.find({}).exec();
}

module.exports = { getAllCities };
