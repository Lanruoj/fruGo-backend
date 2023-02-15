const { hashString } = require("../src/controllers/auth/authHelpers");
describe("Hashing", () => {
  it("Hashes a string", async () => {
    const plainText = "hello1234";
    const result = await hashString(plainText);
    expect(result.length).toBeGreaterThan(plainText.length);
  });
});
