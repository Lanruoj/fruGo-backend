const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../src/server");
const { City } = require("../src/models/City");
const { seedDatabase } = require("../src/seed");

describe("Customer routes", () => {
  beforeAll(async () => {
    await seedDatabase();
    await mongoose.connect(process.env.TEST_DATABASE_URL);
  });

  describe("[POST] /register - register a new customer", () => {
    it("Registers a new customer", async () => {
      const city = await City.findOne({}).exec();
      const response = await request(app)
        .post("/customers/register")
        .send({
          email: `test${Math.floor(Math.random() * 99999)}@email.com`,
          password: "testpassword123",
          username: "testusername",
          firstName: "Test",
          lastName: "Lastname",
          city: city._id,
          streetAddress: "123 Test street",
        });
      expect(response.statusCode).toEqual(201);
      expect(response.body.customer._id).toBeDefined();
      expect(response.body.accessToken).toBeTruthy();
    });
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });
});
