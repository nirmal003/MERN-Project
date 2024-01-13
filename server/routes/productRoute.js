const express = require("express");
const {
  createProduct,
  getALlProducts,
  updateProduct,
  deleteProduct,
  getProductDetail,
} = require("../controllers/productController");
const { isAuthenticatrdUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router
  .route("/product/new")
  .post(isAuthenticatrdUser, authorizeRoles("admin"), createProduct);

router.route("/product").get(getALlProducts);

router
  .route("/product/:id")
  .put(isAuthenticatrdUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatrdUser, authorizeRoles("admin"), deleteProduct)
  .get(isAuthenticatrdUser, getProductDetail);

module.exports = router;
