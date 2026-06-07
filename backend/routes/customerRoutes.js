const express = require("express");

const authenticateUser = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const ROLES = require("../utils/roles");

const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

const router = express.Router();

router.post(
  "/",
  authenticateUser,
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  createCustomer,
);

router.get("/", authenticateUser, getCustomers);

router.get("/:id", authenticateUser, getCustomerById);

router.put(
  "/:id",
  authenticateUser,
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  updateCustomer,
);

router.delete(
  "/:id",
  authenticateUser,
  authorizeRoles(ROLES.ADMIN),
  deleteCustomer,
);

module.exports = router;
