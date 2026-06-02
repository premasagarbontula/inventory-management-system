const express = require("express");
const router = express.Router();
const ROLES = require("../utils/roles");

const authenticateUser = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

router.post("/", authenticateUser, authorizeRoles(ROLES.ADMIN), createProduct);
router.get("/", authenticateUser, getProducts);
router.get("/:id", authenticateUser, getProductById);
router.put(
  "/:id",
  authenticateUser,
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  updateProduct,
);
router.delete(
  "/:id",
  authenticateUser,
  authorizeRoles(ROLES.ADMIN),
  deleteProduct,
);

module.exports = router;
