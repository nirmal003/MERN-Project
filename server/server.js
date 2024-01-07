const app = require("./app");

const dotenv = require("dotenv");
const dbconnection = require("./config/database");

// config

dotenv.config({ path: "server/config/config.env" });

// database connection
dbconnection();

app.listen(process.env.PORT, () => {
  console.log(`server is working on http://localhost:${process.env.PORT}`);
});
