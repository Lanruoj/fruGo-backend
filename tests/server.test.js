const request = require("supertest");
const { app } = require("../src/server");

// Test that [GET] / index page works
describe("Server request", () => {
  describe("GET / index route", () => {
    it("Returns successful status code", async () => {
      const response = await request(app).get("/");
      expect(response.statusCode).toEqual(200);
    });
    it("Returns 'Hello!'", async () => {
      const response = await request(app).get("/");
      expect(response.body.message).toEqual("Hello!");
    });
  });
});
