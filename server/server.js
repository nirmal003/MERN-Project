const app = require("./app");

const dotenv = require("dotenv");
const cloudinary = require("cloudinary");
const dbconnection = require("./config/database");

// Handling Uncaught Exception Error
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Uncaught Exception");

  process.exit(1);
});

// config
dotenv.config({ path: "server/config/config.env" });

// database connection
dbconnection();

//  MMake Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOULDINARY_API_SECRET,
});

const server = app.listen(process.env.PORT, () => {
  console.log(`server is working on http://localhost:${process.env.PORT}`);
});

// Unhandled Promise Rejection Error
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Unhandled Promise Rejection");

  server.close(() => process.exit(1));
});
