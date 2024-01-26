const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");

const errorMiddleware = require("./middleware/error");

// import routes
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(fileUpload());

app.get("/", (req, res) =>
  res.send(`server is working fine
<a href="/api/v1/product">product</a>`)
);

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;
