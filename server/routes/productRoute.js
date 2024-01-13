const express = require("express");
const {
  createProduct,
  getALlProducts,
  updateProduct,
  deleteProduct,
  getProductDetail,
} = require("../controllers/productController");
const { isAuthenticatrdUser } = require("../middleware/auth");

const router = express.Router();

router.route("/product/new").post(createProduct);

router.route("/product").get(isAuthenticatrdUser, getALlProducts);

router
  .route("/product/:id")
  .put(updateProduct)
  .delete(deleteProduct)
  .get(getProductDetail);

module.exports = router;
