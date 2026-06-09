const pool = require("../config/db");

const createCustomer = async (req, res) => {
  try {
    const { customer_name, email, phone, address } = req.body;

    if (!customer_name?.trim()) {
      return res.status(400).json({
        message: "Customer name required",
      });
    }

    const customerName = customer_name?.trim();
    const emailValue = email?.trim() || null;
    const phoneValue = phone?.trim() || null;
    const addressValue = address?.trim() || null;

    if (emailValue) {
      const [existingCustomers] = await pool.execute(
        ` SELECT customer_id
          FROM customers
          WHERE email = ? `,
        [emailValue],
      );

      if (existingCustomers.length > 0) {
        return res.status(409).json({
          message: "Email already exists",
        });
      }
    }

    const [result] = await pool.execute(
      ` INSERT INTO customers ( customer_name, email, phone, address )
        VALUES (?, ?, ?, ?) `,
      [customerName, emailValue, phoneValue, addressValue],
    );

    return res.status(201).json({
      message: "Customer created successfully",
      customerId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

const getCustomers = async (req, res) => {
  try {
    const [customers] = await pool.execute(
      ` SELECT * FROM customers 
        ORDER BY created_at DESC `,
    );
    return res.status(200).json(customers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const customerId = Number(req.params.id);

    if (!Number.isInteger(customerId) || customerId <= 0) {
      return res.status(400).json({
        message: "Provide valid customer id",
      });
    }

    const [customers] = await pool.execute(
      ` SELECT * 
        FROM customers
        WHERE customer_id = ? `,
      [customerId],
    );

    if (customers.length === 0) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    return res.status(200).json(customers[0]);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const customerId = Number(req.params.id);
    const { customer_name, email, phone, address } = req.body;

    if (!Number.isInteger(customerId) || customerId <= 0) {
      return res.status(400).json({
        message: "Provide valid customer id",
      });
    }

    if (!customer_name?.trim()) {
      return res.status(400).json({
        message: "Customer name required",
      });
    }

    const customerName = customer_name.trim();
    const emailValue = email?.trim() || null;
    const phoneValue = phone?.trim() || null;
    const addressValue = address?.trim() || null;

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

    if (emailValue) {
      const [existingCustomers] = await pool.execute(
        ` SELECT customer_id
          FROM customers
          WHERE email = ? 
          AND customer_id != ? `,
        [emailValue, customerId],
      );

      if (existingCustomers.length > 0) {
        return res.status(409).json({
          message: "Email already exists",
        });
      }
    }

    await pool.execute(
      ` UPDATE customers
        SET customer_name = ?,email = ?,phone = ?,address = ? 
        WHERE customer_id=? `,
      [customerName, emailValue, phoneValue, addressValue, customerId],
    );
    return res.status(200).json({
      message: "Customer updated successfully",
      customerId,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const customerId = Number(req.params.id);

    if (!Number.isInteger(customerId) || customerId <= 0) {
      return res.status(400).json({
        message: "Provide valid customer id",
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

    await pool.execute(`DELETE FROM customers WHERE customer_id=?`, [
      customerId,
    ]);
    return res.status(200).json({
      message: "Customer deleted successfully",
      customerId,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
