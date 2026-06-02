const express = require("express");
const authenticateUser = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const ROLES = require("../utils/roles");

const {
  stockIn,
  stockOut,
  getTransactionHistory,
} = require("../controllers/inventoryController");

const router = express.Router();

router.post(
  "/in",
  authenticateUser,
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  stockIn,
);

router.post(
  "/out",
  authenticateUser,
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  stockOut,
);

router.get("/history/:productId", authenticateUser, getTransactionHistory);

module.exports = router;
