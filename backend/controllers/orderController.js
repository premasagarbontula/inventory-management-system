const pool = require("../config/db");

const createOrder = async (req, res) => {
  const createOrder = async (req, res) => {
    try {
      const { customer_id, items } = req.body;

      const customerId = Number(customer_id);

      if (!Number.isInteger(customerId) || customerId <= 0) {
        return res.status(400).json({
          message: "Invalid customer id",
        });
      }

      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          message: "Order items required",
        });
      }
      const [customers] = await pool.execute(
        `SELECT customer_id FROM customers WHERE customer_id = ?`,
        [customerId],
      );

      if (customers.length === 0) {
        return res.status(404).json({
          message: "Customer not found",
        });
      }

      for (const item of items) {
        const productId = Number(item.product_id);
        const quantity = Number(item.quantity);

        if (!Number.isInteger(productId) || productId <= 0) {
          return res.status(400).json({
            message: "Invalid product id",
          });
        }

        if (!Number.isInteger(quantity) || quantity <= 0) {
          return res.status(400).json({
            message: "Invalid quantity",
          });
        }
      }

      for (const item of items) {
        const productId = Number(item.product_id);
        const quantity = Number(item.quantity);

        const [products] = await pool.execute(
          `SELECT product_id,price,stock_quantity FROM products WHERE product_id = ?`,
          [productId],
        );

        if (products.length === 0) {
          return res.status(404).json({
            message: `Product ${productId} not found`,
          });
        }

        const product = products[0];

        if (product.stock_quantity < quantity) {
          return res.status(400).json({
            message: `Insufficient stock for product ${productId}`,
          });
        }
      }
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Server Error",
      });
    }
  };
};

const getOrders = async (req, res) => {};

const getOrderById = async (req, res) => {};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
};
