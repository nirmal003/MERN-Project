const express = require("express");
const app = express();

const errorMiddleware = require("./middleware/error");

// import routes
const product = require("./routes/productRoute");

app.use(express.json());

app.get("/", (req, res) =>
  res.send(`server is working fine
<a href="/product">product</a>`)
);

app.use("/api/v1", product);

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;
