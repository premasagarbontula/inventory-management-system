const pool = require("../config/db");

const stockIn = async (req, res) => {
  try {
    const { product_id, quantity, remarks } = req.body;
    const productId = Number(product_id);
    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({ message: "Invalid product id" });
    }
    if (!Number.isInteger(Number(quantity)) || quantity <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be greater than 0" });
    }

    const [products] = await pool.execute(
      `SELECT product_id,stock_quantity FROM products WHERE product_id=?`,
      [productId],
    );
    if (products.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    await pool.execute(
      `INSERT INTO inventory_transactions (product_id, transaction_type,quantity, remarks) VALUES (?,'IN',?,?)`,
      [productId, quantity, remarks?.trim() ?? null],
    );

    const product = products[0];
    const currentStock = product.stock_quantity;

    await pool.execute(
      `UPDATE products SET stock_quantity=? WHERE product_id=?`,
      [currentStock + Number(quantity), productId],
    );

    return res
      .status(200)
      .json({ message: "Stock added successfully", productId, quantity });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};
const stockOut = async (req, res) => {
  try {
    const { product_id, quantity, remarks } = req.body;
    const productId = Number(product_id);
    const quantityValue = Number(quantity);
    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({ message: "Invalid product id" });
    }
    if (!Number.isInteger(quantityValue) || quantityValue <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be greater than 0" });
    }

    const [products] = await pool.execute(
      `SELECT product_id,stock_quantity FROM products WHERE product_id=?`,
      [productId],
    );
    if (products.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = products[0];
    const currentStock = product.stock_quantity;
    if (currentStock < quantityValue) {
      return res.status(400).json({ message: "Insufficient stock" });
    }
    await pool.execute(
      `INSERT INTO inventory_transactions (product_id, transaction_type,quantity, remarks) VALUES (?,'OUT',?,?)`,
      [productId, quantityValue, remarks?.trim() ?? null],
    );
    await pool.execute(
      `UPDATE products SET stock_quantity=? WHERE product_id=?`,
      [currentStock - quantityValue, productId],
    );

    return res.status(200).json({
      message: "Stock removed successfully",
      productId,
      quantityValue,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

const getTransactionHistory = async (req, res) => {
  try {
    const productId = Number(req.params.productId);
    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({ message: "Invalid product id" });
    }
    const [products] = await pool.execute(
      `SELECT product_id FROM products WHERE product_id = ?`,
      [productId],
    );

    if (products.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    const [transactions] = await pool.execute(
      `SELECT transaction_id,transaction_type,quantity,remarks,created_at FROM inventory_transactions WHERE product_id=? ORDER BY created_at DESC`,
      [productId],
    );

    return res.status(200).json(transactions);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = { stockIn, stockOut, getTransactionHistory };
