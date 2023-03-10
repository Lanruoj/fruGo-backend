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
const { createCustomer } = require("./controllers/customers/CustomerHelpers");

const cities = [
  { name: "Melbourne", state: "Victoria" },
  { name: "Sydney", state: "New South Wales" },
  { name: "Canberra", state: "Australian Capital Territory" },
  { name: "Darwin", state: "Northern Territory" },
  { name: "Perth", state: "Western Australia" },
  { name: "Adelaide", state: "South Australia" },
  { name: "Hobart", state: "Tasmania" },
  { name: "Brisbane", state: "Queensland" },
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
    name: "Melbourne Fresh Food",
    description: "The best merchant in all of Melbourne",
    streetAddress: "1234 Merchant street",
    _city: null,
    stock: [],
  },
  {
    email: "sydney@email.com",
    password: null,
    username: "sydney_merchant",
    name: "Sydney Fresh Food",
    description: "The best merchant in all of Sydney",
    streetAddress: "1234 Merchant street",
    _city: null,
    stock: [],
  },
  {
    email: "canberra@email.com",
    password: null,
    username: "canberra_merchant",
    name: "Canberra Fresh Food",
    description: "The best merchant in all of Canberra",
    streetAddress: "1234 Merchant street",
    _city: null,
    stock: [],
  },
  {
    email: "darwin@email.com",
    password: null,
    username: "darwin_merchant",
    name: "Darwin Fresh Food",
    description: "The best merchant in all of Darwin",
    streetAddress: "1234 Merchant street",
    _city: null,
    stock: [],
  },
  {
    email: "perth@email.com",
    password: null,
    username: "perth_merchant",
    name: "Perth Fresh Food",
    description: "The best merchant in all of Brisbane",
    streetAddress: "1234 Merchant street",
    _city: null,
    stock: [],
  },
  {
    email: "adelaide@email.com",
    password: null,
    username: "adelaide_merchant",
    name: "Adelaide Fresh Food",
    description: "The best merchant in all of Adelaide",
    streetAddress: "1234 Merchant street",
    _city: null,
    stock: [],
  },
  {
    email: "hobart@email.com",
    password: null,
    username: "hobart_merchant",
    name: "Hobart Fresh Food",
    description: "The best merchant in all of Hobart",
    streetAddress: "1234 Merchant street",
    _city: null,
    stock: [],
  },
  {
    email: "brisbane@email.com",
    password: null,
    username: "brisbane_merchant",
    name: "Brisbane Fresh Food",
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
    img: "https://www.gisymbol.com/wp-content/uploads/2021/01/AustralianBananas_Thumb.png",
  },
  {
    name: "Apple",
    type: "Fruits",
    price: 1.99,
    img: "https://www.gisymbol.com/wp-content/uploads/2017/08/AustralianApple.png",
  },
  {
    name: "Almonds",
    type: "Nuts",
    price: 4,
    img: "http://cdn.shopify.com/s/files/1/2185/7175/products/AlmondsDryRoastedAustralianProduct_1024x.png?v=1597054626",
  },
  {
    name: "Cashews",
    type: "Nuts",
    price: 8,
    img: "https://cdn.shopify.com/s/files/1/0012/1434/9414/products/cashew-dry-roasted-unsalted.png?v=1597886701",
  },
  {
    name: "Peanuts",
    type: "Nuts",
    price: 5,
    img: "http://cdn.shopify.com/s/files/1/2185/7175/products/PeanutsDryRoastedProduct_1024x.png?v=1602581687",
  },
  {
    name: "Walnuts",
    type: "Nuts",
    price: 11,
    img: "https://cdn.shopify.com/s/files/1/0012/1434/9414/products/walnutsinshellaustralia.png?v=1601173877g",
  },
  {
    name: "Apricot",
    type: "Fruit",
    price: 3,
    img: "https://fruitguys.com/wp-content/uploads/2016/05/Apricots-tomcot-bigstock-95004482-no-bkgrd.png",
  },
  {
    name: "Watermelon",
    type: "Fruit",
    price: 12,
    img: "https://image.similarpng.com/very-thumbnail/2021/01/Big-ripe-watermelon-isolated-on-transparent-background-PNG.png",
  },
  {
    name: "Orange",
    type: "Fruit",
    price: 3,
    img: "https://png.pngtree.com/png-clipart/20190515/original/pngtree-orange-png-png-image_3619070.jpg",
  },
  {
    name: "Mango",
    type: "Fruit",
    price: 5,
    img: "https://assets.stickpng.com/images/580b57fcd9996e24bc43c15d.png",
  },
  {
    name: "Capsicum",
    type: "Vegetable",
    price: 1.99,
    img: "https://kareelagrocer.com.au/content/images/thumbs/0006259_capsicum-red_800.png",
  },
  {
    name: "Tomato",
    type: "Vegetable",
    price: 5,
    img: "https://thumbs.dreamstime.com/b/tomato-isolated-white-tomato-isolated-white-png-image-transparent-background-137009868.jpg",
  },
  {
    name: "Cauliflower",
    type: "Vegetable",
    price: 5,
    img: "https://dtgxwmigmg3gc.cloudfront.net/imagery/assets/derivations/icon/512/512/true/eyJpZCI6IjE5NjBmZDJjZmI4YTlmYmZjN2YyNGNjODIzMTAxODNhIiwic3RvcmFnZSI6InB1YmxpY19zdG9yZSJ9?signature=18d55767d1196fe828c305cc3a77cda9e3a4a7e67c6f0f8bd0a8558d0df6dd9b",
  },
  {
    name: "Carrot",
    type: "Vegetable",
    price: 5,
    img: "https://i.pinimg.com/736x/bb/b7/f3/bbb7f3bb0fe59ee186ea8b5b579c84be.jpg",
  },
  {
    name: "Zucchini",
    type: "Vegetable",
    price: 5,
    img: "https://dtgxwmigmg3gc.cloudfront.net/imagery/assets/derivations/icon/512/512/true/eyJpZCI6IjBjYjRiY2E2NTc0ZmM4NzVhNTI4ZWQzNmZmNWYwYzlmIiwic3RvcmFnZSI6InB1YmxpY19zdG9yZSJ9?signature=e724770ac6b16cac98585c20a9635baa9470650a60f67e6686047ff9279e7dfe",
  },
  {
    name: "Bok choy",
    type: "Vegetable",
    price: 5,
    img: "https://images.ctfassets.net/tjhwhh07rwer/78FAZR47R9eeQBoa8McLuB/694bfb333229be1a2467d6f61bf3e00a/Shanghai_Green_Bok_Choy-removebg.png",
  },
  {
    name: "Spinach",
    type: "Vegetable",
    price: 5,
    img: "https://cdn.shopify.com/s/files/1/0245/1010/3615/products/Spinach.png?v=1582014384",
  },
  {
    name: "Potato",
    type: "Vegetable",
    price: 5,
    img: "https://toppng.com/uploads/preview/potato-11526060716nzbs5sjigo.png",
  },
  {
    name: "Peas",
    type: "Vegetable",
    price: 5,
    img: "https://www.cascadianfarm.com/wp-content/uploads/2018/12/SweetPeas_Main_0175-1.png",
  },
  {
    name: "Garlic",
    type: "Root",
    price: 5,
    img: "https://dtgxwmigmg3gc.cloudfront.net/imagery/assets/derivations/icon/512/512/true/eyJpZCI6IjE4NTEyYmVlNTUyZjgwZWNkODI1YzAzOTA2NjI2MWY1Iiwic3RvcmFnZSI6InB1YmxpY19zdG9yZSJ9?signature=a1336461d891ae1d3bb8ecc02d699d58c4c338d90970386c27addcfaa0e2ff46",
  },
  {
    name: "Mushroom",
    type: "Vegetable",
    price: 5,
    img: "https://southmill.com/wp-content/uploads/2021/09/white-mushrooms-intro.png",
  },
  {
    name: "Ginger",
    type: "Root",
    price: 5,
    img: "https://cdn.shopify.com/s/files/1/0642/3379/9925/products/Ginger-_1_6648f43c-bb32-4d44-bf05-762b4edaf924.png?v=1660128758",
  },
  {
    name: "Mandarin",
    type: "Fruit",
    price: 5,
    img: "https://res.cloudinary.com/hksqkdlah/image/upload/SIL_Citrus_Mandarin-Orange_009_jjrvg8.png",
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
      databaseURL = process.env.DEV_DATABASE_URL;
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
      // Seed merchants
      for ([index, merchant] of merchants.entries()) {
        merchant.password = await hashString(process.env.USER_SEED_PASSWORD);
        merchant._city = createdCities[index]._id;
      }
      const createdMerchants = await Merchant.insertMany(merchants);
      // Hash each password & assign a city to each customer
      let createdCustomers = [];
      for ([index, customer] of customers.entries()) {
        customer.password = await hashString(process.env.USER_SEED_PASSWORD);
        customer._city = createdCities[index]._id;
        let newCustomer = await createCustomer(customer);
        createdCustomers.push(newCustomer);
      }
      // Seed admin
      admin.password = await hashString(process.env.ADMIN_SEED_PASSWORD);
      const createdAdmin = await Admin.insertMany(admin);
      // Seed products
      const createdProducts = await Product.insertMany(products);
      for (let merchant of createdMerchants) {
        let merchantStockProducts = [];
        for (let product of createdProducts) {
          const stockProduct = await StockProduct.create({
            _merchant: merchant._id,
            _product: product._id,
            quantity: Math.floor(Math.random() * 1000),
          });
          const document = await StockProduct.findById(stockProduct._id)
            .populate({ path: "_product", model: "Product" })
            .exec();
          merchantStockProducts.push(document);
        }
        await Merchant.findByIdAndUpdate(merchant._id, {
          $push: { stock: { $each: merchantStockProducts } },
        });
      }
    })
    .then(async () => {
      await mongoose.connection.close();
      console.log("Database seeded & disconnected");
    })
    .catch((error) => console.log(error));
}

if (process.env.SEED == "true") seedDatabase();

module.exports = { seedDatabase };
