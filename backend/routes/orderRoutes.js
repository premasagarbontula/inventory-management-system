const express = require("express");

const authenticateUser = require("../middleware/authMiddleware");

const {
  createOrder,
  getOrders,
  getOrderById,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", authenticateUser, createOrder);

router.get("/", authenticateUser, getOrders);

router.get("/:id", authenticateUser, getOrderById);

module.exports = router;
