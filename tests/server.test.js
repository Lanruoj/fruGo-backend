const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../src/server");

describe("Test routes", () => {
  describe("'/' index route", () => {
    it("Returns successful status code", async () => {
      const response = await request(app).get("/");
      expect(response.statusCode).toEqual(200);
    });
    it("Returns 'Hello World!'", async () => {
      const response = await request(app).get("/");
      expect(response.body.message).toEqual("Hello World!");
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
