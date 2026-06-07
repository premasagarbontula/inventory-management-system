const express = require("express");

const authenticateUser = require("../middleware/authMiddleware");

const {
  getDashboardSummary,
  getLowStockProducts,
  getRecentOrders,
} = require("../controllers/dashboardController");

const router = express.Router();

router.get("/summary", authenticateUser, getDashboardSummary);
router.get("/low-stock", authenticateUser, getLowStockProducts);
router.get("/recent-orders", authenticateUser, getRecentOrders);

module.exports = router;
