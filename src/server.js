// Parse environment variables
const dotenv = require("dotenv");
dotenv.config();

// Configure Express server
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure headers with Helmet
const helmet = require("helmet");
app.use(helmet());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.contentSecurityPolicy());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
    },
  })
);

// Configure environment variables
let databaseURL, HOST, PORT;
switch (process.env.NODE_ENV.toLowerCase()) {
  case "test":
    databaseURL = process.env.TEST_DATABASE_URL;
    HOST = process.env.DEV_HOST;
    PORT = process.env.DEV_PORT;
    break;
  case "development":
    databaseURL = process.env.DEV_DATABASE_URL;
    HOST = process.env.DEV_HOST;
    PORT = process.env.DEV_PORT;
    break;
  case "production":
    databaseURL = process.env.DATABASE_URL;
    HOST = process.env.HOST;
    PORT = process.env.PORT;
    break;
  default:
    console.error(
      "Incorrect JavaScript environment specified, database will not be connected"
    );
    break;
}

// Configure CORS settings
const cors = require("cors");
const corsOptions = {
  origin: [
    `http://${HOST}:${PORT}`,
    "http://localhost:3000",
    "https://frugo.netlify.app/",
  ],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Connect to database
const { connectDatabase } = require("./database");
connectDatabase(databaseURL)
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((error) => {
    console.log(`An error occurred connecting to the database:
            ${error}`);
  });

app.use("/auth", require("./controllers/auth/authRoutes"));
app.use("/customers", require("./controllers/customers/CustomerRoutes"));
app.use("/merchants", require("./controllers/merchants/MerchantRoutes"));
app.use("/products", require("./controllers/products/ProductRoutes"));
app.use("/orders", require("./controllers/orders/OrderRoutes"));
app.use("/cities", require("./controllers/cities/CityRoutes"));

app.get("/", (request, response) => {
  response.status(200).json({
    status: 200,
    message: "Hello World!",
  });
});

app.use("*", (error, request, response, next) => {
  if (error) {
    console.log(error);
    response.status(error.status || 500).json({
      status: error.status,
      error: {
        message: error.message.split(": ")[2],
      },
    });
  }
});

module.exports = { HOST, PORT, app };
