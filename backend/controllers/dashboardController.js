const pool = require("../config/db");

const getDashboardSummary = async (req, res) => {
  try {
    const [products] = await pool.execute(
      ` SELECT COUNT(*) AS totalProducts
        FROM products `,
    );

    const [customers] = await pool.execute(
      ` SELECT COUNT(*) AS totalCustomers
        FROM customers `,
    );

    const [orders] = await pool.execute(
      ` SELECT COUNT(*) AS totalOrders
        FROM orders `,
    );

    const [lowStock] = await pool.execute(
      ` SELECT COUNT(*) AS lowStockProducts
        FROM products
        WHERE stock_quantity < 10 `,
    );

    return res.status(200).json({
      totalProducts: products[0].totalProducts,

      totalCustomers: customers[0].totalCustomers,

      totalOrders: orders[0].totalOrders,

      lowStockProducts: lowStock[0].lowStockProducts,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

const getLowStockProducts = async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || 10;
    const [products] = await pool.execute(
      ` SELECT product_id, product_name, sku, stock_quantity
        FROM products
        WHERE stock_quantity < ?
        ORDER BY stock_quantity ASC `,
      [threshold],
    );

    return res.status(200).json(products);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

const getRecentOrders = async (req, res) => {
  try {
    const [orders] = await pool.execute(
      ` SELECT o.order_id, c.customer_name, o.order_date
        FROM orders o
        JOIN customers c ON o.customer_id = c.customer_id
        ORDER BY o.order_date DESC
        LIMIT 5 `,
    );

    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = { getDashboardSummary, getLowStockProducts, getRecentOrders };
