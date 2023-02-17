require("dotenv").config();
const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../src/server");
const { City } = require("../src/models/City");
const { Admin } = require("../src/models/Admin");
const { seedDatabase } = require("../src/seed");
const { generateAccessToken } = require("../src/controllers/auth/authHelpers");

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

  describe("[GET] / - get all customers", () => {
    let accessToken = "";
    let response;
    beforeAll(async () => {
      const admin = await Admin.findOne({ username: "test_admin" }).exec();
      accessToken = await generateAccessToken(admin._id);
      response = await request(app)
        .get("/customers/")
        .set("Authorization", `Bearer ${accessToken}`);
    });
    it("Gets all customers", async () => {
      expect(response.statusCode).toEqual(200);
    });
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });
});
