const express = require("express");

const {
  registerUser,
  loginUser,
  getMe,
  getAllUsers,
  deleteUser,
} = require("../controllers/authController");

const {
  protect,
  adminOnly,
} = require("../middleware/auth");

const router = express.Router();

/* ===========================================
   Public Routes
=========================================== */

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

/* ===========================================
   Protected Routes
=========================================== */

// Logged in user profile
router.get("/me", protect, getMe);

/* ===========================================
   Admin Routes
=========================================== */

// Get all users
router.get("/users", protect, adminOnly, getAllUsers);

// Delete user
router.delete("/users/:id", protect, adminOnly, deleteUser);

module.exports = router;