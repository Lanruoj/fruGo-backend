const mongoose = require("mongoose");
require("dotenv").config();
const { connectDatabase } = require("./database");
const { hashString } = require("./controllers/helpers");
const { City } = require("./models/City");
const { Customer } = require("./models/Customer");
const { Admin } = require("./models/Admin");
const { Merchant } = require("./models/Merchant");
const { Product } = require("./models/Product");
const { StockProduct } = require("./models/StockProduct");
const { Cart } = require("./models/Cart");
const { Order } = require("./models/Order");

const cities = [
  { name: "Melbourne", state: "Victoria" },
  { name: "Sydney", state: "New South Wales" },
  { name: "Canberra", state: "Australian Capital Territory" },
  { name: "Darwin", state: "Northern Territory" },
  { name: "Perth", state: "Western Australia" },
  { name: "Adelaide", state: "South Australia" },
  { name: "Hobart", state: "Tasmania" },
];

const customers = [
  {
    email: "john_smith@email.com",
    password: null,
    username: "john_smith",
    firstName: "John",
    lastName: "Smith",
    _city: null,
    streetAddress: "1234 John street",
  },
  {
    email: "sally_smith@email.com",
    password: null,
    username: "sally_smith",
    firstName: "Sally",
    lastName: "Smith",
    _city: null,
    streetAddress: "1234 Sally street",
  },
  {
    email: "jane_doe@email.com",
    password: null,
    username: "jane_doe",
    firstName: "Jane",
    lastName: "Doe",
    _city: null,
    streetAddress: "1234 Jane street",
  },
];

const admin = {
  email: "admin@email.com",
  password: null,
  username: "test_admin",
  firstName: "Admin",
  lastName: "Istrator",
};

const merchants = [
  {
    email: "melbourne_merchant@email.com",
    password: null,
    username: "melbourne_merchant",
    name: "Melbourne Merchant",
    description: "The best merchant in all of Melbourne",
    streetAddress: "1234 Merchant street",
    _city: null,
    stock: [],
  },
  {
    email: "sydney_merchant@email.com",
    password: null,
    username: "sydney_merchant",
    name: "Sydney Merchant",
    description: "The best merchant in all of Sydney",
    streetAddress: "1234 Merchant street",
    _city: null,
    stock: [],
  },
  {
    email: "brisbane_merchant@email.com",
    password: null,
    username: "brisbane_merchant",
    name: "Brisbane Merchant",
    description: "The best merchant in all of Brisbane",
    streetAddress: "1234 Merchant street",
    _city: null,
    stock: [],
  },
];

const products = [
  {
    name: "Banana",
    type: "Fruits",
    price: 2.99,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/800px-Banana-Single.jpg",
  },
  {
    name: "Apple",
    type: "Fruits",
    price: 1.99,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/The_SugarBee_Apple_now_grown_in_Washington_State.jpg/240px-The_SugarBee_Apple_now_grown_in_Washington_State.jpg",
  },
  {
    name: "Almond",
    type: "Nuts",
    price: 0.1,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Almonds.png/293px-Almonds.png",
  },
];

const stockProducts = [
  {
    _merchant: null,
    _product: null,
    quantity: 23,
  },
  {
    _merchant: null,
    _product: null,
    quantity: 99,
  },
  {
    _merchant: null,
    _product: null,
    quantity: 0,
  },
];

const carts = [
  {
    _customer: null,
    _merchant: null,
  },
  {
    _customer: null,
    _merchant: null,
  },
  {
    _customer: null,
    _merchant: null,
  },
];

const orders = [
  {
    _cart: null,
  },
  {
    _cart: null,
    status: "complete",
  },
  {
    _cart: null,
    status: "cancelled",
  },
];

async function seedDatabase() {
  const environment = process.env.NODE_ENV || null;
  await connectDatabase(
    environment == "development"
      ? process.env.DEV_DATABASE_URL
      : process.env.TEST_DATABASE_URL
  )
    .then(async () => {
      const collections = await mongoose.connection.db
        .listCollections()
        .toArray();

      collections
        .map((collection) => collection.name)
        .forEach(async (collectionName) => {
          await mongoose.connection.db.dropCollection(collectionName);
        });
    })
    .then(async () => {
      // Seed cities
      const createdCities = await City.insertMany(cities);
      // Hash each password & assign a city to each customer
      for ([index, customer] of customers.entries()) {
        customer.password = await hashString(process.env.USER_SEED_PASSWORD);
        customer._city = createdCities[index];
      }
      const createdCustomers = await Customer.insertMany(customers);
      // Seed admin
      admin.password = await hashString(process.env.USER_SEED_PASSWORD);
      const createdAdmin = await Admin.insertMany(admin);
      // Seed merchants
      for ([index, merchant] of merchants.entries()) {
        merchant.password = await hashString(process.env.USER_SEED_PASSWORD);
        merchant._city = createdCities[index];
      }
      const createdMerchants = await Merchant.insertMany(merchants);
      // Seed products
      const createdProducts = await Product.insertMany(products);
      // Seed stock products
      for ([index, stockProduct] of stockProducts.entries()) {
        stockProduct._merchant = createdMerchants[index];
        stockProduct._product = createdProducts[index];
      }
      const createdStockProducts = await StockProduct.insertMany(stockProducts);
      // Insert stock products into merchants
      await Merchant.updateMany(
        {},
        { $push: { stock: { $each: createdStockProducts } } }
      );
      // Seed carts
      for ([index, cart] of carts.entries()) {
        cart._customer = createdCustomers[index];
        cart._merchant = createdMerchants[index];
        cart.products = createdStockProducts;
      }
      const createdCarts = await Cart.insertMany(carts);
      // Seed orders
      for ([index, order] of orders.entries()) {
        order._cart = createdCarts[index];
      }
      const createdOrders = await Order.insertMany(orders);
    })
    .then(async () => {
      await mongoose.connection.close();

      console.log("Database seeded & disconnected");
    })
    .catch(() => console.log("Error: Database could not be seeded"));
}

if (process.env.SEED == "true") seedDatabase();

module.exports = { seedDatabase };
