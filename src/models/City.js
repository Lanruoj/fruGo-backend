const mongoose = require("mongoose");

const CitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  state: { type: String, required: true },
});

const City = mongoose.model("City", CitySchema);

modules.export = { City };
