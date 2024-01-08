const app = require("./app");

const dotenv = require("dotenv");
const dbconnection = require("./config/database");

// config

dotenv.config({ path: "server/config/config.env" });

// database connection
dbconnection();

const server = app.listen(process.env.PORT, () => {
  console.log(`server is working on http://localhost:${process.env.PORT}`);
});

// Unhandled Promise Rejection Error
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Unhandled Promise Rejection");

  server.close(() => process.exit(1));
});
