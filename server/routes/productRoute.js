const express = require("express");
const {
  createProduct,
  getALlProducts,
  updateProduct,
  deleteProduct,
  getProductDetail,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router
  .route("/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

router.route("/product").get(getALlProducts);

router
  .route("/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

router.route("/product/:id").get(getProductDetail);

module.exports = router;
