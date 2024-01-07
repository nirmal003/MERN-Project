const express = require("express");
const app = express();

// import routes
const product = require("./routes/productRoute");

app.use(express.json());

app.get("/", (req, res) =>
  res.send(`server is working fine
<a href="/product">product</a>`)
);

app.use("/api/v1", product);

module.exports = app;
