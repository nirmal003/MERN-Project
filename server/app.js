const express = require("express");
const app = express();

const errorMiddleware = require("./middleware/error");

// import routes
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");

app.use(express.json());

app.get("/", (req, res) =>
  res.send(`server is working fine
<a href="/api/v1/product">product</a>`)
);

app.use("/api/v1", product);
app.use("/api/v1", user);

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;
