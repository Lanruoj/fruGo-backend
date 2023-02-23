const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const { createCart } = require("../carts/CartHelpers");

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

// JWT configuration
const jwt = require("jsonwebtoken");
const { Cart } = require("../../models/Cart");

async function generateAccessToken(userID) {
  const encryptedUserData = encryptString(JSON.stringify(userID));
  const payload = { user: encryptedUserData };
  return jwt.sign(payload, process.env.ACCESS_SECRET_KEY, { expiresIn: "30d" });
}

function parseJWT(header) {
  const jwt = header?.split(" ")[1]?.trim();
  return jwt;
}

function verifyJWT(token) {
  const parsedJWT = parseJWT(token);
  return jwt.verify(parsedJWT, process.env.ACCESS_SECRET_KEY, {
    complete: true,
  });
}

async function loginUser(userID, role) {
  const user = await mongoose.model(role).findById(userID).exec();
  let cart;
  // Log user in if not already logged in
  if (!user.loggedIn) {
    await mongoose
      .model(role)
      .findByIdAndUpdate(userID, { loggedIn: true })
      .exec();
    // If user is a customer, create a cart
    if (role == "Customer") {
      cart = await createCart(userID);
    }
  }
  if (user.loggedIn && role == "Customer") {
    cart = await Cart.findOne({ _customer: userID }).exec();
  }
  const accessToken = await generateAccessToken(userID);
  return { user, cart, accessToken };
}

module.exports = {
  hashString,
  decryptString,
  validateHashedData,
  generateAccessToken,
  parseJWT,
  verifyJWT,
  loginUser,
};
