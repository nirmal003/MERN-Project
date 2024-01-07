const express = require("express");
const {
  createProduct,
  getALlProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

router.route("/product/new").post(createProduct);

router.route("/product").get(getALlProducts);

router.route("/product/:id").put(updateProduct).delete(deleteProduct);

module.exports = router;
