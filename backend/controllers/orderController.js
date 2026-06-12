const pool = require("../config/db");

const createOrder = async (req, res) => {
  let connection;

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
      ` SELECT customer_id
        FROM customers
        WHERE customer_id = ? `,
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
        ` SELECT product_id,product_name,price,stock_quantity
          FROM products
          WHERE product_id = ? `,
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
          message: `Insufficient stock for product: ${product.product_name}`,
        });
      }
    }
    connection = await pool.getConnection();

    await connection.beginTransaction();

    const [orderResult] = await connection.execute(
      ` INSERT INTO orders (customer_id,created_by) 
        VALUES (?, ?) `,
      [customerId, req.user.userId],
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      const [products] = await connection.execute(
        ` SELECT product_id,price,stock_quantity
          FROM products WHERE product_id = ? `,
        [item.product_id],
      );

      const product = products[0];

      await connection.execute(
        ` INSERT INTO order_items (order_id,product_id,quantity,unit_price) 
          VALUES (?, ?, ?, ?) `,
        [orderId, item.product_id, item.quantity, product.price],
      );

      await connection.execute(
        ` UPDATE products
          SET stock_quantity = ?
          WHERE product_id = ? `,
        [product.stock_quantity - item.quantity, item.product_id],
      );

      await connection.execute(
        ` INSERT INTO inventory_transactions (product_id,transaction_type,quantity,remarks)
          VALUES (?, 'OUT', ?, ?)`,
        [item.product_id, item.quantity, `Order #${orderId}`],
      );
    }
    await connection.commit();
    return res.status(201).json({
      message: "Order created successfully",
      orderId,
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

const getOrders = async (req, res) => {
  try {
    const [orders] = await pool.execute(
      ` SELECT o.order_id, c.customer_name, o.order_date, COUNT(oi.order_item_id) AS item_count
        FROM orders o
        JOIN customers c
        ON o.customer_id = c.customer_id
        LEFT JOIN order_items oi
        ON o.order_id = oi.order_id
        GROUP BY o.order_id, c.customer_name, o.order_date
        ORDER BY o.order_date DESC; `,
    );

    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return res.status(400).json({
        message: "Invalid order id",
      });
    }

    const [orders] = await pool.execute(
      ` SELECT o.order_id, c.customer_name, o.order_date
        FROM orders o JOIN customers c
        ON o.customer_id = c.customer_id
        WHERE o.order_id = ?`,
      [orderId],
    );
    if (orders.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }
    const [items] = await pool.execute(
      ` SELECT p.product_name, oi.quantity, oi.unit_price, oi.quantity * oi.unit_price AS line_total
        FROM order_items oi
        JOIN products p
        ON oi.product_id = p.product_id
        WHERE oi.order_id = ?`,
      [orderId],
    );
    const order = orders[0];

    return res.status(200).json({
      ...order,
      items,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
};
