const request = require("supertest");
const { app } = require("../src/server");
const { City } = require("../src/models/City");

describe("Test routes", () => {
  describe("'/' index route", () => {
    it("Returns successful status code", async () => {
      const response = await request(app).get("/");
      expect(response.statusCode).toEqual(200);
    });
    it("Returns 'Hello!'", async () => {
      const response = await request(app).get("/");
      expect(response.body.message).toEqual("Hello!");
    });
  });
  describe("'/databaseTest' route", () => {
    it("Returns successful database connection state", async () => {
      const response = await request(app).get("/databaseTest");
      expect(response.statusCode).toEqual(200);
      expect(response.body.readyState).toEqual(1);
    });
  });
});

describe("Customer routes", () => {
  describe("[POST] /register - register a new customer", () => {
    it("Registers a new customer", async () => {
      const city = await City.findOne({}).exec();
      const response = await request(app).post("/customers/register").send({
        email: "test123@email.com",
        password: "testpassword123",
        username: "test_username",
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
});

afterAll((done) => {
  done();
});
