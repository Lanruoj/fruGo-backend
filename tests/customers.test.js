require("dotenv").config();
const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../src/server");
const { City } = require("../src/models/City");
const { Admin } = require("../src/models/Admin");
const { Customer } = require("../src/models/Customer");
const { seedDatabase } = require("../src/seed");
const { generateAccessToken } = require("../src/controllers/helpers");
describe("Customer routes", () => {
  beforeAll(async () => {
    await seedDatabase();
    await mongoose.connect(process.env.DEV_DATABASE_URL);
  });

  describe("[POST] /register - register a new customer", () => {
    it("Registers a new customer", async () => {
      const city = await City.findOne({}).exec();
      console.log(city);
      const response = await request(app)
        .post("/customers/register")
        .send({
          email: `test${Math.floor(Math.random() * 99999)}@email.com`,
          password: "testpassword123",
          username: "testusername",
          firstName: "Test",
          lastName: "Lastname",
          _city: city._id,
          streetAddress: "123 Test street",
        });
      expect(response.statusCode).toEqual(201);
      expect(response.body.user._id).toBeDefined();
      expect(response.body.accessToken).toBeTruthy();
    });
  });

  describe("[GET] / - get all customers", () => {
    let dbCount;
    let adminToken;
    let customerToken;
    beforeAll(async () => {
      const customers = await Customer.find({}).exec();
      dbCount = customers.length;
      const customer = await Customer.findOne({}).exec();
      customerToken = await generateAccessToken(customer._id);
      const admin = await Admin.findOne({ username: "test_admin" }).exec();
      adminToken = await generateAccessToken(admin._id);
    });
    it("Admin token returns all customers", async () => {
      const response = await request(app)
        .get("/customers/")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(response.statusCode).toEqual(200);
      const jsonCount = response.body.data.length;
      expect(jsonCount).toEqual(dbCount);
    });
    it("Customer token denies access", async () => {
      const response = await request(app)
        .get("/customers/")
        .set("Authorization", `Bearer ${customerToken}`);
      expect(response.statusCode).toEqual(401);
    });
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });
});
