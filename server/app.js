const express = require("express");
const app = express();

app.get("/", (req, res) =>
  res.send(`server is working fine
<a href="/product">product</a>`)
);

app.get("/product", (req, res) => res.send("FFF"));

module.exports = app;
