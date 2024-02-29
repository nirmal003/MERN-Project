const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

const errorMiddleware = require("./middleware/error");

// import routes
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");

app.use(cors());
app.use(express.json({ limit: "40mb" }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: "40mb" }));

app.get("/", (req, res) =>
  res.send(`server is working fine
<a href="/api/v1/product">product</a>`)
);

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;
