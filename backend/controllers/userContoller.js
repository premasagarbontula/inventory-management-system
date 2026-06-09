const bcrypt = require("bcrypt");
const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const SALT_ROUNDS = 10;
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: "All fields required" });
    }
    const [existingUsers] = await pool.execute(
      ` SELECT user_id
        FROM users
        WHERE email=?`,
      [email],
    );
    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const sql = `INSERT INTO users (username,email,password) VALUES (?,?,?)`;
    const [result] = await pool.execute(sql, [
      username.trim(),
      email.trim(),
      hashedPassword,
    ]);
    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password) {
      return res.status(400).json({
        message: "Email and Password required",
      });
    }
    const [users] = await pool.execute(`SELECT * FROM users WHERE email = ?`, [
      email.trim(),
    ]);
    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    const token = jwt.sign(
      { userId: user.user_id, roleId: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        roleId: user.role_id,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Logged out successfully",
  });
};

const getCurrentUser = async (req, res) => {
  const [users] = await pool.execute(
    ` SELECT user_id, username, email, role_id
      FROM users
      WHERE user_id = ?`,
    [req.user.userId],
  );

  if (users.length === 0) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  return res.status(200).json(users[0]);
};

module.exports = { registerUser, loginUser, logoutUser, getCurrentUser };
