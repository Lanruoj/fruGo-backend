const { isEmail } = require("validator");

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
const saltRounds = 10;

async function hashString(string) {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(string, salt);

  return hash;
}

async function validateHashedData(providedUnhashedData, storedHashedData) {
  return await bcrypt.compare(providedUnhashedData, storedHashedData);
}

function validateEmail(request, response, next) {
  if (!isEmail(request.body.email)) {
    return next(new Error("Invalid email address"));
  }

  next();
}

function generateJWT(request, response, next) {}

module.exports = { validateEmail };
