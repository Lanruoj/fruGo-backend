// Parse environment variables
const dotenv = require("dotenv");
dotenv.config();
const HOST = process.env.HOST;
const PORT = process.env.PORT;

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

// Configure CORS settings
const cors = require("cors");
const corsOptions = {
  origin: [`http://${HOST}:${PORT}`],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.get("/", (request, response) => {
  response.json({ message: "Hello!" });
});

module.exports = { HOST, PORT, app };
