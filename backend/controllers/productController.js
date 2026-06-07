const pool = require("../config/db");

const createProduct = async (req, res) => {
  try {
    const { product_name, sku, price, stock_quantity } = req.body;
    if (
      !product_name?.trim() ||
      !sku?.trim() ||
      price == null ||
      stock_quantity == null
    ) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    //if price="abc"
    if (Number.isNaN(Number(price))) {
      return res.status(400).json({
        message: "Invalid price",
      });
    }
    if (Number.isNaN(Number(stock_quantity))) {
      return res.status(400).json({
        message: "Invalid stock quantity",
      });
    }
    if (price < 0) {
      return res.status(400).json({
        message: "Price cannot be negative",
      });
    }

    if (stock_quantity < 0) {
      return res.status(400).json({
        message: "Stock quantity cannot be negative",
      });
    }
    const productName = product_name.trim();
    const skuValue = sku.trim();
    const [existingProducts] = await pool.execute(
      ` SELECT product_id
        FROM products 
        WHERE sku = ? `,
      [skuValue],
    );
    if (existingProducts.length > 0) {
      return res.status(409).json({
        message: "SKU already exists",
      });
    }
    const [result] = await pool.execute(
      ` INSERT INTO products (product_name, sku, price, stock_quantity)
        VALUES (?, ?, ?, ?) `,
      [productName, skuValue, price, stock_quantity],
    );
    res.status(201).json({
      message: "Product created successfully",
      productId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const [products] = await pool.execute(
      `SELECT * 
       FROM products
       ORDER BY created_at `,
    );
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = Number(req.params.id);
    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({
        message: "Invalid product id",
      });
    }
    const [products] = await pool.execute(
      ` SELECT *
        FROM products 
        WHERE product_id = ? `,
      [productId],
    );
    if (products.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    res.status(200).json(products[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = Number(req.params.id);
    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({
        message: "Invalid product id",
      });
    }
    const { product_name, sku, price, stock_quantity } = req.body;
    if (
      !product_name?.trim() ||
      !sku?.trim() ||
      price == null ||
      stock_quantity == null
    ) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }
    if (Number.isNaN(Number(stock_quantity))) {
      return res.status(400).json({
        message: "Invalid stock quantity",
      });
    }
    if (Number.isNaN(Number(price))) {
      return res.status(400).json({
        message: "Invalid price",
      });
    }
    if (price < 0) {
      return res.status(400).json({
        message: "Price cannot be negative",
      });
    }

    if (stock_quantity < 0) {
      return res.status(400).json({
        message: "Stock quantity cannot be negative",
      });
    }
    const productName = product_name.trim();
    const skuValue = sku.trim();

    const [existingProducts] = await pool.execute(
      ` SELECT product_id
        FROM products
        WHERE sku = ? AND product_id != ? `,
      [skuValue, productId],
    );

    if (existingProducts.length > 0) {
      return res.status(409).json({
        message: "SKU already exists",
      });
    }

    const [products] = await pool.execute(
      ` SELECT product_id
        FROM products
        WHERE product_id = ?`,
      [productId],
    );

    if (products.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    await pool.execute(
      ` UPDATE products
        SET product_name = ?,sku = ?,price = ?,stock_quantity = ? 
        WHERE product_id = ?`,
      [productName, skuValue, price, stock_quantity, productId],
    );
    res
      .status(200)
      .json({ message: "Product updated successfully", productId });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = Number(req.params.id);
    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const [result] = await pool.execute(
      ` DELETE FROM products
        WHERE product_id = ?`,
      [productId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res
      .status(200)
      .json({ message: "Product deleted successfully", productId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
