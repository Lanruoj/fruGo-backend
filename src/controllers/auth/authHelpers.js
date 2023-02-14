// Encryption/decryption configuration
const crypto = require("crypto");
const encAlgorithm = "aes-256-cbc";
const encPrivateKey = crypto.scryptSync(process.env.ENC_KEY, "SpecialSalt", 32);
const encIV = crypto.scryptSync(process.env.ENC_IV, "SpecialSalt", 16);
let cipher = crypto.createCipheriv(encAlgorithm, encPrivateKey, encIV);
let decipher = crypto.createDecipheriv(encAlgorithm, encPrivateKey, encIV);

function encryptString(data) {
  cipher = crypto.createCipheriv(encAlgorithm, encPrivateKey, encIV);
  return cipher.update(data, "utf8", "hex") + cipher.final("hex");
}

function decryptString(data) {
  decipher = crypto.createDecipheriv(encAlgorithm, encPrivateKey, encIV);

  return decipher.update(data, "hex", "utf8") + decipher.final("utf8");
}

function decryptObject(data) {
  return JSON.parse(decryptString(data));
}

// Hashing configuration
const bcrypt = require("bcrypt");
const { parse } = require("path");
const saltRounds = 10;

async function hashString(string) {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(string, salt);
  return hash;
}

async function validateHashedData(providedUnhashedData, storedHashedData) {
  return await bcrypt.compare(providedUnhashedData, storedHashedData);
}

// JWT configuration
const jwt = require("jsonwebtoken");

function generateJWT(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
}

async function generateUserJWT(userDetails) {
  let encryptedUserData = encryptString(JSON.stringify(userDetails));
  return generateJWT({ data: encryptedUserData });
}

function parseJWT(header) {
  const jwt = header?.split(" ")[1].trim();
  return jwt;
}

function verifyJWT(token) {
  const parsedJWT = parseJWT(token);
  return jwt.verify(parsedJWT, process.env.JWT_SECRET_KEY, {
    complete: true,
  });
}

module.exports = {
  hashString,
  validateHashedData,
  generateJWT,
  generateUserJWT,
  parseJWT,
  verifyJWT,
};
