const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
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
    email: "melbourne@email.com",
    password: null,
    username: "melbourne_merchant",
    name: "Melbourne Merchant",
    description: "The best merchant in all of Melbourne",
    streetAddress: "1234 Merchant street",
    _city: null,
    stock: [],
  },
  {
    email: "sydney@email.com",
    password: null,
    username: "sydney_merchant",
    name: "Sydney Merchant",
    description: "The best merchant in all of Sydney",
    streetAddress: "1234 Merchant street",
    _city: null,
    stock: [],
  },
  {
    email: "canberra@email.com",
    password: null,
    username: "canberra_merchant",
    name: "Canberra Merchant",
    description: "The best merchant in all of Canberra",
    streetAddress: "1234 Merchant street",
    _city: null,
    stock: [],
  },
  {
    email: "darwin@email.com",
    password: null,
    username: "darwin_merchant",
    name: "Darwin Merchant",
    description: "The best merchant in all of Darwin",
    streetAddress: "1234 Merchant street",
    _city: null,
    stock: [],
  },
  {
    email: "perth@email.com",
    password: null,
    username: "perth_merchant",
    name: "Perth Merchant",
    description: "The best merchant in all of Brisbane",
    streetAddress: "1234 Merchant street",
    _city: null,
    stock: [],
  },
  {
    email: "adelaide@email.com",
    password: null,
    username: "adelaide_merchant",
    name: "Adelaide Merchant",
    description: "The best merchant in all of Adelaide",
    streetAddress: "1234 Merchant street",
    _city: null,
    stock: [],
  },
  {
    email: "hobart@email.com",
    password: null,
    username: "hobart_merchant",
    name: "Hobart Merchant",
    description: "The best merchant in all of Hobart",
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
    price: 4,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Almonds.png/293px-Almonds.png",
  },
  {
    name: "Cashews",
    type: "Nuts",
    price: 8,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Almonds.png/293px-Almonds.png",
  },
  {
    name: "Peanuts",
    type: "Nuts",
    price: 5,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Almonds.png/293px-Almonds.png",
  },
  {
    name: "Walnuts",
    type: "Nuts",
    price: 11,
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
    quantity: 103,
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
    _customer: null,
    _merchant: null,
    _products: [],
  },
  {
    _customer: null,
    _merchant: null,
    _products: [],
  },
  {
    _customer: null,
    _merchant: null,
    _products: [],
  },
];

async function seedDatabase() {
  // Configure database URL
  let databaseURL;
  switch (process.env.NODE_ENV.toLowerCase()) {
    case "test":
      databaseURL = process.env.TEST_DATABASE_URL;
      break;
    case "development":
      databaseURL = process.env.DEV_DATABASE_URL;
      break;
    case "production":
      databaseURL = process.env.DATABASE_URL;
      break;
    default:
      console.error(
        "Incorrect JavaScript environment specified, database will not be connected"
      );
      break;
  }
  await connectDatabase(databaseURL)
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
        customer._city = createdCities[index]._id;
      }
      const createdCustomers = await Customer.insertMany(customers);
      // Seed admin
      admin.password = await hashString(process.env.USER_SEED_PASSWORD);
      const createdAdmin = await Admin.insertMany(admin);
      // Seed merchants
      for ([index, merchant] of merchants.entries()) {
        merchant.password = await hashString(process.env.USER_SEED_PASSWORD);
        merchant._city = createdCities[index]._id;
      }
      const createdMerchants = await Merchant.insertMany(merchants);
      // Seed products
      const createdProducts = await Product.insertMany(products);
      // Seed stock products
      for ([index, stockProduct] of stockProducts.entries()) {
        stockProduct._merchant = createdMerchants[0]._id;
        stockProduct._product = createdProducts[index]._id;
      }
      const createdStockProducts = await StockProduct.insertMany(stockProducts);
      // Insert stock products into merchants
      await Merchant.updateMany(
        {},
        { $push: { stock: { $each: createdStockProducts } } }
      );
      // Seed carts
      let cartProducts = [];
      for ([index, stockProduct] of createdStockProducts.entries()) {
        let cartProduct = createdStockProducts[index];
        cartProducts.push(cartProduct);
      }
      const createdCart = await Cart.create({
        _customer: createdCustomers[0]._id,
        _merchant: createdMerchants[0]._id,
        _cartProducts: cartProducts,
      });
      // Seed orders
      let createdOrders = [];
      const orderProducts = createdCart._cartProducts.map((cartProduct) => {
        return {
          stockProduct: cartProduct._id,
          quantity: 3,
        };
      });
      for ([index, order] of orders.entries()) {
        order._customer = createdCustomers[0];
        order._merchant = createdMerchants[0];
        order._orderProducts = orderProducts;
        createdOrders.push(order);
      }
      createdOrders = await Order.insertMany(createdOrders);
      await Customer.findByIdAndUpdate(
        createdCustomers[0]._id,
        {
          $push: { orders: { $each: createdOrders } },
        },
        { returnDocument: "after" }
      );
      await Merchant.findByIdAndUpdate(
        createdMerchants[0]._id,
        {
          $push: { orders: { $each: createdOrders } },
        },
        { returnDocument: "after" }
      );
    })
    .then(async () => {
      await mongoose.connection.close();

      console.log("Database seeded & disconnected");
    })
    .catch((error) => console.log(error));
}

if (process.env.SEED == "true") seedDatabase();

module.exports = { seedDatabase };
